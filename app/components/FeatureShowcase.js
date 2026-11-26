"use client";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Layers, Cpu, Calculator, Package, Activity, SlidersHorizontal, Check, Lock } from "lucide-react";

export default function FeatureShowcase() {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      id: "nesting",
      icon: Layers,
      label: t("features.tab.nesting"),
      title: t("features.nest.title"),
      subtitle: t("features.nest.subtitle"),
      highlights: [
        t("features.nest.h1"),
        t("features.nest.h2"),
        t("features.nest.h3"),
        t("features.nest.h4"),
      ],
      screenshot: "/screenshots/screenshot-nesting.webp",
      url: "app.0machine.com/nesting",
      badge: "30-40% Scrap Reduction",
      badgeColor: "text-green-400 bg-green-500/10 border-green-500/20",
      stats: [
        { label: "Material Savings", value: "30-40%", sub: "Less scrap waste" },
        { label: "Placement Engine", value: "ClipperLib", sub: "Polygon collision detection" },
        { label: "Export Format", value: "Clean SVG", sub: "LightBurn & Ruida ready" },
      ],
    },
    {
      id: "laserai",
      icon: Cpu,
      label: t("features.tab.laserai"),
      title: t("features.laserai.title"),
      subtitle: t("features.laserai.subtitle"),
      highlights: [
        t("features.laserai.h1"),
        t("features.laserai.h2"),
        t("features.laserai.h3"),
        t("features.laserai.h4"),
      ],
      screenshot: "/screenshots/screenshot-laser-ai.webp",
      url: "app.0machine.com/laser-ai",
      badge: "Text-to-Laser AI",
      badgeColor: "text-brand-lime bg-brand-lime/10 border-brand-lime/25",
      stats: [
        { label: "Generation Speed", value: "< 5 sec", sub: "Instant vector geometry" },
        { label: "Path Integrity", value: "100% Closed", sub: "Kerf-aware cut paths" },
        { label: "Compatible Lasers", value: "CO2 & Fiber", sub: "Direct machine import" },
      ],
    },
    {
      id: "calculator",
      icon: Calculator,
      label: t("features.tab.calc"),
      title: t("features.calc.title"),
      subtitle: t("features.calc.subtitle"),
      highlights: [
        t("features.calc.h1"),
        t("features.calc.h2"),
        t("features.calc.h3"),
        t("features.calc.h4"),
      ],
      screenshot: "/screenshots/screenshot-calculator.webp",
      url: "app.0machine.com/calculator",
      badge: "Precision Cost Engine",
      badgeColor: "text-accent-400 bg-accent-500/10 border-accent-500/20",
      stats: [
        { label: "Calculation Accuracy", value: "100%", sub: "Pierce, run & gas costs" },
        { label: "Margin Security", value: "Dynamic", sub: "Guaranteed profit markup" },
        { label: "Client Dispatch", value: "1-Click WhatsApp", sub: "Instant client quotes & invoices" },
      ],
    },
    {
      id: "materials",
      icon: Package,
      label: t("features.tab.inventory"),
      title: t("features.inv.title"),
      subtitle: t("features.inv.subtitle"),
      highlights: [
        t("features.inv.h1"),
        t("features.inv.h2"),
        t("features.inv.h3"),
        t("features.inv.h4"),
      ],
      screenshot: "/screenshots/screenshot-materials.webp",
      url: "app.0machine.com/materials",
      badge: "Sheet & Off-Cut Inventory",
      badgeColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      stats: [
        { label: "Stock Visibility", value: "Real-Time", sub: "Plywood, Acrylic & Metal" },
        { label: "Remnant Tracking", value: "Off-Cuts", sub: "Zero forgotten scrap" },
        { label: "Reorder Alerts", value: "Automated", sub: "Low-stock notifications" },
      ],
    },
    {
      id: "production",
      icon: Activity,
      label: t("features.tab.production"),
      title: t("features.prod.title"),
      subtitle: t("features.prod.subtitle"),
      highlights: [
        t("features.prod.h1"),
        t("features.prod.h2"),
        t("features.prod.h3"),
        t("features.prod.h4"),
      ],
      screenshot: "/screenshots/screenshot-production.webp",
      url: "app.0machine.com/production",
      badge: "Workshop Job Tracker",
      badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      stats: [
        { label: "Workflow Pipeline", value: "Live Kanban", sub: "Pending → Cutting → Done" },
        { label: "Workshop Status", value: "Sync'd", sub: "Front desk & operator" },
        { label: "Time Tracking", value: "Live Timer", sub: "Track exact cutting duration" },
      ],
    },
    {
      id: "presets",
      icon: SlidersHorizontal,
      label: t("features.tab.presets"),
      title: t("features.presets.title"),
      subtitle: t("features.presets.subtitle"),
      highlights: [
        t("features.presets.h1"),
        t("features.presets.h2"),
        t("features.presets.h3"),
        t("features.presets.h4"),
      ],
      screenshot: "/screenshots/screenshot-presets.webp",
      url: "app.0machine.com/presets",
      badge: "Laser Machine Presets",
      badgeColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
      stats: [
        { label: "Supported Tubes", value: "CO2, Fiber, Diode", sub: "Multi-machine workshop" },
        { label: "Parameters", value: "Speed, Power, Hz", sub: "Cut, engrave & score" },
        { label: "Material Waste", value: "0% Test Cuts", sub: "Tested parameters stored" },
      ],
    },
  ];

  const currentFeature = features[active];

  return (
    <section id="features" ref={ref} className="relative py-28 sm:py-36 overflow-hidden bg-[#0e100f] border-t border-[#42433d]/40">
      <div className="absolute inset-0 grid-pattern opacity-25 pointer-events-none" />

      {/* Subtle radial ambient glow */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[700px] h-[700px] bg-[#0ae448]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-14 sm:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#42433D] bg-[#141513] mb-4 shadow-lg shadow-black/40">
            <span className="w-2 h-2 rounded-full bg-[#FE7733] animate-pulse" />
            <span className="text-xs text-[#FFA266] tracking-[0.2em] uppercase font-mono font-semibold">
              {t("features.badge") || "CORE WORKSHOP ENGINES"}
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-[Outfit] text-[#FFFCE1] mt-2 mb-4 tracking-[-0.04em] leading-[1.05]">
            {t("features.title")}
          </h2>
          <p className="text-[#8B95A8] max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            {t("features.subtitle")}
          </p>
        </motion.div>

        {/* Feature tabs + Content grid */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
          {/* Tab navigation */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-80 shrink-0"
          >
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-3 lg:pb-0 scrollbar-none">
              {features.map((f, i) => {
                const isActive = active === i;
                const Icon = f.icon;
                return (
                  <button
                    key={f.id}
                    onClick={() => setActive(i)}
                    className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl text-left whitespace-nowrap transition-all duration-300 border cursor-pointer ${
                      isActive
                        ? "bg-[#141513] border-[#FE7733] shadow-xl shadow-[#FE7733]/15 text-[#FFFCE1]"
                        : "bg-[#0e100f] hover:bg-[#141513] border-[#42433D]/60 text-[#8B95A8] hover:text-[#FFFCE1]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-[#0e100f] border border-[#42433D] flex items-center justify-center shrink-0 ${
                        isActive ? "text-[#FE7733]" : "text-[#8B95A8]"
                      }`}>
                        <Icon size={16} strokeWidth={1.75} />
                      </div>
                      <div>
                        <span className="text-sm font-bold block font-[Outfit]">{f.label}</span>
                        <span className="text-[11px] text-[#8B95A8] block font-mono">
                          {f.badge}
                        </span>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center">
                      <span
                        className={`w-2 h-2 rounded-full transition-colors ${
                          isActive ? "bg-[#FE7733] animate-pulse" : "bg-[#42433D]"
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Feature detail + Screenshot Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex-1 w-full"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFeature.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="space-y-6"
              >
                {/* Header Information */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${currentFeature.badgeColor}`}
                    >
                      {currentFeature.badge}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-[Outfit] mb-3">
                    {currentFeature.title}
                  </h3>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-3xl">
                    {currentFeature.subtitle}
                  </p>
                </div>

                {/* Highlights tags */}
                <div className="flex flex-wrap gap-2">
                  {currentFeature.highlights.map((h) => (
                    <span
                      key={h}
                      className="text-xs px-3 py-1.5 rounded-xl bg-white/5 text-gray-200 border border-white/10 font-medium flex items-center gap-1.5"
                    >
                      <Check size={12} strokeWidth={2} className="text-[#abff84] shrink-0" />
                      <span>{h}</span>
                    </span>
                  ))}
                </div>

                {/* REAL RETINA SCREENSHOT IN MAC BROWSER FRAME */}
                <div className="relative rounded-[24px] overflow-hidden border border-[#42433d] shadow-2xl shadow-black/90 bg-[#0e100f] group">
                  {/* Browser Chrome Header */}
                  <div className="bg-[#141513] backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-[#42433d]/70">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                        <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                      </div>
                      <span className="hidden sm:inline-block ml-3 text-[11px] font-mono text-[#7c7c6f]">
                        0Machine Studio
                      </span>
                    </div>

                    {/* Address Bar */}
                    <div className="bg-[#0e100f] border border-[#42433D] rounded-full px-4 py-1 text-xs text-[#8B95A8] font-mono flex items-center gap-2 max-w-sm w-full justify-center">
                      <Lock size={11} className="text-[#B1FA63] shrink-0" />
                      <span className="truncate text-[#FFFCE1]">{currentFeature.url}</span>
                    </div>

                    {/* Direct Launch Link */}
                    <a
                      href="https://app.0machine.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-semibold text-[#FE7733] hover:text-[#FFA266] flex items-center gap-1 transition-colors px-2.5 py-1 rounded-full bg-[#FE7733]/10 border border-[#FE7733]/25"
                    >
                      <span className="hidden sm:inline">Try Studio</span>
                      <span>↗</span>
                    </a>
                  </div>

                  {/* Screenshot Container */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-dark-950">
                    <img
                      src={currentFeature.screenshot}
                      alt={currentFeature.title}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.01]"
                      loading="lazy"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-dark-950/80 to-transparent pointer-events-none" />
                  </div>
                </div>

                {/* 3-Column Key Metric Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {currentFeature.stats.map((stat, i) => (
                    <div
                      key={i}
                      className="glass-card p-3.5 border-white/5 bg-dark-900/60 rounded-xl"
                    >
                      <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block">
                        {stat.label}
                      </span>
                      <span className="text-base sm:text-lg font-bold text-white font-[Outfit] block mt-0.5">
                        {stat.value}
                      </span>
                      <span className="text-[11px] text-accent-400/90 block mt-0.5 font-medium">
                        {stat.sub}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
