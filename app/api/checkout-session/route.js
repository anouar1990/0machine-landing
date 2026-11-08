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
    const {
      priceId,
      userId,
      userEmail,
      plan = 'pro',
      cycle = 'monthly',
      mode = 'subscription',
      amount,
      credits,
      prompt,
      redirectOrigin,
    } = body;

    console.log(`[STRIPE CHECKOUT] Mode: ${mode}, Plan: ${plan}, Amount: ${amount}, Credits: ${credits}`);

    const isOneTimePayment = mode === 'payment';
    const appOrigin = redirectOrigin || process.env.NEXT_PUBLIC_APP_URL || 'https://app.0machine.com';
    const successUrl = `${appOrigin}/success?session_id={CHECKOUT_SESSION_ID}&plan=${plan}&credits=${credits || 0}&prompt=${encodeURIComponent(prompt || '')}`;
    const cancelUrl = `${appOrigin}/#laser-ai`;

    // Dynamic line items: use priceId if provided, or dynamic price_data for one-time credit packs
    let line_items = [];
    if (priceId && priceId !== 'price_ai_monthly_5') {
      line_items = [{ price: priceId, quantity: 1 }];
    } else if (isOneTimePayment) {
      line_items = [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `0machine AI - ${credits || 15} Vector Credits Pack`,
              description: `${credits || 15} LaserAI generations (SVG, DXF, PNG) · Commercial use · Credits never expire`,
            },
            unit_amount: Math.round((amount || 9) * 100), // in cents
          },
          quantity: 1,
        },
      ];
    } else {
      // Monthly Membership fallback ($5/mo)
      line_items = [
        {
          price_data: {
            currency: 'usd',
            recurring: { interval: 'month' },
            product_data: {
              name: '0machine AI - Monthly Maker Membership',
              description: '10 AI vector credits monthly · Never expire · Commercial license',
            },
            unit_amount: 500, // $5.00
          },
          quantity: 1,
        },
      ];
    }

    const sessionParams = {
      mode: isOneTimePayment ? 'payment' : 'subscription',
      payment_method_types: ['card'],
      line_items,
      allow_promotion_codes: true,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: userId || '',
        plan: plan,
        cycle: cycle,
        credits: String(credits || 0),
        prompt: prompt || '',
      },
    };

    if (!isOneTimePayment) {
      sessionParams.subscription_data = {
        metadata: {
          userId: userId || '',
          plan: plan,
          cycle: cycle,
          credits: String(credits || 10),
        },
      };
    }

    if (userEmail) {
      sessionParams.customer_email = userEmail;
    }

    const session = await getStripe().checkout.sessions.create(sessionParams);

    console.log(`[STRIPE CHECKOUT] Session created successfully: ${session.id}`);
    console.log(`[STRIPE CHECKOUT] URL: ${session.url}`);

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error('[STRIPE CHECKOUT ERROR]:', err);
    return NextResponse.json({ error: err.message || 'Failed to create checkout session' }, { status: 500 });
  }
}
