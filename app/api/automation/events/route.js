import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/app/lib/supabase-admin";


export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization") || request.headers.get("x-api-key");
    // Validate request body
    const body = await request.json().catch(() => null);

    if (!body || !body.event_id || !body.email || !body.event) {
      return NextResponse.json(
        { error: "Invalid payload. 'event_id', 'email', and 'event' are required." },
        { status: 400 }
      );
    }

    const { event_id, email, event: eventName, source = "0machine", attributes = {} } = body;
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Check idempotency: insert event record into automation_events
    const { data: existingEvent, error: eventErr } = await supabase
      .from("automation_events")
      .select("id, processed")
      .eq("event_id", event_id)
      .single();

    if (existingEvent) {
      return NextResponse.json({
        success: true,
        deduplicated: true,
        message: `Event '${event_id}' was already processed. Skipped duplicate workflow enrollment.`
      });
    }

    // Insert new event
    const { error: insertEvtErr } = await supabase.from("automation_events").insert([{
      event_id,
      email: normalizedEmail,
      event: eventName,
      source,
      attributes,
      processed: false
    }]);

    if (insertEvtErr && insertEvtErr.code === "23505") { // unique constraint violation
      return NextResponse.json({
        success: true,
        deduplicated: true,
        message: `Event '${event_id}' deduplicated.`
      });
    }

    // 2. Upsert Contact in contacts table
    const plan = attributes.plan || "free";
    const existingTags = attributes.tags || [eventName.replace(/_/g, "-")];

    const { data: contact, error: contactErr } = await supabase
      .from("contacts")
      .upsert({
        email: normalizedEmail,
        plan,
        attributes: attributes,
        last_activity_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { onConflict: "email" })
      .select()
      .single();

    if (contactErr) {
      console.error("[0MACHINE EVENT API] Contact upsert error:", contactErr);
    }

    // 3. Find matching workflows
    const { data: workflows } = await supabase
      .from("workflows")
      .select("id, name")
      .eq("trigger_event", eventName)
      .eq("status", "active");

    let enrolledCount = 0;
    if (workflows && workflows.length > 0 && contact) {
      for (const wf of workflows) {
        // Enroll contact if not already enrolled in active state
        const { data: existingEnrollment } = await supabase
          .from("workflow_enrollments")
          .select("id")
          .eq("workflow_id", wf.id)
          .eq("contact_id", contact.id)
          .eq("status", "active")
          .single();

        if (!existingEnrollment) {
          await supabase.from("workflow_enrollments").insert([{
            workflow_id: wf.id,
            contact_id: contact.id,
            status: "active",
            execution_state: { step: 0, triggered_by_event: event_id }
          }]);
          enrolledCount++;
        }
      }
    }

    // Mark event processed
    await supabase
      .from("automation_events")
      .update({ processed: true })
      .eq("event_id", event_id);

    // Log internal activity
    await supabase.from("email_activity_logs").insert([{
      action: "EVENT_RECEIVED",
      description: `Received 0machine product event '${eventName}' for ${normalizedEmail}`,
      metadata: { event_id, email: normalizedEmail, workflows_enrolled: enrolledCount }
    }]);

    return NextResponse.json({
      success: true,
      event_id,
      email: normalizedEmail,
      workflows_enrolled: enrolledCount
    });

  } catch (err) {
    console.error("[0MACHINE EVENT API ERROR]:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
