export async function sendSubscriptionReceiptEmail({
  userEmail,
  planName = '0machine Pro',
  billingCycle = 'annual',
  amountPaid = '$149.00',
  nextBillingDate,
  invoiceId = ''
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!userEmail) return;

  const formattedCycle = billingCycle === 'annual' ? 'Annual (1 Year)' : 'Monthly (1 Month)';
  const formattedDate = nextBillingDate ? new Date(nextBillingDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'Next Billing Period';

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0F1117; color: #F1F5F9; margin: 0; padding: 40px 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #1C2030; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
    .header { text-align: center; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 24px; margin-bottom: 24px; }
    .logo { font-size: 24px; font-weight: 900; color: #FF6B35; text-transform: uppercase; letter-spacing: 2px; }
    .badge { display: inline-block; background: rgba(16, 185, 129, 0.15); color: #10B981; border: 1px solid rgba(16, 185, 129, 0.3); font-weight: 700; font-size: 11px; padding: 4px 12px; border-radius: 50px; text-transform: uppercase; margin-top: 8px; }
    .title { font-size: 22px; font-weight: 800; color: #FFFFFF; margin-top: 16px; margin-bottom: 8px; }
    .text { font-size: 14px; color: #94A3B8; line-height: 1.6; margin-bottom: 20px; }
    .box { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 20px; margin-bottom: 24px; }
    .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 13px; }
    .row:last-child { border-bottom: none; }
    .label { color: #8B95A8; }
    .value { font-weight: 700; color: #FFFFFF; text-align: right; }
    .highlight { color: #FF6B35; }
    .section-title { font-size: 15px; font-weight: 700; color: #FFFFFF; margin-top: 24px; margin-bottom: 8px; }
    .btn { display: block; width: 100%; text-align: center; background: #FF6B35; color: #FFFFFF; font-weight: 700; font-size: 14px; padding: 14px 0; border-radius: 12px; text-decoration: none; margin-top: 24px; }
    .footer { text-align: center; font-size: 12px; color: #64748B; margin-top: 32px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 20px; }
    .support-link { color: #FF6B35; text-decoration: none; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">⚙️ 0MACHINE OS</div>
      <div class="badge">Payment Confirmed & Verified</div>
      <div class="title">Welcome to ${planName}! 🎉</div>
      <div class="text">Thank you for subscribing to 0Machine. Your workshop account has been upgraded with full access to all Pro tools and features.</div>
    </div>

    <div class="box">
      <div class="row">
        <span class="label">Plan Name</span>
        <span class="value highlight">${planName}</span>
      </div>
      <div class="row">
        <span class="label">Billing Cycle</span>
        <span class="value">${formattedCycle}</span>
      </div>
      <div class="row">
        <span class="label">Next Billing Date</span>
        <span class="value" style="color:#10B981;">📅 ${formattedDate}</span>
      </div>
      <div class="row">
        <span class="label">Subscription Status</span>
        <span class="value" style="color:#10B981;">Active</span>
      </div>
    </div>

    <div class="section-title">💬 Need Help or Experiencing Issues?</div>
    <div class="text">
      If you ever experience any issue, need help setting up your laser machine presets or material stock inventory, our team is here for you. Simply contact us anytime at <a href="mailto:0machine@cooldelo.com" class="support-link">0machine@cooldelo.com</a>.
    </div>

    <div class="section-title">💡 Have Feature Ideas for 0Machine?</div>
    <div class="text">
      We build 0Machine specifically for makers and workshop owners! If there's a feature, tool, or calculator you'd love to see added inside the app, send your suggestions directly to our support team at <a href="mailto:0machine@cooldelo.com" class="support-link">0machine@cooldelo.com</a> — we review every idea carefully!
    </div>

    <a href="https://app.0machine.com" class="btn">Launch Workshop Dashboard →</a>

    <div class="footer">
      0Machine SaaS Workshop Operating System · <a href="https://app.0machine.com" class="support-link">app.0machine.com</a><br>
      Support & Feature Requests: <a href="mailto:0machine@cooldelo.com" class="support-link">0machine@cooldelo.com</a>
    </div>
  </div>
</body>
</html>
  `;

  console.log(`[EMAIL RECEIPT] Processing receipt email for: ${userEmail}`);

  if (!apiKey || apiKey.startsWith('re_placeholder')) {
    console.log(`[EMAIL RECEIPT] Resend API key missing or placeholder. Logging receipt details:\nTarget: ${userEmail}\nNext Billing: ${formattedDate}\nSupport: 0machine@cooldelo.com`);
    return { success: true, mock: true };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: '0Machine Support <0machine@cooldelo.com>',
        to: [userEmail],
        subject: `🎉 Welcome to ${planName} — Subscription Receipt & Next Renewal Date`,
        html: htmlContent,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.warn('[EMAIL RECEIPT WARNING] Resend API error response:', data);
    } else {
      console.log(`[EMAIL RECEIPT SUCCESS] Receipt email sent to ${userEmail}. ID: ${data.id}`);
    }
    return data;
  } catch (err) {
    console.error('[EMAIL RECEIPT ERROR]:', err);
  }
}
