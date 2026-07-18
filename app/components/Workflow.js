"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function Workflow() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      num: "01",
      title: t("flow.step1.title"),
      desc: t("flow.step1.desc"),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
      ),
      color: "from-orange-500 to-amber-500",
      glowColor: "rgba(249,115,22,0.15)",
    },
    {
      num: "02",
      title: t("flow.step2.title"),
      desc: t("flow.step2.desc"),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008H18v-.008zm0 2.25h.008v.008H18V13.5zM4.5 4.5h15" />
        </svg>
      ),
      color: "from-blue-500 to-indigo-500",
      glowColor: "rgba(59,130,246,0.15)",
    },
    {
      num: "03",
      title: t("flow.step3.title"),
      desc: t("flow.step3.desc"),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.16-3.01A1.125 1.125 0 016 11.1V5.29a1.125 1.125 0 011.68-.98l5.16 3.01a1.125 1.125 0 01.56.97v5.82a1.125 1.125 0 01-.98 1.06zM17.42 15.17l-5.16-3.01a1.125 1.125 0 01-.56-.97V5.29a1.125 1.125 0 011.68-.98l5.16 3.01a1.125 1.125 0 01.56.97v5.82a1.125 1.125 0 01-1.68.98z" />
        </svg>
      ),
      color: "from-emerald-500 to-teal-500",
      glowColor: "rgba(16,185,129,0.15)",
    },
    {
      num: "04",
      title: t("flow.step4.title"),
      desc: t("flow.step4.desc"),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
      ),
      color: "from-purple-500 to-pink-500",
      glowColor: "rgba(168,85,247,0.15)",
    },
  ];

  return (
    <section id="workflow" ref={ref} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-xs text-accent-400 tracking-[0.2em] uppercase font-medium">
            {t("flow.badge")}
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-[Outfit] text-white mt-4 mb-6">
            {t("flow.title")}
            <br />
            <span className="gradient-text-accent">{t("flow.titleAccent")}</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            {t("flow.step1.desc") ? "A streamlined workflow that mirrors how real laser workshops operate." : ""}
          </p>
        </motion.div>

        {/* Steps timeline */}
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent-500/30 via-blue-500/20 to-purple-500/30 hidden sm:block" />

          <div className="space-y-16 sm:space-y-24">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15, duration: 0.7 }}
                className={`relative flex flex-col lg:flex-row items-center gap-8 ${
                  i % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Step number node */}
                <div className="absolute left-8 lg:left-1/2 -translate-x-1/2 hidden sm:block">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center border border-white/10"
                    style={{
                      background: `linear-gradient(135deg, ${step.glowColor}, transparent)`,
                      boxShadow: `0 0 40px ${step.glowColor}`,
                    }}
                  >
                    <span className="text-sm font-bold text-white font-[Outfit]">
                      {step.num}
                    </span>
                  </div>
                </div>

                {/* Content card */}
                <div className={`lg:w-5/12 ${i % 2 === 0 ? "lg:pr-16" : "lg:pl-16"}`}>
                  <div className="glass-card-hover p-6 sm:p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} bg-opacity-10 flex items-center justify-center text-white`}
                        style={{ background: step.glowColor }}
                      >
                        {step.icon}
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 tracking-wider uppercase block sm:hidden">
                          Step {step.num}
                        </span>
                        <h3 className="text-xl font-bold text-white font-[Outfit]">
                          {step.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="lg:w-5/12 hidden lg:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
