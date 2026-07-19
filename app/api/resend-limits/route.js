import { NextResponse } from "next/server";

export async function GET() {
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
