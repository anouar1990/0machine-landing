import { NextResponse } from "next/server";
import { EmailService, ProviderManager } from "../../../lib/email-service";
import { supabaseAdmin as supabase } from "@/app/lib/supabase-admin";
import { generateUnsubscribeToken } from "@/app/lib/email-service/unsubscribe-crypto";
import { interpolateTemplate } from "@/app/lib/email-service/template-interpolator";


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

    // 2. Fetch pending queue items with associated contact data for interpolation
    let query = supabase
      .from("campaign_queue")
      .select("id, campaign_id, contact_id, email, attempt_count, campaigns!inner(id, name, subject, html_content, status), contacts(id, first_name, last_name, plan, attributes)")
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

      // Generate per-recipient cryptographic unsubscribe token & URL
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://app.0machine.com";
      const unsubscribeToken = generateUnsubscribeToken(
        item.email,
        item.contact_id || "",
        item.campaign_id || ""
      );
      const unsubscribeUrl = `${appUrl}/api/email/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`;

      let processedHtml = campaign.html_content || "";
      const hasUnsubscribeTag =
        processedHtml.includes("{{unsubscribe_link}}") ||
        processedHtml.includes("{{unsubscribe_url}}") ||
        processedHtml.includes("%unsubscribe_url%") ||
        processedHtml.includes("{{unsubscribe_preferences}}");

      // Replace template merge tags
      processedHtml = processedHtml
        .replaceAll("{{unsubscribe_link}}", `<a href="${unsubscribeUrl}" target="_blank" rel="noopener noreferrer">Unsubscribe</a>`)
        .replaceAll("{{unsubscribe_url}}", unsubscribeUrl)
        .replaceAll("%unsubscribe_url%", unsubscribeUrl)
        .replaceAll("{{unsubscribe_preferences}}", `<a href="${unsubscribeUrl}" target="_blank" rel="noopener noreferrer">Manage Preferences</a>`);

      // If no unsubscribe link present in HTML, auto-append compliant footer
      if (!hasUnsubscribeTag && !processedHtml.toLowerCase().includes("unsubscribe")) {
        const autoFooter = `
<hr style="margin-top: 40px; border: none; border-top: 1px solid #333333;" />
<p style="font-size: 12px; color: #888888; margin-top: 20px; text-align: center; font-family: sans-serif;">
  You received this because you are on our mailing list. <a href="${unsubscribeUrl}" style="color: #FE7733; text-decoration: underline;" target="_blank" rel="noopener noreferrer">Unsubscribe</a>
</p>`;
        processedHtml += autoFooter;
      }

      // Abort and cancel if contact is missing (hard-deleted) or soft-deleted (EMAIL-008)
      if (!item.contacts || item.contacts.status === "deleted") {
        const cancelReason = item.contacts ? "Contact has been deleted" : "Contact record not found";
        console.warn(`[QUEUE WORKER] Aborting send for queue item ${item.id}: ${cancelReason}`);

        await supabase
          .from("campaign_queue")
          .update({
            status: "cancelled",
            last_error: cancelReason,
            updated_at: new Date().toISOString()
          })
          .eq("id", item.id);

        await supabase
          .from("email_activity_logs")
          .insert([{
            action: "QUEUE_CANCELLED_CONTACT_DELETED",
            description: `Cancelled queue item ${item.id} for ${item.email}: ${cancelReason}`,
            actor_email: item.email,
            metadata: {
              email: item.email,
              campaign_id: item.campaign_id,
              queue_item_id: item.id,
              details: item.contacts ? "Soft-deleted" : "Hard-deleted or missing"
            }
          }]).catch(() => {});

        continue; // Skip to next item, do NOT send
      }

      // Interpolate contact template variables (first_name, last_name, email, plan, attributes.*)
      processedHtml = interpolateTemplate(processedHtml, {
        contact: item.contacts || null,
        campaignId: item.campaign_id,
        email: item.email
      });

      // Dispatch Email via EmailService with unsubscribe token and URL
      const result = await EmailService.send({
        to: item.email,
        subject: campaign.subject,
        html: processedHtml,
        purpose: "marketing",
        unsubscribeToken,
        unsubscribeUrl
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
