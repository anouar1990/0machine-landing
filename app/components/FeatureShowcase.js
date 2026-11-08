"use client";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function FeatureShowcase() {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      id: "nesting",
      icon: "🧩",
      label: t("features.tab.nesting"),
      title: t("features.nest.title"),
      subtitle: t("features.nest.subtitle"),
      highlights: [
        t("features.nest.h1"),
        t("features.nest.h2"),
        t("features.nest.h3"),
        t("features.nest.h4"),
      ],
      screenshot: "/screenshots/screenshot-nesting.png",
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
      icon: "🤖",
      label: t("features.tab.laserai"),
      title: t("features.laserai.title"),
      subtitle: t("features.laserai.subtitle"),
      highlights: [
        t("features.laserai.h1"),
        t("features.laserai.h2"),
        t("features.laserai.h3"),
        t("features.laserai.h4"),
      ],
      screenshot: "/screenshots/screenshot-laser-ai.png",
      url: "app.0machine.com/laser-ai",
      badge: "Text-to-Laser AI",
      badgeColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      stats: [
        { label: "Generation Speed", value: "< 5 sec", sub: "Instant vector geometry" },
        { label: "Path Integrity", value: "100% Closed", sub: "Kerf-aware cut paths" },
        { label: "Compatible Lasers", value: "CO2 & Fiber", sub: "Direct machine import" },
      ],
    },
    {
      id: "calculator",
      icon: "💰",
      label: t("features.tab.calc"),
      title: t("features.calc.title"),
      subtitle: t("features.calc.subtitle"),
      highlights: [
        t("features.calc.h1"),
        t("features.calc.h2"),
        t("features.calc.h3"),
        t("features.calc.h4"),
      ],
      screenshot: "/screenshots/screenshot-calculator.png",
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
      icon: "📦",
      label: t("features.tab.inventory"),
      title: t("features.inv.title"),
      subtitle: t("features.inv.subtitle"),
      highlights: [
        t("features.inv.h1"),
        t("features.inv.h2"),
        t("features.inv.h3"),
        t("features.inv.h4"),
      ],
      screenshot: "/screenshots/screenshot-materials.png",
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
      icon: "⚡",
      label: t("features.tab.production"),
      title: t("features.prod.title"),
      subtitle: t("features.prod.subtitle"),
      highlights: [
        t("features.prod.h1"),
        t("features.prod.h2"),
        t("features.prod.h3"),
        t("features.prod.h4"),
      ],
      screenshot: "/screenshots/screenshot-production.png",
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
      icon: "⚙️",
      label: t("features.tab.presets"),
      title: t("features.presets.title"),
      subtitle: t("features.presets.subtitle"),
      highlights: [
        t("features.presets.h1"),
        t("features.presets.h2"),
        t("features.presets.h3"),
        t("features.presets.h4"),
      ],
      screenshot: "/screenshots/screenshot-presets.png",
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
    <section id="features" ref={ref} className="relative py-28 sm:py-36 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-500/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      {/* Subtle radial ambient glow */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[700px] h-[700px] bg-accent-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-14 sm:mb-20"
        >
          <span className="inline-flex items-center gap-1.5 text-xs text-accent-400 tracking-[0.2em] uppercase font-semibold bg-accent-500/10 px-3.5 py-1.5 rounded-full border border-accent-500/20 mb-4">
            <span>⚡</span>
            <span>{t("features.badge")}</span>
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-[Outfit] text-white mt-2 mb-5 tracking-tight">
            {t("features.title")}
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
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
                return (
                  <button
                    key={f.id}
                    onClick={() => setActive(i)}
                    className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl text-left whitespace-nowrap transition-all duration-300 border ${
                      isActive
                        ? "bg-dark-850 border-accent-500/40 shadow-xl shadow-accent-500/10 text-white"
                        : "bg-dark-900/60 hover:bg-dark-850/80 border-white/5 text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{f.icon}</span>
                      <div>
                        <span className="text-sm font-bold block">{f.label}</span>
                        <span className="text-[11px] text-gray-500 block font-normal">
                          {f.badge}
                        </span>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center">
                      <span
                        className={`w-2 h-2 rounded-full transition-colors ${
                          isActive ? "bg-accent-400 animate-pulse" : "bg-dark-700"
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
                      <span className="text-accent-400 text-[10px]">✓</span>
                      <span>{h}</span>
                    </span>
                  ))}
                </div>

                {/* REAL RETINA SCREENSHOT IN MAC BROWSER FRAME */}
                <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl shadow-black/90 bg-dark-950 group">
                  {/* Browser Chrome Header */}
                  <div className="bg-dark-900/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/70" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                        <div className="w-3 h-3 rounded-full bg-green-500/70" />
                      </div>
                      <span className="hidden sm:inline-block ml-3 text-[11px] font-mono text-gray-500">
                        0Machine Studio
                      </span>
                    </div>

                    {/* Address Bar */}
                    <div className="bg-dark-950/90 border border-white/10 rounded-lg px-4 py-1 text-xs text-gray-300 font-mono flex items-center gap-2 max-w-sm w-full justify-center">
                      <span className="text-green-400 text-[10px]">🔒</span>
                      <span className="truncate">{currentFeature.url}</span>
                    </div>

                    {/* Direct Launch Link */}
                    <a
                      href="https://app.0machine.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-semibold text-accent-400 hover:text-accent-300 flex items-center gap-1 transition-colors px-2 py-0.5 rounded-md hover:bg-accent-500/10"
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
