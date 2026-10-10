import { NextResponse } from "next/server";
import { ProviderManager } from "../../../lib/email-service";
import { supabaseAdmin as supabase } from "@/app/lib/supabase-admin";


export async function POST(request) {
  try {
    const body = await request.json();
    const { provider_id, recipient } = body;

    if (!recipient || !recipient.includes("@")) {
      return NextResponse.json({ error: "Valid recipient email address is required" }, { status: 400 });
    }

    let providerInstance;
    let providerName = "Selected Provider";

    if (provider_id) {
      const { data: record, error } = await supabase
        .from("email_providers")
        .select("*")
        .eq("id", provider_id)
        .single();

      if (error || !record) {
        return NextResponse.json({ error: "Provider not found" }, { status: 404 });
      }

      providerInstance = ProviderManager.getProviderInstance(record);
      providerName = record.name;
    } else {
      const active = await ProviderManager.getActiveProviders("marketing");
      providerInstance = active[0];
      providerName = providerInstance.name;
    }

    const testSubject = `[0MACHINE TEST] Real Connection Test Email (${providerName})`;
    const testHtml = `
      <div style="font-family: Arial, sans-serif; background: #0A0C12; color: #F1F5F9; padding: 40px; border-radius: 16px;">
        <h2 style="color: #FE7733;">⚙️ 0machine Email Provider Test</h2>
        <p>This is a real test email dispatched via <strong>${providerName}</strong>.</p>
        <p style="color: #10B981; font-weight: bold;">✓ Provider sending capability and rate limits verified.</p>
        <p style="font-size: 12px; color: #64748B; margin-top: 24px;">Sent at: ${new Date().toISOString()}</p>
      </div>
    `;

    const result = await providerInstance.sendEmail({
      to: recipient,
      subject: testSubject,
      html: testHtml,
      text: `0machine Test Email via ${providerName}`
    });

    await supabase.from("email_activity_logs").insert([{
      action: "SEND_TEST_EMAIL",
      description: `Sent real test email to ${recipient} via ${providerName}`,
      metadata: { provider: providerInstance.providerType, messageId: result.messageId }
    }]);

    return NextResponse.json({
      success: true,
      provider: providerName,
      messageId: result.messageId,
      recipient
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
