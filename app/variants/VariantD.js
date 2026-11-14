"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useExperiment } from "../context/ExperimentContext";
import {
  Briefcase, TrendingUp, Users, MessageSquare, FileText, CheckCircle2,
  ArrowRight, ShieldCheck, Sparkles, Star, Award, Zap, Clock, Smartphone, Check
} from "lucide-react";
import dynamic from "next/dynamic";
const Pricing = dynamic(() => import("../components/Pricing"), { ssr: true });

export default function VariantD() {
  const { buildAppUrl, handleCtaClick } = useExperiment();

  const businessPillars = [
    {
      title: "1-Click WhatsApp Quotes & Invoices",
      tagline: "Instant First-Impression Professionalism",
      desc: "Stop sending messy text messages with vague prices. Generate branded PDF estimates with line items, VAT, and terms in 30 seconds and send via WhatsApp with 1 tap.",
      icon: MessageSquare,
      badge: "30s Response Time",
    },
    {
      title: "Client CRM & Order History",
      tagline: "Never Forget a Customer Detail",
      desc: "Track client repeat orders, artwork preferences, contact details, and lifetime spending. Turn one-off hobby buyers into reliable corporate B2B clients.",
      icon: Users,
      badge: "Build Client LTV",
    },
    {
      title: "Production Pipeline & Delivery Timers",
      tagline: "99% On-Time Delivery Guarantee",
      desc: "Visual Kanban board tracking jobs from payment to nesting, cutting, packaging, and pickup. Keep clients updated without endless 'is it done yet?' phone calls.",
      icon: Clock,
      badge: "Zero Lost Deadlines",
    },
    {
      title: "Revenue & Cashflow Telemetry",
      tagline: "Know Your Numbers Like a CEO",
      desc: "Real-time dashboard of pending balances, collected revenue, profit margins per job, and material stock valuation. No more guessing if you had a profitable month.",
      icon: TrendingUp,
      badge: "Full Financial Clarity",
    },
  ];

  const growthStages = [
    {
      stage: "Stage 01: The Hobbyist Maker",
      status: "Before 0Machine",
      desc: "Scribbling prices on scrap paper, chaotic DMs, guessing margins, losing client orders, working nights without tracking hourly pay.",
      color: "border-red-500/20 bg-red-950/10 text-red-300",
    },
    {
      stage: "Stage 02: Organized Professional",
      status: "First 30 Days",
      desc: "Branded PDF quotes, 1-click WhatsApp dispatch, accurate kerf & cost math, zero forgotten off-cuts, 100% on-time delivery.",
      color: "border-purple-500/30 bg-purple-950/15 text-purple-200",
    },
    {
      stage: "Stage 03: Scaled Laser Business",
      status: "90+ Days with 0Machine",
      desc: "High-margin B2B clients, automated reorders, synchronized multi-maker team, predictable monthly recurring profit.",
      color: "border-emerald-500/40 bg-emerald-950/20 text-emerald-200",
    },
  ];

  return (
    <div className="relative text-white overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-24 sm:pt-40 sm:pb-32 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-6"
          >
            <Briefcase size={14} className="text-purple-400" />
            <span>Maker-to-Business Growth Platform</span>
          </motion.div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-[Outfit] text-white tracking-tight max-w-5xl mx-auto leading-[1.1] mb-6">
            Turn Your Laser Workshop{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-300 to-accent-400 bg-clip-text text-transparent">
              Into a Real Business.
            </span>
          </h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg sm:text-2xl text-gray-300 max-w-3xl mx-auto font-normal leading-relaxed mb-10"
          >
            Look More Professional, Win More Customers, and Grow Your Workshop Business.
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
                handleCtaClick("variant_d_hero_primary", buildAppUrl());
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-extrabold text-base bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white shadow-xl shadow-purple-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Build a Professional Workshop Free</span>
              <ArrowRight size={18} />
            </a>

            <a
              href="#comparison"
              className="w-full sm:w-auto px-7 py-4 rounded-xl font-bold text-sm bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <span>See The Client Experience</span>
              <span className="text-gray-400">↓</span>
            </a>
          </motion.div>

          {/* Trust Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400 mb-16">
            <span className="flex items-center gap-1.5 text-gray-300">
              <Star size={14} className="text-amber-400 fill-amber-400" />
              <span>Commands Higher Client Prices</span>
            </span>
            <span className="flex items-center gap-1.5 text-gray-300">
              <CheckCircle2 size={14} className="text-purple-400" />
              <span>Branded PDF Quotes &amp; WhatsApp</span>
            </span>
            <span className="flex items-center gap-1.5 text-gray-300">
              <ShieldCheck size={14} className="text-blue-400" />
              <span>Client Ledger &amp; CRM</span>
            </span>
            <span className="flex items-center gap-1.5 text-gray-300">
              <Award size={14} className="text-emerald-400" />
              <span>Win Corporate B2B Contracts</span>
            </span>
          </div>

          {/* Side by Side Visual Comparison */}
          <motion.div
            id="comparison"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 text-left"
          >
            {/* The Amateur Experience */}
            <div className="rounded-2xl border border-red-500/20 bg-dark-950 p-6 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 bg-red-500/10 px-2.5 py-0.5 rounded-full border border-red-500/20 inline-block mb-3">
                  How Amateurs Quote
                </span>
                <h3 className="text-lg font-bold text-white mb-2">Unprofessional Text Message</h3>
                <div className="bg-dark-900 border border-white/5 rounded-xl p-4 font-sans text-xs text-gray-300 space-y-2 mb-4">
                  <div className="text-gray-400 text-[10px]">WhatsApp Message · Yesterday 8:43 PM</div>
                  <p className="italic text-gray-300">&quot;Hey man, I think for that 500x300 wooden sign it will probably be around $60 or maybe $70, depending on the wood I have. Can you send half on PayPal?&quot;</p>
                </div>
                <ul className="space-y-2 text-xs text-gray-400">
                  <li className="flex items-center gap-2 text-red-400">
                    <span>✕</span> <span>Client haggles and negotiates the price down</span>
                  </li>
                  <li className="flex items-center gap-2 text-red-400">
                    <span>✕</span> <span>No line items, no formal terms, no professional proof</span>
                  </li>
                  <li className="flex items-center gap-2 text-red-400">
                    <span>✕</span> <span>Corporate clients cannot submit text DMs for accounting</span>
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-white/5 text-[11px] text-red-400 font-mono mt-4">
                Outcome: Lost clients or squeezed profit margins
              </div>
            </div>

            {/* The 0Machine Professional Experience */}
            <div className="rounded-2xl border border-purple-500/40 bg-gradient-to-b from-purple-950/20 to-dark-950 p-6 flex flex-col justify-between shadow-xl shadow-purple-500/10">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-purple-300 bg-purple-500/20 px-2.5 py-0.5 rounded-full border border-purple-500/30 inline-block mb-3">
                  The 0Machine Way
                </span>
                <h3 className="text-lg font-bold text-white mb-2">Instant Branded PDF Quote + WhatsApp</h3>
                <div className="bg-dark-900 border border-purple-500/20 rounded-xl p-4 font-sans text-xs text-gray-200 space-y-2 mb-4">
                  <div className="flex justify-between items-center text-[10px] text-purple-300">
                    <span className="font-bold">📋 QUOTE #QT-1042</span>
                    <span>1-Click WhatsApp Ready</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Custom Birch Sign (500×300mm) ×1</span>
                      <span className="font-mono font-bold text-white">$85.00</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-gray-400">
                      <span>Laser Cutting, Dual Pass &amp; Clean Kerf Finish</span>
                      <span>Included</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-white/10 flex justify-between items-center font-bold text-purple-300 text-xs">
                    <span>Total Estimate (Deposit 50%):</span>
                    <span className="text-sm text-white">$85.00</span>
                  </div>
                </div>
                <ul className="space-y-2 text-xs text-gray-300">
                  <li className="flex items-center gap-2 text-emerald-400">
                    <Check size={14} /> <span>Clients approve immediately without price haggling</span>
                  </li>
                  <li className="flex items-center gap-2 text-emerald-400">
                    <Check size={14} /> <span>Accepted by schools, restaurants, architects &amp; B2B</span>
                  </li>
                  <li className="flex items-center gap-2 text-emerald-400">
                    <Check size={14} /> <span>Send via WhatsApp in 30 seconds from your phone</span>
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-purple-500/20 text-[11px] text-purple-300 font-mono mt-4 flex items-center justify-between">
                <span>Outcome: Higher prices &amp; repeat contracts</span>
                <span className="font-bold text-emerald-400">+35% Higher Close Rate</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* THE 4 PILLARS OF A REAL BUSINESS */}
      <section className="py-24 bg-dark-900/60 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-widest text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
              The Professional Infrastructure
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-[Outfit] text-white mt-3 mb-4">
              Everything You Need to Look and Run Like a Studio
            </h2>
            <p className="text-gray-300 text-base sm:text-lg">
              When your operations are organized, customers respect your time, pay your deposits without friction, and return every month.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            {businessPillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] p-8 transition-all hover:border-purple-500/40 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Icon size={24} />
                      </div>
                      <span className="text-xs font-mono font-bold text-purple-300 bg-purple-500/15 px-3 py-1 rounded-full border border-purple-500/25">
                        {p.badge}
                      </span>
                    </div>

                    <span className="text-xs uppercase font-bold text-gray-400 tracking-wider block mb-1">
                      {p.tagline}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-sm text-gray-300 leading-relaxed mb-6">
                      {p.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-400 font-mono">
                    <span className="text-purple-400 font-semibold">Included in Free Forever</span>
                    <span>Ready in 1 tap →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* MAKER TO BUSINESS GROWTH ROADMAP */}
      <section className="py-24 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black font-[Outfit] text-white">
              The 3-Stage Laser Business Transformation
            </h2>
            <p className="text-gray-400 text-sm mt-2">Where are you today, and where will 0Machine take your shop?</p>
          </div>

          <div className="space-y-6">
            {growthStages.map((stage, i) => (
              <div key={i} className={`rounded-2xl border p-6 sm:p-8 ${stage.color}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <h3 className="text-xl font-bold text-white">{stage.stage}</h3>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 w-fit">
                    {stage.status}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{stage.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <a
              href={buildAppUrl()}
              onClick={(e) => {
                e.preventDefault();
                handleCtaClick("variant_d_mid_cta", buildAppUrl());
              }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white shadow-lg shadow-purple-500/25 transition-all cursor-pointer"
            >
              <span>Step Up to a Real Business — Free</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <Pricing />

      {/* FINAL CALL TO ACTION */}
      <section className="py-24 text-center relative overflow-hidden bg-gradient-to-b from-dark-950 to-purple-950/25 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-5xl font-black font-[Outfit] text-white tracking-tight mb-4">
            Start Winning Better Clients Today.
          </h2>
          <p className="text-gray-300 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            Give your clients a polished, professional experience from quote to invoice. Free forever tier available with zero setup friction.
          </p>
          <a
            href={buildAppUrl()}
            onClick={(e) => {
              e.preventDefault();
              handleCtaClick("variant_d_final_cta", buildAppUrl());
            }}
            className="inline-flex items-center gap-2 px-10 py-5 rounded-xl font-extrabold text-base bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white shadow-2xl shadow-purple-500/30 transition-all transform hover:-translate-y-1 cursor-pointer"
          >
            <span>Upgrade Your Workshop Reputation Free</span>
            <ArrowRight size={18} />
          </a>
          <p className="text-xs text-gray-400 mt-3">No credit card required · Ready for WhatsApp on mobile &amp; desktop</p>
        </div>
      </section>
    </div>
  );
}

