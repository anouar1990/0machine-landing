import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { prompt, mode = "cut-engrave", targetWidthMm = 120 } = await req.json();

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Prompt is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    // Determine CAM requirements based on mode
    let modeGuidelines = `
- Outer cutline: Put in <g id="CUT_00" stroke="#EF4444" stroke-width="0.5" fill="none">.
- Interior engravings/details: Put in <g id="ENGRAVE_01" fill="#000000" stroke="none">.
`;

    if (mode === "stencil" || mode === "connected-stencil") {
      modeGuidelines = `
- Single-piece laser cut stencil: Connect all inner islands (e.g. loops in letters like O, A, B or animal eyes) with 1.5mm to 2mm bridge tabs to the main body so zero pieces fall out.
- Put all through-cuts in <g id="CUT_00" stroke="#EF4444" stroke-width="0.5" fill="none">.
`;
    } else if (mode === "keychain" || mode === "keychain-medallion") {
      modeGuidelines = `
- Keychain/Pendant mode: Create an integrated 3.5mm circular mounting hole with at least 2mm perimeter wall thickness at the top for a jump ring or keyring.
- Outer boundary and hole in <g id="CUT_00" stroke="#EF4444" stroke-width="0.5" fill="none">.
- Inner graphic art in <g id="ENGRAVE_01" fill="#000000" stroke="none">.
`;
    } else if (mode === "layered" || mode === "layered-scene") {
      modeGuidelines = `
- Multilayer 3D Shadowbox style: Stark separated silhouettes (background horizon, midground elements, foreground silhouette).
- Clean closed cutlines in <g id="CUT_00" stroke="#EF4444" stroke-width="0.5" fill="none">.
- High-contrast crosshatching in <g id="ENGRAVE_01" fill="#000000" stroke="none">.
`;
    }

    const systemPrompt = `You are an expert Laser Cutting CAM Engineer and Vector CAD specialist for LightBurn, xTool, and Ruida CO2/Fiber laser systems.
Generate a high-precision, production-ready, clean SVG for: "${prompt.trim()}".

STRICT RULES:
1. Output valid SVG XML ONLY.
2. Standard ViewBox: viewBox="0 0 500 500" with width="100%" height="100%".
3. Use exact LightBurn Layer Conventions:
   - Include <defs><style>.cut { stroke: #EF4444; stroke-width: 0.5; fill: none; } .engrave { fill: #000000; stroke: none; }</style></defs>
   - Cut Contours: class="cut" stroke="#EF4444" stroke-width="0.5" fill="none" inside <g id="CUT_00">
   - Engrave Elements: class="engrave" fill="#000000" stroke="none" inside <g id="ENGRAVE_01">
4. Geometric Integrity:
   - All cut paths must be closed (<path d="... Z"/> or <circle>, <rect>, <polygon>).
   - No self-intersecting or overlapping duplicate cutlines.
5. Specific Mode Requirements:
${modeGuidelines}

Return ONLY the raw SVG code inside a markdown code block:
\`\`\`xml
<svg ...>
...
</svg>
\`\`\`
Do not include any chat commentary or conversational text.`;

    // Call Google Gemini 3.5 Flash Lite for fast vector generation
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
      console.error("[generate-svg] Gemini API Error:", res.status, errData);
      return NextResponse.json(
        {
          error:
            errData.error?.message ||
            `Gemini API request failed with status ${res.status}`,
        },
        { status: res.status }
      );
    }

    const data = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Extract SVG from output
    const svgMatch = rawText.match(/<svg[\s\S]*?<\/svg>/i);
    if (!svgMatch) {
      console.warn("[generate-svg] No valid SVG block found in response:", rawText.slice(0, 200));
      return NextResponse.json(
        { error: "Model did not return valid SVG markup. Please retry." },
        { status: 502 }
      );
    }

    const svgString = svgMatch[0];

    return NextResponse.json({
      success: true,
      svg: svgString,
      prompt: prompt.trim(),
      mode,
      targetWidthMm,
      layers: {
        cut: "#EF4444 (LightBurn Layer 00)",
        engrave: "#000000 (LightBurn Layer 01)",
      },
    });
  } catch (err) {
    console.error("[generate-svg] Server error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error occurred." },
      { status: 500 }
    );
  }
}

