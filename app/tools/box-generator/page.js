"use client";
import { useState, useMemo } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ParticleField from "../../components/ParticleField";
import { Box, Download, Settings, RefreshCw, Calculator, ArrowRight, ShieldCheck, Check, Copy } from "lucide-react";
import Link from "next/link";

export default function LaserBoxGeneratorPage() {
  const [width, setWidth] = useState(120); // mm
  const [height, setHeight] = useState(80); // mm
  const [depth, setDepth] = useState(80); // mm
  const [thickness, setThickness] = useState(3.0); // mm
  const [tabWidth, setTabWidth] = useState(12); // mm
  const [kerf, setKerf] = useState(0.15); // mm
  const [boxType, setBoxType] = useState("closed"); // 'open' | 'closed'
  const [downloadSuccess, setDownloadSuccess] = useState(null);
  const [copiedSvg, setCopiedSvg] = useState(false);

  // Helper: Create a closed finger-joint boundary polygon
  const createPanelPolygon = (w, h, topEdge, rightEdge, bottomEdge, leftEdge, T, tabSize, k) => {
    function buildEdgePoints(len, edgeType) {
      if (edgeType === "flat") {
        return [{ t1: 0, t2: len, offset: 0 }];
      }
      const rawCount = Math.max(3, Math.floor(len / tabSize));
      const count = rawCount % 2 === 0 ? rawCount + 1 : rawCount;
      const nominalTab = len / count;
      const isMale = edgeType === "male";
      const segs = [];

      for (let i = 0; i < count; i++) {
        const segStart = i * nominalTab;
        const segEnd = (i + 1) * nominalTab;
        const isTab = i % 2 === 0;

        let kAdj = 0;
        if (isMale && isTab) kAdj = k / 2;
        else if (!isMale && !isTab) kAdj = -k / 2;

        const t1 = Math.max(0, segStart - (i > 0 ? kAdj : 0));
        const t2 = Math.min(len, segEnd + (i < count - 1 ? kAdj : 0));
        const offset = isMale ? (isTab ? T : 0) : (isTab ? 0 : -T);
        segs.push({ t1, t2, offset });
      }
      return segs;
    }

    const poly = [];

    // 1. Top edge (x: 0 -> w, y: 0)
    const topSegs = buildEdgePoints(w, topEdge);
    topSegs.forEach((seg) => {
      const yOff = -seg.offset;
      poly.push({ x: seg.t1, y: yOff });
      poly.push({ x: seg.t2, y: yOff });
    });

    // 2. Right edge (x: w, y: 0 -> h)
    const rightSegs = buildEdgePoints(h, rightEdge);
    rightSegs.forEach((seg) => {
      const xOff = w + seg.offset;
      poly.push({ x: xOff, y: seg.t1 });
      poly.push({ x: xOff, y: seg.t2 });
    });

    // 3. Bottom edge (x: w -> 0, y: h)
    const bottomSegs = buildEdgePoints(w, bottomEdge);
    bottomSegs.forEach((seg) => {
      const yOff = h + seg.offset;
      const x1 = w - seg.t1;
      const x2 = w - seg.t2;
      poly.push({ x: x1, y: yOff });
      poly.push({ x: x2, y: yOff });
    });

    // 4. Left edge (x: 0, y: h -> 0)
    const leftSegs = buildEdgePoints(h, leftEdge);
    leftSegs.forEach((seg) => {
      const xOff = -seg.offset;
      const y1 = h - seg.t1;
      const y2 = h - seg.t2;
      poly.push({ x: xOff, y: y1 });
      poly.push({ x: xOff, y: y2 });
    });

    return poly;
  };

  // Compute Finger Joint Paths & Sheet Layout
  const panels = useMemo(() => {
    const W = Math.max(30, Number(width) || 100);
    const H = Math.max(30, Number(height) || 80);
    const D = Math.max(30, Number(depth) || 80);
    const T = Math.max(1, Number(thickness) || 3);
    const tabSize = Math.max(6, Number(tabWidth) || 12);
    const k = Number(kerf) || 0;

    // Panel definitions with interlocking edges:
    // Bottom & Top Lid: All female notches
    // Front & Back: All male tabs (or flat top if open box)
    // Left & Right: Bottom male, Top male (or flat if open), Vertical edges female to mate with Front & Back
    const panelSpecs = [
      {
        name: "Bottom",
        w: W,
        h: D,
        type: "bottom",
        edges: { top: "female", right: "female", bottom: "female", left: "female" },
      },
      {
        name: "Front",
        w: W,
        h: H,
        type: "front",
        edges: {
          top: boxType === "closed" ? "male" : "flat",
          right: "male",
          bottom: "male",
          left: "male",
        },
      },
      {
        name: "Back",
        w: W,
        h: H,
        type: "back",
        edges: {
          top: boxType === "closed" ? "male" : "flat",
          right: "male",
          bottom: "male",
          left: "male",
        },
      },
      {
        name: "Left",
        w: D,
        h: H,
        type: "left",
        edges: {
          top: boxType === "closed" ? "male" : "flat",
          right: "female",
          bottom: "male",
          left: "female",
        },
      },
      {
        name: "Right",
        w: D,
        h: H,
        type: "right",
        edges: {
          top: boxType === "closed" ? "male" : "flat",
          right: "female",
          bottom: "male",
          left: "female",
        },
      },
    ];

    if (boxType === "closed") {
      panelSpecs.push({
        name: "Top Lid",
        w: W,
        h: D,
        type: "top",
        edges: { top: "female", right: "female", bottom: "female", left: "female" },
      });
    }

    // Build polygons & arrange on sheet
    const sheetW = 600;
    const margin = 15;
    let currentX = margin;
    let currentY = margin;
    let rowMaxH = 0;
    const positioned = [];

    panelSpecs.forEach((spec) => {
      const pts = createPanelPolygon(
        spec.w,
        spec.h,
        spec.edges.top,
        spec.edges.right,
        spec.edges.bottom,
        spec.edges.left,
        T,
        tabSize,
        k
      );

      // Total panel footprint including outer tabs
      const panelFootprintW = spec.w + 2 * T;
      const panelFootprintH = spec.h + 2 * T;

      if (currentX + panelFootprintW + margin > sheetW) {
        currentX = margin;
        currentY += rowMaxH + margin + 10;
        rowMaxH = 0;
      }

      const pX = currentX + T;
      const pY = currentY + T;

      // Construct SVG path string
      const pathD = pts
        .map((p, i) => `${i === 0 ? "M" : "L"} ${(pX + p.x).toFixed(2)},${(pY + p.y).toFixed(2)}`)
        .join(" ") + " Z";

      positioned.push({
        ...spec,
        x: pX,
        y: pY,
        pts,
        pathD,
      });

      currentX += panelFootprintW + margin;
      if (panelFootprintH > rowMaxH) rowMaxH = panelFootprintH;
    });

    const totalSheetH = Math.max(300, currentY + rowMaxH + margin + 15);

    return {
      items: positioned,
      sheetWidth: sheetW,
      sheetHeight: totalSheetH,
      W,
      H,
      D,
      T,
    };
  }, [width, height, depth, thickness, tabWidth, kerf, boxType]);

  // Generate LightBurn SVG
  const generateSvgString = () => {
    const { items, sheetWidth, sheetHeight } = panels;
    let svg = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    svg += `<svg xmlns="http://www.w3.org/2000/svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="${sheetWidth}mm" height="${sheetHeight}mm" viewBox="0 0 ${sheetWidth} ${sheetHeight}">\n`;
    svg += `  <!-- Generated by 0Machine Free Laser Box Generator -->\n`;
    svg += `  <!-- Box: ${width}x${height}x${depth}mm | Material: ${thickness}mm | Kerf: ${kerf}mm -->\n`;
    svg += `  <!-- Layer 00: CUT (LightBurn standard: Red 0.1mm hairline) -->\n`;
    svg += `  <g id="CUT_00" inkscape:label="C00 - Cut" stroke="#EF4444" stroke-width="0.1" fill="none">\n`;

    items.forEach((p) => {
      svg += `    <!-- Panel: ${p.name} -->\n`;
      svg += `    <path d="${p.pathD}" />\n`;
    });

    svg += `  </g>\n`;
    svg += `  <!-- Layer 01: ENGRAVE (Panel labels) -->\n`;
    svg += `  <g id="ENGRAVE_01" inkscape:label="C01 - Engrave" fill="#000000" font-family="sans-serif" font-size="3.5">\n`;
    items.forEach((p) => {
      svg += `    <text x="${(p.x + p.w / 2).toFixed(1)}" y="${(p.y + p.h / 2).toFixed(1)}" text-anchor="middle">${p.name} (${p.w}x${p.h}mm)</text>\n`;
    });
    svg += `  </g>\n`;
    svg += `</svg>`;
    return svg;
  };

  // Generate AutoCAD R12 DXF
  const generateDxfString = () => {
    const { items, sheetHeight } = panels;
    let dxf = `0\nSECTION\n2\nHEADER\n9\n$INSUNITS\n70\n4\n0\nENDSEC\n`;
    dxf += `0\nSECTION\n2\nTABLES\n0\nTABLE\n2\nLAYER\n70\n2\n`;
    dxf += `0\nLAYER\n2\nCUT\n70\n0\n62\n1\n6\nCONTINUOUS\n0\n`; // Color 1 = Red
    dxf += `LAYER\n2\nENGRAVE\n70\n0\n62\n7\n6\nCONTINUOUS\n0\nENDTAB\n0\nENDSEC\n`; // Color 7 = White
    dxf += `0\nSECTION\n2\nENTITIES\n`;

    items.forEach((p) => {
      dxf += `0\nLWPOLYLINE\n100\nAcDbEntity\n8\nCUT\n100\nAcDbPolyline\n90\n${p.pts.length}\n70\n1\n`;
      p.pts.forEach((pt) => {
        const px = (p.x + pt.x).toFixed(3);
        const py = (sheetHeight - (p.y + pt.y)).toFixed(3);
        dxf += `10\n${px}\n20\n${py}\n`;
      });
    });

    dxf += `0\nENDSEC\n0\nEOF\n`;
    return dxf;
  };

  const handleDownloadSvg = () => {
    const svgStr = generateSvgString();
    const blob = new Blob([svgStr], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `0machine_finger_joint_box_${width}x${height}x${depth}_${thickness}mm.svg`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess("SVG");
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleDownloadDxf = () => {
    const dxfStr = generateDxfString();
    const blob = new Blob([dxfStr], { type: "application/dxf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `0machine_finger_joint_box_${width}x${height}x${depth}_${thickness}mm.dxf`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess("DXF");
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleCopySvg = () => {
    const svgStr = generateSvgString();
    navigator.clipboard.writeText(svgStr);
    setCopiedSvg(true);
    setTimeout(() => setCopiedSvg(false), 2500);
  };

  return (
    <>
      <ParticleField />
      <Navbar />

      <main className="min-h-screen pt-32 pb-24 relative z-10 bg-[#111317] text-gray-300">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 text-xs text-[#B1FA63] font-bold uppercase tracking-widest bg-[#B1FA63]/10 px-4 py-1.5 rounded-full border border-[#B1FA63]/20 mb-3">
              <Box size={13} />
              <span>FREE CAD GENERATOR</span>
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold font-[Outfit] text-white mb-3">
              Free Laser Cut <span className="text-[#FE7733]">Finger-Joint Box Generator</span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Generate assemble-ready finger-joint tabbed enclosures with automatic kerf compensation. Export 100% LightBurn & Ruida ready SVG and DXF files instantly.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start mb-16">
            {/* Left Controls Column */}
            <div className="lg:col-span-5 bg-[#1A1D21] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Settings size={18} className="text-[#FE7733]" />
                  <span>Box Dimensions (mm)</span>
                </h3>
                <span className="text-xs text-[#B1FA63] font-mono">1:1 Metric</span>
              </div>

              {/* Quick Presets */}
              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-2">QUICK SIZE PRESETS</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => { setWidth(80); setHeight(60); setDepth(50); }}
                    className="px-3 py-2 text-xs font-bold rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-all text-center"
                  >
                    Small Trinket<br /><span className="text-gray-500 text-[10px]">80×60×50</span>
                  </button>
                  <button
                    onClick={() => { setWidth(140); setHeight(90); setDepth(80); }}
                    className="px-3 py-2 text-xs font-bold rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-all text-center"
                  >
                    Enclosure<br /><span className="text-gray-500 text-[10px]">140×90×80</span>
                  </button>
                  <button
                    onClick={() => { setWidth(200); setHeight(140); setDepth(100); }}
                    className="px-3 py-2 text-xs font-bold rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-all text-center"
                  >
                    Storage Bin<br /><span className="text-gray-500 text-[10px]">200×140×100</span>
                  </button>
                </div>
              </div>

              {/* Sliders */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-medium text-gray-300 mb-1.5">
                    <span>Width (X)</span>
                    <span className="font-mono text-white font-bold">{width} mm</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="400"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full accent-[#FE7733]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-gray-300 mb-1.5">
                    <span>Height (Y)</span>
                    <span className="font-mono text-white font-bold">{height} mm</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="300"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full accent-[#FE7733]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-gray-300 mb-1.5">
                    <span>Depth (Z)</span>
                    <span className="font-mono text-white font-bold">{depth} mm</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="300"
                    value={depth}
                    onChange={(e) => setDepth(Number(e.target.value))}
                    className="w-full accent-[#FE7733]"
                  />
                </div>
              </div>

              {/* Material & Kerf Settings */}
              <div className="pt-4 border-t border-white/10 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-2">MATERIAL THICKNESS</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[3.0, 4.0, 5.0, 6.0].map((t) => (
                      <button
                        key={t}
                        onClick={() => setThickness(t)}
                        className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                          thickness === t
                            ? "bg-[#FE7733] text-white border-[#FE7733]"
                            : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        {t} mm
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-400 block mb-1.5">TAB SIZE (MM)</label>
                    <input
                      type="number"
                      value={tabWidth}
                      onChange={(e) => setTabWidth(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#23262C] border border-white/10 rounded-lg text-sm text-white font-mono focus:border-[#FE7733] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-400 block mb-1.5">KERF OFFSET (MM)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={kerf}
                      onChange={(e) => setKerf(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#23262C] border border-white/10 rounded-lg text-sm text-white font-mono focus:border-[#FE7733] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-1.5">BOX ENCLOSURE TYPE</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setBoxType("closed")}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        boxType === "closed"
                          ? "bg-[#FE7733] text-white border-[#FE7733]"
                          : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      Closed Box (6 Faces)
                    </button>
                    <button
                      onClick={() => setBoxType("open")}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        boxType === "open"
                          ? "bg-[#FE7733] text-white border-[#FE7733]"
                          : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      Open Top (5 Faces)
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 space-y-2.5">
                <button
                  onClick={handleDownloadSvg}
                  className="w-full py-3.5 bg-[#FE7733] hover:bg-[#E85F20] text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-[#FE7733]/25 flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  <span>Download LightBurn SVG</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleDownloadDxf}
                    className="py-3 bg-[#23262C] hover:bg-[#2C3038] text-white font-bold rounded-xl text-xs border border-white/10 transition-all flex items-center justify-center gap-2"
                  >
                    <Download size={14} />
                    <span>AutoCAD DXF</span>
                  </button>

                  <button
                    onClick={handleCopySvg}
                    className="py-3 bg-[#23262C] hover:bg-[#2C3038] text-white font-bold rounded-xl text-xs border border-white/10 transition-all flex items-center justify-center gap-2"
                  >
                    {copiedSvg ? <Check size={14} className="text-[#10B981]" /> : <Copy size={14} />}
                    <span>{copiedSvg ? "SVG Copied!" : "Copy SVG"}</span>
                  </button>
                </div>

                {downloadSuccess && (
                  <div className="p-3 bg-[#10B981]/10 border border-[#10B981]/30 rounded-xl text-xs text-[#10B981] flex items-center justify-center gap-2">
                    <Check size={14} />
                    <span>{downloadSuccess} file exported successfully! Drag directly into LightBurn or RDWorks.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right 2D CAD Preview Column */}
            <div className="lg:col-span-7 bg-[#1A1D21] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white font-[Outfit]">Live 2D Sheet Layout Preview</h3>
                    <p className="text-xs text-gray-400">
                      Layer 00: CUT (<span className="text-[#EF4444] font-semibold">Red Hairline</span>) · Kerf: {kerf}mm
                    </p>
                  </div>
                  <span className="text-xs font-mono text-[#B1FA63] bg-[#B1FA63]/10 px-3 py-1 rounded-full border border-[#B1FA63]/20">
                    {panels.items.length} Interlocking Panels
                  </span>
                </div>

                {/* SVG Visualizer Canvas */}
                <div className="w-full bg-[#111317] rounded-xl border border-white/10 p-4 overflow-hidden flex items-center justify-center min-h-[380px]">
                  <svg
                    viewBox={`0 0 ${panels.sheetWidth} ${panels.sheetHeight}`}
                    className="w-full h-auto max-h-[440px]"
                    style={{ background: "#0D0E12" }}
                  >
                    {/* Grid Pattern Background */}
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width={panels.sheetWidth} height={panels.sheetHeight} fill="url(#grid)" />

                    {/* True Finger Joint Panels */}
                    {panels.items.map((p, idx) => (
                      <g key={idx}>
                        <path
                          d={p.pathD}
                          fill="rgba(254, 119, 51, 0.08)"
                          stroke="#EF4444"
                          strokeWidth="1.2"
                          strokeLinejoin="round"
                        />
                        <text
                          x={p.x + p.w / 2}
                          y={p.y + p.h / 2}
                          fill="#B1FA63"
                          fontSize="9"
                          fontWeight="bold"
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          {p.name}
                        </text>
                        <text
                          x={p.x + p.w / 2}
                          y={p.y + p.h / 2 + 12}
                          fill="#6B7280"
                          fontSize="7"
                          textAnchor="middle"
                        >
                          {p.w} × {p.h} mm ({thickness}mm)
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
              </div>

              {/* Conversion Footer Banner */}
              <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left">
                  <span className="text-xs font-bold text-white block">Want to calculate cutting time and selling price?</span>
                  <span className="text-xs text-gray-400">Calculate electricity, laser time, and material sheet cost.</span>
                </div>
                <Link
                  href={`/calculator?pw=${width}&ph=${height}&sc=18`}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-[#FE7733] hover:text-white text-gray-200 border border-white/10 transition-all flex items-center gap-1.5 flex-shrink-0"
                >
                  <Calculator size={14} />
                  <span>Price This Box →</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
