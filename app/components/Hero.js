"use client";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { trackEvent } from "../lib/analytics";
import StudioApertureViewport from "./StudioApertureViewport";

const HERO_TABS = [
  {
    id: "vault",
    labelKey: "hero.tab.vault",
    shortLabelKey: "hero.tab.vault.short",
    tagKey: "hero.tab.vault.tag",
    label: "Designs Vault",
    shortLabel: "Designs",
    path: "app.0machine.com/library",
    src: "/screenshots/screenshot-designs-vault.webp",
    mobileSrc: "/screenshots/screenshot-designs-vault-mobile.webp",
    alt: "0Machine Commercial Designs Vault with 300,000+ Ready-to-Cut Vector Packs",
    tag: "300,000+ Ready-to-Cut",
    badge: "Commercial License",
    specs: "300K+ Vectors · LightBurn Ready · Instant SVG/DXF",
  },
  {
    id: "laser-ai",
    labelKey: "hero.tab.laserai",
    shortLabelKey: "hero.tab.laserai.short",
    tagKey: "hero.tab.laserai.tag",
    label: "LaserAI Studio",
    shortLabel: "LaserAI",
    path: "app.0machine.com/laser-ai",
    src: "/screenshots/screenshot-laser-ai.webp",
    alt: "0Machine LaserAI Studio Text-to-Vector Generator for laser cut designs",
    tag: "Prompt to SVG/DXF",
    badge: "Kerf-Compensated",
    specs: "Text-to-CAD · Auto-Bridge Stencils · 0.15mm Kerf Offset",
  },
  {
    id: "nesting",
    labelKey: "hero.tab.nesting",
    shortLabelKey: "hero.tab.nesting.short",
    tagKey: "hero.tab.nesting.tag",
    label: "Nesting Studio",
    shortLabel: "Nesting",
    path: "app.0machine.com/nesting",
    src: "/screenshots/screenshot-nesting.webp",
    alt: "0Machine True-Shape Nesting Studio with ClipperLib collision detection and sheet yield HUD",
    tag: "30-40% Less Scrap",
    badge: "ClipperLib Engine",
    specs: "True-Shape Nesting · Multi-Sheet · Scrap Reduction",
  },
  {
    id: "dashboard",
    labelKey: "hero.tab.dashboard",
    shortLabelKey: "hero.tab.dashboard.short",
    tagKey: "hero.tab.dashboard.tag",
    label: "Workshop Hub",
    shortLabel: "Dashboard",
    path: "app.0machine.com/dashboard",
    src: "/screenshots/screenshot-dashboard.webp",
    alt: "0Machine Workshop Hub with live revenue analytics, order status, and inventory alerts",
    tag: "Workshop Hub",
    badge: "Live Telemetry",
    specs: "Revenue Analytics · Order Tracking · Sheet Inventory",
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
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-20"
    >
      {/* Background AI Workshop Visual Integration */}
      <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none">
        <picture>
          <source media="(max-width: 768px)" srcSet="/assets/hero-laser-workshop-mobile.webp" type="image/webp" />
          <img
            src="/assets/hero-laser-workshop.webp"
            alt="0Machine Fiber Laser Precision Workshop Cutting Nested Sheets"
            width={800}
            height={533}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            className="w-full h-full object-cover object-center opacity-20 mix-blend-luminosity filter blur-[1px] scale-105"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950/85 via-dark-950/80 to-dark-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-950 via-transparent to-dark-950 opacity-90" />
      </div>

      {/* Ambient subtle technical grid */}
      <div className="absolute inset-0 grid-pattern opacity-25 pointer-events-none -z-10" />

      <div
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 text-center"
      >
        {/* Badge (Laser Workshop OS Pill) */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 sm:py-2 rounded-full border border-[#42433D] bg-[#141513] backdrop-blur-md mb-6 sm:mb-8 shadow-lg shadow-black/40 max-w-full">
          <span className="w-2 h-2 rounded-full bg-[#FE7733] animate-pulse flex-shrink-0" />
          <span className="text-[11px] sm:text-xs text-[#FFA266] font-mono font-semibold tracking-wider uppercase truncate sm:whitespace-normal">
            0MACHINE // LASER WORKSHOP OS
          </span>
        </div>

        {/* Editorial Headline (Outcome-Focused 5-Second Formula) */}
        <h1 className="text-[32px] xs:text-[36px] sm:text-5xl md:text-7xl lg:text-8xl font-black font-[Outfit] leading-[1.08] sm:leading-[0.98] tracking-[-0.03em] mb-6 max-w-5xl mx-auto text-[#FFFCE1] px-2 sm:px-0">
          Design, Nest & Cut.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] via-[#FE7733] to-[#FFA266]">
            At Laser Precision.
          </span>
        </h1>

        {/* Subheadline (Outcome-Focused 20 Words) */}
        <p className="text-sm sm:text-lg lg:text-xl text-[#8B95A8] max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed font-normal px-4 sm:px-0">
          Transform text briefs into kerf-compensated vector CAD, cut material scrap by 35% with automated nesting, and access a curated 300,000+ commercial laser cut library.
        </p>

        {/* Feature Tags (Minimal Hairline Pill Badges) */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-8 sm:mb-10 max-w-3xl mx-auto">
          <span className="text-[11px] font-mono text-[#FFFCE1] bg-[#141513] border border-[#42433D] px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FE7733]" />
            300,000+ Vectors
          </span>
          <span className="text-[11px] font-mono text-[#FFFCE1] bg-[#141513] border border-[#42433D] px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B1FA63]" />
            Commercial Resale License
          </span>
          <span className="text-[11px] font-mono text-[#FFFCE1] bg-[#141513] border border-[#42433D] px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FE7733]" />
            LightBurn C00/C01 Ready
          </span>
          <span className="text-[11px] font-mono text-[#FFFCE1] bg-[#141513] border border-[#42433D] px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B1FA63]" />
            SVG · DXF · CDR · EPS
          </span>
        </div>

        {/* CTAs (High-Contrast Primary Orange Button + Secondary Lime Badge) */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-3 max-w-md mx-auto sm:max-w-none w-full">
          <a
            href="#designs-vault"
            onClick={() => trackEvent("cta_click", { button: "hero_designs_vault" })}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 w-full sm:w-auto rounded-full bg-[#FE7733] hover:bg-[#FF8A47] text-[#0E100F] font-black text-sm sm:text-base tracking-tight transition-all font-[Outfit] shadow-[0_0_28px_rgba(254,119,51,0.35)] hover:shadow-[0_0_38px_rgba(254,119,51,0.55)] active:scale-95 cursor-pointer"
          >
            <span>Explore 300K+ Vault Free</span>
            <span className="text-xs font-mono">↓</span>
          </a>
          <a
            href="#laser-ai"
            onClick={() => trackEvent("cta_click", { button: "hero_laser_ai" })}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 w-full sm:w-auto rounded-full bg-[#141513] hover:bg-[#191919] border border-[#42433D] hover:border-[#B1FA63] text-[#FFFCE1] font-bold text-sm sm:text-base tracking-tight transition-all font-[Outfit] hover:shadow-[0_0_18px_rgba(177,250,99,0.2)] active:scale-95 cursor-pointer"
          >
            <span>Try LaserAI Studio</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#B1FA63]/15 text-[#B1FA63] border border-[#B1FA63]/30 font-bold ml-1">
              LIVE CAD
            </span>
          </a>
        </div>

        {/* Social Proof Line (Trust & Credibility) */}
        <p className="text-xs sm:text-sm text-[#8B95A8] mb-8 sm:mb-12 max-w-2xl mx-auto flex items-center justify-center gap-2 flex-wrap">
          <span>Trusted by 10,000+ Laser Workshops & Makers</span>
          <span className="text-[#42433D]">·</span>
          <span className="text-[#B1FA63] font-medium">No Credit Card Required</span>
        </p>

        {/* MOCKUP SECTION WITH SCREENSHOT TABS */}
        <motion.div
          style={{ y: mockupY }}
          className="relative max-w-5xl mx-auto mt-4 sm:mt-0"
        >
          {/* Mockup Quick Toggle Tabs */}
          <div className="flex items-center justify-center mb-4 w-full">
            <div className="inline-flex p-1.5 rounded-full bg-[#141513] border border-[#42433D] backdrop-blur-xl shadow-2xl gap-1 max-w-full overflow-x-auto scrollbar-none justify-start sm:justify-center">
              {HERO_TABS.map((tab, idx) => {
                const isActive = activeTab === idx;
                const tabLabel = t(tab.labelKey) || tab.label;
                const tabShort = t(tab.shortLabelKey) || tab.shortLabel;
                const tabTag = t(tab.tagKey) || tab.tag;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(idx)}
                    className={`flex items-center gap-1.5 sm:gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-[#FE7733] text-[#0E100F] shadow-lg shadow-[#FE7733]/25"
                        : "text-[#8B95A8] hover:text-[#FFFCE1] hover:bg-[#191919]"
                    }`}
                  >
                    <span className="hidden sm:inline">{tabLabel}</span>
                    <span className="sm:hidden">{tabShort}</span>
                    {isActive && (
                      <span className="hidden md:inline-block text-[10px] px-2 py-0.5 rounded-full bg-black/20 text-[#0E100F] font-mono font-bold border border-black/15">
                        {tabTag}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Glow behind mockup (Vibrant Dual Brand Glow) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FE7733]/15 via-[#B1FA63]/10 to-[#FE7733]/15 rounded-3xl blur-[75px] -z-10 scale-95" />

          {/* Bespoke Retro-Futuristic Studio Aperture Viewport (GSAP Creative Atelier Frame) */}
          <StudioApertureViewport
            currentTab={currentTab}
            activeTab={activeTab}
            tabs={HERO_TABS}
            onSelectTab={setActiveTab}
            t={t}
          />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10"
      >
        <a href="#designs-vault" className="flex flex-col items-center gap-1.5 group cursor-pointer">
          <span className="text-[10px] text-gray-500 group-hover:text-accent-400 tracking-wider transition-colors uppercase">
            {t("vault.badge")}
          </span>
          <div
            className="w-4 h-7 rounded-full border border-gray-700 group-hover:border-accent-500/50 flex items-start justify-center p-1 transition-colors"
          >
            <div className="w-1 h-1.5 rounded-full bg-accent-400 animate-bounce" />
          </div>
        </a>
      </div>
    </section>
  );
}
