import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { vectorizeRecraftImage } from "@/lib/recraft-vectorizer";

export const runtime = "nodejs";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://kfydsuuelaxaffntdjxh.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl, supabaseKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// In-memory sliding-window rate limiter per client IP (20 requests / minute)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 20;

/**
 * Internal LaserAI System Prompt Transformer
 * Automatically enforces:
 * - Strict black-and-white monochrome silhouette (#000000)
 * - Complete background removal (pure white #FFFFFF backdrop, zero border box/scenery)
 * - Laser cut closed contour CAD readiness
 */
function transformPromptForLaserAi(userPrompt, mode = "standard") {
  const clean = userPrompt.trim().replace(/[.]+$/, "");
  let modeDirective = "Clean closed contour silhouette, solid vector shape, 2D flat artwork.";
  if (mode === "stencil" || mode === "connected-stencil") {
    modeDirective = "Single-piece laser cut stencil. All interior counter islands connected with solid bridges, zero loose falling pieces.";
  } else if (mode === "keychain" || mode === "keychain-medallion") {
    modeDirective = "Compact medallion silhouette emblem, unified closed perimeter boundary contour, laser cut keychain ready.";
  } else if (mode === "layered" || mode === "layered-scene") {
    modeDirective = "Multi-layer laser cut shadowbox silhouette, cleanly separated depth planes, distinct contours.";
  }

  return `Ultra-sharp solid monochrome stencil vector line art of ${clean}. ${modeDirective} High contrast pure solid black shapes (#000000) on an isolated, completely pure clean white background (#FFFFFF). Background completely removed, zero background scenery, zero borders, zero bounding square frames, no rectangular backdrop. Crisp smooth edges, clean closed boundary cut paths. Strictly no colors, zero shades of gray, no soft gradients, no photographic textures, no 3D shading, no blur, no drop shadows. Laser cut CAD/CAM ready.`;
}

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

    const { prompt, mode = "cut-engrave", targetWidthMm = 120, userId } = body;

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

    // AI Wallet Credit Pre-Check (Reject before calling Gemini if user has 0 credits)
    if (userId) {
      try {
        const { data: walletData, error: walletErr } = await supabaseAdmin.rpc("get_or_create_ai_wallet", {
          p_user_id: userId,
        });

        if (walletErr) {
          console.warn("[generate-svg] Wallet pre-check warning:", walletErr.message);
        } else {
          const balance = walletData?.balance ?? 0;
          if (balance < 1) {
            return NextResponse.json(
              {
                error: "Insufficient AI credits. Please recharge your AI wallet to generate CAD vectors.",
                code: "INSUFFICIENT_CREDITS",
                balance,
                required: 1,
              },
              { status: 402, headers: corsHeaders }
            );
          }
        }
      } catch (checkErr) {
        console.warn("[generate-svg] Error during wallet pre-check:", checkErr.message);
      }
    }

    const cleanPrompt = prompt.trim();
    const clampedWidth = Math.max(30, Math.min(1000, Number(targetWidthMm) || 120));

    const recraftKey = process.env.RECRAFT_API_KEY;
    const recraftModel = process.env.RECRAFT_MODEL || "recraftv4_1_flash";
    const openrouterKey = process.env.OPENROUTER_API_KEY;
    const openrouterModel = process.env.OPENROUTER_RECRAFT_MODEL || "recraft/recraft-v4.1-flash-v2:free";
    const geminiApiKey = process.env.GEMINI_API_KEY;

    let cleanedSvg = null;
    let recraftImageUrl = null;
    let activeModel = "0machine-laserai-v2.0";
    let activeEngine = "laserai";

    // 3. Tier 1: Direct Official Recraft API (Highest Speed & Direct Commercial License)
    if (recraftKey) {
      try {
        const laserAiPrompt = transformPromptForLaserAi(cleanPrompt, mode);
        const rcRes = await fetch("https://external.api.recraft.ai/v1/images/generations", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${recraftKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: laserAiPrompt,
            model: recraftModel,
          }),
        });

        if (rcRes.ok) {
          const rcData = await rcRes.json();
          const imageUrl = rcData.data?.[0]?.url;
          if (imageUrl) {
            recraftImageUrl = imageUrl;
            const vectorResult = await vectorizeRecraftImage(imageUrl, {
              mode,
              targetWidthMm: clampedWidth,
            });
            cleanedSvg = vectorResult.svg;
            activeModel = "0machine-laserai-v2.0";
            activeEngine = "laserai";
            console.log(`[LaserAI] Direct Recraft API synthesized CAD vector (${vectorResult.outerVertices} outer pts, ${vectorResult.holeCount} holes)`);
          }
        } else {
          const errText = await rcRes.text().catch(() => "");
          console.warn("[LaserAI] Direct Recraft API returned:", rcRes.status, errText.slice(0, 150));
        }
      } catch (rcErr) {
        console.warn("[LaserAI] Direct Recraft API failed, attempting fallback:", rcErr.message);
      }
    }

    // 4. Tier 2: 0machine LaserAI via High-Speed CAM Synthesis Fallback
    if (!cleanedSvg && openrouterKey) {
      try {
        const laserAiPrompt = transformPromptForLaserAi(cleanPrompt, mode);

        const orRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${openrouterKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: openrouterModel,
            messages: [{ role: "user", content: laserAiPrompt }],
          }),
        });

        if (orRes.ok) {
          const orData = await orRes.json();
          const imageUrl = orData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
          if (imageUrl) {
            recraftImageUrl = imageUrl;
            const vectorResult = await vectorizeRecraftImage(imageUrl, {
              mode,
              targetWidthMm: clampedWidth,
            });
            cleanedSvg = vectorResult.svg;
            activeModel = "0machine-laserai-v2.0";
            activeEngine = "laserai";
            console.log(`[LaserAI] Successfully synthesized CAD vectors (${vectorResult.outerVertices} outer pts, ${vectorResult.holeCount} holes)`);
          } else {
            console.warn("[LaserAI] Engine returned no image URL:", JSON.stringify(orData).slice(0, 200));
          }
        } else {
          const errText = await orRes.text().catch(() => "");
          console.warn("[LaserAI] Engine upstream returned status:", orRes.status, errText.slice(0, 200));
        }
      } catch (orErr) {
        console.warn("[LaserAI] Primary engine error, falling back to secondary engine:", orErr.message);
      }
    }

    // 4. Secondary Fallback Path: Gemini Direct SVG Generation
    if (!cleanedSvg && geminiApiKey) {
      console.log("[generate-svg] Attempting Gemini fallback generation...");
      activeModel = "gemini-3.5-flash-lite";
      activeEngine = "gemini";

      let modeGuidelines = `
- Outer contour: Put the primary boundary cut in <g id="CUT_00" stroke="#EF4444" stroke-width="0.8" fill="none">.
- Internal fast line scoring/veins/markings: Put in <g id="SCORE_01" stroke="#3B82F6" stroke-width="0.8" fill="none">.
- Solid surface engravings/textures: Put in <g id="ENGRAVE_02" fill="#000000" stroke="none">.
`;

      if (mode === "stencil" || mode === "connected-stencil") {
        modeGuidelines = `
- Single-piece laser cut stencil: Connect ALL interior counter islands with 1.5mm to 2mm bridge tabs to the main perimeter so NO loose pieces fall out when cut.
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
   - Outer Cut contours (Through cuts): stroke="#EF4444" stroke-width="0.8" fill="none" inside <g id="CUT_00" data-label="C00 - Cut">
   - Score contours (Surface line vector marks): stroke="#3B82F6" stroke-width="0.8" fill="none" inside <g id="SCORE_01" data-label="C01 - Score">
   - Engrave shapes (Solid surface fills): fill="#000000" stroke="none" inside <g id="ENGRAVE_02" data-label="C02 - Engrave">
5. Geometry Integrity:
   - All cut paths must be closed (<path d="... Z"/> or <circle>, <polygon>).
   - Accurately draw the requested subject ("${cleanPrompt}").
6. Specific Mode Requirements:
${modeGuidelines}

Return ONLY raw SVG code inside:
\`\`\`xml
<svg ...>
...
</svg>
\`\`\``;

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${geminiApiKey}`;

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

      if (res.ok) {
        const data = await res.json();
        const candidate = data.candidates?.[0];
        const parts = candidate?.content?.parts || [];
        const fullText = parts.map((p) => (typeof p.text === "string" ? p.text : "")).join("").trim();
        const codeBlockMatch = fullText.match(/```(?:xml|svg)?\s*([\s\S]*?)\s*```/i);
        const candidateText = codeBlockMatch ? codeBlockMatch[1].trim() : fullText;
        const svgMatch = candidateText.match(/<svg[\s\S]*?<\/svg>/i) || fullText.match(/<svg[\s\S]*?<\/svg>/i);
        if (svgMatch) {
          cleanedSvg = svgMatch[0].trim().replace(
            /<rect\b[^>]*(?:width\s*=\s*["'](?:500|100%|100)["'][^>]*height\s*=\s*["'](?:500|100%|100)["']|height\s*=\s*["'](?:500|100%|100)["'][^>]*width\s*=\s*["'](?:500|100%|100)["'])[^>]*\/?>/gi,
            ""
          );
          if (!cleanedSvg.includes("xmlns=")) {
            cleanedSvg = cleanedSvg.replace(/<svg\b/i, '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"');
          }
        }
      }
    }

    if (!cleanedSvg) {
      return NextResponse.json(
        { error: "Model did not produce a complete, valid vector CAD design. Please refine your prompt or retry." },
        { status: 502, headers: corsHeaders }
      );
    }

    // 5. Structural CAM SVG Validation
    if (!cleanedSvg.includes("<svg") || !cleanedSvg.includes("</svg>")) {
      return NextResponse.json(
        { error: "SVG output appears truncated or malformed. Please retry." },
        { status: 422, headers: corsHeaders }
      );
    }

    // Verify presence of geometry elements
    const hasGeometry = /<(?:path|circle|rect|polygon|polyline|line)\b/i.test(cleanedSvg);
    if (!hasGeometry) {
      return NextResponse.json(
        { error: "Generated SVG contains no cut or engrave geometry elements." },
        { status: 422, headers: corsHeaders }
      );
    }

    const durationMs = Date.now() - startTime;
    console.log(`[LaserAI] Success for "${cleanPrompt.slice(0, 30)}" (${cleanedSvg.length} bytes, ${durationMs}ms)`);

    // 6. Deduct credit ONLY after successful generation and CAM validation
    let remainingCredits = null;
    if (userId) {
      try {
        const genId = `gen_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        const { data: deductResult, error: deductErr } = await supabaseAdmin.rpc("deduct_ai_credits", {
          p_user_id: userId,
          p_credits: 1,
          p_reference_id: genId,
          p_description: `LaserAI CAD Generation: "${cleanPrompt.slice(0, 30)}"`,
        });

        if (deductErr) {
          console.warn("[LaserAI] Failed to record credit deduction:", deductErr.message);
        } else if (deductResult) {
          remainingCredits = deductResult.balance;
          console.log(`[LaserAI] Deducted 1 credit for user ${userId}. Remaining balance: ${remainingCredits}`);
        }
      } catch (deductErr) {
        console.warn("[LaserAI] Deduction exception:", deductErr.message);
      }
    }

    return NextResponse.json(
      {
        success: true,
        svg: cleanedSvg,
        imageUrl: recraftImageUrl,
        prompt: cleanPrompt,
        mode,
        targetWidthMm: clampedWidth,
        remainingCredits,
        model: "0machine-laserai-v2.0",
        engine: "laserai",
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


