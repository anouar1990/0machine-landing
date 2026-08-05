import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const getStripe = () => {
  const apiKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_key';
  return new Stripe(apiKey, {
    apiVersion: '2023-10-16',
  });
};

export async function POST(req) {
  try {
    const body = await req.json();
    const { priceId, userId, userEmail, plan = 'pro', cycle = 'monthly', redirectOrigin } = body;

    console.log(`[STRIPE CHECKOUT] Creating checkout session for User ID: ${userId || 'guest'}`);
    console.log(`[STRIPE CHECKOUT] Price ID: ${priceId}, Plan: ${plan}, Cycle: ${cycle}`);

    if (!priceId) {
      return NextResponse.json({ error: 'Missing priceId parameter' }, { status: 400 });
    }

    const appOrigin = redirectOrigin || process.env.NEXT_PUBLIC_APP_URL || 'https://app.0machine.com';
    const successUrl = `${appOrigin}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${appOrigin}/pricing`;

    const sessionParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: userId || '',
        plan: plan,
        cycle: cycle,
      },
      subscription_data: {
        metadata: {
          userId: userId || '',
          plan: plan,
          cycle: cycle,
        },
      },
    };

    if (userEmail) {
      sessionParams.customer_email = userEmail;
    }

    const session = await getStripe().checkout.sessions.create(sessionParams);

    console.log(`[STRIPE CHECKOUT] Session created successfully: ${session.id}`);
    console.log(`[STRIPE CHECKOUT] Success URL: ${successUrl}`);

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error('[STRIPE CHECKOUT ERROR]:', err);
    return NextResponse.json({ error: err.message || 'Failed to create checkout session' }, { status: 500 });
  }
}
