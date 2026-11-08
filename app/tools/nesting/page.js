"use client";
import { useState, useMemo } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ParticleField from "../../components/ParticleField";
import { Layers, Calculator, Settings, ArrowRight, ShieldCheck, Zap, AlertCircle, RotateCcw } from "lucide-react";
import Link from "next/link";

const PRESETS = [
  { label: "600 × 400 mm (Bed standard)", sw: "600", sh: "400" },
  { label: "1200 × 600 mm (Half sheet)", sw: "1200", sh: "600" },
  { label: "A4 (297 × 210 mm)", sw: "297", sh: "210" },
  { label: "A3 (420 × 297 mm)", sw: "420", sh: "297" },
];

export default function SheetNestingEstimatorPage() {
  const [sheetW, setSheetW] = useState("600");
  const [sheetH, setSheetH] = useState("400");
  const [partW, setPartW] = useState("80");
  const [partH, setPartH] = useState("80");
  const [partQty, setPartQty] = useState("24");
  const [spacing, setSpacing] = useState("2");
  const [sheetCost, setSheetCost] = useState("15");
  const [partSellPrice, setPartSellPrice] = useState("4.50");
  const [allowRotation, setAllowRotation] = useState(true);

  const sw = Math.max(10, parseFloat(sheetW) || 600);
  const sh = Math.max(10, parseFloat(sheetH) || 400);
  const pw = Math.max(5, parseFloat(partW) || 80);
  const ph = Math.max(5, parseFloat(partH) || 80);
  const qty = Math.max(1, parseInt(partQty) || 24);
  const sp = Math.max(0, parseFloat(spacing) || 2);
  const sc = Math.max(0, parseFloat(sheetCost) || 15);
  const price = Math.max(0, parseFloat(partSellPrice) || 4.5);

  // Nesting calculation
  const result = useMemo(() => {
    const effPW = pw + sp;
    const effPH = ph + sp;

    // Normal orientation
    const colsA = Math.floor((sw + sp) / effPW);
    const rowsA = Math.floor((sh + sp) / effPH);
    const countA = Math.max(0, colsA * rowsA);

    // Rotated 90 degrees
    let countB = 0;
    let colsB = 0;
    let rowsB = 0;
    if (allowRotation) {
      colsB = Math.floor((sw + sp) / effPH);
      rowsB = Math.floor((sh + sp) / effPW);
      countB = Math.max(0, colsB * rowsB);
    }

    const bestCountPerSheet = Math.max(1, Math.max(countA, countB));
    const isRotatedBest = allowRotation && countB > countA;
    const bestCols = isRotatedBest ? colsB : colsA;
    const bestRows = isRotatedBest ? rowsB : rowsA;
    const activePW = isRotatedBest ? ph : pw;
    const activePH = isRotatedBest ? pw : ph;

    const sheetsNeeded = Math.ceil(qty / bestCountPerSheet);
    const totalCapacity = sheetsNeeded * bestCountPerSheet;

    const singlePartArea = pw * ph;
    const sheetArea = sw * sh;
    const usedAreaSingleSheet = Math.min(qty, bestCountPerSheet) * singlePartArea;
    const sheetYieldPct = Math.min(100, (usedAreaSingleSheet / sheetArea) * 100);
    const scrapPct = Math.max(0, 100 - sheetYieldPct);

    const totalMaterialCost = sheetsNeeded * sc;
    const materialCostPerPart = totalMaterialCost / qty;
    const totalRevenue = qty * price;
    const grossProfit = totalRevenue - totalMaterialCost;
    const marginPct = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

    return {
      bestCountPerSheet,
      isRotatedBest,
      bestCols,
      bestRows,
      activePW,
      activePH,
      sheetsNeeded,
      totalCapacity,
      sheetYieldPct,
      scrapPct,
      totalMaterialCost,
      materialCostPerPart,
      totalRevenue,
      grossProfit,
      marginPct,
    };
  }, [sw, sh, pw, ph, qty, sp, sc, price, allowRotation]);

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
            <span className="text-[#FE7733]">Sheet Nesting Estimator</span>
          </div>

          {/* Header */}
          <div className="max-w-3xl mb-12">
            <span className="inline-flex items-center gap-1.5 text-xs text-[#B1FA63] font-bold uppercase tracking-[0.2em] bg-[#B1FA63]/10 px-4 py-1.5 rounded-full border border-[#B1FA63]/20 mb-3">
              <Layers size={13} />
              <span>100% Free · Material Scrap Reducer</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold font-[Outfit] text-white mb-4">
              Laser & CNC <span className="text-[#FE7733]">Sheet Nesting Calculator</span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              Calculate exact parts per sheet, sheet yield percentage, scrap waste, and material costs. Stop guessing sheet quantities on production runs.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start mb-16">
            {/* Controls */}
            <div className="lg:col-span-5 bg-[#1A1D21] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Settings size={18} className="text-[#FE7733]" />
                  <span>Sheet & Part Dimensions</span>
                </h2>
                <span className="text-xs text-gray-400">Dimensions in mm</span>
              </div>

              {/* Sheet Presets */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">Standard Sheet Presets</span>
                <div className="grid grid-cols-2 gap-2">
                  {PRESETS.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => {
                        setSheetW(p.sw);
                        setSheetH(p.sh);
                      }}
                      className={`text-left p-2 rounded-xl border text-[11px] font-medium transition-all ${sheetW === p.sw && sheetH === p.sh ? "bg-[#FE7733]/15 border-[#FE7733] text-white" : "bg-white/5 border-white/10 text-gray-400 hover:text-white"}`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sheet Size */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-bold text-gray-400 block mb-1.5">Sheet Width (W)</span>
                  <input
                    type="number"
                    value={sheetW}
                    onChange={(e) => setSheetW(e.target.value)}
                    className="w-full bg-[#111317] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-[#FE7733] outline-none"
                  />
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 block mb-1.5">Sheet Height (H)</span>
                  <input
                    type="number"
                    value={sheetH}
                    onChange={(e) => setSheetH(e.target.value)}
                    className="w-full bg-[#111317] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-[#FE7733] outline-none"
                  />
                </div>
              </div>

              {/* Part Size & Quantity */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <span className="text-xs font-bold text-gray-400 block mb-1.5">Part W (mm)</span>
                  <input
                    type="number"
                    value={partW}
                    onChange={(e) => setPartW(e.target.value)}
                    className="w-full bg-[#111317] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-[#FE7733] outline-none"
                  />
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 block mb-1.5">Part H (mm)</span>
                  <input
                    type="number"
                    value={partH}
                    onChange={(e) => setPartH(e.target.value)}
                    className="w-full bg-[#111317] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-[#FE7733] outline-none"
                  />
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 block mb-1.5">Total Qty</span>
                  <input
                    type="number"
                    value={partQty}
                    onChange={(e) => setPartQty(e.target.value)}
                    className="w-full bg-[#111317] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-[#FE7733] outline-none"
                  />
                </div>
              </div>

              {/* Spacing & Rotation */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-bold text-gray-400 block mb-1.5">Kerf / Part Spacing (mm)</span>
                  <input
                    type="number"
                    value={spacing}
                    onChange={(e) => setSpacing(e.target.value)}
                    className="w-full bg-[#111317] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-[#FE7733] outline-none"
                  />
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 block mb-1.5">90° Auto-Rotation</span>
                  <button
                    onClick={() => setAllowRotation(!allowRotation)}
                    className={`w-full py-2 px-3 rounded-xl border text-xs font-bold transition-all ${allowRotation ? "bg-[#10B981]/20 border-[#10B981]/40 text-[#10B981]" : "bg-white/5 border-white/10 text-gray-400"}`}
                  >
                    {allowRotation ? "✓ Allowed (Best Yield)" : "✕ Locked Orientation"}
                  </button>
                </div>
              </div>

              {/* Financial Inputs */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/10">
                <div>
                  <span className="text-xs font-bold text-gray-400 block mb-1.5">Raw Cost / Sheet ($)</span>
                  <input
                    type="number"
                    value={sheetCost}
                    onChange={(e) => setSheetCost(e.target.value)}
                    className="w-full bg-[#111317] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-[#FE7733] outline-none"
                  />
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 block mb-1.5">Selling Price / Part ($)</span>
                  <input
                    type="number"
                    value={partSellPrice}
                    onChange={(e) => setPartSellPrice(e.target.value)}
                    className="w-full bg-[#111317] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-[#FE7733] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Results & Visual Sheet Preview */}
            <div className="lg:col-span-7 bg-[#1A1D21] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Sheet Layout & Yield</h3>
                  <span className="text-xs text-[#10B981] font-bold">
                    {result.sheetYieldPct.toFixed(1)}% Sheet Yield ({result.scrapPct.toFixed(1)}% Scrap)
                  </span>
                </div>

                {/* Visual Canvas */}
                <div className="bg-[#111317] border border-white/5 rounded-xl p-4 flex items-center justify-center min-h-[300px]">
                  <div
                    style={{
                      aspectRatio: `${sw} / ${sh}`,
                      maxWidth: "100%",
                      maxHeight: "260px",
                    }}
                    className="w-full bg-[#23262C] border-2 border-[#FE7733]/40 rounded-lg p-2 relative flex flex-wrap content-start overflow-hidden gap-[2px]"
                  >
                    {Array.from({ length: Math.min(result.bestCountPerSheet, 60) }).map((_, idx) => (
                      <div
                        key={idx}
                        style={{
                          width: `calc(${100 / Math.max(1, result.bestCols)}% - 2px)`,
                          height: `calc(${100 / Math.max(1, result.bestRows)}% - 2px)`,
                        }}
                        className="bg-[#FE7733]/25 border border-[#FE7733]/70 rounded-[2px] flex items-center justify-center text-[9px] font-mono text-white/80"
                      >
                        {idx + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Key Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                <div className="bg-[#23262C] p-3 rounded-xl border border-white/5 text-center">
                  <span className="text-gray-400 block text-[10px] uppercase">Parts / Sheet</span>
                  <span className="text-white font-bold font-mono text-base">{result.bestCountPerSheet}</span>
                </div>
                <div className="bg-[#23262C] p-3 rounded-xl border border-white/5 text-center">
                  <span className="text-gray-400 block text-[10px] uppercase">Sheets Needed</span>
                  <span className="text-[#FE7733] font-bold font-mono text-base">{result.sheetsNeeded}</span>
                </div>
                <div className="bg-[#23262C] p-3 rounded-xl border border-white/5 text-center">
                  <span className="text-gray-400 block text-[10px] uppercase">Mat. Cost / Part</span>
                  <span className="text-white font-bold font-mono text-base">${result.materialCostPerPart.toFixed(2)}</span>
                </div>
                <div className="bg-[#23262C] p-3 rounded-xl border border-white/5 text-center">
                  <span className="text-gray-400 block text-[10px] uppercase">Gross Profit</span>
                  <span className="text-[#10B981] font-bold font-mono text-base">${result.grossProfit.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pro Conversion Upsell */}
          <div className="bg-gradient-to-r from-[#1A1D21] via-[#23262C] to-[#1A1D21] border border-[#B1FA63]/30 rounded-3xl p-8 sm:p-10 text-center max-w-4xl mx-auto shadow-2xl">
            <span className="text-xs text-[#B1FA63] font-extrabold uppercase tracking-widest flex items-center justify-center gap-1.5 mb-2">
              <Zap size={14} />
              <span>CUTTING IRREGULAR SHAPES?</span>
            </span>
            <h3 className="text-2xl sm:text-4xl font-bold text-white mb-3 font-[Outfit]">
              Save 30–40% More Material with True-Shape Polygon Nesting
            </h3>
            <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto mb-8">
              Rectangular grid estimators waste massive voids inside curved and hollow parts. 0Machine Pro packs complex non-convex polygons into voids, nests across remnant off-cuts, and exports full cut files directly to LightBurn.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://app.0machine.com"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#FE7733] hover:bg-[#E85F20] text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-[#FE7733]/25 flex items-center justify-center gap-2"
              >
                <span>🧩 Launch True-Shape Nesting Studio</span>
                <ArrowRight size={16} />
              </a>
              <Link
                href="/calculator"
                className="w-full sm:w-auto px-8 py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl text-sm border border-white/10 transition-all"
              >
                Calculate Job Margin
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
