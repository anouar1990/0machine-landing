"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useExperiment } from "../context/ExperimentContext";
import {
  TrendingUp, DollarSign, Calculator, Package, Grid, CheckCircle2,
  ArrowRight, ShieldCheck, Zap, AlertTriangle, Flame, Layers, Percent, Sparkles, Check
} from "lucide-react";
import Pricing from "../components/Pricing";

export default function VariantC() {
  const { buildAppUrl, handleCtaClick } = useExperiment();
  const [sheetsPerMonth, setSheetsPerMonth] = useState(40);
  const [sheetPrice, setSheetPrice] = useState(25); // average $25 per sheet of birch / acrylic

  // ROI math
  // Average scrap waste without nesting: ~35%. With 0Machine True-Shape ClipperLib: ~15% (20% net material saved)
  const monthlyMaterialSpent = sheetsPerMonth * sheetPrice;
  const materialSaved = monthlyMaterialSpent * 0.22;
  const unbilledTimeRecovered = sheetsPerMonth * 12; // ~$12 in unbilled pierce/gas/depreciation per sheet
  const totalMonthlyGain = materialSaved + unbilledTimeRecovered;
  const annualGain = totalMonthlyGain * 12;

  const profitPillars = [
    {
      title: "True-Shape Sheet Nesting",
      headline: "30% to 40% Less Scrap Waste",
      desc: "Our ClipperLib polygon engine packs irregular vectors tightly on full sheets and remnant off-cuts. Don't leave money in the scrap bin.",
      metric: "Save ~2-3 sheets in every 10",
      icon: Grid,
      color: "from-amber-500 to-orange-500",
    },
    {
      title: "Piercing & Assist Gas Math",
      headline: "Stop Working for Free on Pierces",
      desc: "Every pierce burns tube life, electricity, and O2/N2 assist gas. 0Machine computes exact pierce time and consumables so you bill for every second.",
      metric: "100% Consumables Billed",
      icon: Flame,
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Remnant Scrap Inventory",
      headline: "Turn Dead Off-Cuts into Cash",
      desc: "Off-cut pieces are cataloged with exact dimensions. Before pulling a fresh $30 sheet, the system alerts you to use existing off-cuts first.",
      metric: "Zero Forgotten Off-Cuts",
      icon: Package,
      color: "from-yellow-500 to-amber-500",
    },
    {
      title: "Guaranteed Profit Margin",
      headline: "Price Every Quote with Precision",
      desc: "Set your target margin (e.g. 35% or 50%). The calculator factors material cost, cutting speed, labor, and machine depreciation to output the exact profitable price.",
      metric: "Never Under-Price a Job",
      icon: TrendingUp,
      color: "from-emerald-500 to-teal-500",
    },
  ];

  return (
    <div className="relative text-white overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-24 sm:pt-40 sm:pb-32 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-6"
          >
            <DollarSign size={14} className="text-amber-400" />
            <span>Laser &amp; CNC Financial Efficiency &amp; Material Protection</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black font-[Outfit] text-white tracking-tight max-w-5xl mx-auto leading-[1.1] mb-6"
          >
            Stop Wasting Material.{" "}
            <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-yellow-300 bg-clip-text text-transparent">
              Start Making More Profit.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg sm:text-2xl text-gray-300 max-w-3xl mx-auto font-normal leading-relaxed mb-10"
          >
            Know Your Costs, Price Every Project Correctly, and Keep More Profit in Your Pocket.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
          >
            <a
              href={buildAppUrl()}
              onClick={(e) => {
                e.preventDefault();
                handleCtaClick("variant_c_hero_primary", buildAppUrl());
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-extrabold text-base bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Stop Waste &amp; Calculate Profit Free</span>
              <ArrowRight size={18} />
            </a>

            <a
              href="/calculator"
              className="w-full sm:w-auto px-7 py-4 rounded-xl font-bold text-sm bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Try Live Cost Calculator</span>
              <span className="text-gray-400">→</span>
            </a>
          </motion.div>

          {/* ROI Metric Pills */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16 text-left">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <span className="text-xs text-gray-400 block font-semibold mb-1">Scrap Reduction</span>
              <span className="text-2xl sm:text-3xl font-black text-amber-400 font-[Outfit]">30% - 40%</span>
              <span className="text-[11px] text-gray-400 block mt-1">ClipperLib true-shape nesting</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <span className="text-xs text-gray-400 block font-semibold mb-1">Pierce &amp; Run Accuracy</span>
              <span className="text-2xl sm:text-3xl font-black text-white font-[Outfit]">100% Math</span>
              <span className="text-[11px] text-gray-400 block mt-1">Gas, power &amp; tube wear</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <span className="text-xs text-gray-400 block font-semibold mb-1">Average Monthly Gain</span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-[Outfit]">+$840 / mo</span>
              <span className="text-[11px] text-gray-400 block mt-1">Recovered from waste</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <span className="text-xs text-gray-400 block font-semibold mb-1">Payback Period</span>
              <span className="text-2xl sm:text-3xl font-black text-white font-[Outfit]">Day 1</span>
              <span className="text-[11px] text-gray-400 block mt-1">Pays for itself on 1st sheet</span>
            </div>
          </div>

          {/* Visual Showcase: Nesting & Cost Engine */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative max-w-5xl mx-auto rounded-2xl border border-white/15 bg-dark-950 p-2 shadow-2xl shadow-amber-500/10"
          >
            <div className="rounded-xl overflow-hidden border border-white/10 bg-dark-900">
              <div className="px-4 py-2.5 bg-dark-950 border-b border-white/10 flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                  <span className="ml-2 font-mono text-[11px] text-gray-400 hidden sm:inline">
                    True-Shape Nesting Engine · Sheet Yield Optimization (92.4% Sheet Packing)
                  </span>
                </div>
                <span className="text-amber-400 font-mono text-[11px] font-bold">
                  ⚡ 38.6% LESS SCRAP
                </span>
              </div>
              <img
                src="/screenshots/screenshot-nesting-yield.png"
                alt="0Machine Laser True Shape Nesting Yield with Kerf Compensation"
                className="w-full h-auto object-cover object-top"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* INTERACTIVE WORKSHOP PROFIT RECOVERY CALCULATOR */}
      <section className="py-24 bg-dark-900/60 border-y border-white/5 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Interactive ROI Estimator
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-[Outfit] text-white mt-3 mb-3">
              Calculate How Much Profit You Are Losing Each Month
            </h2>
            <p className="text-gray-300 text-sm sm:text-base">
              Slide to match your monthly laser or CNC production volume and see your estimated recovered cash.
            </p>
          </div>

          <div className="rounded-2xl border border-white/15 bg-dark-950 p-6 sm:p-10 shadow-2xl">
            <div className="grid sm:grid-cols-2 gap-8 mb-10">
              {/* Slider 1: Sheets per month */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs text-gray-400 font-semibold uppercase">Sheets Cut Per Month</label>
                  <span className="text-lg font-black text-amber-400 font-[Outfit]">{sheetsPerMonth} Sheets</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="200"
                  step="5"
                  value={sheetsPerMonth}
                  onChange={(e) => setSheetsPerMonth(parseInt(e.target.value) || 5)}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <span className="text-[11px] text-gray-400 block mt-1">Plywood, acrylic, MDF, or sheet metal</span>
              </div>

              {/* Slider 2: Average Sheet Price */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs text-gray-400 font-semibold uppercase">Average Cost Per Sheet</label>
                  <span className="text-lg font-black text-white font-[Outfit]">${sheetPrice}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={sheetPrice}
                  onChange={(e) => setSheetPrice(parseInt(e.target.value) || 10)}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <span className="text-[11px] text-gray-400 block mt-1">Unit purchase price from your supplier</span>
              </div>
            </div>

            {/* Results Grid */}
            <div className="p-6 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-emerald-500/10 border border-amber-500/20 grid sm:grid-cols-3 gap-6 text-center">
              <div>
                <span className="text-xs text-gray-400 block font-semibold mb-1">Scrap Material Saved</span>
                <span className="text-2xl sm:text-3xl font-black text-amber-400 font-[Outfit]">
                  +${materialSaved.toFixed(0)} <span className="text-xs font-normal text-gray-400">/ mo</span>
                </span>
                <span className="text-[10px] text-gray-400 block mt-0.5">22% tight nesting yield</span>
              </div>

              <div>
                <span className="text-xs text-gray-400 block font-semibold mb-1">Unbilled Pierce &amp; Time</span>
                <span className="text-2xl sm:text-3xl font-black text-orange-400 font-[Outfit]">
                  +${unbilledTimeRecovered.toFixed(0)} <span className="text-xs font-normal text-gray-400">/ mo</span>
                </span>
                <span className="text-[10px] text-gray-400 block mt-0.5">Exact consumables accounted</span>
              </div>

              <div className="sm:border-l sm:border-white/10 sm:pl-6">
                <span className="text-xs text-emerald-400 block font-semibold mb-1">Total Extra Profit</span>
                <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-[Outfit]">
                  +${totalMonthlyGain.toFixed(0)} <span className="text-xs font-normal text-emerald-200">/ mo</span>
                </span>
                <span className="text-[11px] text-emerald-300 font-semibold block mt-0.5">
                  (${annualGain.toLocaleString()}/year back in pocket)
                </span>
              </div>
            </div>

            <div className="mt-8 text-center">
              <a
                href={buildAppUrl()}
                onClick={(e) => {
                  e.preventDefault();
                  handleCtaClick("variant_c_calculator_cta", buildAppUrl(), { estimated_gain: totalMonthlyGain });
                }}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
              >
                <span>Recover This Profit in Your Workshop →</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* THE 4 PROFIT ENGINES */}
      <section className="py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              The 4 Pillars of Profit
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-[Outfit] text-white mt-3 mb-4">
              Where Laser Workshops Lose Money — And How 0Machine Fixes It
            </h2>
            <p className="text-gray-300 text-base sm:text-lg">
              Every feature in 0Machine is engineered around one goal: keeping more margin on every job you cut.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {profitPillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] p-8 transition-all hover:border-amber-500/30 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                        <Icon size={24} />
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                        {p.metric}
                      </span>
                    </div>

                    <span className="text-xs uppercase font-semibold text-gray-400 tracking-wider block mb-1">
                      {p.title}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-3">
                      {p.headline}
                    </h3>
                    <p className="text-sm text-gray-300 leading-relaxed mb-6">
                      {p.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <Check size={14} /> Built into 0Machine Free Tier
                    </span>
                    <span className="text-gray-400 font-mono">100% Automated</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <Pricing />

      {/* FINAL CALL TO ACTION */}
      <section className="py-24 text-center relative overflow-hidden bg-gradient-to-b from-dark-950 to-amber-950/25 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-5xl font-black font-[Outfit] text-white tracking-tight mb-4">
            Stop Leaving Money on the Cutting Bed.
          </h2>
          <p className="text-gray-300 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            Test 0Machine on your next job. Calculate the exact cost, nest your parts tightly, and quote your client with guaranteed margin.
          </p>
          <a
            href={buildAppUrl()}
            onClick={(e) => {
              e.preventDefault();
              handleCtaClick("variant_c_final_cta", buildAppUrl());
            }}
            className="inline-flex items-center gap-2 px-10 py-5 rounded-xl font-extrabold text-base bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black shadow-2xl shadow-amber-500/30 transition-all transform hover:-translate-y-1 cursor-pointer"
          >
            <span>Start Free &amp; Keep More Profit</span>
            <ArrowRight size={18} />
          </a>
          <p className="text-xs text-gray-400 mt-3">Free forever tier · No credit card required · Instant setup</p>
        </div>
      </section>
    </div>
  );
}

