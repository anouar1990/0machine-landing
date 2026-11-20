import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { sendSubscriptionReceiptEmail } from '../../../lib/email';

export const runtime = 'nodejs';

const getStripe = () => {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    throw new Error('STRIPE_SECRET_KEY is not defined in environment variables.');
  }
  return new Stripe(apiKey, {
    apiVersion: '2023-10-16',
  });
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kfydsuuelaxaffntdjxh.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.warn('[STRIPE WEBHOOK INIT WARNING] SUPABASE_SERVICE_ROLE_KEY is missing.');
}

const supabaseAdmin = createClient(supabaseUrl, supabaseKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// Verified Pro & Legacy Price IDs to guarantee existing subscribers retain full access
const PRO_PRICE_IDS = new Set([
  'price_1TuaQPGNkz6GTxuMEEjO6kny', // 0Machine Pro Workshop ($19/mo canonical)
  'price_1U0sHtGNkz6GTxuMtY8nj81a', // 0machine Pro Monthly ($19/mo)
  'price_1U0sHkGNkz6GTxuMW2LnYzpW', // 0machine Pro Annual ($149/yr)
  'price_1TuaQVGNkz6GTxuMi59lGKB5', // 0Machine Industrial
]);

const STARTER_PRICE_IDS = new Set([
  'price_1TAtn4GNkz6GTxuMwTn9DjU3', // 0machine Starter ($9/mo legacy)
  'price_1U0sHpGNkz6GTxuMMsaB6NUp', // 0machine Starter Annual ($79/yr legacy)
]);

export async function POST(req) {
  const bodyText = await req.text();
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  // 1. Strict Signature & Secret Validation (Zero Unsigned Fallback)
  if (!webhookSecret) {
    console.error('[STRIPE WEBHOOK ERROR] STRIPE_WEBHOOK_SECRET is not configured.');
    return NextResponse.json({ error: 'Server webhook secret unconfigured' }, { status: 500 });
  }

  if (!sig) {
    console.warn('[STRIPE WEBHOOK SECURITY ALERT] Webhook request received without stripe-signature header.');
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event;
  try {
    event = getStripe().webhooks.constructEvent(bodyText, sig, webhookSecret);
  } catch (err) {
    console.error(`[STRIPE WEBHOOK SECURITY ALERT] Signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Signature Verification Failed: ${err.message}` }, { status: 400 });
  }

  console.log(`[STRIPE WEBHOOK] Verified signature for event: ${event.type} [ID: ${event.id}]`);

  // 2. Idempotency Check: Prevent duplicate processing of the same Stripe event
  try {
    const { data: existingEvent } = await supabaseAdmin
      .from('stripe_webhook_events')
      .select('event_id')
      .eq('event_id', event.id)
      .maybeSingle();

    if (existingEvent) {
      console.log(`[STRIPE WEBHOOK IDEMPOTENCY] Event ${event.id} already processed. Returning HTTP 200.`);
      return NextResponse.json({ received: true, duplicate: true });
    }
  } catch (idempotencyErr) {
    // Graceful fallback if table is pending migration
    console.warn('[STRIPE WEBHOOK IDEMPOTENCY] Check warning (table may be pending migration):', idempotencyErr.message);
  }

  // 3. Subscription Lifecycle Event Routing
  try {
    switch (event.type) {
      // Event: User completed checkout
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log(`[STRIPE WEBHOOK] Handling checkout.session.completed [Session: ${session.id}]`);

        // 1. Handle Subscription Checkout Sessions
        if (session.mode === 'subscription') {
          const userId = session.metadata?.userId || session.client_reference_id || '';
          const customerId = session.customer;
          const subscriptionId = session.subscription;
          const customerEmail = session.customer_details?.email || session.customer_email || '';
          const requestedPlan = session.metadata?.plan || 'pro';
          const cycle = session.metadata?.cycle || 'monthly';

          let subscriptionStatus = 'active';
          let currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
          let priceId = null;

          if (subscriptionId && typeof subscriptionId === 'string') {
            try {
              const sub = await getStripe().subscriptions.retrieve(subscriptionId);
              subscriptionStatus = sub.status;
              priceId = sub.items?.data[0]?.price?.id || null;
              if (sub.current_period_end) {
                currentPeriodEnd = new Date(sub.current_period_end * 1000).toISOString();
              }
            } catch (subErr) {
              console.warn('[STRIPE WEBHOOK] Could not retrieve subscription details from Stripe:', subErr.message);
            }
          }

          // Determine verified plan based on Stripe Price ID or metadata
          let resolvedPlan = requestedPlan;
          if (priceId) {
            if (PRO_PRICE_IDS.has(priceId)) resolvedPlan = 'pro';
            else if (STARTER_PRICE_IDS.has(priceId)) resolvedPlan = 'starter';
          }

          await updateUserSubscriptionInSupabase({
            userId,
            customerEmail,
            customerId,
            subscriptionId,
            plan: resolvedPlan,
            cycle,
            status: subscriptionStatus,
            priceId,
            currentPeriodEnd,
            cancelAtPeriodEnd: false,
          });

          // Send confirmation receipt email if configured
          if (customerEmail) {
            try {
              await sendSubscriptionReceiptEmail({
                userEmail: customerEmail,
                planName: resolvedPlan === 'starter' ? '0machine Starter' : '0machine Pro Workshop',
                billingCycle: cycle,
                amountPaid: cycle === 'annual' ? (resolvedPlan === 'starter' ? '$79.00' : '$149.00') : (resolvedPlan === 'starter' ? '$9.00' : '$19.00'),
                nextBillingDate: currentPeriodEnd,
                invoiceId: session.invoice || session.id,
              });
            } catch (emailErr) {
              console.warn('[STRIPE WEBHOOK] Email delivery warning:', emailErr.message);
            }
          }
        } 
        // 2. Handle AI Credit Recharge Packages (One-Time Payment)
        else if (session.metadata?.type === 'ai_recharge' || session.mode === 'payment') {
          let userId = session.metadata?.userId || session.client_reference_id || null;
          const customerEmail = session.customer_details?.email || session.customer_email || session.metadata?.userEmail || '';
          const credits = parseInt(session.metadata?.credits, 10);
          const packageId = session.metadata?.packageId || 'pack_100';
          const paymentRef = session.payment_intent || session.id;

          // If userId missing from metadata, lookup user by email in auth.users
          if (!userId && customerEmail) {
            try {
              const { data: userData } = await supabaseAdmin.auth.admin.listUsers();
              const foundUser = userData?.users?.find(
                (u) => u.email?.toLowerCase() === customerEmail.toLowerCase()
              );
              if (foundUser) userId = foundUser.id;
            } catch (userLookupErr) {
              console.warn('[STRIPE WEBHOOK] AI recharge user lookup error:', userLookupErr.message);
            }
          }

          if (userId && credits && credits > 0) {
            console.log(`[STRIPE WEBHOOK] Crediting ${credits} AI credits to user ${userId} (Stripe Ref: ${paymentRef})`);
            const { data: rpcResult, error: rpcErr } = await supabaseAdmin.rpc('add_ai_credits', {
              p_user_id: userId,
              p_credits: credits,
              p_reference_id: typeof paymentRef === 'string' ? paymentRef : session.id,
              p_description: `Purchased AI Recharge: ${credits} credits (${packageId})`,
            });

            if (rpcErr) {
              console.error('[STRIPE WEBHOOK] Failed to add AI credits in Supabase:', rpcErr);
              throw new Error(`Failed to credit AI wallet: ${rpcErr.message}`);
            }

            console.log(`[STRIPE WEBHOOK] AI Credits added successfully. New balance:`, rpcResult?.balance);

            if (session.customer) {
              try {
                await supabaseAdmin
                  .from('user_settings')
                  .update({ stripe_customer_id: session.customer, updated_at: new Date().toISOString() })
                  .eq('user_id', userId);
              } catch (custErr) {
                console.warn('[STRIPE WEBHOOK] Customer id update note:', custErr.message);
              }
            }
          } else {
            console.warn('[STRIPE WEBHOOK] AI Recharge session could not resolve userId or valid credits:', {
              metadata: session.metadata,
              customerEmail,
            });
          }
        }
        break;
      }

      // Event: Subscription updated (Renewal, plan change, or cancel_at_period_end set)
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        console.log(`[STRIPE WEBHOOK] Handling customer.subscription.updated [Sub: ${subscription.id}]`);

        const customerId = subscription.customer;
        const subscriptionId = subscription.id;
        const userId = subscription.metadata?.userId || '';
        const priceId = subscription.items?.data[0]?.price?.id || null;
        const status = subscription.status; // active, past_due, canceled, trialing, incomplete
        const cycle = subscription.items?.data[0]?.price?.recurring?.interval === 'year' ? 'annual' : 'monthly';
        const cancelAtPeriodEnd = subscription.cancel_at_period_end || false;
        const currentPeriodEnd = subscription.current_period_end 
          ? new Date(subscription.current_period_end * 1000).toISOString() 
          : new Date().toISOString();

        // Determine resolved plan based on Price ID and verified status
        let resolvedPlan = 'pro';
        if (priceId) {
          if (STARTER_PRICE_IDS.has(priceId)) resolvedPlan = 'starter';
          else if (PRO_PRICE_IDS.has(priceId)) resolvedPlan = 'pro';
        }

        // Access entitlement logic based on Stripe lifecycle status
        const isEntitled = status === 'active' || status === 'trialing' || status === 'past_due';
        const finalPlan = isEntitled ? resolvedPlan : 'free';

        await updateUserSubscriptionInSupabase({
          userId,
          customerId,
          subscriptionId,
          plan: finalPlan,
          cycle,
          status,
          priceId,
          currentPeriodEnd,
          cancelAtPeriodEnd,
        });

        break;
      }

      // Event: Subscription permanently canceled or period ended
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        console.log(`[STRIPE WEBHOOK] Handling customer.subscription.deleted [Sub: ${subscription.id}]`);

        const customerId = subscription.customer;
        const subscriptionId = subscription.id;
        const userId = subscription.metadata?.userId || '';

        await updateUserSubscriptionInSupabase({
          userId,
          customerId,
          subscriptionId,
          plan: 'free',
          status: 'canceled',
          priceId: null,
          currentPeriodEnd: new Date().toISOString(),
          cancelAtPeriodEnd: false,
        });

        break;
      }

      // Event: Recurring invoice payment failed
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        console.warn(`[STRIPE WEBHOOK] Handling invoice.payment_failed for Customer: ${invoice.customer}, Invoice: ${invoice.id}`);

        if (invoice.subscription) {
          await updateUserSubscriptionInSupabase({
            customerId: invoice.customer,
            subscriptionId: invoice.subscription,
            status: 'past_due',
          });
        }
        break;
      }

      // Event: Recurring invoice payment succeeded (Renewal cycle)
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        console.log(`[STRIPE WEBHOOK] Handling invoice.payment_succeeded for Customer: ${invoice.customer}, Invoice: ${invoice.id}`);

        if (invoice.subscription) {
          try {
            const sub = await getStripe().subscriptions.retrieve(invoice.subscription);
            const priceId = sub.items?.data[0]?.price?.id || null;
            let resolvedPlan = 'pro';
            if (priceId && STARTER_PRICE_IDS.has(priceId)) resolvedPlan = 'starter';

            await updateUserSubscriptionInSupabase({
              customerId: invoice.customer,
              subscriptionId: invoice.subscription,
              plan: sub.status === 'active' ? resolvedPlan : 'free',
              status: sub.status,
              priceId,
              currentPeriodEnd: sub.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : null,
              cancelAtPeriodEnd: sub.cancel_at_period_end || false,
            });
          } catch (invErr) {
            console.warn('[STRIPE WEBHOOK] Invoice sub sync warning:', invErr.message);
          }
        }
        break;
      }

      default:
        console.log(`[STRIPE WEBHOOK] Unhandled event type: ${event.type}`);
    }

    // 4. Record Event in Idempotency Table
    try {
      await supabaseAdmin
        .from('stripe_webhook_events')
        .insert({
          event_id: event.id,
          event_type: event.type,
          status: 'processed',
          processed_at: new Date().toISOString(),
        });
    } catch (recordErr) {
      console.warn('[STRIPE WEBHOOK IDEMPOTENCY] Insert warning (table may be pending migration):', recordErr.message);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('[STRIPE WEBHOOK PROCESSING ERROR]:', err);
    return NextResponse.json({ error: err.message || 'Webhook processing failed' }, { status: 500 });
  }
}

