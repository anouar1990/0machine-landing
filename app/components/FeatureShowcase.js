"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function FeatureShowcase() {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      id: "dashboard",
      label: t("features.tab.dashboard"),
      title: t("features.db.title"),
      subtitle: t("features.db.subtitle"),
      highlights: [
        t("features.db.h1"),
        t("features.db.h2"),
        t("features.db.h3"),
        t("features.db.h4"),
      ],
      mockup: (
        <div className="bg-dark-900 rounded-xl overflow-hidden border border-white/10 shadow-2xl p-2 group">
          <img 
            src="/screenshots/screenshot-dashboard.png" 
            alt="0Machine Workshop Dashboard Overview" 
            className="w-full h-auto rounded-lg transition-transform duration-500 group-hover:scale-[1.01]" 
          />
        </div>
      ),
    },
    {
      id: "cost-calc",
      label: t("features.tab.calc"),
      title: t("features.calc.title"),
      subtitle: t("features.calc.subtitle"),
      highlights: [
        t("features.calc.h1"),
        t("features.calc.h2"),
        t("features.calc.h3"),
        t("features.calc.h4"),
      ],
      mockup: (
        <div className="bg-dark-900 rounded-xl overflow-hidden border border-white/10 shadow-2xl p-2 group">
          <img 
            src="/screenshots/screenshot-detail.png" 
            alt="0Machine Smart Cost & Time Calculator" 
            className="w-full h-auto rounded-lg transition-transform duration-500 group-hover:scale-[1.01]" 
          />
        </div>
      ),
    },
    {
      id: "materials",
      label: t("features.tab.inventory"),
      title: t("features.inv.title"),
      subtitle: t("features.inv.subtitle"),
      highlights: [
        t("features.inv.h1"),
        t("features.inv.h2"),
        t("features.inv.h3"),
        t("features.inv.h4"),
      ],
      mockup: (
        <div className="bg-dark-900 rounded-xl overflow-hidden border border-white/10 shadow-2xl p-2 group">
          <img 
            src="/screenshots/screenshot-stats.png" 
            alt="0Machine Material Inventory Management" 
            className="w-full h-auto rounded-lg transition-transform duration-500 group-hover:scale-[1.01]" 
          />
        </div>
      ),
    },
    {
      id: "orders",
      label: t("features.tab.orders"),
      title: t("features.orders.title"),
      subtitle: t("features.orders.subtitle"),
      highlights: [
        t("features.orders.h1"),
        t("features.orders.h2"),
        t("features.orders.h3"),
        t("features.orders.h4"),
      ],
      mockup: (
        <div className="bg-dark-900 rounded-xl overflow-hidden border border-white/10 shadow-2xl p-2 group">
          <img 
            src="/screenshots/screenshot-dashboard.png" 
            alt="0Machine Orders & Production Job Tracker" 
            className="w-full h-auto rounded-lg transition-transform duration-500 group-hover:scale-[1.01]" 
          />
        </div>
      ),
    },
    {
      id: "presets",
      label: t("features.tab.presets"),
      title: t("features.presets.title"),
      subtitle: t("features.presets.subtitle"),
      highlights: [
        t("features.presets.h1"),
        t("features.presets.h2"),
        t("features.presets.h3"),
        t("features.presets.h4"),
      ],
      mockup: (
        <div className="bg-dark-900 rounded-xl overflow-hidden border border-white/10 shadow-2xl p-2 group">
          <img 
            src="/screenshots/screenshot-detail.png" 
            alt="0Machine Laser Settings Presets Library" 
            className="w-full h-auto rounded-lg transition-transform duration-500 group-hover:scale-[1.01]" 
          />
        </div>
      ),
    },
    {
      id: "nesting",
      label: t("features.tab.nesting"),
      title: t("features.nest.title"),
      subtitle: t("features.nest.subtitle"),
      highlights: [
        t("features.nest.h1"),
        t("features.nest.h2"),
        t("features.nest.h3"),
        t("features.nest.h4"),
      ],
      mockup: (
        <div className="bg-dark-900 rounded-xl overflow-hidden border border-white/10 shadow-2xl p-2 group">
          <img 
            src="/screenshots/screenshot-stats.png" 
            alt="0Machine Nesting Yield Estimator" 
            className="w-full h-auto rounded-lg transition-transform duration-500 group-hover:scale-[1.01]" 
          />
        </div>
      ),
    },
    {
      id: "quotes",
      label: t("features.tab.quotes"),
      title: t("features.quotes.title"),
      subtitle: t("features.quotes.subtitle"),
      highlights: [
        t("features.quotes.h1"),
        t("features.quotes.h2"),
        t("features.quotes.h3"),
        t("features.quotes.h4"),
      ],
      mockup: (
        <div className="bg-dark-900 rounded-xl p-6 border border-white/5">
          <div className="glass-card p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs text-gray-500">Quote #QT-001</p>
                <p className="text-sm text-white font-medium">Sarah Lee — Wedding Decorations</p>
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-green-500/15 text-green-400">Accepted</span>
            </div>
            <div className="space-y-1 mb-3">
              {[
                { item: "Wooden Table Numbers (x20)", qty: 20, price: "$8.00", total: "$160.00" },
                { item: "Acrylic Welcome Sign", qty: 1, price: "$45.00", total: "$45.00" },
                { item: "Engraved Coaster Set (x50)", qty: 50, price: "$3.00", total: "$150.00" },
              ].map((l) => (
                <div key={l.item} className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <div>
                    <p className="text-[10px] text-white">{l.item}</p>
                    <p className="text-[8px] text-gray-500">Qty: {l.qty} × {l.price}</p>
                  </div>
                  <p className="text-[10px] text-white font-medium">{l.total}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-2 space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-white">$355.00</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-500">VAT (20%)</span>
                <span className="text-white">$71.00</span>
              </div>
              <div className="flex justify-between text-xs font-bold pt-1 border-t border-white/10">
                <span className="text-white">Total</span>
                <span className="text-accent-400">$426.00</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "clients",
      label: t("features.tab.clients"),
      title: t("features.clients.title"),
      subtitle: t("features.clients.subtitle"),
      highlights: [
        t("features.clients.h1"),
        t("features.clients.h2"),
        t("features.clients.h3"),
        t("features.clients.h4"),
      ],
      mockup: (
        <div className="bg-dark-900 rounded-xl p-6 border border-white/5">
          <div className="grid grid-cols-3 gap-2.5 mb-3">
            <div className="glass-card p-3">
              <p className="text-[8px] text-gray-500">Total Clients</p>
              <p className="text-xs font-bold text-white mt-1">42 Active</p>
            </div>
            <div className="glass-card p-3">
              <p className="text-[8px] text-gray-500">Total LTV</p>
              <p className="text-xs font-bold text-green-400 mt-1">$6,240</p>
            </div>
            <div className="glass-card p-3">
              <p className="text-[8px] text-gray-500">Balances Due</p>
              <p className="text-xs font-bold text-yellow-400 mt-1">$450</p>
            </div>
          </div>
          <div className="glass-card p-3">
            <p className="text-[9px] text-gray-500 mb-2">TOP CUSTOMERS</p>
            <div className="space-y-2">
              {[
                { name: "Sarah Lee (Wedding Planner)", orders: 8, ltv: "$1,840.50", c: "bg-accent-500/10 text-accent-400", s: "LTV Leader" },
                { name: "Tyler Peterson (CNC Craft Co)", orders: 12, ltv: "$1,450.00", c: "bg-blue-500/10 text-blue-400", s: "Active Builder" },
              ].map((c) => (
                <div key={c.name} className="flex justify-between items-center py-1 border-b border-white/5 last:border-0 last:pb-0">
                  <div>
                    <p className="text-xs text-white font-medium">{c.name}</p>
                    <p className="text-[8px] text-gray-500">{c.orders} orders processed</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white font-bold">{c.ltv}</p>
                    <span className={`text-[7px] px-1.5 py-0.2 rounded ${c.c}`}>{c.s}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "analytics",
      label: t("features.tab.analytics"),
      title: t("features.analytics.title"),
      subtitle: t("features.analytics.subtitle"),
      highlights: [
        t("features.analytics.h1"),
        t("features.analytics.h2"),
        t("features.analytics.h3"),
        t("features.analytics.h4"),
      ],
      mockup: (
        <div className="bg-dark-900 rounded-xl p-6 border border-white/5">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="glass-card p-3 border-l-2 border-accent-500">
              <p className="text-[9px] text-gray-500">Total Revenue</p>
              <p className="text-xl font-bold text-white">$4,842</p>
              <p className="text-[9px] text-green-400">↑ 23% this month</p>
            </div>
            <div className="glass-card p-3 border-l-2 border-green-500">
              <p className="text-[9px] text-gray-500">Completion</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-10 h-10 rounded-full border-2 border-green-400 flex items-center justify-center">
                  <span className="text-xs font-bold text-green-400">78%</span>
                </div>
              </div>
            </div>
            <div className="glass-card p-3 border-l-2 border-blue-500">
              <p className="text-[9px] text-gray-500">Total Time</p>
              <p className="text-xl font-bold text-white">124h</p>
              <p className="text-[9px] text-gray-400">Avg 2.1h/project</p>
            </div>
            <div className="glass-card p-3 border-l-2 border-purple-500">
              <p className="text-[9px] text-gray-500">Avg Cost</p>
              <p className="text-xl font-bold text-white">$48</p>
              <p className="text-[9px] text-gray-400">Per project</p>
            </div>
          </div>
          <div className="glass-card p-3">
            <p className="text-[9px] text-gray-500 mb-2">STATUS BREAKDOWN</p>
            <div className="space-y-2">
              {[
                { l: "Completed", pct: 45, c: "bg-green-500" },
                { l: "In Progress", pct: 33, c: "bg-accent-500" },
                { l: "Planned", pct: 22, c: "bg-dark-600" },
              ].map((s) => (
                <div key={s.l} className="flex items-center gap-2">
                  <span className="text-[8px] text-gray-500 w-16">{s.l}</span>
                  <div className="flex-1 h-2 bg-dark-700 rounded-full overflow-hidden">
                    <div className={`h-full ${s.c} rounded-full`} style={{ width: `${s.pct}%` }} />
                  </div>
                  <span className="text-[9px] text-gray-400 w-8">{s.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="features" ref={ref} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-xs text-accent-400 tracking-[0.2em] uppercase font-medium">
            {t("features.badge")}
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-[Outfit] text-white mt-4 mb-6">
            {t("features.title")}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            {t("features.subtitle")}
          </p>
        </motion.div>

        {/* Feature tabs + content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Tab navigation */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-72 shrink-0"
          >
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {features.map((f, i) => (
                <button
                  key={f.id}
                  onClick={() => setActive(i)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left whitespace-nowrap transition-all duration-300 ${
                    active === i
                      ? "bg-accent-500/10 border border-accent-500/20 text-white"
                      : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.02] border border-transparent"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full transition-colors ${
                      active === i ? "bg-accent-500" : "bg-dark-600"
                    }`}
                  />
                  <span className="text-sm font-medium">{f.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Feature detail */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex-1"
          >
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="text-2xl sm:text-3xl font-bold text-white font-[Outfit] mb-3">
                {features[active].title}
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                {features[active].subtitle}
              </p>

              {/* Highlights */}
              <div className="flex flex-wrap gap-2 mb-8">
                {features[active].highlights.map((h) => (
                  <span
                    key={h}
                    className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-gray-300 border border-white/5"
                  >
                    {h}
                  </span>
                ))}
              </div>

              {/* Mockup */}
              <div className="relative">
                <div className="absolute inset-0 bg-accent-500/5 rounded-2xl blur-[40px] -z-10" />
                {features[active].mockup}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
