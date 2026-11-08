"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ParticleField from "../components/ParticleField";
import { Box, Calculator, Layers, Cpu, ArrowRight, ShieldCheck, Zap, Download, Sparkles } from "lucide-react";
import Link from "next/link";

export default function ToolsHubPage() {
  const tools = [
    {
      title: "LaserAI Prompt-to-Vector Studio",
      desc: "Turn text prompts into production-ready closed vector contours with separate Cut (#EF4444) and Engrave (#000000) layers in under 3 seconds.",
      href: "/#laser-ai",
      icon: Sparkles,
      badge: "⚡ AI Vector Engine",
      action: "Generate Vector Now →",
      features: ["Prompt-to-SVG in 2.1s", "Automatic Kerf Compensation", "Keychain & Stencil Modes", "Direct LightBurn C00/C01 Layers"],
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
      title: "Job Cost & Quote Calculator",
      desc: "Calculate true production costs by factoring cutting speeds, pierce times, material unit cost, gas consumption, electricity, and labor.",
      href: "/calculator",
      icon: Calculator,
      badge: "💰 Profit Optimizer",
      action: "Open Cost Calculator →",
      features: ["Real-Time Selling Price Formula", "Electricity & Machine Wear Rates", "Dynamic Margin Percentage", "Client-Ready PDF Estimates"],
    },
    {
      title: "Commercial Vector Designs Vault",
      desc: "Browse 5,000+ battle-tested commercial laser design packs with full resale rights. 3D multilayer shadowboxes, living hinges, earrings, and wall clocks.",
      href: "/#designs-vault",
      icon: Sparkles,
      badge: "💎 5,000+ Packs",
      action: "Explore Vault Packs →",
      features: ["Commercial Resale License", "SVG · DXF · PDF · AI", "Color-Coded CAM Layers", "Tested on CO2 & Fiber Lasers"],
    },
    {
      title: "True-Shape Sheet Nesting",
      desc: "ClipperLib polygon collision detection packs irregular shapes tightly on full sheets and remnant off-cuts to save 30-40% in scrap.",
      href: "https://app.0machine.com",
      icon: Layers,
      badge: "🧩 Scrap Reducer",
      action: "Launch Nesting Studio →",
      features: ["Multi-Sheet Packing", "Remnant Off-Cut Utilization", "LightBurn & Ruida Ready", "Immediate SVG/DXF Export"],
    },
    {
      title: "Laser Speed & Power Presets",
      desc: "Zero-guesswork machine database for CO2, Fiber, and Diode lasers across plywood, acrylic, MDF, leather, and stainless steel.",
      href: "https://app.0machine.com",
      icon: Cpu,
      badge: "⚡ Zero Test Waste",
      action: "Explore Presets Hub →",
      features: ["Material Thickness Lookup (3-12mm)", "Frequency & Assist Gas Settings", "LightBurn Layer Color Sync", "Custom Machine Profiles"],
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
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.title}
                  className="bg-[#1A1D21] border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-[#23262C] border border-white/10 flex items-center justify-center text-[#FE7733] group-hover:scale-110 transition-transform">
                        <Icon size={24} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#B1FA63]/10 text-[#B1FA63] border border-[#B1FA63]/20">
                        {tool.badge}
                      </span>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2 font-[Outfit]">{tool.title}</h2>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">{tool.desc}</p>

                    <ul className="space-y-2.5 mb-8">
                      {tool.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2.5 text-xs text-gray-300">
                          <ShieldCheck size={14} className="text-[#10B981] flex-shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={tool.href}
                    className="w-full text-center py-3.5 px-6 rounded-xl font-bold text-sm bg-white/5 hover:bg-[#FE7733] hover:text-white text-gray-200 border border-white/10 transition-all flex items-center justify-center gap-2 group-hover:border-[#FE7733]"
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
              Keep your inventory synchronized, save client quotes, track live machine jobs, and export nested sheets directly to LightBurn.
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

