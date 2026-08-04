"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import { trackEvent } from "../lib/analytics";

export default function Hero() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const mockupY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background effects */}
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute inset-0 grid-pattern" />

      {/* Radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-accent-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px]" />

      <motion.div
        style={{ opacity, scale }}
        className="relative z-10 max-w-7xl mx-auto px-6 text-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent-500/20 bg-accent-500/5 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse" />
          <span className="text-xs text-accent-400 font-medium tracking-wide">
            {t("hero.badge")}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-5xl sm:text-6xl lg:text-8xl font-bold font-[Outfit] leading-[1.05] tracking-tight mb-6"
        >
          <span className="text-white">{t("hero.title1")}</span>
          <br />
          <span className="text-white">{t("hero.title2")}</span>
          <span className="gradient-text-accent">{t("hero.titleAccent")}</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {t("hero.subtitle")}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6"
        >
          <a 
            href="https://app.0machine.com" 
            onClick={() => trackEvent('cta_click', { button: 'hero_trial' })}
            className="glow-btn text-base px-8 py-4"
          >
            {t("hero.ctaTrial")}
          </a>
          <a href="#features" className="glow-btn-outline text-base px-8 py-4">
            {t("hero.ctaFeatures")}
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-sm text-gray-600 mb-16"
        >
          {t("hero.trialNote")}
        </motion.p>

        {/* Floating Dashboard Mockup */}
        <motion.div
          style={{ y: mockupY }}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Glow behind mockup */}
          <div className="absolute inset-0 bg-accent-500/10 rounded-3xl blur-[60px] -z-10 scale-90" />

          {/* Main mockup card */}
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
            {/* Browser chrome */}
            <div className="bg-dark-800 px-4 py-3 flex items-center gap-2 border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-dark-700 rounded-lg px-4 py-1 text-xs text-gray-500 flex items-center gap-2">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  app.0machine.com
                </div>
              </div>
            </div>

            {/* Real App Screenshot Image */}
            <div className="bg-dark-950 p-2 relative group">
              <img 
                src="/screenshots/screenshot-dashboard.png" 
                alt="0Machine Workshop Real-Time Operational Dashboard" 
                className="w-full h-auto rounded-xl border border-white/10 shadow-2xl transition-transform duration-500 group-hover:scale-[1.01]" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950/60 via-transparent to-transparent pointer-events-none rounded-xl" />
            </div>
          </div>

          {/* Floating elements around mockup */}
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -right-8 top-20 glass-card p-3 hidden lg:block"
          >
            <p className="text-[10px] text-gray-500 mb-1">Material Cost</p>
            <p className="text-sm font-bold text-white">$45.00</p>
            <p className="text-[9px] text-green-400">Oak 6mm · 3 sheets</p>
          </motion.div>

          <motion.div
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            className="absolute -left-6 bottom-32 glass-card p-3 hidden lg:block"
          >
            <p className="text-[10px] text-gray-500 mb-1">Time Tracked</p>
            <p className="text-sm font-bold text-white">3h 15m</p>
            <div className="w-16 h-1 bg-dark-700 rounded-full mt-1">
              <div className="w-3/4 h-full bg-accent-500 rounded-full" />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-gray-600 tracking-wider">SCROLL TO EXPLORE</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 rounded-full border border-gray-700 flex items-start justify-center p-1"
        >
          <div className="w-1 h-2 rounded-full bg-accent-500" />
        </motion.div>
      </motion.div>
    </section>
  );
}
