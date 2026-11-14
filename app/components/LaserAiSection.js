"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Cpu,
  Download,
  ShieldCheck,
  Zap,
  ArrowRight,
  Code2,
  RefreshCw,
  Eye,
  Check,
  AlertCircle,
  Play
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import LaserAiDemoVideo from "./LaserAiDemoVideo";
import LaserAiCreditModal from "./LaserAiCreditModal";

const SAMPLE_PROMPTS = [
  {
    id: "wolf",
    icon: "🐺",
    title: "Lone Wolf Forest Silhouette",
    prompt: "Majestic howling wolf on a rocky cliff surrounded by pine trees, stark woodcut crosshatching, closed contour cutline.",
    mode: "cut-engrave",
    modeLabel: "Cut & Engrave",
    specs: "Red 0.1mm Cut Perimeter + Black Engrave Crosshatching",
    resale: "$35 - $60 Wood Wall Art",
  },
  {
    id: "owl_clock",
    icon: "⚙️",
    title: "Steampunk Owl Gear Clock",
    prompt: "Mechanical owl with exposed clockwork gears, Roman numerals ring, 8mm center shaft hole for quartz movement.",
    mode: "cut-engrave",
    modeLabel: "Precision Functional CAM",
    specs: "8mm Precision Center Hole + Layered Gear Cutouts",
    resale: "$55 - $95 Etsy Best-Seller",
  },
  {
    id: "keychain",
    icon: "🔑",
    title: "Art Deco Eagle Keychain",
    prompt: "Geometric Art Deco eagle medallion, 40mm circular pendant with integrated 3.5mm top jump-ring hole.",
    mode: "keychain",
    modeLabel: "Keychain Mode",
    specs: "Integrated 3.5mm Reinforced Top Tab Hole",
    resale: "$12 - $20 (Fast 2-Min Cut)",
  },
  {
    id: "stencil",
    icon: "🌿",
    title: "Botanical Floral Monogram",
    prompt: "Intricate vine monogram letter 'M' stencil, connected tabs on all inner enclosed loops, single-piece cut.",
    mode: "stencil",
    modeLabel: "Connected Stencil",
    specs: "Zero Fallen Islands · 1.5mm Micro-Tabs",
    resale: "$25 - $45 Cake Stencil / Sign",
  },
];

