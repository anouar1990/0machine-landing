import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { sendSubscriptionReceiptEmail } from '../../lib/email';

const getStripe = () => {
  const apiKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_key';
  return new Stripe(apiKey, {
    apiVersion: '2023-10-16',
  });
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kfydsuuelaxaffntdjxh.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmeWRzdXVlbGF4YWZmbnRkanhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NDM1NDQsImV4cCI6MjA4ODExOTU0NH0._hb_RTEmoUevs3fjlv3IaZksZo7Ho3AdIdprYA1OaGQ';

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');

  console.log(`[VERIFY SESSION] Request received for session_id: ${sessionId || 'none'}`);

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id parameter' }, { status: 400 });
  }

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer'],
    });

    console.log(`[VERIFY SESSION] Stripe Session found: ${session.id}, Payment Status: ${session.payment_status}`);

    const isPaid = session.payment_status === 'paid' || session.status === 'complete';
    const userId = session.metadata?.userId || '';
    const plan = session.metadata?.plan || 'pro';
    const cycle = session.metadata?.cycle || 'monthly';
    const customerId = typeof session.customer === 'object' ? session.customer?.id : session.customer;
    const subscriptionId = typeof session.subscription === 'object' ? session.subscription?.id : session.subscription;
    const customerEmail = session.customer_details?.email || session.customer_email || (typeof session.customer === 'object' ? session.customer?.email : null);

    if (!isPaid) {
      return NextResponse.json({
        isPro: false,
        status: session.payment_status,
        message: 'Payment not yet confirmed by Stripe',
      });
    }

    const currentPeriodEnd = session.subscription && typeof session.subscription === 'object' && session.subscription.current_period_end
      ? new Date(session.subscription.current_period_end * 1000).toISOString()
      : new Date(Date.now() + (cycle === 'annual' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString();

    // Instant Sync: Ensure user_settings is updated immediately
    if (userId) {
      console.log(`[VERIFY SESSION] Performing instant sync for User ID: ${userId}...`);

      const { error: upsertErr } = await supabaseAdmin
        .from('user_settings')
        .upsert(
          {
            user_id: userId,
            plan: plan,
            billing_cycle: cycle,
            subscription_status: 'active',
            stripe_customer_id: customerId || null,
            stripe_subscription_id: subscriptionId || null,
            current_period_end: currentPeriodEnd,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );

      if (upsertErr) {
        console.error('[VERIFY SESSION DB ERROR]:', upsertErr);
      } else {
        console.log(`[VERIFY SESSION DB SUCCESS] User ${userId} updated to Plan: ${plan}, Status: active`);
      }
    }

    // Trigger Receipt Email Async
    if (customerEmail) {
      sendSubscriptionReceiptEmail({
        userEmail: customerEmail,
        planName: plan === 'starter' ? '0machine Starter' : '0machine Pro',
        billingCycle: cycle,
        amountPaid: cycle === 'annual' ? (plan === 'starter' ? '$59.00' : '$149.00') : (plan === 'starter' ? '$9.00' : '$19.00'),
        nextBillingDate: currentPeriodEnd,
        invoiceId: session.invoice || session.id,
      }).catch(err => console.warn('[VERIFY SESSION EMAIL ERROR]:', err));
    }

    return NextResponse.json({
      isPro: true,
      status: 'active',
      plan: plan,
      userId: userId,
      message: 'Pro account activated successfully!',
    });
  } catch (err) {
    console.error('[VERIFY SESSION ERROR]:', err);
    return NextResponse.json({ error: err.message || 'Failed to verify checkout session' }, { status: 500 });
  }
}
