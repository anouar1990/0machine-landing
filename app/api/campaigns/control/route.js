import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/app/lib/supabase-admin";


export async function POST(request) {
  try {
    const body = await request.json();
    const { campaign_id, action } = body; // pause, resume, cancel

    if (!campaign_id || !["pause", "resume", "cancel"].includes(action)) {
      return NextResponse.json({ error: "Invalid campaign_id or action (pause, resume, cancel)" }, { status: 400 });
    }

    let targetStatus = "sending";
    if (action === "pause") targetStatus = "paused";
    if (action === "cancel") targetStatus = "cancelled";

    // 1. Update Campaign Status
    const { data: updatedCamp, error } = await supabase
      .from("campaigns")
      .update({
        status: targetStatus,
        updated_at: new Date().toISOString()
      })
      .eq("id", campaign_id)
      .select()
      .single();

    if (error) throw error;

    // 2. Handle queue state transitions
    if (action === "cancel") {
      await supabase
        .from("campaign_queue")
        .update({
          status: "cancelled",
          updated_at: new Date().toISOString()
        })
        .eq("campaign_id", campaign_id)
        .in("status", ["pending", "retrying", "claimed"]);
    } else if (action === "resume") {
      // Re-trigger queue processing worker
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      fetch(`${appUrl}/api/campaigns/process-queue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaign_id })
      }).catch(e => console.warn("[CAMPAIGN CONTROL] Resume worker trigger:", e.message));
    }

    // 3. Log Audit Activity
    await supabase.from("email_activity_logs").insert([{
      action: `CAMPAIGN_${action.toUpperCase()}`,
      description: `Action '${action}' executed on campaign '${updatedCamp.name}'`,
      metadata: { campaign_id, new_status: targetStatus }
    }]);

    return NextResponse.json({
      success: true,
      campaign_id,
      status: targetStatus,
      message: `Campaign status updated to '${targetStatus}'.`
    });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