export default function LaserAiSection() {
  const { t } = useLanguage();
  const [activePrompt, setActivePrompt] = useState(0);
  const [customPrompt, setCustomPrompt] = useState(SAMPLE_PROMPTS[0].prompt);
  const [activeMode, setActiveMode] = useState(SAMPLE_PROMPTS[0].mode);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSvg, setGeneratedSvg] = useState(null);
  const [genError, setGenError] = useState(null);
  const [viewMode, setViewMode] = useState("preview"); // "preview" (svg) or "screenshot"
  const [bedMaterial, setBedMaterial] = useState("wood"); // "wood" | "light" | "honeycomb"
  const [copied, setCopied] = useState(false);
  const [showDemoVideo, setShowDemoVideo] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [credits, setCredits] = useState(1); // 1 free generation by default

  useEffect(() => {
    try {
      const stored = localStorage.getItem("0machine_ai_credits");
      if (stored !== null) {
        setCredits(parseInt(stored, 10));
      } else {
        localStorage.setItem("0machine_ai_credits", "1");
        setCredits(1);
      }
    } catch (e) {}
  }, []);

  const selected = SAMPLE_PROMPTS[activePrompt];

  const handleSelectSample = (idx) => {
    setActivePrompt(idx);
    setCustomPrompt(SAMPLE_PROMPTS[idx].prompt);
    setActiveMode(SAMPLE_PROMPTS[idx].mode);
  };

  const handleGenerate = async (promptToUse, modeToUse) => {
    const p = promptToUse || customPrompt;
    const m = modeToUse || activeMode;
    if (!p || !p.trim()) return;

    // Check if user has available credits
    if (credits <= 0) {
      setShowCreditModal(true);
      return;
    }

    setIsGenerating(true);
    setGenError(null);

    try {
      const res = await fetch("/api/generate-svg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: p.trim(), mode: m }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to generate SVG.");
      }

      setGeneratedSvg(data.svg);
      setViewMode("preview");

      // Deduct credit
      const remaining = Math.max(0, credits - 1);
      setCredits(remaining);
      try {
        localStorage.setItem("0machine_ai_credits", String(remaining));
      } catch (e) {}
    } catch (err) {
      console.error("[LaserAiSection] Generate error:", err);
      setGenError(err.message || "Error generating vector file.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadSvg = () => {
    if (!generatedSvg) return;
    const blob = new Blob([generatedSvg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `0machine-laser-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopySvg = () => {
    if (!generatedSvg) return;
    navigator.clipboard.writeText(generatedSvg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="laser-ai" className="relative py-28 bg-[#111317] text-gray-200 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/3 left-10 w-[600px] h-[600px] bg-[#FE7733]/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#B1FA63]/5 rounded-full blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B1FA63]/10 border border-[#B1FA63]/25 text-[#B1FA63] text-xs font-extrabold uppercase tracking-[0.2em] mb-4">
            <Cpu size={14} />
            <span>AI VECTOR CAD ENGINE — POWERED BY 0MACHINE AI</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-[Outfit] text-white tracking-tight mb-5">
            Turn Any Prompt into <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FE7733] to-[#B1FA63]">
              Ready-to-Cut SVG &amp; DXF Vectors
            </span>
          </h2>

          <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-8">
            Need a custom design that doesn't exist yet? Describe what you want. LaserAI Studio generates production-ready closed vector contours with separate Cut (<span className="text-[#EF4444] font-semibold">Red #EF4444</span>) and Engrave (<span className="text-gray-200 font-semibold">Black #000000</span>) layers in under 3 seconds.
          </p>

          {/* Autoplaying 5-Second Video Walkthrough Showcase */}
          <div id="laser-ai-video" className="mb-14 text-left">
            <LaserAiDemoVideo
              inline={true}
              onExpand={() => setShowDemoVideo(true)}
              onTryPrompt={() => {
                setCustomPrompt("Geometric Wolf Keychain with 3.5mm top hole");
                setActiveMode("keychain");
                const el = document.getElementById("laser-ai-generator");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            />
          </div>
        </div>

        {/* Interactive Studio Preview Grid */}
        <div id="laser-ai-generator" className="grid lg:grid-cols-12 gap-8 items-stretch mb-16">
          {/* Left Column: Interactive Prompt Switcher & Custom Input */}
          <div className="lg:col-span-5 bg-[#1A1D21] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">SELECT SAMPLE PROMPT</span>
                <span className="text-xs text-[#B1FA63] font-mono font-bold">⚡ 0machine ai</span>
              </div>

              {/* Sample Prompt Selector Buttons */}
              <div className="space-y-3 mb-6">
                {SAMPLE_PROMPTS.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectSample(idx)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                      activePrompt === idx
                        ? "bg-[#23262C] border-[#FE7733] shadow-lg shadow-[#FE7733]/15"
                        : "bg-white/5 border-white/5 hover:border-white/15 text-gray-400"
                    }`}
                  >
                    <span className="text-2xl flex-shrink-0">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-bold ${activePrompt === idx ? "text-white" : "text-gray-300"}`}>
                          {item.title}
                        </span>
                        <span className="text-[10px] font-mono text-[#B1FA63] font-bold">{item.modeLabel}</span>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-1 italic">"{item.prompt}"</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Live Editable Prompt Input */}
              <div className="p-4 bg-[#111317] border border-white/10 rounded-2xl space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                    Custom Prompt or Edit Sample:
                  </span>
                  <span className="text-[#B1FA63] font-mono text-[10px] font-bold">LightBurn C00/C01 Ready</span>
                </div>
                <textarea
                  id="laser-prompt-input"
                  aria-label="Custom laser design prompt"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  rows={3}
                  placeholder="Describe your design (e.g. Celtic knot keychain, 3D dragon wall art, acrylic cake topper)..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#FE7733] transition-colors resize-none font-mono"
                />

                {/* Mode Selector */}
                <div className="flex gap-2 pt-1">
                  {[
                    { id: "cut-engrave", label: "Cut + Engrave" },
                    { id: "keychain", label: "Keychain (Hole Tab)" },
                    { id: "stencil", label: "Bridge Stencil" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setActiveMode(m.id)}
                      className={`text-[10px] font-semibold px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        activeMode === m.id
                          ? "bg-[#FE7733]/20 border-[#FE7733] text-[#FE7733]"
                          : "bg-white/5 border-white/5 text-gray-400 hover:text-white"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {genError && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle size={14} className="flex-shrink-0" />
                  <span>{genError}</span>
                </div>
              )}
            </div>

            {/* Credit Status & Refill Bar */}
            <div className="flex items-center justify-between text-xs mb-2.5 px-1">
              <span className="text-gray-400 flex items-center gap-1.5 font-medium">
                <span className={`w-2 h-2 rounded-full ${credits > 0 ? "bg-[#10B981]" : "bg-[#EF4444]"}`} />
                <span>Available Credits:</span>
                <span className="font-mono text-white font-bold">{credits}</span>
              </span>
              <button
                type="button"
                onClick={() => setShowCreditModal(true)}
                className="text-[11px] font-bold text-[#FE7733] hover:text-[#FFA559] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Pick Credits (from $9) →</span>
              </button>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => handleGenerate(customPrompt, activeMode)}
              disabled={isGenerating}
              className={`w-full py-4 rounded-xl text-center text-sm font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isGenerating
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#FE7733] to-[#FF8F50] hover:brightness-110 text-white shadow-xl shadow-[#FE7733]/25"
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Generating Vectors with 0machine ai...</span>
                </>
              ) : (
                <>
                  <Zap size={16} />
                  <span>⚡ Generate Real Laser Vector SVG</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column: Live SVG Display or Studio Screenshot View */}
          <div className="lg:col-span-7 bg-[#1A1D21] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Studio Header & View Mode Switcher */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#EF4444]" />
                  <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                  <span className="w-3 h-3 rounded-full bg-[#10B981]" />
                  <span className="text-xs font-mono text-gray-500 ml-2">app.0machine.com/laser-ai</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Material Bed Switcher (When Live SVG is visible) */}
                  {generatedSvg && viewMode === "preview" && (
                    <div className="flex items-center gap-1 p-0.5 bg-black/60 rounded-lg border border-white/10">
                      <button
                        onClick={() => setBedMaterial("wood")}
                        title="Birch Plywood Bed"
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                          bedMaterial === "wood"
                            ? "bg-[#D8C6A5] text-[#2D2115] shadow"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        🪵 Wood
                      </button>
                      <button
                        onClick={() => setBedMaterial("light")}
                        title="Clean Light CAD Sheet"
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                          bedMaterial === "light"
                            ? "bg-white text-dark-950 shadow"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        ⚪ CAD
                      </button>
                      <button
                        onClick={() => setBedMaterial("honeycomb")}
                        title="Dark Honeycomb Bed"
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                          bedMaterial === "honeycomb"
                            ? "bg-[#252A34] text-[#B1FA63] border border-[#B1FA63]/30"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        🐝 Dark
                      </button>
                    </div>
                  )}

                  {generatedSvg && (
                    <button
                      onClick={() => setViewMode(viewMode === "preview" ? "screenshot" : "preview")}
                      className="text-[11px] font-semibold text-gray-300 hover:text-white px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 cursor-pointer"
                    >
                      {viewMode === "preview" ? "Studio Screenshot" : "Live SVG"}
                    </button>
                  )}
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#B1FA63]/10 text-[#B1FA63] border border-[#B1FA63]/20">
                    {generatedSvg ? "Vector Generated ✓" : "Auto-Tracer Active"}
                  </span>
                </div>
              </div>

              {/* Display Area: Either Live SVG CAD Canvas OR Authentic Studio Screenshot */}
              <div
                className={`relative rounded-2xl overflow-hidden border shadow-2xl aspect-[16/10] flex items-center justify-center p-4 transition-colors duration-500 ${
                  generatedSvg && viewMode === "preview"
                    ? bedMaterial === "wood"
                      ? "bg-[#EFE5D3] bg-gradient-to-br from-[#F6EEDC] via-[#ECE1C8] to-[#E2D2B5] border-[#CBB28D]"
                      : bedMaterial === "light"
                      ? "bg-[#FFFFFF] border-slate-300"
                      : "bg-[#090A0C] border-white/10"
                    : "bg-[#090A0C] border-white/10"
                }`}
              >
                <AnimatePresence mode="wait">
                  {generatedSvg && viewMode === "preview" ? (
                    <motion.div
                      key={`live-svg-${bedMaterial}`}
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full flex items-center justify-center relative overflow-hidden"
                    >
                      {/* Grid background for CAD visualization */}
                      <div
                        className={`absolute inset-0 pointer-events-none ${
                          bedMaterial === "light"
                            ? "grid-pattern opacity-15 filter invert"
                            : "grid-pattern opacity-20"
                        }`}
                      />

                      {/* Rendered SVG with Adaptive Laser Finish */}
                      <div
                        className={`w-full h-full max-h-[380px] flex items-center justify-center relative z-10 transition-all duration-300 [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:w-auto [&>svg]:h-auto ${
                          bedMaterial === "wood"
                            ? "[&_.engrave]:fill-[#1A1108] [&_.cut]:stroke-[#EF4444] drop-shadow-[0_4px_12px_rgba(40,25,12,0.35)]"
                            : bedMaterial === "light"
                            ? "[&_.engrave]:fill-[#000000] [&_.cut]:stroke-[#EF4444] drop-shadow-[0_4px_10px_rgba(0,0,0,0.15)]"
                            : "[&_.engrave]:fill-[#F1F5F9] [&_.cut]:stroke-[#EF4444] drop-shadow-[0_0_15px_rgba(254,119,51,0.25)]"
                        }`}
                        dangerouslySetInnerHTML={{ __html: generatedSvg }}
                      />

                      {/* Live Floating Layer Badges */}
                      <div className="absolute top-3 right-3 bg-black/85 backdrop-blur-md p-2.5 rounded-xl border border-white/10 text-xs space-y-1 shadow-xl z-20">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                          <span className="text-gray-200 font-mono text-[10px]">Layer 00: CUT (Hairline)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              bedMaterial === "wood"
                                ? "bg-[#1A1108]"
                                : bedMaterial === "light"
                                ? "bg-black"
                                : "bg-white"
                            }`}
                          />
                          <span className="text-gray-200 font-mono text-[10px]">
                            Layer 01: ENGRAVE ({bedMaterial === "wood" ? "Burnt Wood" : "Scan"})
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="screenshot"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full relative"
                    >
                      <img
                        src="/screenshots/screenshot-laser-ai.webp"
                        alt="0Machine LaserAI Studio Text-to-Vector Generator"
                        className="w-full h-full object-cover object-top"
                        loading="lazy"
                        decoding="async"
                      />

                      {/* Live Floating Layer Badges */}
                      <div className="absolute top-4 right-4 bg-black/85 backdrop-blur-md p-3 rounded-xl border border-white/10 text-xs space-y-1.5 shadow-xl">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                          <span className="text-gray-200 font-mono text-[11px]">Layer 00: CUT (Hairline)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-white" />
                          <span className="text-gray-200 font-mono text-[11px]">Layer 01: ENGRAVE (Scan)</span>
                        </div>
                      </div>

                      {/* Overlay CTA if no SVG generated yet */}
                      {!generatedSvg && (
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent flex flex-col justify-end p-6">
                          <p className="text-xs text-white font-semibold mb-1">
                            Click "⚡ Generate Real Laser Vector SVG" to test live vector CAD synthesis
                          </p>
                          <p className="text-[11px] text-gray-400">
                            Vectors are returned with strict LightBurn color mapping and closed contours.
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Toolbar if SVG Generated */}
              {generatedSvg && (
                <div className="flex flex-wrap items-center justify-between gap-3 mt-4 p-3 bg-white/5 border border-white/10 rounded-xl">
                  <div className="flex items-center gap-2 text-xs text-[#B1FA63] font-mono font-semibold">
                    <Check size={14} />
                    <span>Clean SVG Generated</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopySvg}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Code2 size={13} />
                      <span>{copied ? "Copied SVG!" : "Copy Code"}</span>
                    </button>
                    <button
                      onClick={handleDownloadSvg}
                      className="px-4 py-1.5 rounded-lg bg-[#FE7733] hover:bg-[#E85F20] text-xs text-white font-bold flex items-center gap-1.5 transition-all shadow-md shadow-[#FE7733]/20 cursor-pointer"
                    >
                      <Download size={13} />
                      <span>Download SVG</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Feature highlights below screenshot */}
            <div className="grid sm:grid-cols-3 gap-4 pt-6 mt-6 border-t border-white/10 text-xs">
              <div className="flex items-start gap-2.5">
                <ShieldCheck size={16} className="text-[#10B981] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Kerf Compensated</span>
                  <span className="text-gray-400 text-[11px]">Exact friction-fit joints</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck size={16} className="text-[#10B981] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Connected Stencils</span>
                  <span className="text-gray-400 text-[11px]">Auto-bridges inner islands</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck size={16} className="text-[#10B981] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">1-Click Nesting</span>
                  <span className="text-gray-400 text-[11px]">Send directly to sheet CAM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Modal Video (if user clicks Expand) */}
      <LaserAiDemoVideo
        inline={false}
        isOpen={showDemoVideo}
        onClose={() => setShowDemoVideo(false)}
        onTryPrompt={() => {
          setCustomPrompt("Geometric Wolf Keychain with 3.5mm top hole");
          setActiveMode("keychain");
          const el = document.getElementById("laser-ai-generator");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* LaserAI Credit Paywall Modal */}
      <LaserAiCreditModal
        isOpen={showCreditModal}
        onClose={() => setShowCreditModal(false)}
        savedPrompt={customPrompt}
        activeMode={activeMode}
        onCreditsAcquired={(newCount) => {
          setCredits(newCount);
          setShowCreditModal(false);
        }}
      />
    </section>
  );
}
