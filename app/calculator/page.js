"use client";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ParticleField from "../components/ParticleField";
import { Calculator, Zap, DollarSign, Clock, Layers, ArrowRight, ShieldCheck } from "lucide-react";
import { trackEvent } from "../lib/analytics";

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

                {/* Signup Conversion Call to Action */}
                <div className="bg-accent-500/10 border border-accent-500/20 rounded-xl p-4 mt-6">
                  <div className="flex items-center gap-2 text-white font-bold text-sm mb-1">
                    <Zap size={16} className="text-accent-400" />
                    <span>Save This Calculation for Free</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-4">
                    Create a free account to save project quotes, track material inventory, and access 500+ vector templates.
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
