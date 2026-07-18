"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function Benefits() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const benefits = [
    {
      icon: "⏱",
      feature: t("benefits.calc.feature"),
      title: t("benefits.calc.title"),
      description: t("benefits.calc.desc"),
      outcome: t("benefits.calc.outcome"),
      gradient: "from-orange-500/20 to-amber-500/20",
      stat: t("benefits.calc.stat"),
      statLabel: t("benefits.calc.statLabel"),
    },
    {
      icon: "📦",
      feature: t("benefits.inv.feature"),
      title: t("benefits.inv.title"),
      description: t("benefits.inv.desc"),
      outcome: t("benefits.inv.outcome"),
      gradient: "from-emerald-500/20 to-teal-500/20",
      stat: t("benefits.inv.stat"),
      statLabel: t("benefits.inv.statLabel"),
    },
    {
      icon: "📋",
      feature: t("benefits.order.feature"),
      title: t("benefits.order.title"),
      description: t("benefits.order.desc"),
      outcome: t("benefits.order.outcome"),
      gradient: "from-blue-500/20 to-indigo-500/20",
      stat: t("benefits.order.stat"),
      statLabel: t("benefits.order.statLabel"),
    },
    {
      icon: "⚡",
      feature: t("benefits.presets.feature"),
      title: t("benefits.presets.title"),
      description: t("benefits.presets.desc"),
      outcome: t("benefits.presets.outcome"),
      gradient: "from-purple-500/20 to-pink-500/20",
      stat: t("benefits.presets.stat"),
      statLabel: t("benefits.presets.statLabel"),
    },
    {
      icon: "📄",
      feature: t("benefits.quote.feature"),
      title: t("benefits.quote.title"),
      description: t("benefits.quote.desc"),
      outcome: t("benefits.quote.outcome"),
      gradient: "from-cyan-500/20 to-sky-500/20",
      stat: t("benefits.quote.stat"),
      statLabel: t("benefits.quote.statLabel"),
    },
    {
      icon: "📐",
      feature: t("benefits.nest.feature"),
      title: t("benefits.nest.title"),
      description: t("benefits.nest.desc"),
      outcome: t("benefits.nest.outcome"),
      gradient: "from-rose-500/20 to-red-500/20",
      stat: t("benefits.nest.stat"),
      statLabel: t("benefits.nest.statLabel"),
    },
  ];

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
            {t("benefits.badge")}
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-[Outfit] text-white mt-4 mb-6">
            {t("benefits.title")}
            <br />
            <span className="gradient-text-accent">{t("benefits.titleAccent")}</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            {t("benefits.subtitle")}
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
