import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { sendSubscriptionReceiptEmail } from '../../../lib/email';

const getStripe = () => {
  const apiKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_key';
  return new Stripe(apiKey, {
    apiVersion: '2023-10-16',
  });
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kfydsuuelaxaffntdjxh.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmeWRzdXVlbGF4YWZmbnRkanhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NDM1NDQsImV4cCI6MjA4ODExOTU0NH0._hb_RTEmoUevs3fjlv3IaZksZo7Ho3AdIdprYA1OaGQ';

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

export async function POST(req) {
  const bodyText = await req.text();
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (webhookSecret && sig) {
      event = getStripe().webhooks.constructEvent(bodyText, sig, webhookSecret);
      console.log(`[STRIPE WEBHOOK] Signature verified successfully. Event: ${event.type}`);
    } else {
      console.warn('[STRIPE WEBHOOK] STRIPE_WEBHOOK_SECRET or signature missing. Parsing body JSON without signature check.');
      event = JSON.parse(bodyText);
    }
  } catch (err) {
    console.error(`[STRIPE WEBHOOK ERROR] Signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Signature Verification Failed: ${err.message}` }, { status: 400 });
  }

  console.log(`[STRIPE WEBHOOK] Received event: ${event.type} [ID: ${event.id}]`);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log(`[STRIPE WEBHOOK] Handling checkout.session.completed for Session: ${session.id}`);

        const userId = session.metadata?.userId || '';
        const customerId = session.customer;
        const subscriptionId = session.subscription;
        const customerEmail = session.customer_details?.email || session.customer_email;
        const plan = session.metadata?.plan || 'pro';
        const cycle = session.metadata?.cycle || 'monthly';

        console.log(`[STRIPE WEBHOOK] User ID: ${userId}, Email: ${customerEmail}, Customer: ${customerId}, Sub: ${subscriptionId}`);

        let subscriptionStatus = 'active';
        let currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

        if (subscriptionId && typeof subscriptionId === 'string') {
          try {
            const sub = await getStripe().subscriptions.retrieve(subscriptionId);
            subscriptionStatus = sub.status;
            if (sub.current_period_end) {
              currentPeriodEnd = new Date(sub.current_period_end * 1000).toISOString();
            }
          } catch (subErr) {
            console.warn('[STRIPE WEBHOOK] Could not retrieve subscription from Stripe:', subErr.message);
          }
        }

        await updateUserSubscriptionInSupabase({
          userId,
          customerEmail,
          customerId,
          subscriptionId,
          plan,
          cycle,
          status: subscriptionStatus,
          currentPeriodEnd,
        });

        // Send Welcome & Invoice Receipt Email
        if (customerEmail) {
          await sendSubscriptionReceiptEmail({
            userEmail: customerEmail,
            planName: plan === 'starter' ? '0machine Starter' : '0machine Pro',
            billingCycle: cycle,
            amountPaid: cycle === 'annual' ? (plan === 'starter' ? '$59.00' : '$149.00') : (plan === 'starter' ? '$9.00' : '$19.00'),
            nextBillingDate: currentPeriodEnd,
            invoiceId: session.invoice || session.id,
          });
        }

        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        console.log(`[STRIPE WEBHOOK] Handling customer.subscription.updated for Sub: ${subscription.id}`);

        const customerId = subscription.customer;
        const subscriptionId = subscription.id;
        const userId = subscription.metadata?.userId || '';
        const plan = subscription.metadata?.plan || (subscription.status === 'active' ? 'pro' : 'free');
        const cycle = subscription.metadata?.cycle || 'monthly';
        const status = subscription.status;
        const currentPeriodEnd = subscription.current_period_end 
          ? new Date(subscription.current_period_end * 1000).toISOString() 
          : new Date().toISOString();

        console.log(`[STRIPE WEBHOOK] Sub ID: ${subscriptionId}, Status: ${status}, Customer: ${customerId}`);

        await updateUserSubscriptionInSupabase({
          userId,
          customerId,
          subscriptionId,
          plan: status === 'active' || status === 'trialing' ? plan : 'free',
          cycle,
          status,
          currentPeriodEnd,
          cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
        });

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        console.log(`[STRIPE WEBHOOK] Handling customer.subscription.deleted for Sub: ${subscription.id}`);

        const customerId = subscription.customer;
        const subscriptionId = subscription.id;
        const userId = subscription.metadata?.userId || '';

        await updateUserSubscriptionInSupabase({
          userId,
          customerId,
          subscriptionId,
          plan: 'free',
          status: 'canceled',
          currentPeriodEnd: new Date().toISOString(),
          cancelAtPeriodEnd: false,
        });

        break;
      }

      default:
        console.log(`[STRIPE WEBHOOK] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('[STRIPE WEBHOOK PROCESSING ERROR]:', err);
    return NextResponse.json({ error: err.message || 'Webhook processing failed' }, { status: 500 });
  }
}

async function updateUserSubscriptionInSupabase({
  userId,
  customerEmail,
  customerId,
  subscriptionId,
  plan,
  cycle = 'monthly',
  status,
  currentPeriodEnd,
  cancelAtPeriodEnd = false,
}) {
  console.log(`[STRIPE WEBHOOK DB UPDATE] Initiating Supabase update...`);

  let targetUserId = userId;

  // 1. If userId not in metadata, lookup user by email or stripe_customer_id in Supabase
  if (!targetUserId && customerEmail) {
    const { data: userByEmail } = await supabaseAdmin
      .from('user_settings')
      .select('user_id')
      .eq('user_email', customerEmail)
      .maybeSingle();

    if (userByEmail?.user_id) {
      targetUserId = userByEmail.user_id;
      console.log(`[STRIPE WEBHOOK DB UPDATE] Matched User ID via email: ${targetUserId}`);
    }
  }

  if (!targetUserId && customerId) {
    const { data: userByCust } = await supabaseAdmin
      .from('user_settings')
      .select('user_id')
      .eq('stripe_customer_id', customerId)
      .maybeSingle();

    if (userByCust?.user_id) {
      targetUserId = userByCust.user_id;
      console.log(`[STRIPE WEBHOOK DB UPDATE] Matched User ID via Stripe Customer ID: ${targetUserId}`);
    }
  }

  const updateData = {
    plan: status === 'active' || status === 'trialing' ? plan : 'free',
    billing_cycle: cycle,
    subscription_status: status,
    stripe_customer_id: customerId || null,
    stripe_subscription_id: subscriptionId || null,
    current_period_end: currentPeriodEnd,
    cancel_at_period_end: cancelAtPeriodEnd,
    updated_at: new Date().toISOString(),
  };

  if (targetUserId) {
    const { error: updateError } = await supabaseAdmin
      .from('user_settings')
      .upsert(
        {
          user_id: targetUserId,
          ...updateData,
        },
        { onConflict: 'user_id' }
      );

    if (updateError) {
      console.error(`[STRIPE WEBHOOK DB UPDATE ERROR] Upsert failed for user ${targetUserId}:`, updateError);
    } else {
      console.log(`[STRIPE WEBHOOK DB UPDATE SUCCESS] Updated user ${targetUserId} to Plan: ${updateData.plan}, Status: ${status}`);
    }
  } else {
    console.warn(`[STRIPE WEBHOOK DB UPDATE WARNING] Could not match target user ID. Customer ID: ${customerId}, Email: ${customerEmail}`);
  }
}
