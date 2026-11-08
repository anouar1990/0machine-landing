"use client";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { trackEvent } from "../lib/analytics";

const HERO_TABS = [
  {
    id: "vault",
    label: "💎 Designs Vault",
    shortLabel: "Designs",
    path: "app.0machine.com/library",
    src: "/screenshots/screenshot-designs-vault.png",
    alt: "0Machine Commercial Designs Vault with 5,000+ Ready-to-Cut Vector Packs",
    tag: "5,000+ Ready-to-Cut",
    badge: "Commercial License",
  },
  {
    id: "laser-ai",
    label: "🤖 LaserAI Studio",
    shortLabel: "LaserAI",
    path: "app.0machine.com/laser-ai",
    src: "/screenshots/screenshot-laser-ai.png",
    alt: "0Machine LaserAI Studio Text-to-Vector Generator for laser cut designs",
    tag: "Prompt to SVG/DXF",
    badge: "Kerf-Compensated",
  },
  {
    id: "nesting",
    label: "🧩 Nesting Studio",
    shortLabel: "Nesting",
    path: "app.0machine.com/nesting",
    src: "/screenshots/screenshot-nesting.png",
    alt: "0Machine True-Shape Nesting Studio with ClipperLib collision detection and sheet yield HUD",
    tag: "30-40% Less Scrap",
    badge: "ClipperLib Engine",
  },
  {
    id: "dashboard",
    label: "📊 Workshop Hub",
    shortLabel: "Dashboard",
    path: "app.0machine.com/dashboard",
    src: "/screenshots/screenshot-dashboard.png",
    alt: "0Machine Workshop Hub with live revenue analytics, order status, and inventory alerts",
    tag: "Workshop Hub",
    badge: "Live Telemetry",
  },
];

