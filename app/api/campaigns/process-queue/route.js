import { NextResponse } from "next/server";
import { EmailService, ProviderManager } from "../../../lib/email-service";
import { supabaseAdmin as supabase } from "@/app/lib/supabase-admin";


export async function GET(request) {
  return handleQueueProcessing(request);
}

export async function POST(request) {
  return handleQueueProcessing(request);
}

async function handleQueueProcessing(request) {
  const startTime = Date.now();
  try {
    let targetCampaignId = null;

    // Parse body if present
    if (request.method === "POST") {
      const body = await request.json().catch(() => null);
      if (body?.campaign_id) targetCampaignId = body.campaign_id;
    }

    // 1. Fetch Active Primary Email Provider for rate limits
    const activeProviders = await ProviderManager.getActiveProviders("marketing");
    const primaryProvider = activeProviders[0];
    const rateLimit = primaryProvider?.rateLimit ? parseInt(primaryProvider.rateLimit, 10) : 14;

    // Determine batch size bounded by 60s Vercel execution window (e.g. 50 recipients per batch)
    const batchSize = Math.min(100, rateLimit * 5);

    // 2. Fetch pending queue items
    let query = supabase
      .from("campaign_queue")
      .select("id, campaign_id, contact_id, email, attempt_count, campaigns!inner(id, name, subject, html_content, status)")
      .in("status", ["pending", "retrying"])
      .lte("next_attempt_at", new Date().toISOString())
      .eq("campaigns.status", "sending")
      .limit(batchSize);

    if (targetCampaignId) {
      query = query.eq("campaign_id", targetCampaignId);
    }

    const { data: queueItems, error: queueErr } = await query;

    if (queueErr || !queueItems || queueItems.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No pending queue items to process.",
        processedCount: 0
      });
    }

    // 3. ATOMIC CLAIMING: Claim items to prevent concurrent workers from double-sending
    const claimedIds = queueItems.map(item => item.id);
    const { error: claimErr } = await supabase
      .from("campaign_queue")
      .update({
        status: "claimed",
        updated_at: new Date().toISOString()
      })
      .in("id", claimedIds);

    if (claimErr) {
      console.error("[QUEUE WORKER] Atomic claiming error:", claimErr);
    }

    let sentCount = 0;
    let failedCount = 0;
    let suppressedCount = 0;
    let retryingCount = 0;

    // 4. Bounded Processing Loop with rate limiting
    for (let i = 0; i < queueItems.length; i++) {
      const item = queueItems[i];
      const campaign = item.campaigns;

      // Check if campaign was paused or cancelled mid-execution
      const { data: currentCamp } = await supabase
        .from("campaigns")
        .select("status")
        .eq("id", item.campaign_id)
        .single();

      if (currentCamp && (currentCamp.status === "paused" || currentCamp.status === "cancelled")) {
        // Revert claimed item to pending
        await supabase
          .from("campaign_queue")
          .update({ status: currentCamp.status === "cancelled" ? "cancelled" : "pending" })
          .eq("id", item.id);
        continue;
      }

      // Dispatch Email via EmailService
      const result = await EmailService.send({
        to: item.email,
        subject: campaign.subject,
        html: campaign.html_content,
        purpose: "marketing"
      });

      const nextAttempt = item.attempt_count + 1;

      if (result.success) {
        sentCount++;
        // Update queue record status to 'sent'
        await supabase
          .from("campaign_queue")
          .update({
            status: "sent",
            attempt_count: nextAttempt,
            provider_message_id: result.messageId,
            updated_at: new Date().toISOString()
          })
          .eq("id", item.id);

        // Record campaign event
        await supabase.from("campaign_events").insert([{
          campaign_id: item.campaign_id,
          contact_id: item.contact_id,
          event_type: "sent",
          metadata: { provider: result.provider, message_id: result.messageId }
        }]);

        // Increment campaign sent_count
        const { data: campData } = await supabase.from("campaigns").select("sent_count").eq("id", item.campaign_id).single();
        await supabase
          .from("campaigns")
          .update({ sent_count: (campData?.sent_count || 0) + 1 })
          .eq("id", item.campaign_id);

      } else if (result.code === "RECIPIENT_SUPPRESSED") {
        suppressedCount++;
        await supabase
          .from("campaign_queue")
          .update({
            status: "suppressed",
            last_error: result.error,
            updated_at: new Date().toISOString()
          })
          .eq("id", item.id);

      } else {
        // Provider or temporary error: apply exponential backoff
        if (nextAttempt < 3) {
          retryingCount++;
          const backoffSeconds = Math.pow(2, nextAttempt) * 10;
          const nextAttemptDate = new Date(Date.now() + backoffSeconds * 1000).toISOString();

          await supabase
            .from("campaign_queue")
            .update({
              status: "retrying",
              attempt_count: nextAttempt,
              next_attempt_at: nextAttemptDate,
              last_error: result.error,
              updated_at: new Date().toISOString()
            })
            .eq("id", item.id);
        } else {
          failedCount++;
          await supabase
            .from("campaign_queue")
            .update({
              status: "failed",
              attempt_count: nextAttempt,
              last_error: result.error,
              updated_at: new Date().toISOString()
            })
            .eq("id", item.id);
        }
      }

      // Respect rate limit delay (e.g. 1000ms / rateLimit)
      const delayMs = Math.max(50, Math.floor(1000 / rateLimit));
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    // 5. Check if campaign finished all queued items
    if (targetCampaignId) {
      const { count: remainingCount } = await supabase
        .from("campaign_queue")
        .select("*", { count: "exact", head: true })
        .eq("campaign_id", targetCampaignId)
        .in("status", ["pending", "claimed", "retrying"]);

      if (remainingCount === 0) {
        await supabase
          .from("campaigns")
          .update({ status: "sent", sent_at: new Date().toISOString() })
          .eq("id", targetCampaignId);
      }
    }

    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      durationMs: duration,
      processedCount: queueItems.length,
      sentCount,
      failedCount,
      suppressedCount,
      retryingCount
    });

  } catch (err) {
    console.error("[QUEUE WORKER ERROR]:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
