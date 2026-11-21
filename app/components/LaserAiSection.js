"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Cpu,
  Download,
  Code2,
  RefreshCw,
  Check,
  AlertCircle,
  Lock,
  Unlock,
  ExternalLink,
  ChevronDown,
  X
} from "lucide-react";
import { supabase } from "../lib/supabase";

const REFERENCE_PILLS = [
  {
    title: "A six-fold mandala for a 30 cm wooden wall piece",
    prompt: "Intricate six-fold sacred geometry mandala for a 30 cm wooden wall art piece, clean closed cutting contours",
    mode: "cut-engrave",
  },
  {
    title: "Minimal snowflake ornament with a hanging hole",
    prompt: "Minimalist geometric snowflake ornament with integrated 3.5mm top hanging hole for jump ring",
    mode: "keychain",
  },
  {
    title: "Geometric stag head made of three stacked layers",
    prompt: "Geometric polygonal stag deer head trophy silhouette for multi-layer stacked wood shadowbox",
    mode: "layered",
  },
  {
    title: "Rectangular frame with leaves in the corners",
    prompt: "Decorative rectangular photo frame with botanical leaves and vine corner flourishes, closed cut borders",
    mode: "cut-engrave",
  },
];

// High-quality laser cut SVG preview (Mandala with LightBurn cut and engrave layers)
const DEFAULT_PREVIEW_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <!-- Outer Closed Perimeter Cutline (LightBurn C00 Red Hairline) -->
  <circle cx="200" cy="200" r="185" fill="none" stroke="#EF4444" stroke-width="2" class="cut" />
  <circle cx="200" cy="200" r="172" fill="none" stroke="#1A1108" stroke-width="1.5" class="engrave" />
  
  <!-- Sacred 6-Fold Geometry Engraved Pattern (LightBurn C01 Burnt Wood) -->
  <g class="engrave" fill="#1A1108" fill-opacity="0.85">
    <circle cx="200" cy="200" r="28" fill="#1A1108" />
    <circle cx="200" cy="200" r="38" fill="none" stroke="#1A1108" stroke-width="1.5" />
    <!-- 6 Petals -->
    <path d="M 200,85 Q 242,148 200,200 Q 158,148 200,85 Z" />
    <path d="M 200,315 Q 242,252 200,200 Q 158,252 200,315 Z" />
    <path d="M 100,142 Q 163,122 200,200 Q 137,222 100,142 Z" />
    <path d="M 300,258 Q 237,278 200,200 Q 263,178 300,258 Z" />
    <path d="M 100,258 Q 137,178 200,200 Q 163,278 100,258 Z" />
    <path d="M 300,142 Q 263,222 200,200 Q 237,122 300,142 Z" />
  </g>
  <!-- Decorative Rings & Star Points -->
  <g stroke="#1A1108" stroke-width="1.2" fill="none" class="engrave">
    <circle cx="200" cy="200" r="148" stroke-dasharray="6,4" />
    <circle cx="200" cy="200" r="118" />
    <circle cx="200" cy="200" r="72" stroke-dasharray="4,3" />
    <!-- Inner geometric diamonds -->
    <polygon points="200,105 215,145 200,185 185,145" fill="#1A1108" fill-opacity="0.7" />
    <polygon points="200,295 215,255 200,215 185,255" fill="#1A1108" fill-opacity="0.7" />
    <polygon points="118,152 158,162 188,192 148,182" fill="#1A1108" fill-opacity="0.7" />
    <polygon points="282,248 242,238 212,208 252,218" fill="#1A1108" fill-opacity="0.7" />
    <polygon points="118,248 148,218 188,208 158,238" fill="#1A1108" fill-opacity="0.7" />
    <polygon points="282,152 252,182 212,192 242,162" fill="#1A1108" fill-opacity="0.7" />
  </g>
