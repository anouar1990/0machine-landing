// Resend API Provider Adapter
export class ResendProvider {
  constructor(config) {
    this.id = config.id;
    this.name = config.name || "Resend API";
    this.providerType = "resend";
    this.fromEmail = config.from_email || "onboarding@resend.dev";
    this.fromName = config.from_name || "0machine Support";
    this.credentials = config.credentials_encrypted || {};
    this.apiKey = this.credentials.api_key || process.env.RESEND_API_KEY;
    this.rateLimit = config.rate_limit || 10;
    this.dailyLimit = config.daily_limit || 3000;
  }

  validateConfiguration() {
    if (!this.apiKey) return { valid: false, error: "Resend API Key is required." };
    if (!this.fromEmail) return { valid: false, error: "Sender email is required." };
    return { valid: true };
  }

  async getProviderStatus() {
    const configValid = this.validateConfiguration();
    return {
      id: this.id,
      name: this.name,
      type: this.providerType,
      valid: configValid.valid,
      fromEmail: this.fromEmail,
      rateLimit: `${this.rateLimit} emails/sec`,
      dailyLimit: `${this.dailyLimit.toLocaleString()} / day`
    };
  }

  async testConnection() {
    try {
      const validation = this.validateConfiguration();
      if (!validation.valid) return { success: false, error: validation.error };

      if (!this.apiKey || this.apiKey.startsWith("re_placeholder")) {
        return { success: true, message: "✓ Resend API key placeholder detected (mock mode ready)." };
      }

      const res = await fetch("https://api.resend.com/emails", {
        headers: { Authorization: `Bearer ${this.apiKey}` }
      });

      if (!res.ok && res.status !== 401) {
        return { success: true, message: `✓ Resend API endpoint reachable (HTTP ${res.status}).` };
      }

      if (res.ok) {
        return { success: true, message: "✓ Resend API credentials verified successfully." };
      }

      return { success: false, error: `Resend API key rejected (HTTP ${res.status}).` };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async sendEmail({ to, subject, html, text, fromName, fromEmail }) {
    const recipient = Array.isArray(to) ? to[0] : to;
    const sender = `${fromName || this.fromName} <${fromEmail || this.fromEmail}>`;

    if (!this.apiKey || this.apiKey.startsWith("re_placeholder")) {
      return {
        success: true,
        provider: "resend",
        messageId: `resend-mock-${Date.now()}`,
        recipient,
        mock: true
      };
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        from: sender,
        to: [recipient],
        subject: subject,
        html: html,
        text: text
      })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Resend API failed with status ${res.status}`);
    }

    return {
      success: true,
      provider: "resend",
      messageId: data.id || `resend-${Date.now()}`,
      recipient
    };
  }
}
