import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "./supabase";

export const ADMIN_EMAILS = [
  "admin@cooldelo.com",
  "anouarkharbache@gmail.com",
  "anouar@cooldelo.com",
  "anouar.kharbache@gmail.com"
];

/**
 * Extracts bearer token from Authorization header.
 */
function extractBearerToken(request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7).trim();
  }
  return null;
}

/**
 * Timing-safe string comparison.
 * Returns false if lengths do not match or inputs are invalid.
 */
function timingSafeCompare(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (!a || !b) return false;
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Verifies that the incoming request is from an authenticated human Administrator.
 * Requires a genuine Supabase user access token in `Authorization: Bearer <token>`.
 * Does NOT accept service role keys or API keys.
 * Returns { authorized: true, user } if authorized.
 * Returns { authorized: false, response: NextResponse } (401 or 403) if unauthorized.
 */
export async function verifyAdminAuth(request) {
  const token = extractBearerToken(request);

  if (!token) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Unauthorized: Missing authentication token" },
        { status: 401 }
      )
    };
  }

  // Validate session token server-side with Supabase Auth
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return {
        authorized: false,
        response: NextResponse.json(
          { error: "Unauthorized: Invalid or expired session token" },
          { status: 401 }
        )
      };
    }

    // Verify user is in the canonical administrator whitelist
    const userEmail = (user.email || "").toLowerCase().trim();
    const isAdmin = ADMIN_EMAILS.some((adm) => adm.toLowerCase() === userEmail);

    if (!isAdmin) {
      return {
        authorized: false,
        response: NextResponse.json(
          { error: "Forbidden: Administrator privileges required" },
          { status: 403 }
        )
      };
    }

    return { authorized: true, user };
  } catch (err) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Unauthorized: Authentication verification failed" },
        { status: 401 }
      )
    };
  }
}

/**
 * Verifies that the incoming request is from a verified internal service or whitelisted administrator.
 * Used for product automation events (/api/automation/events).
 *
 * Internal services must authenticate via `x-api-key: <EVENTS_API_KEY>` using timing-safe comparison.
 * Administrators may authenticate via `Authorization: Bearer <token>`.
 * `SUPABASE_SERVICE_ROLE_KEY` is explicitly NOT accepted as an API key or Bearer token.
 */
export async function verifyServiceOrAdminAuth(request) {
  const apiKey = request.headers.get("x-api-key")?.trim();
  const authHeader = request.headers.get("authorization");

  // 1. If x-api-key is present, evaluate dedicated service authentication
  if (apiKey) {
    const configuredSecret = process.env.EVENTS_API_KEY?.trim();

    if (!configuredSecret) {
      return {
        authorized: false,
        response: NextResponse.json(
          { error: "Unauthorized: Service authentication is not configured" },
          { status: 401 }
        )
      };
    }

    if (timingSafeCompare(apiKey, configuredSecret)) {
      return { authorized: true, isService: true };
    }

    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Unauthorized: Invalid service API key" },
        { status: 401 }
      )
    };
  }

  // 2. If Authorization Bearer header is present, evaluate human administrator session
  if (authHeader?.startsWith("Bearer ")) {
    return verifyAdminAuth(request);
  }

  // 3. No credentials provided
  return {
    authorized: false,
    response: NextResponse.json(
      { error: "Unauthorized: Missing authentication credentials (x-api-key or Bearer token required)" },
      { status: 401 }
    )
  };
}
