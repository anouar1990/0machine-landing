import { NextResponse } from "next/server";

export const runtime = "nodejs";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// In-memory sliding-window rate limiter per client IP (20 requests / minute)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 20;

function checkRateLimit(clientIp) {
  const now = Date.now();
  const record = rateLimitMap.get(clientIp);

  // Cleanup expired entries periodically
  if (rateLimitMap.size > 2000) {
    for (const [ip, data] of rateLimitMap.entries()) {
      if (now > data.resetAt) rateLimitMap.delete(ip);
    }
  }

  if (!record || now > record.resetAt) {
    rateLimitMap.set(clientIp, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0, resetInSec: Math.ceil((record.resetAt - now) / 1000) };
  }

  record.count += 1;
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - record.count };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req) {
  const startTime = Date.now();
  try {
    // 1. Client IP & Rate Limiting
    const forwarded = req.headers.get("x-forwarded-for");
    const clientIp = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
    const rateCheck = checkRateLimit(clientIp);
    if (!rateCheck.allowed) {
      console.warn(`[generate-svg] Rate limit exceeded for IP: ${clientIp.slice(0, 7)}***`);
      return NextResponse.json(
        { error: `Too many requests. Please wait ${rateCheck.resetInSec}s before retrying.` },
        { status: 429, headers: corsHeaders }
      );
    }

    // 2. Input Validation
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body." },
        { status: 400, headers: corsHeaders }
      );
    }

    const { prompt, mode = "cut-engrave", targetWidthMm = 120 } = body;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 2) {
      return NextResponse.json(
        { error: "A valid prompt with at least 2 characters is required." },
        { status: 400, headers: corsHeaders }
      );
    }

    if (prompt.trim().length > 600) {
      return NextResponse.json(
        { error: "Prompt is too long. Please keep it under 600 characters." },
        { status: 400, headers: corsHeaders }
      );
    }

    const cleanPrompt = prompt.trim();
    const clampedWidth = Math.max(30, Math.min(1000, Number(targetWidthMm) || 120));

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("[generate-svg] Missing GEMINI_API_KEY environment variable.");
      return NextResponse.json(
        { error: "AI Vector generation service is temporarily unconfigured on this host." },
        { status: 500, headers: corsHeaders }
      );
    }

    // 3. CAM Mode Specific Instructions
    let modeGuidelines = `
- Outer contour: Put the primary boundary cut in <g id="CUT_00" stroke="#EF4444" stroke-width="0.8" fill="none">.
- Internal fast line scoring/veins/markings: Put in <g id="SCORE_01" stroke="#3B82F6" stroke-width="0.8" fill="none">.
- Solid surface engravings/textures: Put in <g id="ENGRAVE_02" fill="#000000" stroke="none">.
`;

    if (mode === "stencil" || mode === "connected-stencil") {
      modeGuidelines = `
- Single-piece laser cut stencil: Connect ALL interior counter islands (e.g. inner loops of letters like A, B, D, O, P, Q, R, 0, 4, 6, 8, 9, or animal eyes/spots) with 1.5mm to 2mm bridge tabs to the main perimeter so NO loose pieces fall out when cut.
- Put all through-cuts in <g id="CUT_00" stroke="#EF4444" stroke-width="0.8" fill="none">.
- Put decorative surface lines in <g id="SCORE_01" stroke="#3B82F6" stroke-width="0.8" fill="none">.
`;
    } else if (mode === "keychain" || mode === "keychain-medallion") {
      modeGuidelines = `
- Keychain/Pendant mode: Create an integrated 3.5mm circular mounting hole with at least 2.5mm perimeter wall thickness at the top for a keyring or jump-ring.
- Outer boundary and mounting eyelet in <g id="CUT_00" stroke="#EF4444" stroke-width="0.8" fill="none">.
- Fine vector line score accents in <g id="SCORE_01" stroke="#3B82F6" stroke-width="0.8" fill="none">.
- Solid engraved artwork in <g id="ENGRAVE_02" fill="#000000" stroke="none">.
`;
    } else if (mode === "layered" || mode === "layered-scene") {
      modeGuidelines = `
- Multilayer 3D Shadowbox style: Clearly separated silhouettes (background, midground, foreground).
- Clean closed cutlines in <g id="CUT_00" stroke="#EF4444" stroke-width="0.8" fill="none">.
- Outline vector scores in <g id="SCORE_01" stroke="#3B82F6" stroke-width="0.8" fill="none">.
- High-contrast crosshatching in <g id="ENGRAVE_02" fill="#000000" stroke="none">.
`;
    }

    const systemPrompt = `You are an expert Laser Cutting CAM Engineer and Vector CAD specialist for LightBurn, xTool, and Ruida CO2/Fiber laser systems.
Generate a high-precision, production-ready, clean SVG for: "${cleanPrompt}".

STRICT RULES:
1. Output valid SVG XML ONLY inside a \`\`\`xml ... \`\`\` code block.
2. Standard ViewBox: viewBox="0 0 500 500" with width="100%" height="100%".
3. NO web gradients (<linearGradient>, <radialGradient>), NO drop-shadow filters, NO background cards or background <rect> bounding boxes.
4. Layer conventions:
   - Outer Cut contours (Through cuts): stroke="#EF4444" stroke-width="0.8" fill="none" inside <g id="CUT_00" inkscape:label="C00 - Cut">
   - Score contours (Surface line vector marks): stroke="#3B82F6" stroke-width="0.8" fill="none" inside <g id="SCORE_01" inkscape:label="C01 - Score">
   - Engrave shapes (Solid surface fills): fill="#000000" stroke="none" inside <g id="ENGRAVE_02" inkscape:label="C02 - Engrave">
5. Geometry Integrity:
   - All cut paths must be closed (<path d="... Z"/> or <circle>, <polygon>).
   - Accurately draw the requested subject ("${cleanPrompt}").
   - Do NOT wrap the artwork in a full-bleed square background box or card unless a coaster/box was explicitly requested.
6. Specific Mode Requirements:
${modeGuidelines}

Return ONLY raw SVG code inside:
\`\`\`xml
<svg ...>
...
</svg>
\`\`\`
Do not include any commentary, chat text, or explanation.`;

    // 4. Upstream Gemini API Call
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 8192,
        },
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.error("[generate-svg] Upstream API Error:", res.status, errData.error?.message || "");
      return NextResponse.json(
        {
          error:
            errData.error?.message ||
            `AI Vector generation upstream request failed with status ${res.status}.`,
        },
        { status: res.status >= 500 ? 502 : res.status, headers: corsHeaders }
      );
    }

    const data = await res.json();

    // 5. Robust Candidate & Multi-part Text Assembly
    const candidate = data.candidates?.[0];
    if (!candidate) {
      const blockReason = data.promptFeedback?.blockReason || "Generation blocked by model safety guidelines.";
      console.warn("[generate-svg] No candidate returned. Reason:", blockReason);
      return NextResponse.json(
        { error: `Generation could not be completed: ${blockReason}` },
        { status: 422, headers: corsHeaders }
      );
    }

    if (candidate.finishReason && !["STOP", "MAX_TOKENS"].includes(candidate.finishReason)) {
      console.warn("[generate-svg] Candidate finished with non-standard reason:", candidate.finishReason);
      return NextResponse.json(
        { error: `AI generation halted unexpectedly: ${candidate.finishReason}` },
        { status: 422, headers: corsHeaders }
      );
    }

    // Concatenate ALL parts safely
    const parts = candidate.content?.parts || [];
    const fullText = parts.map((p) => (typeof p.text === "string" ? p.text : "")).join("").trim();

    if (!fullText) {
      return NextResponse.json(
        { error: "Model returned an empty response. Please retry." },
        { status: 422, headers: corsHeaders }
      );
    }

    // 6. Safe SVG Extraction (Markdown Fences or Raw XML)
    let extractedSvg = null;
    const codeBlockMatch = fullText.match(/```(?:xml|svg)?\s*([\s\S]*?)\s*```/i);
    const candidateText = codeBlockMatch ? codeBlockMatch[1].trim() : fullText;

    const svgMatch = candidateText.match(/<svg[\s\S]*?<\/svg>/i) || fullText.match(/<svg[\s\S]*?<\/svg>/i);
    if (svgMatch) {
      extractedSvg = svgMatch[0].trim();
    }

    if (!extractedSvg) {
      console.warn("[generate-svg] Failed to extract SVG from assembled output length:", fullText.length);
      return NextResponse.json(
        { error: "Model did not produce a complete, valid <svg>...</svg> document. Please refine your prompt." },
        { status: 422, headers: corsHeaders }
      );
    }

    // 7. Structural CAM SVG Validation
    if (!extractedSvg.startsWith("<svg") || !extractedSvg.endsWith("</svg>")) {
      return NextResponse.json(
        { error: "SVG output appears truncated or malformed. Please retry." },
        { status: 422, headers: corsHeaders }
      );
    }

    // Verify presence of geometry elements
    const hasGeometry = /<(?:path|circle|rect|polygon|polyline|line)\b/i.test(extractedSvg);
    if (!hasGeometry) {
      return NextResponse.json(
        { error: "Generated SVG contains no cut or engrave geometry elements." },
        { status: 422, headers: corsHeaders }
      );
    }

    // Sanitize: remove full-screen background rects that text LLMs sometimes inject
    // (e.g. <rect width="500" height="500" fill="#000000" ... /> or fill="white")
    let cleanedSvg = extractedSvg.replace(
      /<rect\b[^>]*(?:width\s*=\s*["'](?:500|100%|100)["'][^>]*height\s*=\s*["'](?:500|100%|100)["']|height\s*=\s*["'](?:500|100%|100)["'][^>]*width\s*=\s*["'](?:500|100%|100)["'])[^>]*\/?>/gi,
      ""
    );

    const durationMs = Date.now() - startTime;
    console.log(`[generate-svg] Success for "${cleanPrompt.slice(0, 30)}" (${cleanedSvg.length} bytes, ${durationMs}ms)`);

    return NextResponse.json(
      {
        success: true,
        svg: cleanedSvg,
        prompt: cleanPrompt,
        mode,
        targetWidthMm: clampedWidth,
        layers: {
          cut: "#EF4444 (LightBurn Layer 00 Cut)",
          score: "#3B82F6 (LightBurn Layer 01 Score)",
          engrave: "#000000 (LightBurn Layer 02 Engrave)",
        },
      },
      { headers: corsHeaders }
    );
  } catch (err) {
    console.error("[generate-svg] Unhandled error:", err.message || err);
    return NextResponse.json(
      { error: err.message || "Internal server error occurred." },
      { status: 500, headers: corsHeaders }
    );
  }
}