/**
 * Updates user subscription state in Supabase safely using the service-role client.
 * Matches user by userId, customerId, or auth email.
 */
async function updateUserSubscriptionInSupabase({
  userId,
  customerEmail,
  customerId,
  subscriptionId,
  plan,
  cycle,
  status,
  priceId,
  currentPeriodEnd,
  cancelAtPeriodEnd = false,
}) {
  console.log(`[STRIPE WEBHOOK DB UPDATE] Synchronizing Supabase user_settings...`);

  let targetUserId = userId;

  // 1. If userId is not provided, look up by stripe_customer_id in user_settings
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

  // 2. If still not matched, look up by stripe_subscription_id
  if (!targetUserId && subscriptionId) {
    const { data: userBySub } = await supabaseAdmin
      .from('user_settings')
      .select('user_id')
      .eq('stripe_subscription_id', subscriptionId)
      .maybeSingle();

    if (userBySub?.user_id) {
      targetUserId = userBySub.user_id;
      console.log(`[STRIPE WEBHOOK DB UPDATE] Matched User ID via Subscription ID: ${targetUserId}`);
    }
  }

  // 3. Fallback: Search auth.users by email if provided
  if (!targetUserId && customerEmail) {
    try {
      const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
      const matched = userList?.users?.find(
        (u) => u.email?.toLowerCase() === customerEmail.toLowerCase()
      );
      if (matched?.id) {
        targetUserId = matched.id;
        console.log(`[STRIPE WEBHOOK DB UPDATE] Matched User ID via Auth email: ${targetUserId}`);
      }
    } catch (authLookupErr) {
      console.warn('[STRIPE WEBHOOK DB UPDATE] Auth user lookup warning:', authLookupErr.message);
    }
  }

  if (!targetUserId) {
    console.warn(`[STRIPE WEBHOOK DB UPDATE WARNING] Could not match target user ID. Customer: ${customerId}, Sub: ${subscriptionId}, Email: ${customerEmail}`);
    return;
  }

  const updateData = {
    updated_at: new Date().toISOString(),
  };

  if (plan !== undefined) updateData.plan = plan;
  if (cycle !== undefined) updateData.billing_cycle = cycle;
  if (status !== undefined) updateData.subscription_status = status;
  if (customerId !== undefined) updateData.stripe_customer_id = customerId;
  if (subscriptionId !== undefined) updateData.stripe_subscription_id = subscriptionId;
  if (priceId !== undefined) updateData.subscription_price_id = priceId;
  if (currentPeriodEnd !== undefined) updateData.current_period_end = currentPeriodEnd;
  if (cancelAtPeriodEnd !== undefined) updateData.cancel_at_period_end = cancelAtPeriodEnd;

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
    console.log(`[STRIPE WEBHOOK DB UPDATE SUCCESS] User ${targetUserId} updated -> Plan: ${updateData.plan || 'unchanged'}, Status: ${updateData.subscription_status || 'unchanged'}`);
  }
}
