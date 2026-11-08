/**
 * Default fallback values for standard contact merge tags
 */
export const DEFAULT_FALLBACKS = {
  first_name: "there",
  last_name: "",
  email: "",
  plan: "user",
  company: "",
  machine_type: ""
};

/**
 * Standard preview sample contact record (EMAIL-005)
 */
export const SAMPLE_CONTACT = {
  first_name: "Alex",
  last_name: "Smith",
  email: "alex@example.com",
  plan: "pro",
  attributes: {
    company: "Acme Corp",
    machine_type: "xTool M1"
  }
};

/**
 * Safely escapes characters that have special meaning in HTML to prevent XSS.
 * Null/undefined inputs return an empty string.
 *
 * @param {*} text
 * @returns {string}
 */
export function escapeHtml(text) {
  if (text === null || text === undefined) return "";
  const str = String(text);
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Retrieves a field value from a contact record, supporting dot-notation
 * for nested objects (e.g., "attributes.company" or "attributes.plan").
 * Also falls back to checking `contact.attributes[path]` for shorthand keys.
 *
 * @param {Object} contact
 * @param {string} path
 * @returns {*}
 */
export function getContactValue(contact, path) {
  if (!contact || typeof contact !== "object") return null;
  if (!path || typeof path !== "string") return null;

  const normalizedPath = path.trim();

  // 1. Direct top-level property check
  if (
    normalizedPath in contact &&
    contact[normalizedPath] !== undefined &&
    contact[normalizedPath] !== null
  ) {
    return contact[normalizedPath];
  }

  // 2. Nested property check (e.g., "attributes.machine_type")
  const parts = normalizedPath.split(".");
  let current = contact;
  let found = true;

  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== "object") {
      found = false;
      break;
    }
    current = current[part];
  }

  if (found && current !== undefined && current !== null) {
    return current;
  }

  // 3. Shorthand check in attributes object (e.g., "company" -> contact.attributes.company)
  if (contact.attributes && typeof contact.attributes === "object") {
    if (
      contact.attributes[normalizedPath] !== undefined &&
      contact.attributes[normalizedPath] !== null
    ) {
      return contact.attributes[normalizedPath];
    }
  }

  return null;
}

/**
 * Applies fallback default if the provided value is null, undefined, or empty string.
 *
 * @param {*} value
 * @param {string} fallback
 * @returns {string}
 */
export function applyFallback(value, fallback = "") {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }
  return String(value);
}

/**
 * Interpolates template variables in an HTML string with per-recipient contact data.
 * Supports both double curly braces ({{variable}}) and percent delimiters (%variable%).
 *
 * NOTE: Unsubscribe placeholders ({{unsubscribe_*}}, %unsubscribe_url%) are preserved
 * untouched so the queue worker EMAIL-006 cryptographic logic can process them.
 *
 * @param {string} htmlContent
 * @param {Object} context
 * @param {Object} [context.contact] Contact data object
 * @param {string} [context.email] Fallback recipient email
 * @param {string} [context.campaignId]
 * @param {Object} [options]
 * @returns {string} Processed and HTML-escaped content
 */
export function interpolateTemplate(htmlContent, context = {}, options = {}) {
  if (!htmlContent || typeof htmlContent !== "string") return "";

  const contact = context?.contact || null;
  const contextEmail = context?.email || "";

  const replacer = (match, rawVarName) => {
    const varName = rawVarName.trim();
    const lowerVar = varName.toLowerCase();

    // Preserve unsubscribe variables for EMAIL-006 logic
    if (lowerVar.startsWith("unsubscribe_") || lowerVar === "unsubscribe") {
      return match;
    }

    let val = getContactValue(contact, varName);

    // If variable is email and not on contact record, use queue context email
    if (
      (lowerVar === "email" || lowerVar === "recipient_email") &&
      (val === null || val === undefined || val === "")
    ) {
      val = contextEmail;
    }

    // Determine fallback
    let fallback = "";
    if (lowerVar in DEFAULT_FALLBACKS) {
      fallback = DEFAULT_FALLBACKS[lowerVar];
    } else if (lowerVar.startsWith("attributes.")) {
      const attrKey = lowerVar.replace("attributes.", "");
      if (attrKey in DEFAULT_FALLBACKS) {
        fallback = DEFAULT_FALLBACKS[attrKey];
      }
    }

    const resolved = applyFallback(val, fallback);
    return escapeHtml(resolved);
  };

  // Replace double curly braces {{variable}} with whitespace tolerance
  let result = htmlContent.replace(/{{\s*([a-zA-Z0-9_.]+)\s*}}/g, replacer);

  // Replace percent delimiters %variable% with whitespace tolerance
  result = result.replace(/%\s*([a-zA-Z0-9_.]+)\s*%/g, replacer);

  return result;
}

/**
 * Previews email template HTML with sample contact data and sample unsubscribe links
 *
 * @param {string} rawHtml
 * @returns {string}
 */
export function generatePreviewHtml(rawHtml) {
  if (!rawHtml) return "";
  let processed = interpolateTemplate(rawHtml, {
    contact: SAMPLE_CONTACT,
    campaignId: "preview",
    email: SAMPLE_CONTACT.email
  });
  return processed
    .replaceAll("{{unsubscribe_link}}", '<a href="#unsubscribe-preview" style="color: #FE7733; text-decoration: underline;">Unsubscribe</a>')
    .replaceAll("{{unsubscribe_url}}", "#unsubscribe-preview")
    .replaceAll("%unsubscribe_url%", "#unsubscribe-preview")
    .replaceAll("{{unsubscribe_preferences}}", '<a href="#unsubscribe-preview" style="color: #FE7733; text-decoration: underline;">Manage Preferences</a>');
}

