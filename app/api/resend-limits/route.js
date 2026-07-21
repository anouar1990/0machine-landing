import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";

const ADMIN_EMAILS = ["admin@cooldelo.com", "anouarkharbache@gmail.com"];

export async function GET(request) {
  // 1. Extract Bearer Token from Authorization Header
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized: Missing authentication token" },
      { status: 401 }
    );
  }

  // 2. Validate token with Supabase Auth
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return NextResponse.json(
      { error: "Unauthorized: Invalid or expired session token" },
      { status: 401 }
    );
  }

  // 3. Verify user is an authorized administrator
  if (!user.email || !ADMIN_EMAILS.includes(user.email)) {
    return NextResponse.json(
      { error: "Forbidden: Administrator privileges required" },
      { status: 403 }
    );
  }

  // 4. Authorized Admin -> Fetch Resend API metrics
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey.startsWith("re_placeholder")) {
    // Return high-quality mock statistics for a default launching state
    return NextResponse.json({
      sent: 184,
      limit: 3000,
      remaining: 2816,
      is_mock: true
    });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });

    if (!res.ok) {
      throw new Error(`Resend API returned status ${res.status}`);
    }

    const data = await res.json();
    const sentCount = data?.data?.length || 0;

    return NextResponse.json({
      sent: sentCount,
      limit: 3000,
      remaining: Math.max(0, 3000 - sentCount),
      is_mock: false
    });
  } catch (err) {
    console.error("Resend API limits fetch error:", err.message);
    // Fallback to mock instead of crashing, indicating error
    return NextResponse.json({
      sent: 0,
      limit: 3000,
      remaining: 3000,
      is_mock: true,
      error: err.message
    });
  }
}
