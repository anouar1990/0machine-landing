"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ParticleField from "../components/ParticleField";
import { Box, Calculator, Layers, Cpu, ArrowRight, ShieldCheck, Zap, Download, Sparkles, Grid } from "lucide-react";
import Link from "next/link";

export default function ToolsHubPage() {
  const tools = [
    {
      title: "Job Cost & Quote Calculator",
      desc: "Calculate true production costs by factoring cutting speeds, pierce times, material unit cost, gas consumption, electricity, and labor.",
      href: "/calculator",
      icon: Calculator,
      badge: "💰 Profit Optimizer",
      action: "Open Cost Calculator →",
      features: ["Real-Time Selling Price Formula", "Electricity & Machine Wear Rates", "Dynamic Margin Percentage", "Client-Ready PDF Estimates & WhatsApp"],
    },
    {
      title: "Free Laser Box Generator",
      desc: "Generate custom finger-joint boxes with live 2D preview, kerf compensation, and instant LightBurn SVG & AutoCAD DXF download.",
      href: "/tools/box-generator",
      icon: Box,
      badge: "⭐ Most Popular",
      action: "Launch Box Generator →",
      features: ["Custom W × H × D & Thickness", "Automatic Kerf Offset (0.15mm)", "1-Click DXF & SVG Export", "100% Free · No Sign Up"],
    },
    {
      title: "Laser Power & Speed Test Matrix",
      desc: "Generate custom speed vs. power calibration grids with kerf test slits for CO2, Fiber, and Diode lasers. Zero test waste on new material batches.",
      href: "/tools/test-matrix",
      icon: Grid,
      badge: "⚡ Zero Guesswork",
      action: "Generate Test Matrix →",
      features: ["Speed & Power Step Grids", "Kerf Slits for Friction Fit", "LightBurn C00/C01 Layer Export", "CO2, Fiber & Diode Calibrated"],
    },
    {
      title: "Laser Living Hinge Generator",
      desc: "Parametric flexible wood lattice patterns. Bend rigid 3mm–6mm plywood and acrylic into smooth curved boxes, notebook spines, and lamps.",
      href: "/tools/living-hinge",
      icon: Layers,
      badge: "🌀 Flexible Wood CAD",
      action: "Generate Living Hinge →",
      features: ["Custom Width, Height & Cut Length", "Staggered Lattice Slit Layout", "Instant LightBurn SVG & DXF", "3-6mm Plywood Tolerances"],
    },
    {
      title: "Laser & CNC Sheet Nesting Estimator",
      desc: "Calculate exact parts per sheet, sheet yield percentage, scrap waste, and material costs. Stop guessing sheet quantities on production runs.",
      href: "/tools/nesting",
      icon: Layers,
      badge: "🧩 Scrap Reducer",
      action: "Estimate Sheet Yield →",
      features: ["Standard Bed Presets (600×400, 1200×600)", "90° Rotational Optimization", "Total Material Cost & Gross Profit", "Instant Scrap Waste %"],
    },
    {
      title: "LaserAI Prompt-to-Vector Studio",
      desc: "Turn text prompts into production-ready closed vector contours with separate Cut (#EF4444) and Engrave (#000000) layers in under 3 seconds.",
      href: "/#laser-ai",
      icon: Sparkles,
      badge: "🤖 AI Vector Engine",
      action: "Generate Vector Now →",
      features: ["Prompt-to-SVG in 2.1s", "Automatic Kerf Compensation", "Keychain & Stencil Modes", "Direct LightBurn C00/C01 Layers"],
    },
  ];

  return (
    <>
      <ParticleField />
      <Navbar />

      <main className="min-h-screen pt-32 pb-24 relative z-10 bg-[#111317] text-gray-300">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 text-xs text-[#B1FA63] font-bold uppercase tracking-[0.2em] bg-[#B1FA63]/10 px-4 py-1.5 rounded-full border border-[#B1FA63]/20 mb-4">
              <Zap size={13} />
              <span>FREE WORKSHOP SUITE</span>
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-[Outfit] text-white mb-4">
              Free Laser & CNC <br />
              <span className="text-[#FE7733]">Production Tools</span>
            </h1>
            <p className="text-gray-400 text-base sm:text-lg">
              Engineered for makers, fablabs, and commercial workshops. 100% free online CAD utilities with zero sign-up required.
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.title}
                  className="bg-[#1A1D21] border border-white/10 rounded-2xl p-6 sm:p-7 hover:border-white/20 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-[#23262C] border border-white/10 flex items-center justify-center text-[#FE7733] group-hover:scale-110 transition-transform">
                        <Icon size={24} />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#B1FA63]/10 text-[#B1FA63] border border-[#B1FA63]/20">
                        {tool.badge}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-white mb-2 font-[Outfit]">{tool.title}</h2>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6">{tool.desc}</p>

                    <ul className="space-y-2 mb-6">
                      {tool.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                          <ShieldCheck size={13} className="text-[#10B981] flex-shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={tool.href}
                    className="w-full text-center py-3 px-4 rounded-xl font-bold text-xs bg-white/5 hover:bg-[#FE7733] hover:text-white text-gray-200 border border-white/10 transition-all flex items-center justify-center gap-1.5 group-hover:border-[#FE7733]"
                  >
                    <span>{tool.action}</span>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Bottom Conversion Banner */}
          <div className="bg-gradient-to-r from-[#1A1D21] via-[#23262C] to-[#1A1D21] border border-[#B1FA63]/30 rounded-3xl p-10 text-center max-w-4xl mx-auto shadow-2xl">
            <span className="text-xs text-[#B1FA63] font-extrabold uppercase tracking-widest">RUN SMARTER</span>
            <h3 className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-3 font-[Outfit]">
              Manage Your Whole Workshop From One Screen
            </h3>
            <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto mb-8">
              Keep your inventory synchronized, save client quotes, track live machine jobs, and export nested sheets directly to LightBurn with 0Machine Pro.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://app.0machine.com"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#FE7733] hover:bg-[#E85F20] text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-[#FE7733]/25 flex items-center justify-center gap-2"
              >
                <span>⚡ Start Free Forever</span>
                <ArrowRight size={16} />
              </a>
              <Link
                href="/calculator"
                className="w-full sm:w-auto px-8 py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl text-sm border border-white/10 transition-all"
              >
                Open Cost Calculator
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