</svg>`;

export default function LaserAiSection() {
  const [customPrompt, setCustomPrompt] = useState("");
  const [activeMode, setActiveMode] = useState("cut-engrave");
  const [fileTypeTab, setFileTypeTab] = useState("svg"); // "svg" | "preview"
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressStage, setProgressStage] = useState("");
  const [genError, setGenError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Current SVG design displayed in the viewport (initialized with default so blur & unlock are immediately visible)
  const [currentSvg, setCurrentSvg] = useState(DEFAULT_PREVIEW_SVG);
  const [currentPromptTitle, setCurrentPromptTitle] = useState("A six-fold mandala for a 30 cm wooden wall piece");

  // Auth & Unlock state: strictly locked by default so the blur & unlock card are always active
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false); // Standalone Pop-up Modal state
  const [authMode, setAuthMode] = useState("signup"); // "signup" | "login"
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  const progressIntervalRef = useRef(null);

  // Check initial authentication from real Supabase session
  useEffect(() => {
    setMounted(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setIsUnlocked(true);
      } else {
        // Respect explicit URL parameter if present
        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search);
          if (params.get("unlocked") === "true") {
            setIsUnlocked(true);
          }
          if (params.get("modal") === "true") {
            setShowAuthModal(true);
          }
        }
      }

      // Check if user returned from Google OAuth redirect with a pending SVG
      if (typeof window !== "undefined") {
        try {
          const pendingSvg = sessionStorage.getItem("0machine_pending_laser_svg");
          const pendingPrompt = sessionStorage.getItem("0machine_pending_laser_prompt");
          if (pendingSvg) {
            setCurrentSvg(pendingSvg);
            if (pendingPrompt) setCurrentPromptTitle(pendingPrompt);
            sessionStorage.removeItem("0machine_pending_laser_svg");
            sessionStorage.removeItem("0machine_pending_laser_prompt");
          }
        } catch (e) {}
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setIsUnlocked(true);
        setShowAuthModal(false);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Clean up progress interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  const handleSelectPill = (pill) => {
    setCustomPrompt(pill.prompt);
    setActiveMode(pill.mode);
  };

  const handleSendPrompt = async (promptToSend = null, modeToSend = null) => {
    const p = (promptToSend || customPrompt).trim();
    const m = modeToSend || activeMode;
    if (!p || isGenerating) return;

    setGenError(null);
    setIsGenerating(true);
    setProgressPercent(8);
    setProgressStage("Analyzing prompt & vector geometry...");

    // Animate progress bar ("samta katcharja") live from 8% to 92%
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    let currentP = 8;
    progressIntervalRef.current = setInterval(() => {
      currentP += Math.floor(Math.random() * 7) + 4;
      if (currentP > 92) {
        currentP = 92;
        clearInterval(progressIntervalRef.current);
      }
      setProgressPercent(currentP);

      if (currentP > 25 && currentP <= 55) {
        setProgressStage("Tracing closed boundary cutlines (#EF4444)...");
      } else if (currentP > 55 && currentP <= 80) {
        setProgressStage("Synthesizing LightBurn/DXF layers & kerf offset...");
      } else if (currentP > 80) {
        setProgressStage("Finalizing vector smoothing & CAM export...");
      }
    }, 220);

    try {
      const res = await fetch("/api/generate-svg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: p, mode: m }),
      });

      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to generate laser vector SVG.");
      }

      // Finish progress bar smoothly to 100%
      setProgressPercent(100);
      setProgressStage("Vector CAD Synthesis Complete! ✓");

      await new Promise((r) => setTimeout(r, 450));

      // Update current displayed SVG
      setCurrentSvg(data.svg);
      setCurrentPromptTitle(p);

      // Automatically open the clean unlock pop-up modal if user is not unlocked
      if (!isUnlocked) {
        setShowAuthModal(true);
      }
    } catch (err) {
      console.error("[LaserAiSection] Generate error:", err);
      setGenError(err.message || "Error generating vector file.");
    } finally {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setIsGenerating(false);
      setProgressPercent(0);
      setProgressStage("");
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!authEmail || !authPassword) {
      setAuthError("Please enter both email and password.");
      return;
    }
    setAuthLoading(true);
    setAuthError(null);

    try {
      if (authMode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: authEmail.trim(),
          password: authPassword,
        });

        if (error) {
          if (error.message?.toLowerCase().includes("already registered")) {
            setAuthMode("login");
            setAuthError("This email is already registered. Please log in to unlock.");
            setAuthLoading(false);
            return;
          }
          throw error;
        }

        setIsUnlocked(true);
        setShowAuthModal(false);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authEmail.trim(),
          password: authPassword,
        });

        if (error) throw error;
        setIsUnlocked(true);
        setShowAuthModal(false);
      }
    } catch (err) {
      console.error("[LaserAiSection] Auth error:", err);
      setAuthError(err.message || "Authentication error. Please check your credentials.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setAuthError(null);

    if (typeof window !== "undefined" && currentSvg) {
      try {
        sessionStorage.setItem("0machine_pending_laser_svg", currentSvg);
        sessionStorage.setItem("0machine_pending_laser_prompt", currentPromptTitle || "");
      } catch (e) {}
    }

    try {
      const redirectOrigin = typeof window !== "undefined" ? window.location.origin : "https://www.0machine.com";
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${redirectOrigin}/#laser-ai`,
        },
      });

      if (error) throw error;
    } catch (err) {
      console.error("[LaserAiSection] Google OAuth error:", err);
      setAuthError(err.message || "Google sign-in failed. Please use email and password.");
      setGoogleLoading(false);
    }
  };

  const handleDownloadSvg = (svgContent) => {
    if (!isUnlocked) {
      setShowAuthModal(true);
      return;
    }
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `0machine-laser-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopySvg = (svgContent) => {
    if (!isUnlocked) {
      setShowAuthModal(true);
      return;
    }
    if (!svgContent) return;
    navigator.clipboard.writeText(svgContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="laser-ai" suppressHydrationWarning className="relative py-20 sm:py-28 bg-[#0D0E11] text-gray-200 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-[#FE7733]/10 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#B1FA63]/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B1FA63]/10 border border-[#B1FA63]/25 text-[#B1FA63] text-xs font-bold uppercase tracking-widest mb-3">
            <Cpu size={14} />
            <span>0MACHINE LASERAI ENGINE V2.0</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold font-[Outfit] text-white tracking-tight mb-3">
            LaserAI Prompt Chat <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FE7733] via-[#FF8F50] to-[#B1FA63]">
              Text to Clean Laser Cut Vector
            </span>
          </h2>

          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
            Enter your design idea in any language (Darija, French, English). Watch the CAD engine charge live from 0% to 100% and synthesize production-ready vector contours.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* STANDALONE DEDICATED LASERAI PROMPT CHAT V2.0 CONTAINER ("bohdha")         */}
        {/* MATCHING EXACT USER REFERENCE SCREENSHOT (100% PIXEL PERFECT ALIGNMENT)  */}
        {/* ========================================================================= */}
        <div className="bg-[#18181B] border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-5">
          {/* Top Label & Quick Toggle for Lock/Unlock Testing */}
          <div className="flex items-center justify-between">
            <div className="text-xs sm:text-sm font-normal text-gray-300">
              Start with a shape, a theme, or a full brief.
            </div>

            {/* Quick Interactive Test Toggle */}
            <button
              onClick={() => {
                const nextUnlocked = !isUnlocked;
                setIsUnlocked(nextUnlocked);
                if (!nextUnlocked) setShowAuthModal(false);
              }}
              title="Click to toggle lock state for testing"
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isUnlocked
                  ? "bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] hover:bg-[#10B981]/25"
                  : "bg-[#FE7733]/15 border border-[#FE7733]/30 text-[#FE7733] hover:bg-[#FE7733]/25"
              }`}
            >
              {isUnlocked ? (
                <>
                  <Unlock size={13} />
                  <span>Unlocked ✓</span>
                </>
              ) : (
                <>
                  <Lock size={13} />
                  <span>Locked (Sign Up)</span>
                </>
              )}
            </button>
          </div>

          {/* 4 Reference Pills (Matching Screenshot Exactly: rounded-full pills) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {REFERENCE_PILLS.map((pill, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPill(pill)}
                className="text-left text-xs px-4 py-2.5 rounded-full bg-[#111115] hover:bg-[#1C1D23] border border-white/10 hover:border-[#FFA526]/40 text-gray-300 hover:text-white transition-all cursor-pointer leading-snug truncate"
              >
                {pill.title}
              </button>
            ))}
          </div>

          {/* Horizontal Divider Line */}
          <div className="border-t border-white/10 my-4" />

          {/* Controls Row: Segmented Toggle (Left) + Style Selector (Right) */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Left: SVG cut file FREE | Image preview LIMITED */}
            <div className="inline-flex p-1 bg-[#111216] rounded-full border border-white/10">
              <button
                type="button"
                onClick={() => setFileTypeTab("svg")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  fileTypeTab === "svg"
                    ? "bg-[#1C1D24] text-white shadow-sm"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <span>SVG cut file</span>
                <span className="text-[10px] font-mono text-[#FFA526] font-black uppercase">FREE</span>
              </button>
              <button
                type="button"
                onClick={() => setFileTypeTab("preview")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  fileTypeTab === "preview"
                    ? "bg-[#1C1D24] text-white shadow-sm"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <span>Image preview</span>
                <span className="text-[10px] font-mono text-gray-500 font-semibold uppercase">LIMITED</span>
              </button>
            </div>

            {/* Right: Style Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-medium">Style</span>
              <div className="relative">
                <select
                  value={activeMode}
                  onChange={(e) => setActiveMode(e.target.value)}
                  className="appearance-none bg-[#111216] border border-white/10 text-gray-200 text-xs rounded-full pl-3.5 pr-8 py-1.5 focus:outline-none focus:border-[#FFA526] cursor-pointer"
                >
                  <option value="cut-engrave">Open brief (Cut + Engrave)</option>
                  <option value="keychain">Keychain (3.5mm hole)</option>
                  <option value="stencil">Connected Stencil (Bridge tabs)</option>
                  <option value="layered">Multi-layer 3D Shadowbox</option>
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Input Row: Textarea (Left) + Large Golden-Orange Generate Button (Right) */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <textarea
              id="laser-prompt-input"
              aria-label="Laser cut design prompt"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendPrompt();
                }
              }}
              rows={2}
              placeholder="e.g. a geometric stag head for a 30 cm wall piece"
              className="flex-1 bg-[#0E0E12] border border-white/10 rounded-2xl p-4 text-xs sm:text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#FFA526] transition-colors resize-none font-mono"
            />

            <button
              onClick={() => handleSendPrompt()}
              disabled={isGenerating || !customPrompt.trim()}
              className={`sm:w-36 px-6 py-4 rounded-2xl text-sm font-bold tracking-wide transition-all cursor-pointer shadow-lg flex items-center justify-center ${
                isGenerating || !customPrompt.trim()
                  ? "bg-[#333] text-gray-500 cursor-not-allowed opacity-60"
                  : "bg-[#FDB237] hover:bg-[#FFA526] text-black shadow-[#FDB237]/25 active:scale-95"
              }`}
            >
              {isGenerating ? (
                <span className="flex items-center gap-1.5">
                  <RefreshCw size={15} className="animate-spin text-black" />
                  <span>Synthesizing</span>
                </span>
              ) : (
                <span>Generate</span>
              )}
            </button>
          </div>

          {/* Footer Warning Note */}
          <div className="text-[11px] text-gray-400 font-normal">
            First drafts, not finished cut files — check kerf, bridges and joints before cutting.
          </div>

          {genError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle size={15} className="flex-shrink-0" />
              <span>{genError}</span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ANIMATED CHARGING PROGRESS BAR ("Samta katcharja")                         */}
          {/* 0% to 100% with Live CAD Synthesis Stages                                  */}
          {/* ========================================================================= */}
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full rounded-2xl p-4 sm:p-5 bg-[#121316] border border-[#FE7733]/30 space-y-3 shadow-xl"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[#FE7733] font-bold">
                  <RefreshCw size={14} className="animate-spin" />
                  <span>{progressStage || "Synthesizing vector contours..."}</span>
                </div>
                <span className="font-mono font-extrabold text-[#B1FA63] text-xs">
                  {progressPercent}%
                </span>
              </div>

              {/* The Live Charging Bar ("Samta") */}
              <div className="w-full bg-[#0E0E12] h-3.5 rounded-full p-0.5 border border-white/10 overflow-hidden relative shadow-inner">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#FE7733] via-[#FFA559] to-[#B1FA63] shadow-lg shadow-[#FE7733]/40 relative"
                  style={{ width: `${progressPercent}%` }}
                  transition={{ ease: "easeOut", duration: 0.25 }}
                >
                  <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/40 blur-[2px] rounded-full" />
                </motion.div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-400 pt-0.5 font-mono">
                <span>0Machine CAD Engine v2.0</span>
                <span>Closed Perimeter · LightBurn C00/C01</span>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* VECTOR RESULT VIEWPORT (BLURRED "FLOW" + UNLOCK TEASER BUTTON)            */}
          {/* ========================================================================= */}
          {currentSvg && (
            <div className="space-y-3 pt-2">
              <div className="relative rounded-2xl overflow-hidden border border-[#CBB28D] bg-gradient-to-br from-[#F6EEDC] via-[#ECE1C8] to-[#E2D2B5] min-h-[340px] sm:min-h-[380px] flex items-center justify-center p-6 shadow-2xl">
                {/* CAD Grid Backdrop */}
                <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />

                {/* Floating LightBurn Layer Badges */}
                <div className="absolute top-3 right-3 bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[10px] space-y-0.5 shadow-lg z-20">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                    <span className="text-gray-200 font-mono">Layer 00: CUT (Hairline)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#1A1108]" />
                    <span className="text-gray-200 font-mono">Layer 01: ENGRAVE (Burnt Wood)</span>
                  </div>
                </div>

                {/* SVG Canvas with conditional blur ("flow hta ytsejel") */}
                <div
                  id="laser-svg-canvas"
                  style={{
                    filter: !isUnlocked ? "blur(14px) brightness(0.95)" : "none",
                    pointerEvents: !isUnlocked ? "none" : "auto",
                    userSelect: !isUnlocked ? "none" : "auto",
                    transition: "filter 0.5s ease-in-out",
                  }}
                  className="w-full h-full max-h-[320px] flex items-center justify-center relative z-10 [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:w-auto [&>svg]:h-auto [&_.engrave]:fill-[#1A1108] [&_.cut]:stroke-[#EF4444] drop-shadow-[0_4px_12px_rgba(40,25,12,0.35)]"
                  dangerouslySetInnerHTML={{ __html: currentSvg }}
                />

                {/* =================================================================== */}
                {/* OVERLAY TEASER CARD ON BLURRED CANVAS (OPENS FULL POPUP MODAL)      */}
                {/* =================================================================== */}
                {!isUnlocked && (
                  <div
                    onClick={() => setShowAuthModal(true)}
                    className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] cursor-pointer group"
                  >
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.25 }}
                      className="text-center p-5 sm:p-6 rounded-3xl bg-[#16181D]/95 border border-[#FE7733]/40 shadow-2xl space-y-3.5 max-w-xs backdrop-blur-xl group-hover:scale-105 transition-all"
                    >
                      <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-[#FE7733] to-[#FF8F50] flex items-center justify-center text-white shadow-lg shadow-[#FE7733]/30">
                        <Lock size={22} />
                      </div>

                      <div>
                        <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-[#B1FA63] px-2.5 py-0.5 rounded-full bg-[#B1FA63]/10 border border-[#B1FA63]/20">
                          ⚡ Vector CAD Ready
                        </span>
                        <h3 className="text-base font-bold text-white mt-1.5 font-[Outfit]">
                          Sign Up Free to Unlock
                        </h3>
                        <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                          Closed cutlines synthesized. Click to open unlock modal & export clean SVG.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowAuthModal(true);
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FE7733] to-[#FF8F50] hover:brightness-110 text-white font-extrabold text-xs shadow-lg shadow-[#FE7733]/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Lock size={13} />
                        <span>Unlock Vector (Free) →</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsUnlocked(true);
                        }}
                        className="text-[11px] text-gray-400 hover:text-[#B1FA63] underline cursor-pointer transition-colors block mx-auto"
                      >
                        ⚡ Instant Unlock (Demo Test)
                      </button>
                    </motion.div>
                  </div>
                )}
              </div>

              {/* Unlocked Vector Controls: Download SVG & Copy Code */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadSvg(currentSvg)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isUnlocked
                        ? "bg-[#FE7733] hover:bg-[#E85F20] text-white shadow-lg shadow-[#FE7733]/20"
                        : "bg-white/5 text-gray-400 hover:text-white border border-white/10"
                    }`}
                  >
                    <Download size={14} />
                    <span>Download SVG (Free)</span>
                  </button>

                  <button
                    onClick={() => handleCopySvg(currentSvg)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isUnlocked
                        ? "bg-white/10 hover:bg-white/15 text-gray-200 border border-white/10"
                        : "bg-white/5 text-gray-400 hover:text-white border border-white/10"
                    }`}
                  >
                    {copied ? <Check size={14} className="text-[#10B981]" /> : <Code2 size={14} />}
                    <span>{copied ? "Copied!" : "Copy Code"}</span>
                  </button>
                </div>

                <a
                  href="https://app.0machine.com/laser-ai"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#B1FA63] hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Open in Studio</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* POP-UP MODAL: SIGN UP FREE TO UNLOCK (PORTAL TO BODY - NEVER CUT OFF)     */}
      {/* ========================================================================= */}
      {mounted &&
        showAuthModal &&
        !isUnlocked &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            {/* Click backdrop to dismiss */}
            <div
              className="fixed inset-0 -z-10"
              onClick={() => setShowAuthModal(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-md bg-[#16181D] border border-[#FE7733]/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(254,119,51,0.25)] relative text-center space-y-4 my-auto max-h-[92vh] overflow-y-auto scrollbar-thin"
            >
              {/* Close Button (X) */}
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              {/* Glowing Lock Badge */}
              <div className="w-14 h-14 mx-auto rounded-3xl bg-gradient-to-br from-[#FE7733] to-[#FF8F50] flex items-center justify-center text-white shadow-xl shadow-[#FE7733]/30">
                <Lock size={26} />
              </div>

              <div>
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-[#B1FA63] px-3 py-1 rounded-full bg-[#B1FA63]/10 border border-[#B1FA63]/25 inline-block">
                  ⚡ 100% Free Maker Access
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-[Outfit] text-white mt-2">
                  Sign Up Free to Unlock Vector
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 mt-1.5 leading-relaxed">
                  Closed cutlines synthesized. Register in 5 seconds to unblur and download your clean SVG & LightBurn cut files.
                </p>
              </div>

              {/* 1-Click Google OAuth */}
              <button
                type="button"
                id="modal-google-signin-btn"
                onClick={() => handleGoogleSignIn()}
                disabled={googleLoading}
                className="w-full py-3 px-4 rounded-xl bg-white hover:bg-gray-100 text-gray-900 font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 mt-1"
              >
                {googleLoading ? (
                  <RefreshCw size={16} className="animate-spin text-gray-700" />
                ) : (
                  <>
                    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-2 text-[10px] text-gray-500 uppercase tracking-widest font-mono">
                <div className="flex-1 h-px bg-white/10" />
                <span>or with email</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Auth Tab Toggle */}
              <div className="flex p-1 bg-black/40 rounded-xl border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setAuthMode("signup")}
                  className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition-all ${
                    authMode === "signup" ? "bg-[#FE7733] text-white shadow" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Sign Up Free
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode("login")}
                  className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition-all ${
                    authMode === "login" ? "bg-[#FE7733] text-white shadow" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Log In
                </button>
              </div>

              {/* Email Form */}
              <form onSubmit={handleEmailAuth} className="space-y-3 pt-1 text-left">
                <div>
                  <label className="text-[11px] font-semibold text-gray-400 block mb-1">
                    Work Email
                  </label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="you@workshop.com"
                    className="w-full bg-[#1A1D21] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FE7733] transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-gray-400 block mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#1A1D21] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FE7733] transition-colors"
                  />
                </div>

                {authError && (
                  <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                    {authError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FE7733] to-[#FF8F50] hover:brightness-110 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-[#FE7733]/25 transition-all cursor-pointer flex items-center justify-center gap-1.5 mt-2"
                >
                  {authLoading ? (
                    <RefreshCw size={15} className="animate-spin" />
                  ) : (
                    <span>{authMode === "signup" ? "Create Free Account & Unlock" : "Log In & Unlock"}</span>
                  )}
                </button>
              </form>

              {/* Instant Demo Unlock Pill */}
              <div className="pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    setIsUnlocked(true);
                    setShowAuthModal(false);
                  }}
                  className="text-xs text-gray-400 hover:text-[#B1FA63] underline cursor-pointer transition-colors"
                >
                  ⚡ Instant Unlock (Demo Test)
                </button>
              </div>
            </motion.div>
          </div>,
          document.body
        )}
    </section>
  );
}
