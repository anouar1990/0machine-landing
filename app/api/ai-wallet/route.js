import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kfydsuuelaxaffntdjxh.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl, supabaseKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId query parameter is required.' },
        { status: 400, headers: corsHeaders }
      );
    }

    // 1. Fetch or initialize wallet atomically
    const { data: walletData, error: walletErr } = await supabaseAdmin.rpc('get_or_create_ai_wallet', {
      p_user_id: userId,
    });

    if (walletErr) {
      console.error('[AI WALLET API] Error fetching wallet:', walletErr);
      return NextResponse.json(
        { error: 'Failed to retrieve AI wallet.' },
        { status: 500, headers: corsHeaders }
      );
    }

    // 2. Fetch recent credit ledger transactions
    const { data: transactions, error: txErr } = await supabaseAdmin
      .from('ai_credit_transactions')
      .select('id, amount, balance_after, type, description, reference_id, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (txErr) {
      console.warn('[AI WALLET API] Error fetching transactions:', txErr.message);
    }

    return NextResponse.json(
      {
        success: true,
        wallet: {
          userId: walletData.user_id,
          balance: walletData.balance ?? 0,
          lifetimePurchased: walletData.lifetime_purchased ?? 0,
          lifetimeUsed: walletData.lifetime_used ?? 0,
          updatedAt: walletData.updated_at,
        },
        transactions: transactions || [],
      },
      { headers: corsHeaders }
    );
  } catch (err) {
    console.error('[AI WALLET API ERROR]:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error.' },
      { status: 500, headers: corsHeaders }
    );
  }
}

