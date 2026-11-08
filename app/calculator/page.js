"use client";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ParticleField from "../components/ParticleField";
import { Calculator, Zap, DollarSign, Clock, Layers, ArrowRight, ShieldCheck, Copy, Check } from "lucide-react";
import { trackEvent } from "../lib/analytics";

function WhatsAppIcon({ className = "w-4 h-4", ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662a11.838 11.838 0 005.711 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}

export default function PublicCalculatorPage() {
  const [sheetCost, setSheetCost] = useState("12.00");
  const [sheetWidth, setSheetWidth] = useState("600");
  const [sheetHeight, setSheetHeight] = useState("400");
  const [partWidth, setPartWidth] = useState("200");
  const [partHeight, setPartHeight] = useState("150");
  const [laserTime, setLaserTime] = useState("12");
  const [hourlyRate, setHourlyRate] = useState("25.00");
  const [machineWearRate, setMachineWearRate] = useState("10.00");
  const [profitMargin, setProfitMargin] = useState("35");
  const [quantity, setQuantity] = useState("1");
  const [copiedQuote, setCopiedQuote] = useState(false);

  // Calculation Logic
  const sc = parseFloat(sheetCost) || 0;
  const sw = parseFloat(sheetWidth) || 1;
  const sh = parseFloat(sheetHeight) || 1;
  const pw = parseFloat(partWidth) || 1;
  const ph = parseFloat(partHeight) || 1;
  const lt = parseFloat(laserTime) || 0;
  const hr = parseFloat(hourlyRate) || 0;
  const mw = parseFloat(machineWearRate) || 0;
  const pm = parseFloat(profitMargin) || 0;
  const qty = parseFloat(quantity) || 1;

  // Sheet Area Calculation
  const sheetAreaSqMm = sw * sh;
  const partAreaSqMm = pw * ph;
  const materialCostPerPart = sheetAreaSqMm > 0 ? (partAreaSqMm / sheetAreaSqMm) * sc : 0;
  
  // Laser Time Cost (Time in hours)
  const timeInHours = lt / 60;
  const machineCostPerPart = timeInHours * (hr + mw);
  
  const unitProductionCost = materialCostPerPart + machineCostPerPart;
  const totalProductionCost = unitProductionCost * qty;
  
  // Recommended Selling Price with Margin
  const unitSellingPrice = pm < 100 ? unitProductionCost / (1 - pm / 100) : unitProductionCost * 1.5;
  const totalSellingPrice = unitSellingPrice * qty;
  const totalProfit = totalSellingPrice - totalProductionCost;

  const handleCopyQuote = () => {
    const text = `📋 *Laser Cutting Job Quote*\n` +
      `• Part Size: ${pw} × ${ph} mm (Qty: ${qty})\n` +
      `• Unit Price: $${unitSellingPrice.toFixed(2)}\n` +
      `• Total Estimate: $${totalSellingPrice.toFixed(2)}\n\n` +
      `Calculated via 0Machine Laser Workshop (https://0machine.com)`;
    navigator.clipboard.writeText(text);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2500);
  };

  const handleWhatsAppQuote = () => {
    const text = `📋 *Laser Cutting Job Quote*\n` +
      `• Part Size: ${pw} × ${ph} mm (Qty: ${qty})\n` +
      `• Unit Price: $${unitSellingPrice.toFixed(2)}\n` +
      `• Total Estimate: $${totalSellingPrice.toFixed(2)}\n\n` +
      `Calculated via 0Machine Laser Workshop (https://0machine.com)`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const applyMaterialPreset = (cost, w, h) => {
    setSheetCost(cost);
    setSheetWidth(w);
    setSheetHeight(h);
  };

  return (
    <>
      <ParticleField />
      <Navbar />

      <main className="min-h-screen pt-32 pb-24 relative z-10 bg-dark-950 text-gray-300">
        <div className="max-w-6xl mx-auto px-6">
          
          {/* Page Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 text-xs text-accent-400 font-semibold uppercase tracking-widest bg-accent-500/10 px-4 py-1.5 rounded-full border border-accent-500/20 mb-4">
              <Calculator size={14} />
              <span>Free Online Tool</span>
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-[Outfit] text-white mb-4">
              Free Laser Cut <span className="gradient-text-accent">Cost & Quote Calculator</span>
            </h1>
            <p className="text-gray-400 text-base sm:text-lg">
              Calculate exact material costs, machine wear, labor, and profit margins for your laser & CNC cutting projects in seconds.
            </p>
          </div>

          {/* Calculator Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Input Form Column (7 cols) */}
            <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
              
              <div className="border-b border-white/10 pb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white font-[Outfit] flex items-center gap-2">
                  <Layers size={18} className="text-accent-400" />
                  <span>1. Material & Sheet Dimensions</span>
                </h3>
                <span className="text-xs text-gray-500">Metric (mm / $)</span>
              </div>

              {/* Material Quick Presets */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">POPULAR SHEET PRESETS</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => applyMaterialPreset("12.00", "600", "400")}
                    className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-all text-center"
                  >
                    3mm Birch<br /><span className="text-gray-500 text-[10px]">600×400 · $12</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => applyMaterialPreset("24.00", "600", "400")}
                    className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-all text-center"
                  >
                    3mm Acrylic<br /><span className="text-gray-500 text-[10px]">600×400 · $24</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => applyMaterialPreset("18.00", "800", "600")}
                    className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-all text-center"
                  >
                    5mm MDF<br /><span className="text-gray-500 text-[10px]">800×600 · $18</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Sheet Cost ($)</label>
                  <input
                    type="number"
                    value={sheetCost}
                    onChange={(e) => setSheetCost(e.target.value)}
                    className="w-full bg-dark-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-accent-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Sheet Width (mm)</label>
                  <input
                    type="number"
                    value={sheetWidth}
                    onChange={(e) => setSheetWidth(e.target.value)}
                    className="w-full bg-dark-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-accent-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Sheet Height (mm)</label>
                  <input
                    type="number"
                    value={sheetHeight}
                    onChange={(e) => setSheetHeight(e.target.value)}
                    className="w-full bg-dark-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-accent-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Part Width (mm)</label>
                  <input
                    type="number"
                    value={partWidth}
                    onChange={(e) => setPartWidth(e.target.value)}
                    className="w-full bg-dark-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-accent-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Part Height (mm)</label>
                  <input
                    type="number"
                    value={partHeight}
                    onChange={(e) => setPartHeight(e.target.value)}
                    className="w-full bg-dark-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-accent-500 font-mono"
                  />
                </div>
              </div>

              <div className="border-b border-white/10 pt-4 pb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white font-[Outfit] flex items-center gap-2">
                  <Clock size={18} className="text-blue-400" />
                  <span>2. Laser Cutting Time & Labor</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Laser Time (minutes)</label>
                  <input
                    type="number"
                    value={laserTime}
                    onChange={(e) => setLaserTime(e.target.value)}
                    className="w-full bg-dark-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-accent-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Labor Rate ($/hr)</label>
                  <input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    className="w-full bg-dark-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-accent-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Machine Wear ($/hr)</label>
                  <input
                    type="number"
                    value={machineWearRate}
                    onChange={(e) => setMachineWearRate(e.target.value)}
                    className="w-full bg-dark-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-accent-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Target Profit Margin (%)</label>
                  <input
                    type="number"
                    value={profitMargin}
                    onChange={(e) => setProfitMargin(e.target.value)}
                    className="w-full bg-dark-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-accent-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Order Quantity</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-dark-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-accent-500 font-mono"
                  />
                </div>
              </div>

            </div>

            {/* Results Output Column (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-gradient-to-b from-dark-900 to-dark-950 border border-accent-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                <div className="text-xs font-bold text-accent-400 uppercase tracking-widest mb-1">Instant Cost Breakdown</div>
                
                <div className="my-6 space-y-3 text-xs border-b border-white/10 pb-6">
                  <div className="flex justify-between items-center text-gray-300">
                    <span>Material Cost per Unit:</span>
                    <span className="font-mono text-white font-semibold">${materialCostPerPart.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-300">
                    <span>Machine & Time Cost:</span>
                    <span className="font-mono text-white font-semibold">${machineCostPerPart.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-300 pt-2 border-t border-white/5">
                    <span className="font-semibold text-gray-200">Total Production Cost:</span>
                    <span className="font-mono text-white font-bold">${totalProductionCost.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-xs text-gray-400 block mb-1 font-semibold">Recommended Quote Price ({profitMargin}% Margin)</span>
                  <div className="text-4xl font-black text-accent-400 font-[Outfit]">
                    ${totalSellingPrice.toFixed(2)}
                  </div>
                  <div className="text-xs text-green-400 font-semibold mt-1">
                    Est. Profit: +${totalProfit.toFixed(2)} (${unitSellingPrice.toFixed(2)} / unit)
                  </div>
                </div>

                {/* WhatsApp & Copy Quote Buttons */}
                <div className="space-y-2 mb-4">
                  <button
                    type="button"
                    onClick={handleWhatsAppQuote}
                    className="w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-black shadow-lg shadow-[#25D366]/25 border border-[#25D366]"
                  >
                    <WhatsAppIcon className="w-4 h-4 fill-current" />
                    <span>Send Quote via WhatsApp (1-Click)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyQuote}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 border ${
                      copiedQuote
                        ? "bg-[#10B981] text-white border-[#10B981] shadow-lg shadow-[#10B981]/25"
                        : "bg-white/10 hover:bg-white/15 text-gray-300 hover:text-white border-white/15 hover:border-white/25"
                    }`}
                  >
                    {copiedQuote ? (
                      <>
                        <Check size={14} />
                        <span>Quote Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Copy Quote for WhatsApp / Email</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Signup Conversion Call to Action */}
                <div className="bg-accent-500/10 border border-accent-500/20 rounded-xl p-4 mt-6">
                  <div className="flex items-center gap-2 text-white font-bold text-sm mb-1">
                    <Zap size={16} className="text-accent-400" />
                    <span>Save This Calculation for Free</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-4">
                    Create a free account to save project quotes, track material inventory, and access unlimited vector templates.
                  </p>
                  
                  <a
                    href="https://app.0machine.com"
                    onClick={() => trackEvent('cta_click', { button: 'public_calculator_signup' })}
                    className="glow-btn text-xs py-3 w-full flex items-center justify-center gap-2 text-center"
                  >
                    <span>Start Free Forever</span>
                    <ArrowRight size={14} />
                  </a>
                </div>

              </div>

              <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-xs text-gray-400 flex items-center gap-3">
                <ShieldCheck size={20} className="text-green-400 shrink-0" />
                <span>No credit card required. Free forever account with unlimited project estimates.</span>
              </div>

            </div>

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
