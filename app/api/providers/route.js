import { NextResponse } from "next/server";
import { maskProviderCredentials } from "../../lib/email-service/crypto";
import { supabaseAdmin as supabase } from "@/app/lib/supabase-admin";


export async function GET() {
  try {
    const { data: providers, error } = await supabase
      .from("email_providers")
      .select("*")
      .order("is_primary", { ascending: false })
      .order("priority", { ascending: true });

    if (error) throw error;

    // Mask secrets before returning to client
    const safeProviders = (providers || []).map(p => ({
      ...p,
      credentials_masked: maskProviderCredentials(p.credentials_encrypted, p.provider_type),
      credentials_encrypted: undefined // NEVER expose raw secrets to browser
    }));

    return NextResponse.json({ success: true, providers: safeProviders });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      provider_type,
      from_email,
      from_name = "0machine Marketing",
      credentials = {},
      daily_limit = 10000,
      rate_limit = 14,
      is_primary = false,
      is_active = true,
      marketing_enabled = true,
      transactional_enabled = true
    } = body;

    if (!name || !provider_type || !from_email) {
      return NextResponse.json(
        { error: "Name, provider type, and sender email are required." },
        { status: 400 }
      );
    }

    // If setting as primary, demote other primary providers for same purpose
    if (is_primary) {
      await supabase
        .from("email_providers")
        .update({ is_primary: false })
        .eq("is_primary", true);
    }

    const { data: created, error } = await supabase
      .from("email_providers")
      .insert([{
        name,
        provider_type,
        from_email,
        from_name,
        credentials_encrypted: credentials,
        daily_limit: parseInt(daily_limit, 10),
        rate_limit: parseInt(rate_limit, 10),
        is_primary,
        is_active,
        marketing_enabled,
        transactional_enabled,
        last_test_status: "pending"
      }])
      .select()
      .single();

    if (error) throw error;

    // Log action
    await supabase.from("email_activity_logs").insert([{
      action: "PROVIDER_CREATED",
      description: `Added new email provider '${name}' (${provider_type})`
    }]);

    return NextResponse.json({ success: true, provider: created });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, credentials, ...updates } = body;

    if (!id) return NextResponse.json({ error: "Provider ID is required" }, { status: 400 });

    const { data: existing } = await supabase.from("email_providers").select("credentials_encrypted").eq("id", id).single();

    // If new credentials passed, merge with existing
    let finalCredentials = existing?.credentials_encrypted || {};
    if (credentials && Object.keys(credentials).length > 0) {
      // Ignore masked values
      for (const [k, v] of Object.entries(credentials)) {
        if (v && !v.includes("••••••••")) {
          finalCredentials[k] = v;
        }
      }
    }

    if (updates.is_primary) {
      await supabase.from("email_providers").update({ is_primary: false }).neq("id", id);
    }

    const { data: updated, error } = await supabase
      .from("email_providers")
      .update({
        ...updates,
        credentials_encrypted: finalCredentials,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    await supabase.from("email_activity_logs").insert([{
      action: "PROVIDER_UPDATED",
      description: `Updated email provider '${updated.name}'`
    }]);

    return NextResponse.json({ success: true, provider: updated });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Provider ID required" }, { status: 400 });

    const { error } = await supabase.from("email_providers").delete().eq("id", id);
    if (error) throw error;

    await supabase.from("email_activity_logs").insert([{
      action: "PROVIDER_DELETED",
      description: `Deleted email provider ID ${id}`
    }]);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
