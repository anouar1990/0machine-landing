"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Play, Pause, RotateCcw, X, Download, Check, Sparkles, Cpu, Maximize2, ArrowRight } from "lucide-react";

export default function LaserAiDemoVideo({
  inline = false,
  isOpen = true,
  onClose,
  onTryPrompt,
  onExpand,
}) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { margin: "-50px" });

  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0); // 0 to 5000 ms
  const [currentStep, setCurrentStep] = useState(1); // 1: Prompt, 2: 0machine AI, 3: CAM Layers, 4: Export
  const requestRef = useRef(null);
  const startTimeRef = useRef(null);
  const TOTAL_DURATION = 5000; // 5 seconds exact

  // Control playback based on visibility if inline
  useEffect(() => {
    if (inline) {
      if (isInView) {
        setIsPlaying(true);
        startTimeRef.current = performance.now() - progress;
      } else {
        setIsPlaying(false);
      }
    }
  }, [isInView, inline]);

  useEffect(() => {
    if (!inline && !isOpen) {
      setProgress(0);
      setIsPlaying(false);
      return;
    }
    if (inline || isOpen) {
      setIsPlaying(true);
      startTimeRef.current = performance.now() - progress;
    }
  }, [isOpen, inline]);

  useEffect(() => {
    if (!isPlaying) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    const animate = (time) => {
      if (!startTimeRef.current) startTimeRef.current = time - progress;
      const elapsed = time - startTimeRef.current;
      const current = Math.min(elapsed, TOTAL_DURATION);
      setProgress(current);

      // Determine active scene step
      if (current < 1300) setCurrentStep(1);
      else if (current < 2800) setCurrentStep(2);
      else if (current < 4100) setCurrentStep(3);
      else setCurrentStep(4);

      if (elapsed >= TOTAL_DURATION) {
        // Auto loop seamlessly after brief pause
        setTimeout(() => {
          startTimeRef.current = performance.now();
          setProgress(0);
        }, 1000);
      } else {
        requestRef.current = requestAnimationFrame(animate);
      }
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, progress]);

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      startTimeRef.current = performance.now() - progress;
      setIsPlaying(true);
    }
  };

  const handleRestart = () => {
    startTimeRef.current = performance.now();
    setProgress(0);
    setIsPlaying(true);
  };

  if (!inline && !isOpen) return null;

  const progressPercent = Math.min(100, (progress / TOTAL_DURATION) * 100);

  const videoCardContent = (
    <div
      ref={containerRef}
      className={`bg-[#1A1D21] border border-white/15 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col ${
        inline ? "w-full max-w-4xl mx-auto" : "max-w-3xl w-full"
      }`}
    >
      {/* Top Video Header */}
      <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-[#15171B]">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-bold text-white uppercase tracking-wider font-[Outfit] flex items-center gap-1.5">
            <span className="hidden sm:inline">5-SECOND VIDEO DEMO:</span>
            <span className="text-[#FE7733]">HOW 0MACHINE AI WORKS</span>
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#B1FA63]/10 text-[#B1FA63] border border-[#B1FA63]/25 font-bold">
            0:0{Math.floor(progress / 1000)} / 0:05
          </span>
        </div>

        <div className="flex items-center gap-2">
          {inline && onExpand && (
            <button
              onClick={onExpand}
              aria-label="Expand Fullscreen"
              className="text-gray-400 hover:text-white px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 flex items-center gap-1 text-[11px] font-bold transition-colors border border-white/10"
              title="Expand Fullscreen"
            >
              <Maximize2 size={13} />
              <span className="hidden sm:inline">Expand</span>
            </button>
          )}

          {!inline && onClose && (
            <button
              onClick={onClose}
              aria-label="Close video demo"
              className="text-gray-400 hover:text-white w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Video Screen Viewport */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] bg-[#0E1013] overflow-hidden select-none flex items-center justify-center">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />

        {/* SCENE 1: Typing Prompt (0.0s - 1.3s) */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-lg px-6 text-center space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FE7733]/10 border border-[#FE7733]/30 text-[#FE7733] text-xs font-bold">
              <span>STEP 1: TYPE YOUR PROMPT</span>
            </div>

            <div className="p-4 bg-[#1A1D21] border border-[#FE7733]/40 rounded-2xl shadow-xl text-left">
              <span className="text-[10px] text-gray-500 block mb-1 font-mono uppercase font-bold">
                0machine AI Input:
              </span>
              <div className="text-sm font-mono text-white flex items-center gap-1">
                <span>"Geometric Wolf Keychain with 3.5mm top hole"</span>
                <span className="w-2 h-4 bg-[#FE7733] animate-pulse" />
              </div>
            </div>

            <div className="flex justify-center gap-2 text-[11px] text-gray-400">
              <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 font-bold text-[#B1FA63]">
                ✓ Keychain Mode (Hole Tab)
              </span>
              <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-gray-300">
                ⚡ Auto Kerf 0.15mm
              </span>
            </div>
          </motion.div>
        )}

        {/* SCENE 2: Laser Beam Synthesis & Sparks (1.3s - 2.8s) */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative w-full h-full flex flex-col items-center justify-center"
          >
            {/* Birch Wood Preview Simulation Bed */}
            <div className="w-[310px] sm:w-[360px] h-[210px] sm:h-[240px] bg-[#EFE5D3] rounded-2xl relative border-4 border-[#C8B89E] shadow-2xl overflow-hidden flex items-center justify-center">
              {/* Subtle Wood Grain Overlay */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#8B5A2B_1px,transparent_1px)] [background-size:12px_12px]" />

              {/* Tracing Wolf Keychain Vector */}
              <svg viewBox="0 0 100 100" className="w-36 sm:w-40 h-36 sm:h-40 relative z-10">
                {/* Cut Contour */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="4 2" />
                {/* Top Hole */}
                <circle cx="50" cy="18" r="4.5" fill="#EFE5D3" stroke="#EF4444" strokeWidth="1.5" />
                {/* Engraved Wolf Silhouette (Revealing) */}
                <path
                  d="M 50 30 L 60 48 L 54 50 L 58 65 L 50 58 L 42 65 L 46 50 L 40 48 Z"
                  fill="#1A1108"
                  opacity="0.85"
                />
              </svg>

              {/* Glowing Laser Head Nozzle */}
              <motion.div
                animate={{
                  x: [-50, 30, 60, -20, 40],
                  y: [-30, 25, -15, 45, 0],
                }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                className="absolute z-20 pointer-events-none"
              >
                {/* Laser Focal Dot */}
                <div className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_15px_#EF4444] animate-ping" />
                <div className="w-1.5 h-1.5 bg-white rounded-full -mt-2.5 ml-0.5 shadow-[0_0_8px_#FFFFFF]" />
                {/* Spark Flare */}
                <div className="w-10 h-10 -mt-6 -ml-4 bg-amber-400/35 rounded-full blur-sm" />
              </motion.div>
            </div>

            {/* Processing Status Banner */}
            <div className="absolute bottom-4 px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-xs font-mono text-[#B1FA63] flex items-center gap-2">
              <Cpu size={14} className="animate-spin text-[#FE7733]" />
              <span>0machine AI synthesizing closed vectors in 2.1s...</span>
            </div>
          </motion.div>
        )}

        {/* SCENE 3: Finished Vector Layers on Birch Bed (2.8s - 4.1s) */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="relative w-full h-full flex flex-col items-center justify-center"
          >
            {/* Birch Wood Finished Bed */}
            <div className="w-[320px] sm:w-[380px] h-[220px] sm:h-[250px] bg-[#EFE5D3] rounded-2xl relative border-4 border-[#C8B89E] shadow-2xl flex items-center justify-center p-3">
              <svg viewBox="0 0 100 100" className="w-40 sm:w-44 h-40 sm:h-44">
                {/* Layer 00: CUT (Hairline Red) */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#EF4444" strokeWidth="1.2" />
                <circle cx="50" cy="18" r="4" fill="none" stroke="#EF4444" strokeWidth="1.2" />
                {/* Layer 01: ENGRAVE (Roasted Pyrography Dark) */}
                <path
                  d="M 50 28 L 63 46 L 56 49 L 60 66 L 50 58 L 40 66 L 44 49 L 37 46 Z"
                  fill="#1A1108"
                />
                <path d="M 50 36 L 53 43 L 47 43 Z" fill="#EFE5D3" />
              </svg>

              {/* Layer Badges Floating on Video */}
              <div className="absolute top-3 left-3 bg-[#111317]/90 border border-white/10 rounded-lg px-2.5 py-1 text-[10px] text-white font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                <span className="font-bold">CUT_00: Red 0.1mm</span>
              </div>
              <div className="absolute top-3 right-3 bg-[#111317]/90 border border-white/10 rounded-lg px-2.5 py-1 text-[10px] text-white font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-black border border-white/30" />
                <span className="font-bold">ENGRAVE_01: Black</span>
              </div>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#10B981]/20 border border-[#10B981]/40 rounded-full px-3 py-0.5 text-[10px] text-[#10B981] font-bold font-mono">
                ✓ 100% Closed Contours &amp; Kerf Ready
              </div>
            </div>
          </motion.div>
        )}

        {/* SCENE 4: 1-Click LightBurn Download (4.1s - 5.0s) */}
        {currentStep === 4 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-md px-6 text-center space-y-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/30 mx-auto flex items-center justify-center text-[#10B981]">
              <Check size={28} />
            </div>

            <div>
              <h4 className="text-xl font-bold text-white font-[Outfit]">Ready to Cut in LightBurn!</h4>
              <p className="text-xs text-gray-400 mt-1">
                Exported with LightBurn C00/C01 layer tags &amp; AutoCAD DXF
              </p>
            </div>

            <div className="p-3.5 bg-[#1A1D21] border border-white/10 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Download size={14} className="text-[#FE7733]" />
                <span className="font-mono text-white font-bold">wolf_keychain_3.5mm.svg</span>
              </div>
              <span className="text-[10px] text-[#B1FA63] font-bold bg-[#B1FA63]/10 px-2 py-0.5 rounded">
                Downloaded
              </span>
            </div>

            <button
              onClick={() => {
                if (onClose) onClose();
                if (onTryPrompt) onTryPrompt();
              }}
              className="w-full py-3 bg-[#FE7733] hover:bg-[#E85F20] text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-[#FE7733]/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles size={14} />
              <span>Try It Now With Your Own Prompt</span>
              <ArrowRight size={14} />
            </button>
          </motion.div>
        )}

        {/* Floating Step Badges */}
        <div className="absolute top-3 left-4 flex items-center gap-1.5 z-30">
          {[
            { num: 1, label: "Prompt" },
            { num: 2, label: "0machine AI" },
            { num: 3, label: "CAM Layers" },
            { num: 4, label: "Export" },
          ].map((s) => (
            <div
              key={s.num}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                currentStep === s.num
                  ? "bg-[#FE7733] text-white shadow-md shadow-[#FE7733]/30 scale-105"
                  : "bg-black/60 text-gray-400 border border-white/5"
              }`}
            >
              <span>{s.num}.</span>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Video Player Control Bar */}
      <div className="p-4 bg-[#15171B] border-t border-white/10 space-y-2.5">
        {/* Timeline Progress Bar (0 to 5s) */}
        <div className="relative w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#FE7733] via-[#FFA559] to-[#B1FA63] transition-all duration-75 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Transport Buttons & Time */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors border border-white/10 cursor-pointer"
              title={isPlaying ? "Pause Video" : "Play Video"}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} fill="white" />}
            </button>
            <button
              onClick={handleRestart}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white flex items-center justify-center transition-colors border border-white/10 cursor-pointer"
              title="Replay from 0:00"
            >
              <RotateCcw size={13} />
            </button>
            <span className="font-mono text-[11px] text-gray-300 font-bold">
              0:0{Math.floor(progress / 1000)} / 0:05
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (onClose) onClose();
                if (onTryPrompt) onTryPrompt();
              }}
              className="px-3.5 py-1.5 rounded-lg bg-[#FE7733]/15 hover:bg-[#FE7733] text-[#FE7733] hover:text-white border border-[#FE7733]/30 transition-all font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles size={12} />
              <span>Launch Live Studio Below ↓</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (inline) {
    return videoCardContent;
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-3xl flex justify-center"
        >
          {videoCardContent}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
