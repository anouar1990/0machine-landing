import nodemailer from "nodemailer";

export class SmtpProvider {
  constructor(config) {
    this.id = config.id;
    this.name = config.name || "Custom SMTP";
    this.providerType = "smtp";
    this.fromEmail = config.from_email || "0machine@cooldelo.com";
    this.fromName = config.from_name || "0machine Marketing";
    this.credentials = config.credentials_encrypted || {};
    this.host = this.credentials.host || "smtp.mailtrap.io";
    this.port = parseInt(this.credentials.port || 587, 10);
    this.username = this.credentials.username || "";
    this.password = this.credentials.password || "";
    this.encryption = this.credentials.encryption || "tls"; // tls, ssl, none
    this.rateLimit = config.rate_limit || 5;
    this.dailyLimit = config.daily_limit || 5000;
  }

  validateConfiguration() {
    if (!this.host) return { valid: false, error: "SMTP Host is required." };
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

  createTransporter() {
    return nodemailer.createTransport({
      host: this.host,
      port: this.port,
      secure: this.encryption === "ssl",
      auth: this.username ? { user: this.username, pass: this.password } : undefined,
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  async testConnection() {
    try {
      const validation = this.validateConfiguration();
      if (!validation.valid) return { success: false, error: validation.error };

      const transporter = this.createTransporter();
      await transporter.verify();
      return { success: true, message: `✓ SMTP connection to ${this.host}:${this.port} verified successfully.` };
    } catch (err) {
      return { success: false, error: `SMTP connection failed: ${err.message}` };
    }
  }

  async sendEmail({ to, subject, html, text, fromName, fromEmail }) {
    const recipient = Array.isArray(to) ? to[0] : to;
    const sender = `${fromName || this.fromName} <${fromEmail || this.fromEmail}>`;

    const transporter = this.createTransporter();
    const info = await transporter.sendMail({
      from: sender,
      to: recipient,
      subject: subject,
      html: html,
      text: text
    });

    return {
      success: true,
      provider: "smtp",
      messageId: info.messageId || `smtp-${Date.now()}`,
      recipient
    };
  }
}
