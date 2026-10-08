import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { ProviderManager } from "../../../lib/email-service";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://kfydsuuelaxaffntdjxh.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey || "");

export async function POST(request) {
  try {
    const body = await request.json();
    const { provider_id } = body;

    if (!provider_id) {
      return NextResponse.json({ error: "Provider ID is required" }, { status: 400 });
    }

    const { data: record, error } = await supabase
      .from("email_providers")
      .select("*")
      .eq("id", provider_id)
      .single();

    if (error || !record) {
      return NextResponse.json({ error: "Provider configuration not found" }, { status: 444 });
    }

    const providerInstance = ProviderManager.getProviderInstance(record);
    const testResult = await providerInstance.testConnection();

    // Update status in DB
    const newStatus = testResult.success ? "success" : "failed";
    await supabase
      .from("email_providers")
      .update({
        last_test_at: new Date().toISOString(),
        last_test_status: newStatus
      })
      .eq("id", provider_id);

    // Audit log
    await supabase.from("email_activity_logs").insert([{
      action: "TEST_CONNECTION",
      description: `Tested connection for provider '${record.name}': ${testResult.success ? 'PASSED' : 'FAILED'}`,
      metadata: { provider_id, status: newStatus, message: testResult.message || testResult.error }
    }]);

    return NextResponse.json({
      success: testResult.success,
      message: testResult.message || testResult.error,
      status: newStatus
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
