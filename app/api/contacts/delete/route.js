import { NextResponse } from "next/server";
import { verifyAdminAuth } from "@/app/lib/admin-auth";
import { supabaseAdmin } from "@/app/lib/supabase-admin";

export async function POST(request) {
  // EMAIL-003 protection: verify admin session
  const auth = await verifyAdminAuth(request);
  if (!auth.authorized) return auth.response;

  try {
    const body = await request.json().catch(() => ({}));
    const { contact_id } = body;

    if (!contact_id) {
      return NextResponse.json({ error: "contact_id required" }, { status: 400 });
    }

    // Get contact email for audit trail
    const { data: contact } = await supabaseAdmin
      .from("contacts")
      .select("id, email")
      .eq("id", contact_id)
      .single();

    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    // Step 1: Soft-delete the contact (set status = 'deleted')
    await supabaseAdmin
      .from("contacts")
      .update({ status: "deleted", updated_at: new Date().toISOString() })
      .eq("id", contact_id);

    // Step 2: Cancel all pending/retrying queue items for this contact
    const { data: pendingItems } = await supabaseAdmin
      .from("campaign_queue")
      .select("id")
      .eq("contact_id", contact_id)
      .in("status", ["pending", "retrying"]);

    if (pendingItems && pendingItems.length > 0) {
      await supabaseAdmin
        .from("campaign_queue")
        .update({
          status: "cancelled",
          last_error: "Contact deleted",
          updated_at: new Date().toISOString()
        })
        .eq("contact_id", contact_id)
        .in("status", ["pending", "retrying"]);
    }

    // Step 3: Log the deletion
    await supabaseAdmin
      .from("email_activity_logs")
      .insert([{
        action: "CONTACT_DELETED",
        description: `Contact ${contact.email} deleted: Cancelled ${pendingItems?.length || 0} pending queue items`,
        actor_email: auth.user?.email || null,
        metadata: {
          email: contact.email,
          contact_id: contact.id,
          details: `Cancelled ${pendingItems?.length || 0} pending queue items`
        }
      }]).catch(() => {});

    return NextResponse.json({
      success: true,
      message: `Contact ${contact.email} deleted and ${pendingItems?.length || 0} pending emails cancelled`
    });
  } catch (error) {
    console.error("Delete contact error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
