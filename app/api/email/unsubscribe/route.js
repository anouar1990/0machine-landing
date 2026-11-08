import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/app/lib/supabase-admin";
import { verifyUnsubscribeToken } from "@/app/lib/email-service/unsubscribe-crypto";

/**
 * HTML Template for GET /api/email/unsubscribe confirmation page
 */
function renderConfirmationHtml({ email, token, campaignName, error = null }) {
  if (error) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Invalid Unsubscribe Link — 0machine</title>
  <style>
    body { margin: 0; background-color: #0A0C12; color: #F1F5F9; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; min-height: 100vh; align-items: center; justify-content: center; padding: 20px; box-sizing: border-box; }
    .card { background: #13151F; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; max-width: 480px; width: 100%; padding: 36px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
    .icon { width: 56px; height: 56px; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: #EF4444; font-size: 24px; font-weight: bold; }
    h1 { font-size: 22px; margin: 0 0 12px; font-weight: 700; color: #FFFFFF; }
    p { font-size: 14px; color: #94A3B8; line-height: 1.6; margin: 0 0 24px; }
    .btn { display: inline-block; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #F1F5F9; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-size: 13px; font-weight: 600; transition: all 0.2s; }
    .btn:hover { background: rgba(255,255,255,0.15); }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">✕</div>
    <h1>Invalid or Expired Link</h1>
    <p>${error}</p>
    <a href="https://0machine.com" class="btn">Return to 0machine Home</a>
  </div>
</body>
</html>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Unsubscribe — 0machine Marketing</title>
  <style>
    body { margin: 0; background-color: #0A0C12; color: #F1F5F9; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; min-height: 100vh; align-items: center; justify-content: center; padding: 20px; box-sizing: border-box; }
    .card { background: #13151F; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; max-width: 500px; width: 100%; padding: 40px; text-align: center; box-shadow: 0 25px 50px rgba(0,0,0,0.5); }
    .logo { display: inline-flex; align-items: center; gap: 8px; font-size: 18px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px; margin-bottom: 24px; }
    .logo span { color: #FE7733; }
    .icon { width: 56px; height: 56px; background: rgba(254, 119, 51, 0.12); border: 1px solid rgba(254, 119, 51, 0.25); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: #FE7733; font-size: 24px; }
    h1 { font-size: 24px; margin: 0 0 8px; font-weight: 800; color: #FFFFFF; }
    .target-email { display: inline-block; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); padding: 6px 14px; border-radius: 20px; font-family: monospace; font-size: 13px; color: #FE7733; margin: 12px 0 16px; }
    p { font-size: 14px; color: #94A3B8; line-height: 1.6; margin: 0 0 28px; }
    .actions { display: flex; flex-direction: column; gap: 12px; }
    .btn-confirm { background: #FE7733; border: none; color: #FFFFFF; padding: 14px 24px; border-radius: 12px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 8px 20px rgba(254, 119, 51, 0.25); }
    .btn-confirm:hover { background: #ff8547; transform: translateY(-1px); }
    .btn-cancel { background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #94A3B8; text-decoration: none; padding: 12px 24px; border-radius: 12px; font-size: 13px; font-weight: 600; transition: all 0.2s; }
    .btn-cancel:hover { background: rgba(255,255,255,0.05); color: #F1F5F9; }
    .success-panel { display: none; padding-top: 10px; }
    .success-icon { color: #10B981; font-size: 32px; margin-bottom: 12px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">0MACHINE <span>MARKETING</span></div>
    
    <div id="prompt-state">
      <div class="icon">✉</div>
      <h1>Confirm Unsubscribe</h1>
      <div><span class="target-email">${email}</span></div>
      <p>
        Are you sure you want to unsubscribe from 0machine marketing emails${campaignName ? ` for <strong>${campaignName}</strong>` : ""}? You will not receive future marketing announcements.
      </p>

      <form id="unsub-form" method="POST" action="/api/email/unsubscribe">
        <input type="hidden" name="token" value="${token}" />
        <div class="actions">
          <button type="submit" id="submit-btn" class="btn-confirm">Confirm Unsubscribe</button>
          <a href="https://0machine.com" class="btn-cancel">Go Back / Cancel</a>
        </div>
      </form>
    </div>

    <div id="success-state" class="success-panel">
      <div class="success-icon">✓</div>
      <h1>You have been unsubscribed</h1>
      <p>Your email preference has been updated. You will no longer receive marketing communications from 0machine.</p>
      <a href="https://0machine.com" class="btn-cancel" style="display: inline-block;">Return to 0machine</a>
    </div>
  </div>

  <script>
    const form = document.getElementById('unsub-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('submit-btn');
        btn.disabled = true;
        btn.innerText = 'Unsubscribing...';
        try {
          const res = await fetch('/api/email/unsubscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: '${token}' })
          });
          const data = await res.json();
          if (res.ok && data.success) {
            document.getElementById('prompt-state').style.display = 'none';
            document.getElementById('success-state').style.display = 'block';
          } else {
            alert(data.error || 'Failed to process unsubscribe request.');
            btn.disabled = false;
            btn.innerText = 'Confirm Unsubscribe';
          }
        } catch (err) {
          alert('Network error. Please try again.');
          btn.disabled = false;
          btn.innerText = 'Confirm Unsubscribe';
        }
      });
    }
  </script>
</body>
</html>`;
}

/**
 * GET /api/email/unsubscribe?token=xyz
 * Renders user-facing confirmation page
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    const html = renderConfirmationHtml({
      error: "Missing unsubscribe token. Please click the unsubscribe link provided in your email."
    });
    return new NextResponse(html, {
      status: 400,
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });
  }

  const verified = verifyUnsubscribeToken(token);
  if (!verified.valid) {
    const html = renderConfirmationHtml({
      error: "This unsubscribe link is invalid or has expired (links remain valid for 60 days)."
    });
    return new NextResponse(html, {
      status: 400,
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });
  }

  let campaignName = null;
  if (verified.campaignId) {
    try {
      const { data: campaign } = await supabase
        .from("campaigns")
        .select("name")
        .eq("id", verified.campaignId)
        .single();
      if (campaign?.name) campaignName = campaign.name;
    } catch (e) {
      // Non-critical, continue without campaign name
    }
  }

  const html = renderConfirmationHtml({
    email: verified.email,
    token,
    campaignName
  });

  return new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" }
  });
}

/**
 * POST /api/email/unsubscribe
 * RFC 8058 one-click and confirmation form submission endpoint
 */
export async function POST(request) {
  try {
    let token = null;

    // 1. Try JSON body
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await request.json().catch(() => null);
      if (body?.token) token = body.token;
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await request.formData().catch(() => null);
      if (formData) token = formData.get("token");
    }

    // 2. If body is empty or token missing, check URL query param (RFC 8058 support)
    if (!token) {
      const { searchParams } = new URL(request.url);
      token = searchParams.get("token");
    }

    if (!token) {
      return NextResponse.json(
        { error: "Invalid or expired unsubscribe link" },
        { status: 400 }
      );
    }

    // 3. Verify Token
    const verified = verifyUnsubscribeToken(token);
    if (!verified.valid) {
      return NextResponse.json(
        { error: verified.error || "Invalid or expired unsubscribe link" },
        { status: 400 }
      );
    }

    const { email: verifiedEmail, contactId, campaignId } = verified;
    const nowIso = new Date().toISOString();

    // 4. Database Updates with Graceful Partial Failure Handling

    // 4a. Upsert into public.suppressions
    try {
      await supabase
        .from("suppressions")
        .upsert(
          [
            {
              email: verifiedEmail,
              reason: "recipient_unsubscribed",
              source: "recipient_link",
              created_at: nowIso
            }
          ],
          { onConflict: "email" }
        );
    } catch (suppErr) {
      console.error("[UNSUBSCRIBE] Suppressions upsert warning:", suppErr.message);
    }

    // 4b. Update public.contacts
    try {
      await supabase
        .from("contacts")
        .update({
          status: "unsubscribed",
          updated_at: nowIso
        })
        .eq("email", verifiedEmail);
    } catch (contactErr) {
      console.error("[UNSUBSCRIBE] Contacts update warning:", contactErr.message);
    }

    // 4c. Insert into public.campaign_events (if campaignId is known)
    if (campaignId) {
      try {
        await supabase.from("campaign_events").insert([
          {
            campaign_id: campaignId,
            contact_id: contactId || null,
            event_type: "unsubscribed",
            created_at: nowIso
          }
        ]);
      } catch (evtErr) {
        console.error("[UNSUBSCRIBE] Campaign event logging warning:", evtErr.message);
      }

      // 4d. Increment campaign unsubscribe_count
      try {
        const { data: camp } = await supabase
          .from("campaigns")
          .select("unsubscribe_count")
          .eq("id", campaignId)
          .single();

        await supabase
          .from("campaigns")
          .update({
            unsubscribe_count: (camp?.unsubscribe_count || 0) + 1,
            updated_at: nowIso
          })
          .eq("id", campaignId);
      } catch (campErr) {
        console.error("[UNSUBSCRIBE] Campaign count increment warning:", campErr.message);
      }
    }

    // 4e. Log to public.email_activity_logs
    try {
      await supabase.from("email_activity_logs").insert([
        {
          action: "UNSUBSCRIBE_CONFIRMED",
          description: `Recipient ${verifiedEmail} unsubscribed via recipient_link`,
          actor_email: verifiedEmail,
          metadata: {
            email: verifiedEmail,
            campaign_id: campaignId || null,
            contact_id: contactId || null,
            source: "recipient_link"
          },
          created_at: nowIso
        }
      ]);
    } catch (logErr) {
      console.error("[UNSUBSCRIBE] Activity log warning:", logErr.message);
    }

    return NextResponse.json(
      {
        success: true,
        message: "You have been unsubscribed"
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[UNSUBSCRIBE ENDPOINT ERROR]:", err);
    return NextResponse.json(
      { error: "Unable to process request" },
      { status: 500 }
    );
  }
}
