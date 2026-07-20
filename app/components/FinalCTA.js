"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import { trackEvent } from "../lib/analytics";

export default function FinalCTA() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    t("benefits.calc.feature"),
    t("benefits.inv.feature"),
    t("benefits.order.feature"),
    t("benefits.presets.feature"),
    t("benefits.quote.feature"),
    t("price.pro.f1"),
    t("price.trial.f6") || "Analytics",
    t("price.pro.f3"),
    t("price.pro.f5"),
    t("benefits.nest.feature"),
  ];

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 gradient-mesh" />

      {/* Large glow orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-500/8 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-600 shadow-xl shadow-accent-500/30 mb-8"
          >
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold font-[Outfit] text-white mb-6 leading-tight">
            {t("final.title")}
            <br />
            {t("final.titleMid")}
            <br />
            <span className="gradient-text-accent">{t("final.titleAccent")}</span>
          </h2>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t("final.subtitle")}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <a
              href="https://app.0machine.com"
              onClick={() => trackEvent('cta_click', { button: 'final_cta_trial' })}
              className="glow-btn text-lg px-10 py-5"
            >
              {t("final.cta.trial")}
            </a>
            <a href="#features" className="glow-btn-outline text-lg px-10 py-5">
              {t("final.cta.features")}
            </a>
          </div>

          <p className="text-sm text-gray-600">
            {t("final.terms")}
          </p>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3 mt-12"
          >
            {features.map((feature) => (
              <span
                key={feature}
                className="text-xs px-3 py-1.5 rounded-full bg-white/[0.03] text-gray-500 border border-white/5"
              >
                {feature}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
