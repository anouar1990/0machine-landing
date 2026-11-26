"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Clock, Package, ClipboardList, Zap, FileText, Maximize2, Check } from "lucide-react";

export default function Benefits() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const benefits = [
    {
      icon: Clock,
      feature: t("benefits.calc.feature"),
      title: t("benefits.calc.title"),
      description: t("benefits.calc.desc"),
      outcome: t("benefits.calc.outcome"),
      stat: t("benefits.calc.stat"),
      statLabel: t("benefits.calc.statLabel"),
    },
    {
      icon: Package,
      feature: t("benefits.inv.feature"),
      title: t("benefits.inv.title"),
      description: t("benefits.inv.desc"),
      outcome: t("benefits.inv.outcome"),
      stat: t("benefits.inv.stat"),
      statLabel: t("benefits.inv.statLabel"),
    },
    {
      icon: ClipboardList,
      feature: t("benefits.order.feature"),
      title: t("benefits.order.title"),
      description: t("benefits.order.desc"),
      outcome: t("benefits.order.outcome"),
      stat: t("benefits.order.stat"),
      statLabel: t("benefits.order.statLabel"),
    },
    {
      icon: Zap,
      feature: t("benefits.presets.feature"),
      title: t("benefits.presets.title"),
      description: t("benefits.presets.desc"),
      outcome: t("benefits.presets.outcome"),
      stat: t("benefits.presets.stat"),
      statLabel: t("benefits.presets.statLabel"),
    },
    {
      icon: FileText,
      feature: t("benefits.quote.feature"),
      title: t("benefits.quote.title"),
      description: t("benefits.quote.desc"),
      outcome: t("benefits.quote.outcome"),
      stat: t("benefits.quote.stat"),
      statLabel: t("benefits.quote.statLabel"),
    },
    {
      icon: Maximize2,
      feature: t("benefits.nest.feature"),
      title: t("benefits.nest.title"),
      description: t("benefits.nest.desc"),
      outcome: t("benefits.nest.outcome"),
      stat: t("benefits.nest.stat"),
      statLabel: t("benefits.nest.statLabel"),
    },
  ];

  return (
    <section id="benefits" ref={ref} className="relative py-32 overflow-hidden bg-[#0e100f] border-t border-[#42433d]/40">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#42433D] bg-[#141513] mb-4 shadow-lg shadow-black/40">
            <span className="w-2 h-2 rounded-full bg-[#FE7733] animate-pulse" />
            <span className="text-xs text-[#FFA266] tracking-[0.2em] uppercase font-mono font-semibold">
              {t("benefits.badge") || "WORKSHOP ADVANTAGE"}
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black font-[Outfit] text-[#FFFCE1] mt-2 mb-4 tracking-[-0.04em] leading-[1.05]">
            {t("benefits.title")}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] via-[#FE7733] to-[#FFA266]">
              {t("benefits.titleAccent")}
            </span>
          </h2>
          <p className="text-[#8B95A8] max-w-2xl mx-auto text-base sm:text-lg">
            {t("benefits.subtitle")}
          </p>
        </motion.div>

        {/* Benefits grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="p-6 sm:p-8 rounded-[24px] bg-[#141513] border border-[#42433d] hover:border-[#abff84]/50 transition-all shadow-xl group relative overflow-hidden"
              >
                <div className="relative z-10">
                  {/* Icon & badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#0e100f] border border-[#42433d] flex items-center justify-center text-[#abff84]">
                      <Icon size={18} strokeWidth={1.75} />
                    </div>
                    <span className="text-[10px] text-[#abff84] bg-[#abff84]/10 border border-[#abff84]/20 px-2.5 py-1 rounded-full font-mono font-bold">
                      {benefit.feature}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-[#fffce1] mb-3 font-[Outfit] leading-tight">
                    {benefit.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-[#7c7c6f] leading-relaxed mb-5">
                    {benefit.description}
                  </p>

                  {/* Outcome */}
                  <div className="flex items-start gap-2 p-3 rounded-full bg-[#0e100f] border border-[#42433d]/60 mb-5">
                    <Check size={14} strokeWidth={2} className="text-[#abff84] mt-0.5 ml-1 flex-shrink-0" />
                    <p className="text-xs text-[#fffce1]/90 leading-relaxed truncate">
                      {benefit.outcome}
                    </p>
                  </div>

                  {/* Stat */}
                  <div className="flex items-end gap-2 pt-4 border-t border-[#42433d]/50">
                    <span className="text-3xl font-black text-[#fffce1] font-[Outfit]">
                      {benefit.stat}
                    </span>
                    <span className="text-xs text-[#7c7c6f] font-mono mb-1">
                      {benefit.statLabel}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