export default function Hero() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState(0);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const mockupY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  const currentTab = HERO_TABS[activeTab];

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-20"
    >
      {/* Background AI Workshop Visual Integration */}
      <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none">
        <img
          src="/assets/hero-laser-workshop.jpg"
          alt="0Machine Fiber Laser Precision Workshop Cutting Nested Sheets"
          className="w-full h-full object-cover object-center opacity-20 mix-blend-luminosity filter blur-[1px] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950/85 via-dark-950/80 to-dark-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-950 via-transparent to-dark-950 opacity-90" />
      </div>

      {/* Ambient glowing meshes */}
      <div className="absolute inset-0 gradient-mesh opacity-70 pointer-events-none -z-10" />
      <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none -z-10" />

      {/* Radial soft laser ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-accent-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-1/4 w-[450px] h-[450px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <motion.div
        style={{ opacity, scale }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent-500/30 bg-accent-500/10 backdrop-blur-md mb-8 shadow-lg shadow-accent-500/10"
        >
          <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
          <span className="text-xs text-accent-300 font-semibold tracking-wide">
            {t("hero.badge")}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8 }}
          className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black font-[Outfit] leading-[1.06] tracking-tight mb-6"
        >
          <span className="text-white">{t("hero.title1")}</span>
          <br className="hidden sm:inline" />{" "}
          <span className="text-white">{t("hero.title2")}</span>
          <span className="gradient-text-accent">{t("hero.titleAccent")}</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed font-normal"
        >
          {t("hero.subtitle")}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4"
        >
          <a
            href="#designs-vault"
            onClick={() => trackEvent("cta_click", { button: "hero_designs_vault" })}
            className="glow-btn text-base px-8 py-4 w-full sm:w-auto shadow-xl shadow-accent-500/25 flex items-center justify-center gap-2 font-semibold"
          >
            <span>💎 {t("hero.ctaVault")}</span>
            <span className="text-xs">↓</span>
          </a>
          <a
            href="#laser-ai-video"
            onClick={() => trackEvent("cta_click", { button: "hero_laser_ai" })}
            className="glow-btn-outline text-base px-8 py-4 w-full sm:w-auto text-gray-200 border-white/20 hover:border-accent-500/50 flex items-center justify-center gap-2 font-semibold"
          >
            <span>🤖 {t("hero.ctaLaserAi")}</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FE7733]/20 text-[#FE7733] border border-[#FE7733]/30 font-bold ml-1">
              ▶ 5s Video
            </span>
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-xs sm:text-sm text-gray-400 mb-12"
        >
          {t("hero.trialNote")}
        </motion.p>

        {/* MOCKUP SECTION WITH SCREENSHOT TABS */}
        <motion.div
          style={{ y: mockupY }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1, ease: [0.4, 0, 0.2, 1] }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Mockup Quick Toggle Tabs */}
          <div className="flex items-center justify-center mb-4">
            <div className="inline-flex p-1.5 rounded-2xl bg-dark-900/90 border border-white/10 backdrop-blur-xl shadow-2xl gap-1 max-w-full overflow-x-auto scrollbar-none">
              {HERO_TABS.map((tab, idx) => {
                const isActive = activeTab === idx;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(idx)}
                    className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                      isActive
                        ? "bg-accent-500 text-white shadow-lg shadow-accent-500/30"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span>{tab.label}</span>
                    {isActive && (
                      <span className="hidden md:inline-block text-[10px] px-2 py-0.5 rounded-full bg-black/25 text-white font-medium border border-white/15">
                        {tab.tag}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Glow behind mockup */}
          <div className="absolute inset-0 bg-accent-500/15 rounded-3xl blur-[70px] -z-10 scale-95" />

          {/* Mac Browser Frame with Real Screenshot */}
          <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl shadow-black/90 bg-dark-950">
            {/* Mac Browser Chrome Header */}
            <div className="bg-dark-900/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="hidden sm:flex items-center gap-2 ml-4 text-[11px] font-mono text-gray-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span>app.0machine.com</span>
                </div>
              </div>

              {/* Realistic SSL Address Pill */}
              <div className="bg-dark-950/90 border border-white/10 rounded-lg px-4 py-1 text-xs text-gray-300 font-mono flex items-center gap-2 max-w-sm sm:max-w-md w-full justify-center">
                <span className="text-green-400 text-[10px]">🔒 https://</span>
                <span className="text-white font-medium truncate">{currentTab.path}</span>
              </div>

              {/* Live Link Button */}
              <div className="flex items-center gap-2">
                <a
                  href="https://app.0machine.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold text-accent-400 hover:text-accent-300 bg-accent-500/10 border border-accent-500/20 px-3 py-1 rounded-lg transition-colors"
                >
                  <span>Launch Live</span>
                  <span>↗</span>
                </a>
              </div>
            </div>

            {/* High-Resolution Screenshot Frame */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-dark-950">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentTab.id}
                  src={currentTab.src}
                  alt={currentTab.alt}
                  initial={{ opacity: 0, scale: 0.99 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="w-full h-full object-cover object-top block"
                  loading="eager"
                />
              </AnimatePresence>

              {/* Bottom depth subtle fade */}
              <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-dark-950/80 to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Floating HUD Card 1: Commercial Designs Vault */}
          <motion.div
            animate={{ y: [-8, 8, -8] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-4 -bottom-6 sm:-right-8 sm:bottom-12 glass-card p-3.5 hidden sm:block border-accent-500/30 shadow-2xl shadow-black/80 z-20 backdrop-blur-xl text-left"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
              <p className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">
                Commercial Designs Vault
              </p>
            </div>
            <p className="text-sm font-bold text-white">5,000+ Ready-to-Cut Vectors</p>
            <p className="text-[10px] text-accent-400 font-semibold mt-0.5">
              Full Resale License · SVG, DXF, PDF, AI
            </p>
          </motion.div>

          {/* Floating HUD Card 2: LaserAI Engine */}
          <motion.div
            animate={{ y: [8, -8, 8] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            className="absolute -left-4 -top-6 sm:-left-8 sm:top-28 glass-card p-3.5 hidden sm:block border-purple-500/30 shadow-2xl shadow-black/80 z-20 backdrop-blur-xl text-left"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs">⚡</span>
              <p className="text-[10px] text-purple-400 font-semibold tracking-wider uppercase">
                LaserAI Vector Studio
              </p>
            </div>
            <p className="text-sm font-bold text-white">Prompt → Closed SVG/DXF</p>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">
              Cut (Red) + Engrave (Black) split layers
            </p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10"
      >
        <a href="#designs-vault" className="flex flex-col items-center gap-1.5 group cursor-pointer">
          <span className="text-[10px] text-gray-500 group-hover:text-accent-400 tracking-wider transition-colors">
            EXPLORE DESIGNS VAULT
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-4 h-7 rounded-full border border-gray-700 group-hover:border-accent-500/50 flex items-start justify-center p-1 transition-colors"
          >
            <div className="w-1 h-1.5 rounded-full bg-accent-400" />
          </motion.div>
        </a>
      </motion.div>
    </section>
  );
}
