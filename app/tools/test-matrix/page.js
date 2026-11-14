"use client";
import { useState, useMemo } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ParticleField from "../../components/ParticleField";
import { Grid, Download, RefreshCw, Settings, Check, ArrowRight, ShieldCheck, Sparkles, Cpu } from "lucide-react";
import Link from "next/link";
import { generateDxfString, triggerDownload } from "../../lib/cad-export";

export default function LaserTestMatrixPage() {
  const [matrixMode, setMatrixMode] = useState("cut"); // 'cut' | 'engrave'
  const [minSpeed, setMinSpeed] = useState("200");
  const [maxSpeed, setMaxSpeed] = useState("800");
  const [speedSteps, setSpeedSteps] = useState("5");
  const [minPower, setMinPower] = useState("20");
  const [maxPower, setMaxPower] = useState("100");
  const [powerSteps, setPowerSteps] = useState("5");
  const [cellSize, setCellSize] = useState("12");
  const [includeKerfSlits, setIncludeKerfSlits] = useState(true);
  const [downloadSuccess, setDownloadSuccess] = useState(null);

  // Parse numeric values
  const sMin = Math.max(10, parseFloat(minSpeed) || 100);
  const sMax = Math.max(sMin + 10, parseFloat(maxSpeed) || 800);
  const sCount = Math.max(2, Math.min(10, parseInt(speedSteps) || 5));
  const pMin = Math.max(5, parseFloat(minPower) || 10);
  const pMax = Math.max(pMin + 5, Math.min(100, parseFloat(maxPower) || 100));
  const pCount = Math.max(2, Math.min(10, parseInt(powerSteps) || 5));
  const cSize = Math.max(6, Math.min(30, parseFloat(cellSize) || 12));
  const gap = 3;

  const speeds = useMemo(() => {
    const arr = [];
    for (let i = 0; i < sCount; i++) {
      arr.push(Math.round(sMin + (sMax - sMin) * (i / (sCount - 1))));
    }
    return arr;
  }, [sMin, sMax, sCount]);

  const powers = useMemo(() => {
    const arr = [];
    for (let j = 0; j < pCount; j++) {
      arr.push(Math.round(pMin + (pMax - pMin) * (j / (pCount - 1))));
    }
    return arr;
  }, [pMin, pMax, pCount]);

  // Total canvas dimensions in mm
  const startX = 25; // Margin for Y labels
  const startY = 18; // Margin for X labels
  const totalW = startX + pCount * (cSize + gap) + 15;
  const totalH = startY + sCount * (cSize + gap) + 15;

  // Build CAD geometry
  const cadGeometry = useMemo(() => {
    const lines = [];
    const polylines = [];
    const texts = [];

    // Header Title Text
    texts.push({
      text: `0MACHINE TEST MATRIX - ${matrixMode.toUpperCase()}`,
      x: startX,
      y: 6,
      height: 3,
      layer: "ENGRAVE",
    });

    // Column Headers (Power %)
    powers.forEach((p, c) => {
      const x = startX + c * (cSize + gap) + cSize / 2;
      texts.push({
        text: `${p}%`,
        x: x - 4,
        y: startY - 4,
        height: 2.2,
        layer: "ENGRAVE",
      });
    });

    // Row Headers (Speed mm/s)
    speeds.forEach((s, r) => {
      const y = startY + r * (cSize + gap) + cSize / 2;
      texts.push({
        text: `${s}`,
        x: 2,
        y: y + 1,
        height: 2.2,
        layer: "ENGRAVE",
      });
    });

    // Cells
    for (let r = 0; r < sCount; r++) {
      const y = startY + r * (cSize + gap);
      for (let c = 0; c < pCount; c++) {
        const x = startX + c * (cSize + gap);

        // Cell rectangle
        polylines.push({
          points: [
            { x, y },
            { x: x + cSize, y },
            { x: x + cSize, y: y + cSize },
            { x, y: y + cSize },
          ],
          closed: true,
          layer: matrixMode === "cut" ? "CUT" : "ENGRAVE",
        });

        // Optional internal kerf slit
        if (includeKerfSlits && matrixMode === "cut" && cSize >= 10) {
          lines.push({
            x1: x + cSize / 2,
            y1: y + 2,
            x2: x + cSize / 2,
            y2: y + cSize - 2,
            layer: "CUT",
          });
        }
      }
    }

    // Outer border frame
    polylines.push({
      points: [
        { x: 0, y: 0 },
        { x: totalW, y: 0 },
        { x: totalW, y: totalH },
        { x: 0, y: totalH },
      ],
      closed: true,
      layer: "CUT",
    });

    return { lines, polylines, texts };
  }, [matrixMode, powers, speeds, cSize, gap, sCount, pCount, includeKerfSlits, totalW, totalH]);

  // Export DXF
  const downloadDxf = () => {
    const dxf = generateDxfString(cadGeometry);
    triggerDownload(`0machine-test-matrix-${matrixMode}.dxf`, dxf, "application/dxf");
    setDownloadSuccess("AutoCAD DXF (.dxf) downloaded!");
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  // Export SVG
  const downloadSvg = () => {
    let svg = `<?xml version="1.0" standalone="no"?>\n`;
    svg += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${totalH}" width="${totalW}mm" height="${totalH}mm">\n`;
    svg += `  <style>\n`;
    svg += `    .cut { stroke: #EF4444; stroke-width: 0.15; fill: none; }\n`;
    svg += `    .engrave { stroke: #000000; stroke-width: 0.1; fill: none; font-family: monospace; font-size: 2px; fill: #000000; }\n`;
    svg += `  </style>\n`;

    cadGeometry.texts.forEach((t) => {
      svg += `  <text x="${t.x}" y="${t.y}" class="engrave">${t.text}</text>\n`;
    });

    cadGeometry.lines.forEach((l) => {
      svg += `  <line x1="${l.x1}" y1="${l.y1}" x2="${l.x2}" y2="${l.y2}" class="${l.layer === "CUT" ? "cut" : "engrave"}" />\n`;
    });

    cadGeometry.polylines.forEach((p) => {
      const pts = p.points.map((pt) => `${pt.x},${pt.y}`).join(" ");
      svg += `  <polygon points="${pts}" class="${p.layer === "CUT" ? "cut" : "engrave"}" />\n`;
    });

    svg += `</svg>`;
    triggerDownload(`0machine-test-matrix-${matrixMode}.svg`, svg, "image/svg+xml");
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
            <span className="text-[#FE7733]">Laser Test Matrix</span>
          </div>

          {/* Header */}
          <div className="max-w-3xl mb-12">
            <span className="inline-flex items-center gap-1.5 text-xs text-[#B1FA63] font-bold uppercase tracking-[0.2em] bg-[#B1FA63]/10 px-4 py-1.5 rounded-full border border-[#B1FA63]/20 mb-3">
              <Grid size={13} />
              <span>100% Free · No Signup Required</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold font-[Outfit] text-white mb-4">
              Laser Power & Speed <span className="text-[#FE7733]">Test Matrix Generator</span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              Generate custom speed vs. power calibration grids for CO2, Fiber, and Diode lasers. Zero guesswork on new batches of plywood, acrylic, leather, and slate.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start mb-16">
            {/* Controls Panel */}
            <div className="lg:col-span-5 bg-[#1A1D21] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Settings size={18} className="text-[#FE7733]" />
                  <span>Matrix Parameters</span>
                </h2>
                <div className="flex bg-[#23262C] p-1 rounded-lg border border-white/10">
                  <button
                    onClick={() => setMatrixMode("cut")}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all ${matrixMode === "cut" ? "bg-[#EF4444] text-white" : "text-gray-400 hover:text-white"}`}
                  >
                    Cut Grid
                  </button>
                  <button
                    onClick={() => setMatrixMode("engrave")}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all ${matrixMode === "engrave" ? "bg-[#3B82F6] text-white" : "text-gray-400 hover:text-white"}`}
                  >
                    Engrave Grid
                  </button>
                </div>
              </div>

              {/* Speed Controls */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Laser Speed Range (mm/s)</label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <span className="text-[10px] text-gray-400 block mb-1">Min Speed</span>
                    <input
                      type="number"
                      value={minSpeed}
                      onChange={(e) => setMinSpeed(e.target.value)}
                      className="w-full bg-[#111317] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-[#FE7733] outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block mb-1">Max Speed</span>
                    <input
                      type="number"
                      value={maxSpeed}
                      onChange={(e) => setMaxSpeed(e.target.value)}
                      className="w-full bg-[#111317] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-[#FE7733] outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block mb-1">Rows (Steps)</span>
                    <input
                      type="number"
                      value={speedSteps}
                      onChange={(e) => setSpeedSteps(e.target.value)}
                      min="2"
                      max="10"
                      className="w-full bg-[#111317] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-[#FE7733] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Power Controls */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Laser Power Range (%)</label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <span className="text-[10px] text-gray-400 block mb-1">Min Power %</span>
                    <input
                      type="number"
                      value={minPower}
                      onChange={(e) => setMinPower(e.target.value)}
                      className="w-full bg-[#111317] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-[#FE7733] outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block mb-1">Max Power %</span>
                    <input
                      type="number"
                      value={maxPower}
                      onChange={(e) => setMaxPower(e.target.value)}
                      className="w-full bg-[#111317] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-[#FE7733] outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block mb-1">Cols (Steps)</span>
                    <input
                      type="number"
                      value={powerSteps}
                      onChange={(e) => setPowerSteps(e.target.value)}
                      min="2"
                      max="10"
                      className="w-full bg-[#111317] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-[#FE7733] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Cell Geometry */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-bold text-gray-400 block mb-1.5">Square Cell Size (mm)</span>
                  <input
                    type="number"
                    value={cellSize}
                    onChange={(e) => setCellSize(e.target.value)}
                    min="6"
                    max="30"
                    className="w-full bg-[#111317] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-[#FE7733] outline-none"
                  />
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 block mb-1.5">Include Kerf Slits</span>
                  <button
                    onClick={() => setIncludeKerfSlits(!includeKerfSlits)}
                    className={`w-full py-2 px-3 rounded-xl border text-xs font-bold transition-all ${includeKerfSlits ? "bg-[#10B981]/20 border-[#10B981]/40 text-[#10B981]" : "bg-white/5 border-white/10 text-gray-400"}`}
                  >
                    {includeKerfSlits ? "✓ Kerf Slits ON" : "✕ Slits OFF"}
                  </button>
                </div>
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
                  Color-coded for LightBurn: <span className="text-[#EF4444] font-bold">C00 Cut (#EF4444)</span> & <span className="text-blue-400 font-bold">C01 Engrave (#000000)</span>
                </p>
              </div>
            </div>

            {/* Interactive Preview Canvas */}
            <div className="lg:col-span-7 bg-[#1A1D21] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Live CAD Geometry Preview</h3>
                <span className="text-xs text-[#FE7733] font-mono">
                  {Math.round(totalW)} × {Math.round(totalH)} mm
                </span>
              </div>

              <div className="bg-[#111317] border border-white/5 rounded-xl p-4 flex items-center justify-center min-h-[360px] overflow-auto">
                <svg
                  viewBox={`0 0 ${totalW} ${totalH}`}
                  className="max-h-[380px] w-auto max-w-full drop-shadow-md"
                >
                  {/* Grid Lines */}
                  {cadGeometry.lines.map((l, i) => (
                    <line
                      key={`l-${i}`}
                      x1={l.x1}
                      y1={l.y1}
                      x2={l.x2}
                      y2={l.y2}
                      stroke={l.layer === "CUT" ? "#EF4444" : "#3B82F6"}
                      strokeWidth="0.3"
                    />
                  ))}
                  {/* Polylines */}
                  {cadGeometry.polylines.map((p, i) => (
                    <polygon
                      key={`p-${i}`}
                      points={p.points.map((pt) => `${pt.x},${pt.y}`).join(" ")}
                      stroke={p.layer === "CUT" ? "#EF4444" : "#3B82F6"}
                      strokeWidth="0.3"
                      fill={p.layer === "ENGRAVE" ? "#3B82F615" : "none"}
                    />
                  ))}
                  {/* Labels */}
                  {cadGeometry.texts.map((t, i) => (
                    <text
                      key={`t-${i}`}
                      x={t.x}
                      y={t.y}
                      fill="#9CA3AF"
                      fontSize={t.height}
                      fontFamily="monospace"
                    >
                      {t.text}
                    </text>
                  ))}
                </svg>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6 text-center text-xs">
                <div className="bg-[#23262C] p-3 rounded-xl border border-white/5">
                  <span className="text-gray-400 block text-[10px]">Total Test Cells</span>
                  <span className="text-white font-bold font-mono text-sm">{sCount * pCount} Cells</span>
                </div>
                <div className="bg-[#23262C] p-3 rounded-xl border border-white/5">
                  <span className="text-gray-400 block text-[10px]">Speed Range</span>
                  <span className="text-white font-bold font-mono text-sm">{sMin} - {sMax} mm/s</span>
                </div>
                <div className="bg-[#23262C] p-3 rounded-xl border border-white/5">
                  <span className="text-gray-400 block text-[10px]">Power Range</span>
                  <span className="text-white font-bold font-mono text-sm">{pMin}% - {pMax}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pro Conversion Upsell */}
          <div className="bg-gradient-to-r from-[#1A1D21] via-[#23262C] to-[#1A1D21] border border-[#B1FA63]/30 rounded-3xl p-8 sm:p-10 text-center max-w-4xl mx-auto shadow-2xl">
            <span className="text-xs text-[#B1FA63] font-extrabold uppercase tracking-widest flex items-center justify-center gap-1.5 mb-2">
              <Cpu size={14} />
              <span>TIRED OF TESTING EVERY SHEET?</span>
            </span>
            <h3 className="text-2xl sm:text-4xl font-bold text-white mb-3 font-[Outfit]">
              Unlock 50+ Verified Machine Presets in 0Machine Pro
            </h3>
            <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto mb-8">
              Skip the calibration grid entirely. Get pre-calibrated speed, power, frequency, and air-assist settings for xTool, OMTech, Glowforge, Thunder Laser, and Boss Laser across Baltic birch, cast acrylic, MDF, and leather.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://app.0machine.com"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#FE7733] hover:bg-[#E85F20] text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-[#FE7733]/25 flex items-center justify-center gap-2"
              >
                <span>🚀 Access Pro Preset Database</span>
                <ArrowRight size={16} />
              </a>
              <Link
                href="/calculator"
                className="w-full sm:w-auto px-8 py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl text-sm border border-white/10 transition-all"
              >
                Estimate Job Cost
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

