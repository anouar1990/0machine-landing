import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/app/lib/supabase-admin";


export async function POST(request) {
  try {
    const body = await request.json();
    const { campaign_id } = body;

    if (!campaign_id) {
      return NextResponse.json({ error: "Campaign ID is required" }, { status: 400 });
    }

    // 1. Fetch Campaign Details
    const { data: campaign, error: campErr } = await supabase
      .from("campaigns")
      .select("*")
      .eq("id", campaign_id)
      .single();

    if (campErr || !campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    // 2. Fetch Recipient Audience
    let contactsQuery = supabase.from("contacts").select("id, email, status, plan");
    
    // Apply Segment filter if configured
    if (campaign.segment_id) {
      const { data: segment } = await supabase
        .from("segments")
        .select("*")
        .eq("id", campaign.segment_id)
        .single();

      if (segment && segment.rules && segment.rules.length > 0) {
        const planRule = segment.rules.find(r => r.field === "plan");
        if (planRule && planRule.value) {
          contactsQuery = contactsQuery.eq("plan", planRule.value);
        }
      }
    }

    const { data: contacts, error: contactErr } = await contactsQuery;

    if (contactErr || !contacts || contacts.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No eligible contacts found for this audience segment."
      }, { status: 400 });
    }

    // 3. Populate persistent campaign_queue atomically
    const queueRows = contacts.map(c => ({
      campaign_id,
      contact_id: c.id,
      email: c.email.toLowerCase().trim(),
      status: "pending",
      attempt_count: 0,
      next_attempt_at: new Date().toISOString()
    }));

    // Insert in batches of 1000 for database efficiency
    const batchSize = 1000;
    let insertedTotal = 0;
    for (let i = 0; i < queueRows.length; i += batchSize) {
      const chunk = queueRows.slice(i, i + batchSize);
      const { data: inserted, error: queueErr } = await supabase
        .from("campaign_queue")
        .upsert(chunk, { onConflict: "campaign_id, email", ignoreDuplicates: true })
        .select("id");

      if (!queueErr && inserted) {
        insertedTotal += inserted.length;
      }
    }

    // 4. Update Campaign status to 'sending'
    await supabase
      .from("campaigns")
      .update({
        status: "sending",
        updated_at: new Date().toISOString()
      })
      .eq("id", campaign_id);

    // 5. Log audit action
    await supabase.from("email_activity_logs").insert([{
      action: "CAMPAIGN_ENQUEUED",
      description: `Enqueued ${contacts.length} recipients into campaign_queue for campaign '${campaign.name}'`,
      metadata: { campaign_id, recipient_count: contacts.length }
    }]);

    // 6. Asynchronously trigger background worker batch
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    fetch(`${appUrl}/api/campaigns/process-queue`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaign_id })
    }).catch(e => console.warn("[CAMPAIGN ENQUEUE] Worker trigger async notification:", e.message));

    return NextResponse.json({
      success: true,
      campaign_id,
      status: "sending",
      queued_count: contacts.length,
      message: `Campaign '${campaign.name}' queued successfully. Processing started.`
    });

  } catch (err) {
    console.error("[CAMPAIGN ENQUEUE ERROR]:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
