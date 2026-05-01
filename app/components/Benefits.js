"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const benefits = [
  {
    icon: "⏱",
    feature: "Cost Calculator",
    title: "Know your true cost per job — instantly",
    description:
      "Input materials, laser time, electricity, labor, and machine wear. Get a real-time cost breakdown with recommended selling price. Never underprice a job again.",
    outcome: "Stop losing money on jobs you thought were profitable",
    gradient: "from-orange-500/20 to-amber-500/20",
    stat: "3x",
    statLabel: "faster quoting",
  },
  {
    icon: "📦",
    feature: "Material Inventory",
    title: "Track every sheet, every cut, every dollar",
    description:
      "Manage your plywood, acrylic, MDF, and leather stock with real-time inventory value. Get low-stock alerts before you run out mid-project.",
    outcome: "Eliminate surprise material shortages during production",
    gradient: "from-emerald-500/20 to-teal-500/20",
    stat: "0",
    statLabel: "stockouts",
  },
  {
    icon: "📋",
    feature: "Order Management",
    title: "Every order tracked from request to delivery",
    description:
      "See all orders at a glance — Pending, In Progress, Completed. Track client names, due dates, revenue earned, and pending payments in one view.",
    outcome: "Never miss a deadline or forget a client order",
    gradient: "from-blue-500/20 to-indigo-500/20",
    stat: "100%",
    statLabel: "order visibility",
  },
  {
    icon: "⚡",
    feature: "Laser Presets",
    title: "Perfect settings every time, zero guesswork",
    description:
      "Save speed, power, frequency, passes, and air assist settings per material. Load presets instantly when switching between plywood, acrylic, or leather.",
    outcome: "Reduce wasted material from wrong machine settings",
    gradient: "from-purple-500/20 to-pink-500/20",
    stat: "10s",
    statLabel: "to load settings",
  },
  {
    icon: "📄",
    feature: "Quote Generator",
    title: "Send professional quotes in under a minute",
    description:
      "Create detailed quotes with line items, VAT, and totals. Look professional and close deals faster with client-ready documents.",
    outcome: "Win more clients with polished, instant quotes",
    gradient: "from-cyan-500/20 to-sky-500/20",
    stat: "60s",
    statLabel: "to send a quote",
  },
  {
    icon: "📐",
    feature: "Nesting Estimator",
    title: "Maximize every sheet, minimize every waste",
    description:
      "Calculate how many parts fit on a sheet before you cut. Optimize material usage and reduce scrap across every job.",
    outcome: "Save up to 30% on material costs with smarter nesting",
    gradient: "from-rose-500/20 to-red-500/20",
    stat: "30%",
    statLabel: "less waste",
  },
];

export default function Benefits() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="benefits" ref={ref} className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-mesh opacity-50" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-500/20 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-xs text-accent-400 tracking-[0.2em] uppercase font-medium">
            Real Benefits
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-[Outfit] text-white mt-4 mb-6">
            Every Feature Saves You
            <br />
            <span className="gradient-text-accent">Time and Money</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Built from real workshop pain points. Every tool in 0Machine exists
            because makers asked for it.
          </p>
        </motion.div>

        {/* Benefits grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="glass-card-hover p-6 sm:p-8 group relative overflow-hidden"
            >
              {/* Gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[20px]`}
              />

              <div className="relative z-10">
                {/* Icon & badge */}
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{benefit.icon}</span>
                  <span className="text-[10px] text-accent-400 bg-accent-500/10 px-2.5 py-1 rounded-full font-medium">
                    {benefit.feature}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3 font-[Outfit] leading-tight">
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-400 leading-relaxed mb-5">
                  {benefit.description}
                </p>

                {/* Outcome */}
                <div className="flex items-start gap-2 p-3 rounded-xl bg-dark-800/50 border border-white/5 mb-5">
                  <span className="text-green-400 text-sm mt-0.5">✓</span>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {benefit.outcome}
                  </p>
                </div>

                {/* Stat */}
                <div className="flex items-end gap-2 pt-4 border-t border-white/5">
                  <span className="text-3xl font-bold text-accent-400 font-[Outfit]">
                    {benefit.stat}
                  </span>
                  <span className="text-xs text-gray-500 mb-1">
                    {benefit.statLabel}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
