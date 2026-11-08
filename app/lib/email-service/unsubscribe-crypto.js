import crypto from "crypto";

const DEFAULT_MAX_AGE_MS = 60 * 24 * 60 * 60 * 1000; // 60 days

/**
 * Resolves secret key for unsubscribe tokens.
 */
export function getUnsubscribeSecret(customSecret) {
  if (customSecret) return customSecret;
  if (process.env.UNSUBSCRIBE_SECRET) return process.env.UNSUBSCRIBE_SECRET;
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return crypto
      .createHash("sha256")
      .update(`unsubscribe_salt_${process.env.SUPABASE_SERVICE_ROLE_KEY}`)
      .digest("hex");
  }
  return "0machine_default_unsubscribe_secret_salt_2026";
}

/**
 * Encodes payload into URL-safe base64 string.
 */
function toBase64Url(str) {
  return Buffer.from(str, "utf8").toString("base64url");
}

/**
 * Decodes URL-safe base64 string.
 */
function fromBase64Url(str) {
  return Buffer.from(str, "base64url").toString("utf8");
}

/**
 * Generates an HMAC-SHA256 signature for the given payload string.
 */
function generateSignature(payloadString, secretKey) {
  return crypto
    .createHmac("sha256", secretKey)
    .update(payloadString)
    .digest("base64url");
}

/**
 * Generates a tamper-proof unsubscribe token.
 * Format: base64url(email|contactId|campaignId|timestamp|signature)
 *
 * @param {string} email
 * @param {string} [contactId]
 * @param {string} [campaignId]
 * @param {string} [secret]
 * @param {number} [customTimestamp]
 * @returns {string} compact url-safe token
 */
export function generateUnsubscribeToken(
  email,
  contactId = "",
  campaignId = "",
  secret = null,
  customTimestamp = null
) {
  if (!email || typeof email !== "string") {
    throw new Error("Valid email is required to generate unsubscribe token.");
  }

  const normalizedEmail = email.toLowerCase().trim();
  const cId = contactId ? String(contactId).trim() : "";
  const campId = campaignId ? String(campaignId).trim() : "";
  const timestamp = customTimestamp !== null ? String(customTimestamp) : String(Date.now());
  const secretKey = getUnsubscribeSecret(secret);

  const payloadString = `${normalizedEmail}|${cId}|${campId}|${timestamp}`;
  const signature = generateSignature(payloadString, secretKey);

  const fullPayload = `${payloadString}|${signature}`;
  return toBase64Url(fullPayload);
}

/**
 * Verifies and decodes an unsubscribe token.
 *
 * @param {string} token
 * @param {string} [secret]
 * @param {number} [maxAgeMs]
 * @returns {{ valid: boolean, email?: string, contactId?: string, campaignId?: string, error?: string }}
 */
export function verifyUnsubscribeToken(token, secret = null, maxAgeMs = DEFAULT_MAX_AGE_MS) {
  if (!token || typeof token !== "string") {
    return { valid: false, error: "Missing or invalid token format" };
  }

  try {
    const decoded = fromBase64Url(token.trim());
    const parts = decoded.split("|");

    if (parts.length < 5) {
      return { valid: false, error: "Malformed token payload" };
    }

    const [email, contactId, campaignId, timestampStr, signature] = parts;
    const timestamp = parseInt(timestampStr, 10);

    if (Number.isNaN(timestamp) || !email || !signature) {
      return { valid: false, error: "Invalid token parameters" };
    }

    // Check expiration
    const now = Date.now();
    if (maxAgeMs > 0 && now - timestamp > maxAgeMs) {
      return { valid: false, error: "Unsubscribe token has expired" };
    }

    // Verify HMAC signature
    const secretKey = getUnsubscribeSecret(secret);
    const payloadString = `${email}|${contactId}|${campaignId}|${timestampStr}`;
    const expectedSignature = generateSignature(payloadString, secretKey);

    const sigBuf = Buffer.from(signature, "utf8");
    const expectedBuf = Buffer.from(expectedSignature, "utf8");

    if (
      sigBuf.length !== expectedBuf.length ||
      !crypto.timingSafeEqual(sigBuf, expectedBuf)
    ) {
      return { valid: false, error: "Invalid token signature" };
    }

    return {
      valid: true,
      email,
      contactId: contactId || null,
      campaignId: campaignId || null,
      timestamp
    };
  } catch (err) {
    return { valid: false, error: "Failed to parse token" };
  }
}
