import { NextResponse } from "next/server";
import { verifyAdminAuth } from "@/app/lib/admin-auth";
import { supabaseAdmin } from "@/app/lib/supabase-admin";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_ROWS = 5000;

export async function POST(request) {
  // EMAIL-003: Verify admin authentication
  const auth = await verifyAdminAuth(request);
  if (!auth.authorized) return auth.response;

  try {
    const body = await request.json().catch(() => ({}));
    const { csvText } = body;

    if (!csvText || typeof csvText !== "string" || !csvText.trim()) {
      return NextResponse.json(
        { error: "csvText required (non-empty string)" },
        { status: 400 }
      );
    }

    // Size limit check (5MB)
    if (Buffer.byteLength(csvText, "utf8") > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `CSV exceeds 5MB limit (${Buffer.byteLength(csvText, "utf8")} bytes)` },
        { status: 413 }
      );
    }

    // Parse CSV using robust RFC 4180 parser
    const records = parseRFC4180CSV(csvText);

    if (records.length === 0) {
      return NextResponse.json(
        { error: "No valid records found" },
        { status: 400 }
      );
    }

    // Exclude header row if present when evaluating row limits
    const firstField = (records[0]?.[0] || "").toLowerCase().trim();
    const isFirstRowHeader = records.length > 0 &&
      (firstField === "email" || (!firstField.includes("@") && firstField.startsWith("email")));
    const dataRecords = isFirstRowHeader ? records.slice(1) : records;

    if (dataRecords.length === 0) {
      return NextResponse.json(
        { error: "No data records found (only header row present)" },
        { status: 400 }
      );
    }

    if (dataRecords.length > MAX_ROWS) {
      return NextResponse.json(
        { error: `CSV exceeds ${MAX_ROWS} rows limit (${dataRecords.length} rows)` },
        { status: 413 }
      );
    }

    // Validate all records before inserting
    const validated = [];
    const errors = [];

    for (let i = 0; i < dataRecords.length; i++) {
      const record = dataRecords[i];
      const rowNumber = isFirstRowHeader ? i + 2 : i + 1;
      const validation = validateContactRecord(record, rowNumber);

      if (!validation.valid) {
        errors.push(validation.error);
        continue;
      }

      validated.push(validation.data);
    }

    // If no records passed validation, return summary with skipped errors
    if (validated.length === 0) {
      return NextResponse.json({
        success: true,
        summary: {
          processed: 0,
          inserted: 0,
          updated: 0,
          skipped: errors.length,
          errors: errors.slice(0, 10)
        }
      });
    }

    // Batch upsert validated contacts in chunks of 500, preserving existing tags and status
    let totalInserted = 0;
    let totalUpdated = 0;
    const CHUNK_SIZE = 500;

    for (let i = 0; i < validated.length; i += CHUNK_SIZE) {
      const chunk = validated.slice(i, i + CHUNK_SIZE);
      const chunkEmails = chunk.map(c => c.email);

      // Check existing contacts in database for this chunk to merge tags safely
      const { data: existingContacts, error: selectErr } = await supabaseAdmin
        .from("contacts")
        .select("id, email, first_name, plan, tags, status")
        .in("email", chunkEmails);

      if (selectErr) {
        console.error("[CONTACT IMPORT] Existing lookup error:", selectErr);
      }

      const existingMap = new Map((existingContacts || []).map(c => [c.email.toLowerCase(), c]));

      let chunkUpdated = 0;
      let chunkInserted = 0;

      // Prepare payload preserving existing tags & reserved statuses
      const upsertRows = chunk.map(item => {
        const existing = existingMap.get(item.email);
        if (existing) {
          chunkUpdated++;
          // Preserve existing tags by merging 'csv-imported'
          const mergedTags = Array.from(new Set([...(existing.tags || []), "csv-imported"]));
          return {
            id: existing.id,
            email: item.email,
            first_name: item.first_name || existing.first_name || "",
            plan: item.plan || existing.plan || "free",
            tags: mergedTags,
            // Preserve existing status (e.g. unsubscribed, bounced, complained, deleted)
            status: existing.status || "active",
            updated_at: new Date().toISOString()
          };
        } else {
          chunkInserted++;
          return {
            email: item.email,
            first_name: item.first_name,
            plan: item.plan,
            tags: ["csv-imported"],
            status: "active",
            updated_at: new Date().toISOString()
          };
        }
      });

      const { error: upsertErr } = await supabaseAdmin
        .from("contacts")
        .upsert(upsertRows, { onConflict: "email" });

      if (upsertErr) {
        console.error("[CONTACT IMPORT] Upsert error:", upsertErr);
        return NextResponse.json(
          { error: `Batch upsert failed: ${upsertErr.message}` },
          { status: 500 }
        );
      }

      totalInserted += chunkInserted;
      totalUpdated += chunkUpdated;
    }

    // Log import to email_activity_logs audit trail using valid schema columns
    await supabaseAdmin
      .from("email_activity_logs")
      .insert([{
        action: "CONTACTS_CSV_IMPORTED",
        description: `Imported ${validated.length} contacts (${totalInserted} inserted, ${totalUpdated} updated, ${errors.length} skipped)`,
        actor_email: auth.user?.email || "admin",
        metadata: {
          total_processed: dataRecords.length,
          validated_count: validated.length,
          inserted: totalInserted,
          updated: totalUpdated,
          skipped_invalid: errors.length,
          errors: errors.slice(0, 10),
          imported_by: auth.user?.email || "admin"
        }
      }]).catch(() => {});

    return NextResponse.json({
      success: true,
      summary: {
        processed: validated.length,
        inserted: totalInserted,
        updated: totalUpdated,
        skipped: errors.length,
        errors: errors.slice(0, 10)
      }
    });

  } catch (error) {
    console.error("[CONTACT IMPORT] Unexpected error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

/**
 * RFC 4180 Compliant CSV Parser
 * Handles:
 * - UTF-8 Byte Order Mark (BOM) stripping
 * - Commas within quoted fields
 * - Newlines within quoted fields
 * - Escaped double quotes ("")
 * - CRLF and LF line terminations
 */
export function parseRFC4180CSV(rawText) {
  if (!rawText || typeof rawText !== "string") return [];

  // 1. Strip UTF-8 BOM (\uFEFF) if present
  let text = rawText;
  if (text.charCodeAt(0) === 0xfeff) {
    text = text.slice(1);
  }

  const records = [];
  let currentFields = [];
  let currentField = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        // Escaped double quote: "" -> "
        currentField += '"';
        i++; // Skip the next quote
      } else {
        // Toggle quote context
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      // Delimiter outside quotes: end of current field
      currentFields.push(currentField.trim());
      currentField = "";
    } else if ((char === "\r" || char === "\n") && !insideQuotes) {
      // Line break outside quotes: end of record
      // Handle CRLF sequence
      if (char === "\r" && nextChar === "\n") {
        i++;
      }

      currentFields.push(currentField.trim());
      currentField = "";

      // Only push non-empty rows
      if (currentFields.some(f => f.length > 0)) {
        records.push(currentFields);
      }
      currentFields = [];
    } else {
      currentField += char;
    }
  }

  // Flush trailing field & record if present
  currentFields.push(currentField.trim());
  if (currentFields.some(f => f.length > 0)) {
    records.push(currentFields);
  }

  return records;
}

