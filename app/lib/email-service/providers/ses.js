import { SESClient, SendEmailCommand, SendRawEmailCommand, GetSendQuotaCommand } from "@aws-sdk/client-ses";
import nodemailer from "nodemailer";

export class AwsSesProvider {
  constructor(config = {}) {
    this.id = config.id;
    this.name = config.name || "Amazon SES";
    this.providerType = "aws_ses";
    this.fromEmail = config.from_email || "0machine@cooldelo.com";
    this.fromName = config.from_name || "0machine Marketing";
    this.credentials = config.credentials_encrypted || {};
    this.rateLimit = config.rate_limit || 14;
    this.dailyLimit = config.daily_limit || 50000;
  }

  getAwsCredentials() {
    const region = this.credentials.region || process.env.AWS_REGION || "us-east-1";
    const accessKeyId = this.credentials.access_key_id || process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = this.credentials.secret_access_key || process.env.AWS_SECRET_ACCESS_KEY;

    return { region, accessKeyId, secretAccessKey };
  }

  validateConfiguration() {
    if (!this.fromEmail || !this.fromEmail.includes("@")) {
      return { valid: false, error: "Valid sender email (from_email) is required." };
    }

    const { region, accessKeyId, secretAccessKey } = this.getAwsCredentials();

    if (!region) {
      return { valid: false, error: "AWS Region is required for Amazon SES." };
    }

    if (!accessKeyId || !accessKeyId.trim()) {
      return { valid: false, error: "AWS Access Key ID is required." };
    }

    if (!secretAccessKey || !secretAccessKey.trim()) {
      return { valid: false, error: "AWS Secret Access Key is required." };
    }

    const isPlaceholder = (val) => {
      const upper = (val || "").toUpperCase().trim();
      return (
        upper.includes("EXAMPLE") ||
        upper.includes("PLACEHOLDER") ||
        upper.includes("TODO") ||
        upper.includes("DUMMY")
      );
    };

    if (isPlaceholder(accessKeyId) || isPlaceholder(secretAccessKey)) {
      return {
        valid: false,
        error: "AWS SES configuration contains placeholder credentials. Real AWS Access Key ID and Secret Access Key are required."
      };
    }

    return { valid: true };
  }

  createSesClient() {
    const validation = this.validateConfiguration();
    if (!validation.valid) {
      throw new Error(`AWS SES configuration error: ${validation.error}`);
    }

    const { region, accessKeyId, secretAccessKey } = this.getAwsCredentials();

    return new SESClient({
      region,
      credentials: {
        accessKeyId: accessKeyId.trim(),
        secretAccessKey: secretAccessKey.trim()
      }
    });
  }

  async getProviderStatus() {
    const configValid = this.validateConfiguration();
    return {
      id: this.id,
      name: this.name,
      type: this.providerType,
      valid: configValid.valid,
      error: configValid.error || null,
      fromEmail: this.fromEmail,
      rateLimit: `${this.rateLimit} emails/sec`,
      dailyLimit: `${this.dailyLimit.toLocaleString()} / day`
    };
  }

  async testConnection() {
    try {
      const validation = this.validateConfiguration();
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      const client = this.createSesClient();
      const command = new GetSendQuotaCommand({});
      const quota = await client.send(command);

      const region = this.credentials.region || process.env.AWS_REGION || "us-east-1";
      return {
        success: true,
        message: `✓ Amazon SES (${region}) connected. Max 24h Quota: ${quota.Max24HourSend || 50000}, Sent 24h: ${quota.SentLast24Hours || 0}, Max Rate: ${quota.MaxSendRate || 14}/sec.`
      };
    } catch (err) {
      return { success: false, error: `AWS SES Connection Failed: ${err.message}` };
    }
  }

  async sendEmail({ to, subject, html, text, fromName, fromEmail, headers, unsubscribeToken, unsubscribeUrl }) {
    const recipient = Array.isArray(to) ? to[0] : to;
    if (!recipient || !recipient.includes("@")) {
      throw new Error("Valid recipient email address is required.");
    }

    // Explicit validation check: reject missing or placeholder credentials
    const validation = this.validateConfiguration();
    if (!validation.valid) {
      throw new Error(`AWS SES send failed: ${validation.error}`);
    }

    const sender = `${fromName || this.fromName} <${fromEmail || this.fromEmail}>`;
    const client = this.createSesClient();

    // Prepare MIME headers
    const mailHeaders = {
      ...(headers || {})
    };
    if (unsubscribeToken || unsubscribeUrl) {
      const unsubUrl = unsubscribeUrl || `https://app.0machine.com/api/email/unsubscribe?token=${unsubscribeToken}`;
      mailHeaders["List-Unsubscribe"] = `<${unsubUrl}>`;
      mailHeaders["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
    }

    let response;

    if (Object.keys(mailHeaders).length > 0) {
      // Build RFC 5322 MIME message for SES with custom headers
      const transporter = nodemailer.createTransport({ streamTransport: true, buffer: true });
      const rawInfo = await transporter.sendMail({
        from: sender,
        to: recipient,
        subject,
        html,
        text,
        headers: mailHeaders
      });

      const rawCommand = new SendRawEmailCommand({
        RawMessage: {
          Data: rawInfo.message
        },
        Source: sender,
        Destinations: [recipient]
      });

      response = await client.send(rawCommand);
    } else {
      const command = new SendEmailCommand({
        Source: sender,
        Destination: {
          ToAddresses: [recipient]
        },
        Message: {
          Subject: {
            Data: subject,
            Charset: "UTF-8"
          },
          Body: {
            Html: {
              Data: html,
              Charset: "UTF-8"
            },
            ...(text ? { Text: { Data: text, Charset: "UTF-8" } } : {})
          }
        }
      });

      response = await client.send(command);
    }

    if (!response || !response.MessageId) {
      throw new Error("AWS SES send failed: No MessageId returned by provider.");
    }

    return {
      success: true,
      provider: "aws_ses",
      messageId: response.MessageId,
      recipient,
      headers: mailHeaders
    };
  }
}
