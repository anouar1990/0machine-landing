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
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl, supabaseKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

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

    const { userId, userEmail, returnUrl } = body;

    if (!userId && !userEmail) {
      return NextResponse.json(
        { error: 'Either userId or userEmail is required to access the customer portal.' },
        { status: 400, headers: corsHeaders }
      );
    }

    let customerId = null;

    // 1. Look up stripe_customer_id in Supabase user_settings
    if (userId) {
      const { data: settings } = await supabaseAdmin
        .from('user_settings')
        .select('stripe_customer_id')
        .eq('user_id', userId)
        .maybeSingle();

      if (settings?.stripe_customer_id) {
        customerId = settings.stripe_customer_id;
      }
    }

    // 2. If not found in DB, search Stripe by userEmail
    if (!customerId && userEmail) {
      const customers = await getStripe().customers.list({
        email: userEmail.toLowerCase().trim(),
        limit: 1,
      });

      if (customers.data.length > 0) {
        customerId = customers.data[0].id;

        // Cache customerId in user_settings if userId is known
        if (userId) {
          await supabaseAdmin
            .from('user_settings')
            .update({ stripe_customer_id: customerId })
            .eq('user_id', userId);
        }
      }
    }

    if (!customerId) {
      return NextResponse.json(
        { error: 'No active Stripe billing customer was found for your account. Please subscribe to access the billing portal.' },
        { status: 404, headers: corsHeaders }
      );
    }

    // 3. Create Stripe Billing Portal session
    const appOrigin = returnUrl || process.env.NEXT_PUBLIC_APP_URL || 'https://app.0machine.com';
    const portalSession = await getStripe().billingPortal.sessions.create({
      customer: customerId,
      return_url: `${appOrigin}/settings`,
    });

    console.log(`[CUSTOMER PORTAL] Created portal session for customer: ${customerId}`);
    return NextResponse.json({ url: portalSession.url }, { headers: corsHeaders });
  } catch (err) {
    console.error('[CUSTOMER PORTAL ERROR]:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to create customer portal session.' },
      { status: 500, headers: corsHeaders }
    );
  }
}

