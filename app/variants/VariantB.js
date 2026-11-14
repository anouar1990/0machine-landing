"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useExperiment } from "../context/ExperimentContext";
import {
  LayoutDashboard, Layers, Calculator, Package, Calendar, Clock,
  Sparkles, CheckCircle2, Zap, TrendingUp, ShieldCheck, ArrowRight,
  FileText, Check, Users, Smartphone, MessageSquare, AlertTriangle,
  Flame, Sliders, ChevronRight
} from "lucide-react";
import dynamic from "next/dynamic";
const Pricing = dynamic(() => import("../components/Pricing"), { ssr: true });

export default function VariantB() {
  const { buildAppUrl, handleCtaClick } = useExperiment();
  const [activeTab, setActiveTab] = useState("pipeline");

  const workshopTools = [
    {
      id: "projects",
      name: "Project Management",
      icon: LayoutDashboard,
      desc: "Track client files, kerf settings, and design specifications without lost sticky notes.",
      stat: "100% Traceability",
    },
    {
      id: "crm",
      name: "Customer CRM",
      icon: Users,
      desc: "Full client order history, contact details, balance dues, and lifetime value in one click.",
      stat: "Zero Lost Clients",
    },
    {
      id: "pipeline",
      name: "Orders & Production Queue",
      icon: Layers,
      desc: "Live Kanban queue synced between front desk intake and workshop laser operators.",
      stat: "Live Workshop Sync",
    },
    {
      id: "inventory",
      name: "Material & Off-Cut Inventory",
      icon: Package,
      desc: "Track full birch, acrylic, and steel sheets plus remnant scrap off-cuts with reorder alerts.",
      stat: "Zero Scrap Waste",
    },
    {
      id: "calculator",
      name: "Smart Cost Calculator",
      icon: Calculator,
      desc: "Exact cutting time, pierce count, gas usage, wear depreciation, and guaranteed markup.",
      stat: "100% Pierce Math",
    },
    {
      id: "quotes",
      name: "1-Click WhatsApp Quotes",
      icon: MessageSquare,
      desc: "Generate professional branded PDF quotes and send directly to clients via WhatsApp in 30 seconds.",
      stat: "30s Dispatch",
    },
    {
      id: "calendar",
      name: "Calendar & Deadlines",
      icon: Calendar,
      desc: "Visual schedule of rush orders, laser maintenance slots, and promised customer pickup dates.",
      stat: "99% On-Time Delivery",
    },
    {
      id: "timers",
      name: "Live Cutting Timers",
      icon: Clock,
      desc: "Log exact machine run time per tube so you bill every second of laser beam operation.",
      stat: "Accurate Labor Logs",
    },
    {
      id: "presets",
      name: "Machine Parameters Vault",
      icon: Sliders,
      desc: "Speed, power, Hz, and focus presets stored for CO2, Fiber, and Diode tubes across all materials.",
      stat: "Zero Ruined Test Cuts",
    },
  ];

  const toolsComparison = [
    { category: "Client Quotes", before: "Excel + manual WhatsApp typing", after: "1-Click Branded PDF via WhatsApp" },
    { category: "Job Costing", before: "Guesswork per inch or gut feel", after: "Pierce + run-speed + gas + wear math" },
    { category: "Scrap & Sheets", before: "Forgotten off-cuts in wood racks", after: "Live inventory & off-cut barcode tracking" },
    { category: "Shop Production", before: "Paper job tickets & lost emails", after: "Synced digital Kanban for all makers" },
    { category: "Client Invoicing", before: "Word templates + late bank checks", after: "Integrated PDF invoices + instant payment links" },
  ];

  return (
    <div className="relative text-white overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-24 sm:pt-40 sm:pb-32 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6"
          >
            <Sparkles size={14} className="text-emerald-400" />
            <span>The Complete Laser & CNC Workshop Operating System</span>
          </motion.div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-[Outfit] text-white tracking-tight max-w-5xl mx-auto leading-[1.1] mb-6">
            Run Your Entire Laser &amp; CNC Workshop{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-accent-400 bg-clip-text text-transparent">
              in One Place.
            </span>
          </h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg sm:text-2xl text-gray-300 max-w-3xl mx-auto font-normal leading-relaxed mb-10"
          >
            Stop Managing Your Workshop With 10 Different Tools. Everything You Need in One Unified Platform.
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
                handleCtaClick("variant_b_hero_primary", buildAppUrl());
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-extrabold text-base bg-emerald-500 hover:bg-emerald-400 text-black shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Start Running Your Workshop Free</span>
              <ArrowRight size={18} />
            </a>

            <a
              href="#workshop-tools"
              className="w-full sm:w-auto px-7 py-4 rounded-xl font-bold text-sm bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Explore All 9 Workshop Tools</span>
              <span className="text-gray-400">↓</span>
            </a>
          </motion.div>

          {/* Telemetry pill badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400 mb-16">
            <span className="flex items-center gap-1.5 text-gray-300">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>Full Job Costing</span>
            </span>
            <span className="flex items-center gap-1.5 text-gray-300">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>1-Click WhatsApp Quotes</span>
            </span>
            <span className="flex items-center gap-1.5 text-gray-300">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>Sheet Stock &amp; Off-Cuts</span>
            </span>
            <span className="flex items-center gap-1.5 text-gray-300">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>Live Machine Timers</span>
            </span>
          </div>

          {/* Desktop Dashboard Mockup */}
          <div
            className="relative max-w-5xl mx-auto rounded-2xl border border-white/15 bg-dark-950 p-2 shadow-2xl shadow-emerald-500/10"
          >
            <div className="rounded-xl overflow-hidden border border-white/10 bg-dark-900">
              {/* Chrome bar */}
              <div className="px-4 py-2.5 bg-dark-950 border-b border-white/10 flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                  <span className="ml-2 font-mono text-[11px] text-gray-400 hidden sm:inline">
                    0Machine Workshop OS · Live Atelier Control Center
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px] bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>ALL SYSTEMS ONLINE</span>
                </div>
              </div>

              {/* Real screenshot */}
              <img
                src="/screenshots/screenshot-dashboard.webp"
                alt="0Machine Workshop Operating System Dashboard"
                width={1600}
                height={1000}
                fetchPriority="high"
                decoding="async"
                className="w-full h-auto object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>

      {/* THE 10-TOOL PROBLEM VS THE 0MACHINE SOLUTION */}
      <section className="py-24 bg-dark-900/60 border-y border-white/5 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Why Workshops Switch
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-[Outfit] text-white mt-3 mb-4">
              Stop Juggling 10 Disconnected Tools
            </h2>
            <p className="text-gray-300 text-base sm:text-lg">
              Most laser and CNC makers waste 8+ hours a week copying data between WhatsApp, Excel, messy paper notes, and folders.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* The Old Way */}
            <div className="rounded-2xl border border-red-500/20 bg-red-950/10 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 text-red-400 font-bold text-sm mb-4">
                  <AlertTriangle size={18} />
                  <span>THE OLD CHAOTIC WAY (10 TOOLS)</span>
                </div>
                <ul className="space-y-4 text-sm text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 font-bold">✕</span>
                    <span>Spreadsheets that crash or get accidentally overwritten</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 font-bold">✕</span>
                    <span>Client quotes typed manually inside WhatsApp chats</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 font-bold">✕</span>
                    <span>Forgotten off-cuts in scrap bins that never get re-used</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 font-bold">✕</span>
                    <span>Paper job tickets lost between front desk and machine operators</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 font-bold">✕</span>
                    <span>Unbilled pierce time and assist gas eating away profit margins</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-red-500/20 text-xs text-red-300 font-mono">
                Result: 8+ hours wasted/week &amp; 30% lost profits
              </div>
            </div>

            {/* The 0Machine Way */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/15 p-6 sm:p-8 flex flex-col justify-between relative shadow-xl shadow-emerald-500/5">
              <div className="absolute top-4 right-4 bg-emerald-500 text-black text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full">
                Unified OS
              </div>
              <div>
                <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm mb-4">
                  <CheckCircle2 size={18} />
                  <span>THE 0MACHINE WORKSHOP OS</span>
                </div>
                <ul className="space-y-4 text-sm text-gray-200">
                  <li className="flex items-start gap-3">
                    <Check size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>1-Click WhatsApp Client Quotes:</strong> Send branded PDFs with instant client approval.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Live Sheet &amp; Off-Cut Tracker:</strong> Auto-deduct sheets &amp; log scrap remnants for re-nesting.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Exact Kerf &amp; Pierce Math:</strong> Know true laser cutting time and cost down to the penny.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Workshop Kanban Pipeline:</strong> Front desk and machine operators always in sync.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Machine Profiles &amp; Presets:</strong> Speed/power lookup for CO2, Fiber &amp; Diode tubes.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-emerald-500/20 text-xs text-emerald-300 font-mono flex items-center justify-between">
                <span>Result: Run like a pro factory on autopilot</span>
                <span className="font-bold text-white">Save 8h/week</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE 9 CORE WORKSHOP ENGINES */}
      <section id="workshop-tools" className="py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Full Feature Tour
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-[Outfit] text-white mt-3 mb-4">
              9 Specialized Tools. One Clean Interface.
            </h2>
            <p className="text-gray-300 text-base sm:text-lg">
              Designed specifically around how laser and CNC cutting businesses intake, price, cut, and invoice jobs.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {workshopTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] p-6 transition-all hover:border-emerald-500/40 group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                      <Icon size={22} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed mb-6">
                      {tool.desc}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                    <span className="text-emerald-400 font-semibold">{tool.stat}</span>
                    <span className="text-gray-500 group-hover:text-white transition-colors">Included Free →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WORKFLOW WALKTHROUGH */}
      <section className="py-24 bg-dark-900/80 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black font-[Outfit] text-white">
              The 4-Step Workshop Flow
            </h2>
            <p className="text-gray-400 text-sm mt-2">How 0Machine handles your jobs from intake to cash in bank</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Client Intake & Quote", desc: "Calculate exact cost & kerf, then send a branded PDF quote to client on WhatsApp in 30 seconds." },
              { step: "02", title: "Material Deduction", desc: "Select 3mm birch or 6mm acrylic sheet from inventory; off-cut scrap remnants logged automatically." },
              { step: "03", title: "Laser Cut & Timer", desc: "Operator pulls tested speed/power preset, runs laser, and logs actual cut time in live shop Kanban." },
              { step: "04", title: "Invoice & Payment", desc: "Convert accepted quote to final invoice with bank QR code or payment link with 1 tap." },
            ].map((s) => (
              <div key={s.step} className="rounded-xl border border-white/10 bg-dark-950 p-6 relative">
                <span className="text-3xl font-black text-emerald-400/40 font-mono block mb-2">{s.step}</span>
                <h3 className="font-bold text-white text-base mb-2">{s.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <a
              href={buildAppUrl()}
              onClick={(e) => {
                e.preventDefault();
                handleCtaClick("variant_b_mid_cta", buildAppUrl());
              }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <span>Test The Entire Workshop OS Free</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <Pricing />

      {/* FINAL CALL TO ACTION */}
      <section className="py-24 text-center relative overflow-hidden bg-gradient-to-b from-dark-950 to-emerald-950/20 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-5xl font-black font-[Outfit] text-white tracking-tight mb-4">
            Ready to Run Your Entire Workshop Like a Pro?
          </h2>
          <p className="text-gray-300 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            Join hundreds of laser and CNC makers who replaced 10 messy tools with 0Machine. Set up takes less than 3 minutes.
          </p>
          <a
            href={buildAppUrl()}
            onClick={(e) => {
              e.preventDefault();
              handleCtaClick("variant_b_final_cta", buildAppUrl());
            }}
            className="inline-flex items-center gap-2 px-10 py-5 rounded-xl font-extrabold text-base bg-emerald-500 hover:bg-emerald-400 text-black shadow-2xl shadow-emerald-500/30 transition-all transform hover:-translate-y-1 cursor-pointer"
          >
            <span>Start Free Workshop Account</span>
            <ArrowRight size={18} />
          </a>
          <p className="text-xs text-gray-400 mt-3">Free forever tier available · No credit card required</p>
        </div>
      </section>
    </div>
  );
}

