import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, user_id, price_id } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Log abandoned checkout tracking event to Supabase
    const { error: dbErr } = await supabase
      .from('analytics_events')
      .insert([
        {
          event_name: 'abandoned_checkout_queued',
          page_path: '/checkout',
          session_id: user_id || 'anonymous',
          metadata: {
            email,
            user_id,
            price_id,
            recovery_status: 'pending',
            queued_at: new Date().toISOString(),
          },
        },
      ]);

    if (dbErr) {
      console.error('Abandoned checkout DB log error:', dbErr);
    }

    // Check if Resend API Key is set
    const resendKey = process.env.RESEND_API_KEY;
    let emailStatus = 'logged_only';

    if (resendKey && resendKey !== 're_placeholder_please_replace_with_your_key') {
      try {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: '0Machine Planner <support@cooldelo.com>',
            to: [email],
            subject: '⚡ Still thinking about 0Machine Pro?',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #13151f; color: #ffffff; padding: 32px; border-radius: 16px;">
                <h2 style="color: #ff6b35;">Unlock the 500+ Design Library & Nesting Tool</h2>
                <p style="color: #94a3b8; line-height: 1.6;">Hi there,</p>
                <p style="color: #94a3b8; line-height: 1.6;">We noticed you started upgrading to 0Machine Pro ($19/mo) but didn't complete your checkout.</p>
                <p style="color: #94a3b8; line-height: 1.6;">With Pro, you get instant access to 500+ ready-to-cut DXF/SVG vector files, sheet nesting yield optimizer, and custom PDF client invoices.</p>
                <div style="text-align: center; margin: 28px 0;">
                  <a href="https://app.0machine.com" style="background: #ff6b35; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: bold; display: inline-block;">Complete Pro Upgrade →</a>
                </div>
                <p style="font-size: 12px; color: #64748b; text-align: center;">Questions? Simply reply to this email.</p>
              </div>
            `,
          }),
        });

        if (resendRes.ok) {
          emailStatus = 'email_sent';
        }
      } catch (e) {
        console.error('Resend email error:', e);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Abandoned checkout queued successfully',
      status: emailStatus,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
