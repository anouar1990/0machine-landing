import { AwsSesProvider } from "./providers/ses.js";
import { ResendProvider } from "./providers/resend.js";
import { SmtpProvider } from "./providers/smtp.js";
import { supabaseAdmin as supabase } from "../supabase-admin.js";


export class ProviderManager {
  static getProviderInstance(record) {
    switch (record.provider_type) {
      case "aws_ses":
        return new AwsSesProvider(record);
      case "resend":
        return new ResendProvider(record);
      case "smtp":
        return new SmtpProvider(record);
      default:
        return new ResendProvider(record);
    }
  }

  static async getActiveProviders(purpose = "marketing") {
    const { data: records, error } = await supabase
      .from("email_providers")
      .select("*")
      .eq("is_active", true)
      .order("is_primary", { ascending: false })
      .order("priority", { ascending: true });

    if (error || !records || records.length === 0) {
      // Return default fallback configuration
      return [new ResendProvider({
        id: "default-resend",
        name: "Resend API (Fallback)",
        provider_type: "resend",
        from_email: "0machine@cooldelo.com"
      })];
    }

    const filtered = records.filter(r => {
      if (purpose === "marketing") return r.marketing_enabled;
      if (purpose === "transactional") return r.transactional_enabled;
      return true;
    });

    const instances = (filtered.length > 0 ? filtered : records).map(r => this.getProviderInstance(r));
    return instances;
  }
}

export class EmailService {
  /**
   * Centralized Email Send Method with Suppression Safeguards & Provider Fallback
   */
  static async send({ to, subject, html, text, purpose = "marketing", fromName, fromEmail }) {
    const recipient = (Array.isArray(to) ? to[0] : to).toLowerCase().trim();

    // 1. SUPPRESSION PROTECTION: Pre-send suppression check
    const { data: suppressed } = await supabase
      .from("suppressions")
      .select("reason")
      .eq("email", recipient)
      .single();

    if (suppressed) {
      console.warn(`[EMAIL SERVICE ABORTED] Recipient ${recipient} is suppressed (${suppressed.reason}).`);
      return {
        success: false,
        error: `Recipient is suppressed (${suppressed.reason})`,
        code: "RECIPIENT_SUPPRESSED",
        recipient
      };
    }

    // Check contact status in contacts table
    const { data: contact } = await supabase
      .from("contacts")
      .select("status")
      .eq("email", recipient)
      .single();

    if (contact && ["unsubscribed", "bounced", "complained"].includes(contact.status)) {
      console.warn(`[EMAIL SERVICE ABORTED] Contact ${recipient} status is ${contact.status}.`);
      return {
        success: false,
        error: `Contact status is ${contact.status}`,
        code: "RECIPIENT_SUPPRESSED",
        recipient
      };
    }

    // 2. Fetch Active Providers for purpose
    const providers = await ProviderManager.getActiveProviders(purpose);

    let lastError = null;
    for (let i = 0; i < providers.length; i++) {
      const provider = providers[i];
      try {
        console.log(`[EMAIL SERVICE] Attempting send via provider '${provider.name}' (${provider.providerType})...`);

        const result = await provider.sendEmail({
          to: recipient,
          subject,
          html,
          text,
          fromName,
          fromEmail
        });

        // Log successful send activity
        await supabase.from("email_activity_logs").insert([{
          action: "EMAIL_SENT",
          description: `Sent ${purpose} email to ${recipient} via ${provider.name}`,
          metadata: { provider: provider.providerType, messageId: result.messageId, purpose }
        }]);

        return result;
      } catch (err) {
        lastError = err;
        console.error(`[EMAIL SERVICE PROVIDER FAILURE] Provider '${provider.name}' failed:`, err.message);

        // Log provider failure event
        await supabase.from("email_activity_logs").insert([{
          action: "PROVIDER_FAILURE",
          description: `Provider '${provider.name}' failed for recipient ${recipient}: ${err.message}`,
          metadata: { provider: provider.providerType, error: err.message }
        }]);

        // If this was a primary provider failure and fallback exists, log fallback transition
        if (i < providers.length - 1) {
          console.warn(`[EMAIL SERVICE FALLBACK] Switching to fallback provider '${providers[i + 1].name}'...`);
          await supabase.from("email_activity_logs").insert([{
            action: "PROVIDER_FALLBACK",
            description: `Fallback triggered: Switched from ${provider.name} to ${providers[i + 1].name}`,
            metadata: { failed_provider: provider.providerType, next_provider: providers[i + 1].providerType }
          }]);
        }
      }
    }

    return {
      success: false,
      error: lastError ? lastError.message : "All configured email providers failed to send.",
      code: "PROVIDER_ALL_FAILED",
      recipient
    };
  }
}
