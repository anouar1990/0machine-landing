"use client";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";

const features = [
  {
    id: "dashboard",
    label: "Dashboard",
    title: "Your entire workshop, one glance",
    subtitle: "See total projects, active jobs, completed work, and revenue at a glance. No more guessing where things stand.",
    highlights: ["Real-time project stats", "Revenue tracking", "Recent projects feed", "Status overview"],
    mockup: (
      <div className="bg-dark-900 rounded-xl p-6 border border-white/5">
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { v: "24", l: "Total", c: "text-accent-400", icon: "📊" },
            { v: "8", l: "In Progress", c: "text-yellow-400", icon: "⏱" },
            { v: "16", l: "Completed", c: "text-green-400", icon: "✅" },
            { v: "$2,847", l: "Revenue", c: "text-blue-400", icon: "📈" },
          ].map((s) => (
            <div key={s.l} className="glass-card p-4">
              <span className="text-lg">{s.icon}</span>
              <p className={`text-2xl font-bold ${s.c} mt-1`}>{s.v}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{s.l}</p>
            </div>
          ))}
        </div>
        <div className="glass-card p-3">
          <p className="text-[10px] text-gray-500 mb-2 tracking-wider">RECENT PROJECTS</p>
          {["Precision Gear Set — $145.50", "Architectural Model V2 — $210.75", "Custom Signage — $98.20"].map((p) => (
            <div key={p} className="py-2 border-b border-white/5 text-xs text-gray-300 last:border-0">{p}</div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "cost-calc",
    label: "Cost Calculator",
    title: "Real-time cost & profit calculation",
    subtitle: "Input material cost, sheet dimensions, laser time, electricity, machine wear, and labor. See your cost breakdown and recommended selling price instantly.",
    highlights: ["Material cost per unit", "Machine & energy tracking", "Profit margin calculator", "Recommended pricing"],
    mockup: (
      <div className="bg-dark-900 rounded-xl p-6 border border-white/5">
        <div className="flex gap-4">
          <div className="flex-1 space-y-3">
            <div className="glass-card p-3">
              <p className="text-[10px] text-gray-500 mb-2">PROJECT</p>
              <p className="text-sm text-white font-medium">Custom Coasters</p>
              <p className="text-xs text-gray-400 mt-1">Birch Plywood 3mm</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { l: "Sheet Cost", v: "$25.00" },
                { l: "Usage", v: "80%" },
                { l: "Laser Time", v: "45 min" },
                { l: "Labor", v: "$10.00" },
              ].map((f) => (
                <div key={f.l} className="glass-card p-2.5">
                  <p className="text-[9px] text-gray-500">{f.l}</p>
                  <p className="text-xs text-white font-medium">{f.v}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="w-40">
            <div className="glass-card p-3 mb-2">
              <p className="text-[10px] text-gray-500 mb-2">COST BREAKDOWN</p>
              {[
                { l: "Material", v: "$20.00" },
                { l: "Electricity", v: "$1.13" },
                { l: "Machine Wear", v: "$2.00" },
                { l: "Labor", v: "$10.00" },
              ].map((c) => (
                <div key={c.l} className="flex justify-between py-1">
                  <span className="text-[9px] text-gray-500">{c.l}</span>
                  <span className="text-[9px] text-white">{c.v}</span>
                </div>
              ))}
              <div className="border-t border-white/10 mt-2 pt-2 flex justify-between">
                <span className="text-[10px] text-gray-400 font-medium">Total</span>
                <span className="text-xs text-accent-400 font-bold">$33.13</span>
              </div>
            </div>
            <div className="glass-card p-3 text-center border-accent-500/20">
              <p className="text-[9px] text-gray-500">Selling Price</p>
              <p className="text-xl font-bold text-accent-400">$49.70</p>
              <div className="flex gap-2 mt-1">
                <div className="flex-1 bg-green-500/10 rounded p-1">
                  <p className="text-[8px] text-green-400">$16.57</p>
                  <p className="text-[7px] text-gray-500">Profit</p>
                </div>
                <div className="flex-1 bg-green-500/10 rounded p-1">
                  <p className="text-[8px] text-green-400">50%</p>
                  <p className="text-[7px] text-gray-500">Margin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "materials",
    label: "Materials",
    title: "Your entire material library, organized",
    subtitle: "Track plywood, acrylic, MDF, leather — with thickness, sheet size, price per sheet, and live stock count. Know your inventory value at all times.",
    highlights: ["SKU tracking", "Stock levels", "Inventory value", "Low stock alerts"],
    mockup: (
      <div className="bg-dark-900 rounded-xl p-6 border border-white/5">
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="glass-card p-3 text-center">
            <p className="text-xl font-bold text-accent-400">12</p>
            <p className="text-[9px] text-gray-500">Total SKUs</p>
          </div>
          <div className="glass-card p-3 text-center">
            <p className="text-xl font-bold text-yellow-400">2</p>
            <p className="text-[9px] text-gray-500">Low Stock</p>
          </div>
          <div className="glass-card p-3 text-center">
            <p className="text-xl font-bold text-green-400">$1,248</p>
            <p className="text-[9px] text-gray-500">Inventory Value</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { name: "Birch Plywood 3mm", type: "Wood", price: "$18/sheet", stock: "10", color: "bg-amber-500/15 text-amber-400" },
            { name: "Clear Acrylic 4mm", type: "Acrylic", price: "$24/sheet", stock: "5", color: "bg-cyan-500/15 text-cyan-400" },
            { name: "MDF 6mm", type: "Wood", price: "$14/sheet", stock: "8", color: "bg-amber-500/15 text-amber-400" },
          ].map((m) => (
            <div key={m.name} className="glass-card p-3">
              <span className={`text-[8px] px-1.5 py-0.5 rounded ${m.color}`}>{m.type}</span>
              <p className="text-xs text-white font-medium mt-1.5">{m.name}</p>
              <p className="text-[9px] text-gray-500 mt-0.5">{m.price}</p>
              <div className="mt-2">
                <span className="text-[9px] text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded">{m.stock} sheets</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "presets",
    label: "Laser Presets",
    title: "Your machine settings, always ready",
    subtitle: "Save speed, power, frequency, passes, air assist, and focus per material. Switch materials and load the right settings in seconds.",
    highlights: ["Multi-machine support", "Per-material settings", "Notes & tips", "Star favorites"],
    mockup: (
      <div className="bg-dark-900 rounded-xl p-6 border border-white/5">
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: "3mm Birch Plywood", speed: "20", power: "85%", freq: "1000", passes: "1", air: true, note: "Clean cut, slight smoke" },
            { name: "4mm Clear Acrylic", speed: "15", power: "90%", freq: "1500", passes: "1", air: true, note: "Remove protective film first" },
            { name: "Birch Plywood Engrave", speed: "200", power: "40%", freq: "500", passes: "1", air: false, note: "Good contrast, medium depth" },
            { name: "Leather 2mm", speed: "150", power: "25%", freq: "500", passes: "1", air: false, note: "Ventilate well, low power" },
          ].map((p) => (
            <div key={p.name} className="glass-card p-3">
              <div className="flex items-center gap-1 mb-1.5">
                <span className="text-accent-400 text-xs">★</span>
                <p className="text-xs text-white font-medium truncate">{p.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-1 mb-2">
                <div className="bg-dark-800 rounded px-2 py-1">
                  <p className="text-[7px] text-gray-500">Speed</p>
                  <p className="text-[10px] text-white">{p.speed} mm/s</p>
                </div>
                <div className="bg-dark-800 rounded px-2 py-1">
                  <p className="text-[7px] text-gray-500">Power</p>
                  <p className="text-[10px] text-accent-400 font-medium">{p.power}</p>
                </div>
              </div>
              <p className="text-[8px] text-gray-500 leading-relaxed">{p.note}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "quotes",
    label: "Quotes",
    title: "Win clients with professional quotes",
    subtitle: "Create itemized quotes with line items, custom descriptions, VAT, and totals. Look like a serious business from day one.",
    highlights: ["Line items & descriptions", "VAT calculation", "Client-ready format", "Quote tracking"],
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
    id: "analytics",
    label: "Analytics",
    title: "Understand your business with smart numbers",
    subtitle: "Track total revenue, completion rates, top-earning projects, material usage, and average cost per job. Know exactly where your profits come from.",
    highlights: ["Revenue tracking", "Completion rates", "Top projects", "Time analysis"],
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

export default function FeatureShowcase() {
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
            Product Tour
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-[Outfit] text-white mt-4 mb-6">
            Everything You Need.
            <br />
            <span className="gradient-text-accent">Nothing You Don't.</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Seven powerful tools designed for the way laser and CNC workshops
            actually work.
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
