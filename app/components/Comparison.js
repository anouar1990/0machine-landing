"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import { X, Check } from "lucide-react";

export default function Comparison() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const withoutItems = [
    t("comp.old.1"),
    t("comp.old.2"),
    t("comp.old.3"),
    t("comp.old.4"),
    t("comp.old.5"),
    t("comp.old.6"),
  ];

  const withItems = [
    t("comp.new.1"),
    t("comp.new.2"),
    t("comp.new.3"),
    t("comp.new.4"),
    t("comp.new.5"),
    t("comp.new.6"),
  ];

  return (
    <section ref={ref} className="relative py-28 sm:py-32 overflow-hidden bg-[#0e100f] border-t border-[#42433d]/40">
      <div className="absolute inset-0 grid-pattern opacity-15 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#42433D] bg-[#141513] mb-4 shadow-lg shadow-black/40">
            <span className="w-2 h-2 rounded-full bg-[#FE7733] animate-pulse" />
            <span className="text-xs text-[#FFA266] tracking-[0.2em] uppercase font-mono font-semibold">
              {t("comp.badge") || "WORKSHOP COMPARISON"}
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black font-[Outfit] text-[#FFFCE1] mt-2 mb-4 tracking-[-0.04em] leading-[1.05]">
            {t("comp.title")}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] via-[#FE7733] to-[#FFA266]">
              {t("comp.titleAccent")}
            </span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Without */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-[24px] bg-[#141513] border border-red-500/20 p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <X size={18} strokeWidth={2.5} className="text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-[Outfit]">
                  {t("comp.col.old")}
                </h3>
                <p className="text-xs text-red-400/80">
                  {t("comp.subtitle")}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {withoutItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-[#0e100f] border border-red-500/10"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400/60 mt-2 shrink-0" />
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {item}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* With */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="rounded-[24px] bg-[#141513] border border-[#abff84]/30 p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#abff84]/10 border border-[#abff84]/20 flex items-center justify-center">
                <Check size={18} strokeWidth={2.5} className="text-[#abff84]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-[Outfit]">
                  {t("comp.col.new")}
                </h3>
                <p className="text-xs text-[#abff84]/80">
                  {t("comp.col.new")}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {withItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-[#0e100f] border border-[#abff84]/20"
                >
                  <Check size={14} strokeWidth={2} className="text-[#abff84] mt-1 shrink-0" />
                  <p className="text-sm text-[#fffce1] leading-relaxed">
                    {item}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
