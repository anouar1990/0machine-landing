import { SESClient, SendEmailCommand, GetSendQuotaCommand } from "@aws-sdk/client-ses";

export class AwsSesProvider {
  constructor(config) {
    this.id = config.id;
    this.name = config.name || "Amazon SES";
    this.providerType = "aws_ses";
    this.fromEmail = config.from_email || "0machine@cooldelo.com";
    this.fromName = config.from_name || "0machine Marketing";
    this.credentials = config.credentials_encrypted || {};
    this.rateLimit = config.rate_limit || 14;
    this.dailyLimit = config.daily_limit || 50000;
  }

  validateConfiguration() {
    if (!this.fromEmail) return { valid: false, error: "Sender email is required." };
    return { valid: true };
  }

  getAwsCredentials() {
    const region = this.credentials.region || process.env.AWS_REGION || "us-east-1";
    const accessKeyId = this.credentials.access_key_id || process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = this.credentials.secret_access_key || process.env.AWS_SECRET_ACCESS_KEY;

    return { region, accessKeyId, secretAccessKey };
  }

  createSesClient() {
    const { region, accessKeyId, secretAccessKey } = this.getAwsCredentials();

    if (accessKeyId && secretAccessKey && !accessKeyId.includes("EXAMPLE")) {
      return new SESClient({
        region,
        credentials: {
          accessKeyId,
          secretAccessKey
        }
      });
    }

    // Default environment fallback
    return new SESClient({ region });
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

      const { region, accessKeyId } = this.getAwsCredentials();
      if (!accessKeyId || accessKeyId.includes("EXAMPLE")) {
        return {
          success: true,
          message: `✓ Amazon SES (${region}) adapter ready. Add real AWS Access Keys in provider settings to activate live SES sending.`
        };
      }

      const client = this.createSesClient();
      const command = new GetSendQuotaCommand({});
      const quota = await client.send(command);

      return {
        success: true,
        message: `✓ Amazon SES (${region}) connected. Max 24h Quota: ${quota.Max24HourSend || 50000}, Sent 24h: ${quota.SentLast24Hours || 0}, Max Rate: ${quota.MaxSendRate || 14}/sec.`
      };
    } catch (err) {
      return { success: false, error: `AWS SES Connection Failed: ${err.message}` };
    }
  }

  async sendEmail({ to, subject, html, text, fromName, fromEmail }) {
    const recipient = Array.isArray(to) ? to[0] : to;
    const sender = `${fromName || this.fromName} <${fromEmail || this.fromEmail}>`;
    const { accessKeyId } = this.getAwsCredentials();

    // If using placeholder credentials, perform mock send cleanly
    if (!accessKeyId || accessKeyId.includes("EXAMPLE")) {
      console.log(`[AWS SES MOCK SEND] To: ${recipient}, Subject: ${subject}`);
      return {
        success: true,
        provider: "aws_ses",
        messageId: `ses-mock-${Date.now()}`,
        recipient,
        mock: true
      };
    }

    const client = this.createSesClient();
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

    const response = await client.send(command);

    console.log(`[AWS SES LIVE SEND SUCCESS] MessageId: ${response.MessageId} to ${recipient}`);
    return {
      success: true,
      provider: "aws_ses",
      messageId: response.MessageId,
      recipient
    };
  }
}
