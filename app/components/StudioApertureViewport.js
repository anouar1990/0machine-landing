"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function StudioApertureViewport({
  currentTab,
  activeTab,
  tabs,
  onSelectTab,
  t,
}) {
  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Studio Application Window Chassis */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#33352e] bg-[#121311] shadow-[0_25px_80px_-15px_rgba(0,0,0,0.9)] select-none">
        
        {/* Top Window Bar / Studio Header */}
        <div className="flex items-center justify-between px-3.5 sm:px-5 py-2.5 sm:py-3 border-b border-[#262724] bg-[#171815]">
          {/* Left: Window Control Dots */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#ef4444]/60 border border-[#ef4444]/30" />
            <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#eab308]/60 border border-[#eab308]/30" />
            <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#22c55e]/60 border border-[#22c55e]/30" />
          </div>

          {/* Center: URL & Status Pill */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 rounded-full bg-[#0e100f] border border-[#2a2b27] text-[11px] sm:text-xs font-mono text-[#8B95A8] max-w-[65%] sm:max-w-none truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FE7733] animate-pulse flex-shrink-0" />
            <span className="text-[#FFFCE1] font-medium truncate">
              {currentTab.path || "app.0machine.com"}
            </span>
            <span className="hidden sm:inline text-[#42433d]">·</span>
            <span className="hidden sm:inline text-[10px] text-[#B1FA63] font-semibold tracking-wide uppercase">
              {currentTab.badge || "PRO"}
            </span>
          </div>

          {/* Right: Studio Direct Action */}
          <div className="flex items-center gap-2">
            <a
              href="https://app.0machine.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full bg-[#1c1d19] hover:bg-[#252722] border border-[#33352e] hover:border-[#FE7733]/50 text-[#FFFCE1] text-[11px] sm:text-xs font-medium font-[Outfit] transition-colors cursor-pointer"
            >
              <span className="hidden xs:inline">Open</span>
              <span className="xs:hidden">App</span>
              <span className="text-[#FE7733] text-xs font-bold">↗</span>
            </a>
          </div>
        </div>

        {/* Screenshot Viewport: Full 16:10 Uncropped Rectangular Display */}
        <div className="relative w-full aspect-[16/10] bg-[#0e100f] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab.id}
              initial={{ opacity: 0, scale: 0.995 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full h-full flex items-center justify-center bg-[#0e100f]"
            >
              <picture className="w-full h-full block">
                <source
                  media="(max-width: 640px)"
                  srcSet={currentTab.mobileSrc || currentTab.src}
                  type="image/webp"
                />
                <img
                  src={currentTab.src}
                  alt={currentTab.alt}
                  width={1280}
                  height={800}
                  decoding="sync"
                  fetchPriority="high"
                  className="w-full h-full object-cover object-top block"
                />
              </picture>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Technical Status Bar */}
        <div className="flex items-center justify-between px-3.5 sm:px-5 py-2 sm:py-2.5 bg-[#141513] border-t border-[#262724] text-[10px] sm:text-xs font-mono text-[#8B95A8]">
          <div className="flex items-center gap-2 sm:gap-3 truncate">
            <span className="flex items-center gap-1.5 flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FE7733]" />
              <span className="text-[#FFFCE1] font-semibold">{currentTab.label}</span>
            </span>
            <span className="hidden sm:inline text-[#42433d]">|</span>
            <span className="hidden md:inline text-[#8B95A8] truncate">{currentTab.specs || currentTab.tag}</span>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="hidden sm:inline text-[#8B95A8]">SVG · DXF · LightBurn C00</span>
            <span className="text-[#B1FA63] font-semibold flex items-center gap-1">
              Active Studio
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
