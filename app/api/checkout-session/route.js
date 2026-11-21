import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const getStripe = () => {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    throw new Error('STRIPE_SECRET_KEY is not defined.');
  }
  return new Stripe(apiKey, {
    apiVersion: '2023-10-16',
  });
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kfydsuuelaxaffntdjxh.supabase.co';
const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmeWRzdXVlbGF4YWZmbnRkanhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NDM1NDQsImV4cCI6MjA4ODExOTU0NH0._hb_RTEmoUevs3fjlv3IaZksZo7Ho3AdIdprYA1OaGQ';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || defaultKey;
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

// Verified Stripe Subscription Price IDs
const STRIPE_PRICES = {
  PRO_MONTHLY: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || 'price_1TuaQPGNkz6GTxuMEEjO6kny', // $19/mo
  PRO_ANNUAL: process.env.STRIPE_PRO_ANNUAL_PRICE_ID || 'price_1U0sHkGNkz6GTxuMW2LnYzpW',   // $149/yr
  STARTER_MONTHLY: 'price_1TAtn4GNkz6GTxuMwTn9DjU3',                                        // $9/mo legacy
  STARTER_ANNUAL: 'price_1U0sHpGNkz6GTxuMMsaB6NUp',                                         // $79/yr legacy
};

// Verified AI Credit Recharge Packages ($10, $25, $50)
export const AI_RECHARGE_PACKAGES = {
  pack_100: {
    id: 'pack_100',
    name: '0Machine AI Studio — 100 Credits',
    credits: 100,
    amountCents: 1000, // $10.00 ($0.10/credit)
    description: '100 AI CAD Vector generation credits ($0.10/credit). Credits never expire.',
  },
  pack_300: {
    id: 'pack_300',
    name: '0Machine AI Studio — 300 Credits (20% Bonus)',
    credits: 300,
    amountCents: 2500, // $25.00 ($0.083/credit)
    description: '300 AI CAD Vector generation credits ($0.083/credit). Save 20%. Credits never expire.',
  },
  pack_700: {
    id: 'pack_700',
    name: '0Machine AI Studio — 700 Credits (40% Bonus)',
    credits: 700,
    amountCents: 5000, // $50.00 ($0.071/credit)
    description: '700 AI CAD Vector generation credits ($0.071/credit). Save 40%. Credits never expire.',
  },
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON request body.' },
        { status: 400, headers: corsHeaders }
      );
    }

    const {
      priceId,
      packageId,
      type,
      userId,
      userEmail,
      plan = 'pro',
      cycle = 'monthly',
      mode = 'subscription',
      redirectOrigin,
    } = body;

    const isAiRecharge = type === 'ai_recharge' || mode === 'payment' || (packageId && AI_RECHARGE_PACKAGES[packageId]);

    console.log(`[STRIPE CHECKOUT] Type: ${isAiRecharge ? 'ai_recharge' : 'subscription'}, Mode: ${mode}, Package: ${packageId || 'none'}, Plan: ${plan}, User: ${userId || userEmail || 'anonymous'}`);

    const appOrigin = redirectOrigin || process.env.NEXT_PUBLIC_APP_URL || 'https://app.0machine.com';

    // Check if user already has an existing Stripe Customer ID to prevent duplicates
    let existingCustomerId = null;
    if (userId) {
      const { data: userSettings } = await supabaseAdmin
        .from('user_settings')
        .select('stripe_customer_id')
        .eq('user_id', userId)
        .maybeSingle();

      if (userSettings?.stripe_customer_id) {
        existingCustomerId = userSettings.stripe_customer_id;
      }
    }

    // ==========================================
    // CASE A: AI RECHARGE WALLET (ONE-TIME PAYMENT)
    // ==========================================
    if (isAiRecharge) {
      const resolvedPackKey = packageId && AI_RECHARGE_PACKAGES[packageId] ? packageId : 'pack_100';
      const pkg = AI_RECHARGE_PACKAGES[resolvedPackKey];

      const successUrl = `${appOrigin}/dashboard?ai_recharge=success&credits=${pkg.credits}&session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${appOrigin}/dashboard?ai_recharge=cancelled`;

      const sessionParams = {
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: pkg.name,
                description: pkg.description,
              },
              unit_amount: pkg.amountCents,
            },
            quantity: 1,
          },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        client_reference_id: userId || undefined,
        metadata: {
          type: 'ai_recharge',
          userId: userId || '',
          userEmail: userEmail || '',
          packageId: pkg.id,
          credits: String(pkg.credits),
          amountDollars: String(pkg.amountCents / 100),
        },
      };

      if (existingCustomerId) {
        sessionParams.customer = existingCustomerId;
      } else if (userEmail) {
        sessionParams.customer_email = userEmail.toLowerCase().trim();
      }

      const session = await getStripe().checkout.sessions.create(sessionParams);
      console.log(`[STRIPE CHECKOUT] AI Recharge checkout session created: ${session.id} (${pkg.credits} credits)`);
      return NextResponse.json({ url: session.url, sessionId: session.id, credits: pkg.credits }, { headers: corsHeaders });
    }

    // ==========================================
    // CASE B: PRO SUBSCRIPTION ($19/MO RECURRING)
    // ==========================================
    let selectedPriceId = priceId;
    if (!selectedPriceId) {
      if (plan === 'pro') {
        selectedPriceId = cycle === 'annual' ? STRIPE_PRICES.PRO_ANNUAL : STRIPE_PRICES.PRO_MONTHLY;
      } else if (plan === 'starter') {
        selectedPriceId = cycle === 'annual' ? STRIPE_PRICES.STARTER_ANNUAL : STRIPE_PRICES.STARTER_MONTHLY;
      } else {
        selectedPriceId = STRIPE_PRICES.PRO_MONTHLY;
      }
    }

    const subSuccessUrl = `${appOrigin}/success?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`;
    const subCancelUrl = `${appOrigin}/paywall`;

    const subSessionParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: selectedPriceId,
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
      success_url: subSuccessUrl,
      cancel_url: subCancelUrl,
      client_reference_id: userId || undefined,
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

    if (existingCustomerId) {
      subSessionParams.customer = existingCustomerId;
    } else if (userEmail) {
      subSessionParams.customer_email = userEmail.toLowerCase().trim();
    }

    const session = await getStripe().checkout.sessions.create(subSessionParams);
    console.log(`[STRIPE CHECKOUT] Subscription checkout session created: ${session.id}`);
    return NextResponse.json({ url: session.url, sessionId: session.id }, { headers: corsHeaders });
  } catch (err) {
    console.error('[STRIPE CHECKOUT ERROR]:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to create checkout session.' },
      { status: 500, headers: corsHeaders }
    );
  }
}