/**
 * Validates and sanitizes a single contact record [email, firstName, plan]
 */
export function validateContactRecord(record, rowNumber) {
  if (!record || record.length === 0 || record.every(f => !f)) {
    return {
      valid: false,
      error: `Row ${rowNumber}: Empty record`
    };
  }

  // Clean quotes that may wrap raw unescaped values
  const cleanField = (val) => (val || "").replace(/^["']|["']$/g, "").trim();

  const email = cleanField(record[0]).toLowerCase();
  let firstName = cleanField(record[1]);
  let plan = cleanField(record[2]).toLowerCase() || "free";

  // 1. Email RFC 5322 regex validation
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  if (!email) {
    return {
      valid: false,
      error: `Row ${rowNumber}: Email is required`
    };
  }

  if (!emailRegex.test(email)) {
    return {
      valid: false,
      error: `Row ${rowNumber}: Invalid email format (${email})`
    };
  }

  // 2. Whitelist plan (free, pro, user)
  const validPlans = ["free", "pro", "user"];
  if (!validPlans.includes(plan)) {
    return {
      valid: false,
      error: `Row ${rowNumber}: Invalid plan "${plan}" (must be free, pro, or user)`
    };
  }

  // 3. Formula Injection Sanitization (CSV Injection prevention)
  // If field starts with =, +, -, @, \t, or \r, prefix with single quote '
  if (firstName && /^[=+\-@\t\r]/.test(firstName)) {
    firstName = "'" + firstName;
  }

  return {
    valid: true,
    data: {
      email,
      first_name: firstName,
      plan
    }
  };
}
