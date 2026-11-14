"use client";
import { useState, useMemo } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ParticleField from "../../components/ParticleField";
import { Layers, Download, Settings, RefreshCw, Check, ArrowRight, ShieldCheck, Sparkles, Box } from "lucide-react";
import Link from "next/link";
import { generateDxfString, triggerDownload } from "../../lib/cad-export";

export default function LivingHingeGeneratorPage() {
  const [hingeW, setHingeW] = useState("100"); // mm
  const [hingeH, setHingeH] = useState("60");  // mm
  const [cutLength, setCutLength] = useState("18"); // mm
  const [cutSpacing, setCutSpacing] = useState("3.5"); // mm
  const [lineGap, setLineGap] = useState("2.5"); // mm
  const [includeOuterBorder, setIncludeOuterBorder] = useState(true);
  const [downloadSuccess, setDownloadSuccess] = useState(null);

  const hw = Math.max(20, Math.min(500, parseFloat(hingeW) || 100));
  const hh = Math.max(10, Math.min(500, parseFloat(hingeH) || 60));
  const cl = Math.max(4, Math.min(60, parseFloat(cutLength) || 18));
  const cs = Math.max(1, Math.min(20, parseFloat(cutSpacing) || 3.5));
  const lg = Math.max(1, Math.min(20, parseFloat(lineGap) || 2.5));

  // Compute living hinge slit geometry
  const cadGeometry = useMemo(() => {
    const lines = [];
    const polylines = [];
    const texts = [];

    // Optional border frame
    if (includeOuterBorder) {
      polylines.push({
        points: [
          { x: 0, y: 0 },
          { x: hw, y: 0 },
          { x: hw, y: hh },
          { x: 0, y: hh },
        ],
        closed: true,
        layer: "CUT",
      });
    }

    // Number of columns of cuts across width
    const colCount = Math.floor(hw / cs);
    const actualSpacing = hw / (colCount + 1);

    for (let col = 1; col <= colCount; col++) {
      const x = col * actualSpacing;
      const isShifted = col % 2 === 1;

      // Vertical slits with staggered offset
      let y = isShifted ? lg / 2 : 0;

      while (y < hh) {
        const yEnd = Math.min(hh, y + cl);
        if (yEnd - y > 2) {
          lines.push({
            x1: x,
            y1: y,
            x2: x,
            y2: yEnd,
            layer: "CUT",
          });
        }
        y = yEnd + lg;
      }
    }

    return { lines, polylines, texts };
  }, [hw, hh, cl, cs, lg, includeOuterBorder]);

  // Export DXF
  const downloadDxf = () => {
    const dxf = generateDxfString(cadGeometry);
    triggerDownload(`0machine-living-hinge-${hw}x${hh}mm.dxf`, dxf, "application/dxf");
    setDownloadSuccess("AutoCAD DXF (.dxf) downloaded!");
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  // Export SVG
  const downloadSvg = () => {
    let svg = `<?xml version="1.0" standalone="no"?>\n`;
    svg += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${hw} ${hh}" width="${hw}mm" height="${hh}mm">\n`;
    svg += `  <style>\n`;
    svg += `    .cut { stroke: #EF4444; stroke-width: 0.15; fill: none; }\n`;
    svg += `  </style>\n`;

    cadGeometry.polylines.forEach((p) => {
      const pts = p.points.map((pt) => `${pt.x},${pt.y}`).join(" ");
      svg += `  <polygon points="${pts}" class="cut" />\n`;
    });

    cadGeometry.lines.forEach((l) => {
      svg += `  <line x1="${l.x1}" y1="${l.y1}" x2="${l.x2}" y2="${l.y2}" class="cut" />\n`;
    });

    svg += `</svg>`;
    triggerDownload(`0machine-living-hinge-${hw}x${hh}mm.svg`, svg, "image/svg+xml");
    setDownloadSuccess("LightBurn SVG (.svg) downloaded!");
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <>
      <ParticleField />
      <Navbar />

      <main className="min-h-screen pt-32 pb-24 relative z-10 bg-[#111317] text-gray-300">
        <div className="max-w-6xl mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-white">Free Tools</Link>
            <span>/</span>
            <span className="text-[#FE7733]">Living Hinge Generator</span>
          </div>

          {/* Header */}
          <div className="max-w-3xl mb-12">
            <span className="inline-flex items-center gap-1.5 text-xs text-[#B1FA63] font-bold uppercase tracking-[0.2em] bg-[#B1FA63]/10 px-4 py-1.5 rounded-full border border-[#B1FA63]/20 mb-3">
              <Layers size={13} />
              <span>100% Free · No Signup Required</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold font-[Outfit] text-white mb-4">
              Laser Cut <span className="text-[#FE7733]">Living Hinge Generator</span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              Generate parametric flexible wood lattice patterns. Bend rigid 3mm–6mm plywood and acrylic into smooth curved boxes, notebook spines, lamps, and rounded enclosures.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start mb-16">
            {/* Controls */}
            <div className="lg:col-span-5 bg-[#1A1D21] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Settings size={18} className="text-[#FE7733]" />
                  <span>Hinge Dimensions</span>
                </h2>
                <span className="text-xs text-gray-400">Values in millimeters</span>
              </div>

              {/* Width & Height */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-bold text-gray-400 block mb-1.5">Hinge Width (W)</span>
                  <input
                    type="number"
                    value={hingeW}
                    onChange={(e) => setHingeW(e.target.value)}
                    className="w-full bg-[#111317] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-[#FE7733] outline-none"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">Bend arc length</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 block mb-1.5">Hinge Height (H)</span>
                  <input
                    type="number"
                    value={hingeH}
                    onChange={(e) => setHingeH(e.target.value)}
                    className="w-full bg-[#111317] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-[#FE7733] outline-none"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">Total vertical span</span>
                </div>
              </div>

              {/* Slit Settings */}
              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400 font-bold">Slit Cut Length</span>
                    <span className="text-white font-mono">{cutLength} mm</span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="40"
                    step="0.5"
                    value={cutLength}
                    onChange={(e) => setCutLength(e.target.value)}
                    className="w-full accent-[#FE7733]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400 font-bold">Cut Column Spacing</span>
                    <span className="text-white font-mono">{cutSpacing} mm</span>
                  </div>
                  <input
                    type="range"
                    min="1.5"
                    max="10"
                    step="0.25"
                    value={cutSpacing}
                    onChange={(e) => setCutSpacing(e.target.value)}
                    className="w-full accent-[#FE7733]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400 font-bold">Line Gap Between Slits</span>
                    <span className="text-white font-mono">{lineGap} mm</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    step="0.25"
                    value={lineGap}
                    onChange={(e) => setLineGap(e.target.value)}
                    className="w-full accent-[#FE7733]"
                  />
                </div>
              </div>

              {/* Outer Border Toggle */}
              <div>
                <button
                  onClick={() => setIncludeOuterBorder(!includeOuterBorder)}
                  className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${includeOuterBorder ? "bg-[#10B981]/20 border-[#10B981]/40 text-[#10B981]" : "bg-white/5 border-white/10 text-gray-400"}`}
                >
                  {includeOuterBorder ? "✓ Include Outer Boundary Box" : "✕ Boundary Cut OFF (Slits Only)"}
                </button>
              </div>

              {/* Download Buttons */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={downloadDxf}
                    className="py-3 px-4 rounded-xl bg-[#FE7733] hover:bg-[#E85F20] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#FE7733]/20"
                  >
                    <Download size={15} />
                    <span>Download DXF</span>
                  </button>
                  <button
                    onClick={downloadSvg}
                    className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
                  >
                    <Download size={15} />
                    <span>Download SVG</span>
                  </button>
                </div>
                {downloadSuccess && (
                  <p className="text-xs text-[#10B981] font-bold text-center flex items-center justify-center gap-1.5 bg-[#10B981]/10 py-2 rounded-lg border border-[#10B981]/20">
                    <Check size={14} />
                    <span>{downloadSuccess}</span>
                  </p>
                )}
                <p className="text-[11px] text-gray-400 text-center">
                  Exported directly in LightBurn-ready red vector cut layer (<span className="text-[#EF4444] font-bold">#EF4444</span>)
                </p>
              </div>
            </div>

            {/* Interactive Preview Canvas */}
            <div className="lg:col-span-7 bg-[#1A1D21] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Live Hinge Pattern Preview</h3>
                <span className="text-xs text-[#FE7733] font-mono">{hw} × {hh} mm</span>
              </div>

              <div className="bg-[#111317] border border-white/5 rounded-xl p-4 flex items-center justify-center min-h-[360px] overflow-auto">
                <svg
                  viewBox={`0 0 ${hw} ${hh}`}
                  className="max-h-[380px] w-auto max-w-full drop-shadow-md"
                >
                  {/* Outer border */}
                  {cadGeometry.polylines.map((p, i) => (
                    <polygon
                      key={`p-${i}`}
                      points={p.points.map((pt) => `${pt.x},${pt.y}`).join(" ")}
                      stroke="#EF4444"
                      strokeWidth="0.3"
                      fill="none"
                    />
                  ))}
                  {/* Slits */}
                  {cadGeometry.lines.map((l, i) => (
                    <line
                      key={`l-${i}`}
                      x1={l.x1}
                      y1={l.y1}
                      x2={l.x2}
                      y2={l.y2}
                      stroke="#EF4444"
                      strokeWidth="0.3"
                    />
                  ))}
                </svg>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6 text-center text-xs">
                <div className="bg-[#23262C] p-3 rounded-xl border border-white/5">
                  <span className="text-gray-400 block text-[10px]">Total Slit Lines</span>
                  <span className="text-white font-bold font-mono text-sm">{cadGeometry.lines.length} cuts</span>
                </div>
                <div className="bg-[#23262C] p-3 rounded-xl border border-white/5">
                  <span className="text-gray-400 block text-[10px]">Recommended Wood</span>
                  <span className="text-white font-bold font-mono text-sm">3.0 mm Birch</span>
                </div>
                <div className="bg-[#23262C] p-3 rounded-xl border border-white/5">
                  <span className="text-gray-400 block text-[10px]">Grain Orientation</span>
                  <span className="text-[#10B981] font-bold font-mono text-sm">Parallel to Slits</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pro Conversion Upsell */}
          <div className="bg-gradient-to-r from-[#1A1D21] via-[#23262C] to-[#1A1D21] border border-[#B1FA63]/30 rounded-3xl p-8 sm:p-10 text-center max-w-4xl mx-auto shadow-2xl">
            <span className="text-xs text-[#B1FA63] font-extrabold uppercase tracking-widest flex items-center justify-center gap-1.5 mb-2">
              <Box size={14} />
              <span>BUILDING COMMERCIAL PRODUCTS?</span>
            </span>
            <h3 className="text-2xl sm:text-4xl font-bold text-white mb-3 font-[Outfit]">
              Access 5,000+ Production-Ready Laser Design Packs
            </h3>
            <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto mb-8">
              Explore the 0Machine Commercial Design Vault. Get pre-tested living hinge boxes, book covers, multilayer 3D mandala art, and parametric organizers with full commercial resale rights.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://app.0machine.com"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#FE7733] hover:bg-[#E85F20] text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-[#FE7733]/25 flex items-center justify-center gap-2"
              >
                <span>📦 Explore Design Vault</span>
                <ArrowRight size={16} />
              </a>
              <Link
                href="/tools/box-generator"
                className="w-full sm:w-auto px-8 py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl text-sm border border-white/10 transition-all"
              >
                Launch Box Generator
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

