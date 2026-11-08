import { NextResponse } from "next/server";
import { ProviderManager } from "@/app/lib/email-service";
import { supabaseAdmin as supabase } from "@/app/lib/supabase-admin";
import { verifyAdminAuth } from "@/app/lib/admin-auth";
import { interpolateTemplate, SAMPLE_CONTACT } from "@/app/lib/email-service/template-interpolator";

const MAX_HTML_SIZE = 1024 * 1024; // 1MB
const MAX_SUBJECT_LENGTH = 500;

export async function POST(request) {
  // 1. Enforce Server-Side Administrator Authentication (EMAIL-003)
  const auth = await verifyAdminAuth(request);
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const { to, subject, html } = body;

    // 2. Validate Recipient Address
    if (!to || typeof to !== "string") {
      return NextResponse.json({ error: "Recipient address ('to') is required" }, { status: 400 });
    }

    const trimmedTo = to.trim().toLowerCase();

    // Prevent Header Injection (CRLF in recipient)
    if (/[\r\n]/.test(trimmedTo)) {
      return NextResponse.json({ error: "Header injection detected: Invalid characters in recipient address" }, { status: 400 });
    }

    // RFC 5322 Simplified Email Regex
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailRegex.test(trimmedTo) || trimmedTo.length > 254) {
      return NextResponse.json({ error: `Invalid recipient email address format (${trimmedTo})` }, { status: 400 });
    }

    // 3. Validate Subject
    if (!subject || typeof subject !== "string" || !subject.trim()) {
      return NextResponse.json({ error: "Subject is required" }, { status: 400 });
    }

    const trimmedSubject = subject.trim();
    if (/[\r\n]/.test(trimmedSubject)) {
      return NextResponse.json({ error: "Header injection detected: Newlines not allowed in email subject" }, { status: 400 });
    }

    if (trimmedSubject.length > MAX_SUBJECT_LENGTH) {
      return NextResponse.json({ error: `Subject exceeds maximum length of ${MAX_SUBJECT_LENGTH} characters` }, { status: 400 });
    }

    // 4. Validate HTML Content
    if (!html || typeof html !== "string" || !html.trim()) {
      return NextResponse.json({ error: "Email HTML content is required" }, { status: 400 });
    }

    if (Buffer.byteLength(html, "utf8") > MAX_HTML_SIZE) {
      return NextResponse.json({ error: "HTML content exceeds 1MB limit" }, { status: 413 });
    }

    // 5. Interpolate Sample Merge Tags (using confirmed existing SAMPLE_CONTACT)
    const processedSubject = interpolateTemplate(
      trimmedSubject.startsWith("[TEST]") ? trimmedSubject : `[TEST] ${trimmedSubject}`,
      { contact: SAMPLE_CONTACT, email: trimmedTo }
    );

    const processedHtml = interpolateTemplate(
      html,
      { contact: SAMPLE_CONTACT, email: trimmedTo }
    );

    // 6. Fetch Active Marketing Providers (ordered by is_primary, priority)
    const providers = await ProviderManager.getActiveProviders("marketing");
    if (!providers || providers.length === 0) {
      return NextResponse.json({ error: "No active email providers available" }, { status: 503 });
    }

    let lastError = null;
    let successfulResult = null;
    let usedProvider = null;

    // 7. Dispatch with Verified Fallback Behavior & EMAIL-002 Safeguards
    for (let i = 0; i < providers.length; i++) {
      const provider = providers[i];
      try {
        console.log(`[CAMPAIGN TEST SEND] Attempting send via provider '${provider.name}' (${provider.providerType})...`);

        const result = await provider.sendEmail({
          to: trimmedTo,
          subject: processedSubject,
          html: processedHtml,
          text: `[CAMPAIGN TEST] ${trimmedSubject}`
        });

        // Ensure provider reports genuine delivery with valid Message ID
        if (!result || !result.success || !result.messageId) {
          throw new Error(result?.error || `Provider '${provider.name}' did not return a valid Message ID confirmation.`);
        }

        successfulResult = result;
        usedProvider = provider;
        break;
      } catch (err) {
        lastError = err;
        console.error(`[CAMPAIGN TEST SEND] Provider '${provider.name}' failed:`, err.message);

        // Safe activity log entry for provider failure
        await supabase.from("email_activity_logs").insert([{
          action: "TEST_SEND_PROVIDER_FAILURE",
          description: `Test send via '${provider.name}' to ${trimmedTo} failed: ${err.message}`,
          actor_email: auth.user?.email || "admin",
          metadata: { provider: provider.providerType, error: err.message, recipient: trimmedTo }
        }]).catch(() => {});
      }
    }

    if (!successfulResult || !usedProvider) {
      return NextResponse.json({
        success: false,
        error: lastError ? lastError.message : "All configured providers failed to send test email."
      }, { status: 502 });
    }

    // 8. Log Successful Test Send to Audit Trail (No campaign counters modified)
    await supabase.from("email_activity_logs").insert([{
      action: "SEND_TEST_CAMPAIGN_EMAIL",
      description: `Sent campaign test email to ${trimmedTo} via ${usedProvider.name}`,
      actor_email: auth.user?.email || "admin",
      metadata: {
        provider: usedProvider.providerType,
        messageId: successfulResult.messageId,
        recipient: trimmedTo,
        subject: processedSubject
      }
    }]).catch(() => {});

    return NextResponse.json({
      success: true,
      provider: usedProvider.name,
      messageId: successfulResult.messageId,
      recipient: trimmedTo
    });

  } catch (error) {
    console.error("[CAMPAIGN TEST SEND ERROR]:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
