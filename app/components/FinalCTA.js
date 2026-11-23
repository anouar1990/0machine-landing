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
    <section ref={ref} className="relative py-32 overflow-hidden bg-[#0e100f] border-t border-[#42433d]/40">
      <div className="absolute inset-0 grid-pattern opacity-25 pointer-events-none" />

      {/* Large glow orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#0ae448]/8 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-[#ff8709]/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#42433d] bg-[#141513] mb-8 shadow-lg shadow-black/40">
            <span className="w-2 h-2 rounded-full bg-[#abff84] animate-pulse" />
            <span className="text-xs text-[#abff84] tracking-[0.2em] uppercase font-mono font-semibold">
              ATELIER PASS · COMMERCIAL RESALE
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black font-[Outfit] text-[#fffce1] mb-6 leading-[0.96] tracking-[-0.04em]">
            {t("final.title") || "Ready to Transform"}
            <br />
            {t("final.titleMid") || "Your Laser Workshop?"}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fffce1] via-[#abff84] to-[#0ae448]">
              {t("final.titleAccent") || "Start Free in Seconds."}
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-[#7c7c6f] max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            {t("final.subtitle")}
          </p>

          {/* CTA buttons (GSAP Outlined Pill) */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <a
              href="https://app.0machine.com"
              onClick={() => trackEvent('cta_click', { button: 'final_cta_trial' })}
              className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-full bg-[#fffce1] hover:bg-[#abff84] text-[#0e100f] font-black text-base sm:text-lg tracking-tight transition-all font-[Outfit] shadow-2xl hover:shadow-[0_0_35px_rgba(171,255,132,0.35)] active:scale-95 cursor-pointer w-full sm:w-auto"
            >
              <span>{t("final.cta.trial") || "Launch Studio Free →"}</span>
            </a>
            <a
              href="#designs-vault"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-full bg-[#141513] hover:bg-[#191919] border border-[#42433d] hover:border-[#abff84] text-[#fffce1] font-bold text-base sm:text-lg tracking-tight transition-all font-[Outfit] hover:shadow-[0_0_20px_rgba(171,255,132,0.18)] active:scale-95 cursor-pointer w-full sm:w-auto"
            >
              <span>{t("final.cta.features") || "Explore 300K+ Vault ↓"}</span>
            </a>
          </div>

          <p className="text-xs sm:text-sm text-[#7c7c6f] max-w-md mx-auto">
            {t("final.terms")}
          </p>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-2.5 mt-12"
          >
            {features.map((feature) => (
              <span
                key={feature}
                className="text-xs px-3.5 py-1.5 rounded-full bg-[#141513] text-[#7c7c6f] border border-[#42433d] font-mono"
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
