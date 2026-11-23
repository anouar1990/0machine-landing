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
      {/* Main Studio Aperture Container */}
      <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden border border-[#42433d] shadow-2xl shadow-black/90 bg-[#0e100f] select-none">
        {/* Aspect Ratio Box that scales smoothly on all viewports */}
        <div className="relative w-full aspect-[1024/575] overflow-hidden bg-[#0e100f]">
          
          {/* 1. LAYER BEHIND MASK: Live Active Tab Content (Screenshots / Vectors) */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTab.id}
                initial={false}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
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
                    width={1024}
                    height={575}
                    decoding="sync"
                    fetchPriority="high"
                    className="w-full h-full object-cover object-center block"
                  />
                </picture>
              </motion.div>
            </AnimatePresence>

            {/* Central HUD Pill (Telemetry & Live SSL status inside the circular lens) */}
            <div className="absolute top-3 sm:top-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#0e100f]/85 border border-[#42433d] backdrop-blur-md shadow-lg shadow-black/80 max-w-[90%]">
              <span className="w-2 h-2 rounded-full bg-[#abff84] animate-pulse flex-shrink-0" />
              <span className="text-[10px] sm:text-xs font-mono font-semibold text-[#fffce1] truncate">
                {currentTab.label}
              </span>
              <span className="hidden md:inline-block text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#abff84]/15 text-[#abff84] border border-[#abff84]/30 font-bold">
                {currentTab.badge || "PRO"}
              </span>
            </div>

            {/* Bottom Floating Pill inside aperture: Direct Studio Action */}
            <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
              <a
                href="https://app.0machine.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full bg-[#0e100f]/90 hover:bg-[#141513] border border-[#42433d] hover:border-[#abff84] text-[#fffce1] text-[10px] sm:text-xs font-bold font-[Outfit] tracking-wide backdrop-blur-md shadow-xl transition-all active:scale-95 cursor-pointer group"
              >
                <span>Launch {currentTab.shortLabel}</span>
                <span className="text-[#abff84] group-hover:translate-x-0.5 transition-transform">↗</span>
              </a>
            </div>
          </div>

          {/* 2. LAYER ON TOP: SVG Studio Aperture Frame (Cream wings + Red concentric arcs + Hairlines) */}
          <svg
            viewBox="0 0 1024 575"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Outer card clipping */}
              <clipPath id="studioCardClip">
                <rect x="0" y="0" width="1024" height="575" rx="32" ry="32" />
              </clipPath>

              {/* Mask: White shows cream, Black cuts circular aperture in the center */}
              <mask id="studioApertureMask">
                <rect width="1024" height="575" rx="32" ry="32" fill="white" />
                <circle cx="512" cy="287.5" r="398" fill="black" />
              </mask>
            </defs>

            <g clipPath="url(#studioCardClip)">
              {/* Cream Surface with central circular cutout */}
              <rect
                x="0"
                y="0"
                width="1024"
                height="575"
                fill="#f3ebd8"
                mask="url(#studioApertureMask)"
              />

              {/* Red/Coral Concentric Hairline Arc */}
              <circle
                cx="512"
                cy="287.5"
                r="426"
                fill="none"
                stroke="#d3534a"
                strokeWidth="2.5"
                mask="url(#studioApertureMask)"
              />

              {/* Hairline inner border touching the aperture circumference */}
              <circle
                cx="512"
                cy="287.5"
                r="398"
                fill="none"
                stroke="#42433d"
                strokeWidth="1.5"
              />

              {/* Left Wing Studio Telemetry & Typographic Markings */}
              <g className="hidden sm:block opacity-90 select-none">
                <text
                  x="36"
                  y="62"
                  fill="#7c7c6f"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="600"
                  letterSpacing="0.08em"
                >
                  0M // ATELIER
                </text>
                <text
                  x="36"
                  y="82"
                  fill="#1b1108"
                  fontSize="12"
                  fontFamily="system-ui, -apple-system, sans-serif"
                  fontWeight="800"
                  letterSpacing="-0.02em"
                >
                  CAD LENS
                </text>
                <circle cx="36" cy="106" r="3" fill="#d3534a" />
                <text
                  x="45"
                  y="110"
                  fill="#7c7c6f"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  LIGHTBURN C00
                </text>

                <text
                  x="36"
                  y="526"
                  fill="#7c7c6f"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="600"
                >
                  SCALE 1:1
                </text>
              </g>

              {/* Right Wing Studio Telemetry & Typographic Markings */}
              <g className="hidden sm:block opacity-90 select-none">
                <text
                  x="988"
                  y="62"
                  textAnchor="end"
                  fill="#7c7c6f"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="600"
                  letterSpacing="0.08em"
                >
                  300K+ VECTORS
                </text>
                <text
                  x="988"
                  y="82"
                  textAnchor="end"
                  fill="#1b1108"
                  fontSize="12"
                  fontFamily="system-ui, -apple-system, sans-serif"
                  fontWeight="800"
                  letterSpacing="-0.02em"
                >
                  READY TO CUT
                </text>
                <circle cx="988" cy="106" r="3" fill="#0ae448" />
                <text
                  x="980"
                  y="110"
                  textAnchor="end"
                  fill="#7c7c6f"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  KERF: 0.15mm
                </text>

                <text
                  x="988"
                  y="526"
                  textAnchor="end"
                  fill="#7c7c6f"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="600"
                >
                  SVG · DXF · CDR
                </text>
              </g>
            </g>

            {/* Outer hairline border on the rounded card */}
            <rect
              x="0.5"
              y="0.5"
              width="1023"
              height="574"
              rx="31.5"
              ry="31.5"
              fill="none"
              stroke="#42433d"
              strokeWidth="1"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
