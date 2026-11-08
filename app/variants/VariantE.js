"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useExperiment } from "../context/ExperimentContext";
import {
  Sparkles, Layers, Download, CheckCircle2, ArrowRight, ShieldCheck,
  FolderDown, Sliders, Box, Cpu, Scissors, Palette, Check, Tag, Eye
} from "lucide-react";
import Pricing from "../components/Pricing";

export default function VariantE() {
  const { buildAppUrl, handleCtaClick } = useExperiment();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Niches" },
    { id: "mandalas", label: "3D Layered Mandalas" },
    { id: "boxes", label: "Boxes & Living Hinges" },
    { id: "decor", label: "Home Decor & Signs" },
    { id: "puzzles", label: "Puzzles & 3D Games" },
    { id: "jewelry", label: "Jewelry & Keychains" },
  ];

  const designPacks = [
    {
      title: "Sacred Geometry 3D Mandala (8-Layer)",
      category: "mandalas",
      downloads: "12.4k",
      files: "SVG, DXF, AI, PDF",
      tags: ["3mm Birch", "Layered Cut", "Best Seller"],
      commercial: "Full Resale Rights",
    },
    {
      title: "Interlocking Finger-Joint Storage Chest",
      category: "boxes",
      downloads: "9.8k",
      files: "SVG, DXF, LightBurn",
      tags: ["Living Hinge", "Kerf-Ready", "Zero Glue"],
      commercial: "Full Resale Rights",
    },
    {
      title: "Art Deco Botanical Welcome Sign",
      category: "decor",
      downloads: "15.1k",
      files: "SVG, DXF, CDR",
      tags: ["Acrylic + Wood", "Signage", "Trending"],
      commercial: "Full Resale Rights",
    },
    {
      title: "Mechanical Gear Clock & Marble Run",
      category: "puzzles",
      downloads: "8.3k",
      files: "SVG, DXF, PDF",
      tags: ["Kinetic Art", "4mm Plywood", "High Detail"],
      commercial: "Full Resale Rights",
    },
    {
      title: "Laser Geometric Acrylic Earrings (Pack of 30)",
      category: "jewelry",
      downloads: "18.2k",
      files: "SVG, DXF, PNG",
      tags: ["Mirrored Acrylic", "Fast Cut", "Gift Niche"],
      commercial: "Full Resale Rights",
    },
    {
      title: "Modular Desk Cable & Tool Organizer",
      category: "boxes",
      downloads: "11.6k",
      files: "SVG, DXF",
      tags: ["Workshop Use", "6mm MDF", "Snap-Fit"],
      commercial: "Full Resale Rights",
    },
  ];

  const filteredPacks = selectedCategory === "all"
    ? designPacks
    : designPacks.filter((p) => p.category === selectedCategory);

  return (
    <div className="relative text-white overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-24 sm:pt-40 sm:pb-32 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-rose-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          {/* Dual Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-6"
          >
            <span className="flex items-center gap-1">
              <Download size={13} className="text-rose-400" />
              <span>300,000+ Ready-to-Cut Library</span>
            </span>
            <span className="text-gray-500">•</span>
            <span className="flex items-center gap-1 text-accent-400">
              <Cpu size={13} />
              <span>Built-in CAD &amp; AI Creator Studio</span>
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black font-[Outfit] text-white tracking-tight max-w-5xl mx-auto leading-[1.1] mb-6"
          >
            300,000+ Designs Ready to Use.{" "}
            <span className="bg-gradient-to-r from-rose-400 via-pink-300 to-amber-300 bg-clip-text text-transparent">
              Create Your Own. No Limits.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg sm:text-2xl text-gray-300 max-w-3xl mx-auto font-normal leading-relaxed mb-10"
          >
            Never Run Out of Ideas. Start With 300,000+ Curated Designs or Create Something Completely Your Own with Native Laser Tools.
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
                handleCtaClick("variant_e_hero_primary", buildAppUrl());
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-extrabold text-base bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white shadow-xl shadow-rose-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore 300,000+ Designs &amp; Tools Free</span>
              <ArrowRight size={18} />
            </a>

            <a
              href="#creation-tools"
              className="w-full sm:w-auto px-7 py-4 rounded-xl font-bold text-sm bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <span>See Creator Tools</span>
              <span className="text-gray-400">↓</span>
            </a>
          </motion.div>

          {/* Value Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16 text-left">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <span className="text-xs text-gray-400 block font-semibold mb-1">Vector Catalog</span>
              <span className="text-2xl sm:text-3xl font-black text-rose-400 font-[Outfit]">300,000+</span>
              <span className="text-[11px] text-gray-400 block mt-1">Curated cut-ready vectors</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <span className="text-xs text-gray-400 block font-semibold mb-1">Commercial License</span>
              <span className="text-2xl sm:text-3xl font-black text-white font-[Outfit]">100% Rights</span>
              <span className="text-[11px] text-gray-400 block mt-1">Sell physical items freely</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <span className="text-xs text-gray-400 block font-semibold mb-1">Original Creation</span>
              <span className="text-2xl sm:text-3xl font-black text-accent-400 font-[Outfit]">Box &amp; AI Studio</span>
              <span className="text-[11px] text-gray-400 block mt-1">Custom dimensions &amp; kerf</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <span className="text-xs text-gray-400 block font-semibold mb-1">File Formats</span>
              <span className="text-2xl sm:text-3xl font-black text-white font-[Outfit]">SVG &amp; DXF</span>
              <span className="text-[11px] text-gray-400 block mt-1">LightBurn, xTool &amp; Ruida</span>
            </div>
          </div>

          {/* Visual Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative max-w-5xl mx-auto rounded-2xl border border-white/15 bg-dark-950 p-2 shadow-2xl shadow-rose-500/10"
          >
            <div className="rounded-xl overflow-hidden border border-white/10 bg-dark-900">
              <div className="px-4 py-2.5 bg-dark-950 border-b border-white/10 flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                  <span className="ml-2 font-mono text-[11px] text-gray-400 hidden sm:inline">
                    0Machine Designs Vault &amp; Live Vector Studio
                  </span>
                </div>
                <span className="text-rose-400 font-mono text-[11px] font-bold">
                  💎 300k+ VECTOR ASSETS
                </span>
              </div>
              <img
                src="/screenshots/screenshot-designs-vault.png"
                alt="0Machine 300000+ Laser and CNC Vector Designs Vault"
                className="w-full h-auto object-cover object-top"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* PILLAR 1: GET 300,000+ READY-MADE DESIGNS */}
      <section className="py-24 bg-dark-900/60 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
              Value Proposition 1
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-[Outfit] text-white mt-3 mb-4">
              Get 300,000+ Ready-Made Cut Files
            </h2>
            <p className="text-gray-300 text-base sm:text-lg">
              Save hours of CAD drawing time. Download battle-tested vectors across dozens of profitable categories, import directly to LightBurn, and start cutting immediately.
            </p>
          </div>

          {/* Category Pills */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-6 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === c.id
                    ? "bg-rose-500 text-white shadow-lg shadow-rose-500/25"
                    : "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredPacks.map((pack, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] p-6 transition-all hover:border-rose-500/40 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-3 font-mono">
                    <span className="text-rose-400 font-semibold">{pack.commercial}</span>
                    <span>{pack.downloads} cuts</span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-rose-300 transition-colors">
                    {pack.title}
                  </h3>

                  <div className="flex flex-wrap gap-1.5 my-3">
                    {pack.tags.map((t, i) => (
                      <span key={i} className="text-[10px] font-semibold bg-white/5 text-gray-300 px-2 py-0.5 rounded border border-white/5">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-gray-400 font-mono text-[11px]">{pack.files}</span>
                  <a
                    href={buildAppUrl()}
                    onClick={(e) => {
                      e.preventDefault();
                      handleCtaClick(`variant_e_pack_${idx}`, buildAppUrl());
                    }}
                    className="text-rose-400 font-bold hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Download</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PILLAR 2: CREATE YOUR OWN DESIGNS */}
      <section id="creation-tools" className="py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-widest text-accent-400 bg-accent-500/10 px-3 py-1 rounded-full border border-accent-500/20">
              Value Proposition 2
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-[Outfit] text-white mt-3 mb-4">
              Create Your Own Original Designs
            </h2>
            <p className="text-gray-300 text-base sm:text-lg">
              Turn your custom ideas into production-ready vectors using 0Machine&apos;s verified native CAD and AI creation tools.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Tool 1: Box & Enclosure CAD Generator */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-accent-500/10 border border-accent-500/20 text-accent-400 flex items-center justify-center mb-5">
                  <Box size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Finger-Joint Box Generator</h3>
                <p className="text-sm text-gray-300 leading-relaxed mb-6">
                  Input custom width, height, depth, and sheet thickness. Automatically calculates finger tab dimensions and applies exact kerf offsets for snap-fit joints without glue.
                </p>
                <ul className="space-y-2 text-xs text-gray-400">
                  <li className="flex items-center gap-2 text-emerald-400">
                    <Check size={14} /> <span>Automatic kerf compensation</span>
                  </li>
                  <li className="flex items-center gap-2 text-emerald-400">
                    <Check size={14} /> <span>Open / closed top &amp; living hinges</span>
                  </li>
                  <li className="flex items-center gap-2 text-emerald-400">
                    <Check size={14} /> <span>Instant SVG download</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6 border-t border-white/5 mt-6">
                <a
                  href="/tools/box-generator"
                  className="text-xs font-bold text-accent-400 hover:text-accent-300 flex items-center gap-1.5"
                >
                  <span>Launch Free Box Generator</span>
                  <span>→</span>
                </a>
              </div>
            </div>

            {/* Tool 2: 0Machine AI Vector Studio */}
            <div className="rounded-2xl border border-rose-500/30 bg-rose-950/10 p-8 flex flex-col justify-between shadow-xl shadow-rose-500/5">
              <div>
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-5">
                  <Cpu size={24} />
                </div>
                <div className="inline-block text-[10px] uppercase font-bold text-rose-400 bg-rose-500/20 px-2.5 py-0.5 rounded-full border border-rose-500/30 mb-2">
                  0Machine AI Engine
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Prompt-to-Laser AI Studio</h3>
                <p className="text-sm text-gray-300 leading-relaxed mb-6">
                  Type any prompt (e.g., &quot;Nordic wolf silhouette with geometric frame&quot;) and generate 100% closed, kerf-compensated vector cutting paths ready for your laser.
                </p>
                <ul className="space-y-2 text-xs text-gray-400">
                  <li className="flex items-center gap-2 text-emerald-400">
                    <Check size={14} /> <span>Clean closed cut contours</span>
                  </li>
                  <li className="flex items-center gap-2 text-emerald-400">
                    <Check size={14} /> <span>LightBurn layer separation (C00/C01)</span>
                  </li>
                  <li className="flex items-center gap-2 text-emerald-400">
                    <Check size={14} /> <span>Instant SVG &amp; DXF export</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6 border-t border-rose-500/20 mt-6">
                <a
                  href={buildAppUrl()}
                  onClick={(e) => {
                    e.preventDefault();
                    handleCtaClick("variant_e_ai_cta", buildAppUrl());
                  }}
                  className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Open 0Machine AI Studio</span>
                  <span>→</span>
                </a>
              </div>
            </div>

            {/* Tool 3: Kerf Compensator & SVG Optimizer */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5">
                  <Scissors size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Kerf &amp; Path Optimizer</h3>
                <p className="text-sm text-gray-300 leading-relaxed mb-6">
                  Upload an existing SVG or DXF and automatically offset beam beam kerf (0.1mm - 0.3mm) so interlocking parts fit together tightly every single time.
                </p>
                <ul className="space-y-2 text-xs text-gray-400">
                  <li className="flex items-center gap-2 text-emerald-400">
                    <Check size={14} /> <span>Zero loose or wobbly joints</span>
                  </li>
                  <li className="flex items-center gap-2 text-emerald-400">
                    <Check size={14} /> <span>Removes double-lines &amp; duplicate nodes</span>
                  </li>
                  <li className="flex items-center gap-2 text-emerald-400">
                    <Check size={14} /> <span>Speed up cutting time by 15-20%</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6 border-t border-white/5 mt-6">
                <a
                  href="/tools"
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5"
                >
                  <span>Explore Free Maker Tools</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMMERCIAL RIGHTS CLARITY */}
      <section className="py-20 bg-dark-900/60 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 text-emerald-400 font-bold text-sm bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 mb-4">
            <ShieldCheck size={16} />
            <span>Commercial Resale Rights Included</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-[Outfit] text-white mb-4">
            Cut and Sell as Many Physical Products as You Want.
          </h2>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Every ready-made design and every vector you create with 0Machine comes with a perpetual commercial license. Sell on Etsy, craft markets, local boutiques, or B2B contracts with zero royalty fees.
          </p>
        </div>
      </section>

      {/* PRICING */}
      <Pricing />

      {/* FINAL CALL TO ACTION */}
      <section className="py-24 text-center relative overflow-hidden bg-gradient-to-b from-dark-950 to-rose-950/25 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-5xl font-black font-[Outfit] text-white tracking-tight mb-4">
            Never Stare at a Blank Screen Again.
          </h2>
          <p className="text-gray-300 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            Access 300,000+ vector designs or start creating your own original creations right now. Free forever plan available.
          </p>
          <a
            href={buildAppUrl()}
            onClick={(e) => {
              e.preventDefault();
              handleCtaClick("variant_e_final_cta", buildAppUrl());
            }}
            className="inline-flex items-center gap-2 px-10 py-5 rounded-xl font-extrabold text-base bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white shadow-2xl shadow-rose-500/30 transition-all transform hover:-translate-y-1 cursor-pointer"
          >
            <span>Unlock 300k+ Designs &amp; Creation Studio</span>
            <ArrowRight size={18} />
          </a>
          <p className="text-xs text-gray-400 mt-3">Instant download in SVG &amp; DXF · LightBurn &amp; xTool compatible</p>
        </div>
      </section>
    </div>
  );
}

