"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Cpu,
  Download,
  ShieldCheck,
  Zap,
  Code2,
  RefreshCw,
  Check,
  AlertCircle,
  Lock,
  Unlock,
  ExternalLink,
  Send,
  Layers,
  ArrowRight
} from "lucide-react";
import { supabase } from "../lib/supabase";

const SAMPLE_PROMPTS = [
  {
    id: "wolf",
    icon: "🐺",
    title: "Lone Wolf Silhouette",
    prompt: "Majestic howling wolf on a rocky cliff surrounded by pine trees, stark woodcut crosshatching, closed contour cutline.",
    mode: "cut-engrave",
    modeLabel: "Cut + Engrave",
  },
  {
    id: "keychain",
    icon: "🔑",
    title: "Art Deco Eagle Keychain",
    prompt: "Geometric Art Deco eagle medallion, 40mm circular pendant with integrated 3.5mm top jump-ring hole.",
    mode: "keychain",
    modeLabel: "Keychain (3.5mm Hole)",
  },
  {
    id: "owl_clock",
    icon: "⚙️",
    title: "Steampunk Gear Clock",
    prompt: "Mechanical owl with exposed clockwork gears, Roman numerals ring, 8mm center shaft hole for quartz movement.",
    mode: "cut-engrave",
    modeLabel: "Precision CAM",
  },
  {
    id: "coaster",
    icon: "🌸",
    title: "Mandala Floral Coaster",
    prompt: "Sacred geometry mandala flower pattern coaster, circular laser cut border with concentric engraved lace detail.",
    mode: "cut-engrave",
    modeLabel: "Coaster Pack",
  },
  {
    id: "stencil",
    icon: "🌿",
    title: "Monogram Stencil",
    prompt: "Intricate vine monogram letter 'M' stencil, connected tabs on all inner enclosed loops, single-piece cut.",
    mode: "stencil",
    modeLabel: "Bridged Stencil",
  },
];

export default function LaserAiSection() {
  const [customPrompt, setCustomPrompt] = useState("");
  const [activeMode, setActiveMode] = useState("cut-engrave");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressStage, setProgressStage] = useState("");
  const [genError, setGenError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Auth & Unlock state
  const [user, setUser] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [authMode, setAuthMode] = useState("signup"); // "signup" | "login"
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Chat conversation messages
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      sender: "assistant",
      text: "👋 Welcome to LaserAI Prompt Chat v2.0! Describe any design you want to laser cut (keychains, signs, wall art, stencils). Our CAD engine will synthesize closed cutlines (C00) and engrave contours (C01).",
      timestamp: "Just now",
    },
  ]);

  const chatContainerRef = useRef(null);
  const progressIntervalRef = useRef(null);

  // Check initial authentication & restore pending design after OAuth redirect
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        if (localStorage.getItem("0machine_user_unlocked") === "true") {
          setIsUnlocked(true);
        }
      }
    } catch (e) {}

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setIsUnlocked(true);
        try {
          localStorage.setItem("0machine_user_unlocked", "true");
          const pendingSvg = sessionStorage.getItem("0machine_pending_laser_svg");
          const pendingPrompt = sessionStorage.getItem("0machine_pending_laser_prompt") || "Your Custom Laser Vector";
          if (pendingSvg) {
            setMessages((prev) => [
              ...prev,
              {
                id: `ai-restored-${Date.now()}`,
                sender: "assistant",
                text: `⚡ Design unlocked! Clean vector ready for "${pendingPrompt}".`,
                svg: pendingSvg,
                prompt: pendingPrompt,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              },
            ]);
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
        try {
          localStorage.setItem("0machine_user_unlocked", "true");
        } catch (e) {}
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Auto-scroll chat to latest message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isGenerating, progressPercent]);

  // Clean up progress intervals on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  const handleSelectSample = (sample) => {
    setCustomPrompt(sample.prompt);
    setActiveMode(sample.mode);
  };

  const handleSendPrompt = async (promptToSend = null, modeToSend = null) => {
    const p = (promptToSend || customPrompt).trim();
    const m = modeToSend || activeMode;
    if (!p || isGenerating) return;

    // Add user message
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: p,
      mode: m,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setCustomPrompt("");
    setGenError(null);
    setIsGenerating(true);
    setProgressPercent(10);
    setProgressStage("Analyzing prompt & vector geometry...");

    // Animate progress bar ("samta katcharja")
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    let currentPercent = 10;
    progressIntervalRef.current = setInterval(() => {
      currentPercent += Math.floor(Math.random() * 8) + 4;
      if (currentPercent > 92) {
        currentPercent = 92;
        clearInterval(progressIntervalRef.current);
      }
      setProgressPercent(currentPercent);

      if (currentPercent > 30 && currentPercent <= 60) {
        setProgressStage("Tracing closed boundary cutlines (#EF4444)...");
      } else if (currentPercent > 60 && currentPercent <= 85) {
        setProgressStage("Synthesizing LightBurn/DXF layers & kerf offset...");
      } else if (currentPercent > 85) {
        setProgressStage("Finalizing vector smoothing & CAM export...");
      }
    }, 280);

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

      await new Promise((r) => setTimeout(r, 400));

      // Append assistant message with generated SVG
      const aiResultMsg = {
        id: `ai-${Date.now()}`,
        sender: "assistant",
        text: `⚡ Clean vector synthesized for: "${p}"`,
        svg: data.svg,
        prompt: p,
        mode: m,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiResultMsg]);
    } catch (err) {
      console.error("[LaserAiSection] Generate error:", err);
      setGenError(err.message || "Error generating vector file.");
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: "assistant",
          text: `⚠️ Generation failed: ${err.message || "Please try another prompt."}`,
          isError: true,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setIsGenerating(false);
      setProgressPercent(0);
      setProgressStage("");
    }
  };

  const handleAuthSubmit = async (e) => {
    e?.preventDefault();
    if (!authEmail || !authPassword) {
      setAuthError("Please enter your email and password.");
      return;
    }
    if (authPassword.length < 6) {
      setAuthError("Password must be at least 6 characters.");
      return;
    }

    setAuthLoading(true);
    setAuthError(null);

    try {
      if (authMode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: authEmail.trim(),
          password: authPassword,
          options: {
            data: {
              source: "laserai_prompt_chat_v2",
            },
          },
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

        // Grant instant unlock
        setIsUnlocked(true);
        try {
          localStorage.setItem("0machine_user_unlocked", "true");
          localStorage.setItem("0machine_user_email", authEmail.trim());
        } catch (e) {}
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authEmail.trim(),
          password: authPassword,
        });

        if (error) throw error;

        setIsUnlocked(true);
        try {
          localStorage.setItem("0machine_user_unlocked", "true");
          localStorage.setItem("0machine_user_email", authEmail.trim());
        } catch (e) {}
      }
    } catch (err) {
      console.error("[LaserAiSection] Auth error:", err);
      setAuthError(err.message || "Authentication error. Please check your credentials.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleSignIn = async (pendingSvg = null, pendingPrompt = "") => {
    setGoogleLoading(true);
    setAuthError(null);

    if (typeof window !== "undefined" && pendingSvg) {
      try {
        sessionStorage.setItem("0machine_pending_laser_svg", pendingSvg);
        sessionStorage.setItem("0machine_pending_laser_prompt", pendingPrompt || "");
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
      setAuthError("Please create a free account to download the clean vector file.");
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
      setAuthError("Please sign up free to copy clean vector code.");
      return;
    }
    if (!svgContent) return;
    navigator.clipboard.writeText(svgContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="laser-ai" className="relative py-24 sm:py-32 bg-[#111317] text-gray-200 overflow-hidden">
      {/* Background neon ambient gradients */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-[#FE7733]/10 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#B1FA63]/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B1FA63]/10 border border-[#B1FA63]/25 text-[#B1FA63] text-xs font-extrabold uppercase tracking-[0.2em] mb-4">
            <Cpu size={14} />
            <span>0MACHINE LASERAI ENGINE V2.0</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold font-[Outfit] text-white tracking-tight mb-4">
            LaserAI Prompt Chat <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FE7733] via-[#FF8F50] to-[#B1FA63]">
              Text to Clean Laser Cut Vector
            </span>
          </h2>

          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Type any prompt below. Watch the CAD engine charge in real-time and synthesize closed cut contours ready for LightBurn and laser cutters.
          </p>
        </div>

        {/* ============================================================== */}
        {/* STANDALONE LASERAI PROMPT CHAT V2.0 CONTAINER                 */}
        {/* ============================================================== */}
        <div className="bg-[#1A1D21] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
          {/* Chat Top Bar */}
          <div className="p-4 sm:p-5 border-b border-white/10 bg-[#16181D] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FE7733] to-[#FF8F50] flex items-center justify-center text-white shadow-lg shadow-[#FE7733]/20">
                <Sparkles size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-bold text-white font-[Outfit]">LaserAI Prompt Chat</span>
                  <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-md bg-[#B1FA63]/15 text-[#B1FA63] border border-[#B1FA63]/30">
                    v2.0
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                  <span>0machine Cloud Active · 2.0s Average Synthesize</span>
                </div>
              </div>
            </div>

            {isUnlocked ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] text-xs font-bold">
                <Unlock size={13} />
                <span>Unlocked ✓</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FE7733]/15 border border-[#FE7733]/30 text-[#FE7733] text-xs font-bold">
                <Lock size={13} />
                <span>Sign Up to Unlock</span>
              </div>
            )}
          </div>

          {/* Chat Messages Stream */}
          <div
            ref={chatContainerRef}
            className="p-5 sm:p-7 space-y-6 max-h-[520px] overflow-y-auto scrollbar-thin bg-gradient-to-b from-[#1A1D21] to-[#14161A]"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                {/* User Message Bubble */}
                {msg.sender === "user" && (
                  <div className="max-w-[85%] rounded-2xl rounded-tr-none p-4 bg-gradient-to-r from-[#FE7733] to-[#FF8F50] text-white shadow-lg shadow-[#FE7733]/20 text-xs sm:text-sm font-medium space-y-1.5">
                    {msg.mode && (
                      <div className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-white/80">
                        Mode: {msg.mode}
                      </div>
                    )}
                    <p>{msg.text}</p>
                    <div className="text-right text-[10px] text-white/70">{msg.timestamp}</div>
                  </div>
                )}

                {/* Assistant Message Bubble */}
                {msg.sender === "assistant" && (
                  <div className="max-w-[95%] sm:max-w-[90%] rounded-2xl rounded-tl-none p-4 sm:p-5 bg-[#16181D] border border-white/10 text-gray-200 text-xs sm:text-sm space-y-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#B1FA63]">
                        <Cpu size={14} />
                        <span>0machine LaserAI Assistant</span>
                      </div>
                      <span className="text-[10px] text-gray-500">{msg.timestamp}</span>
                    </div>

                    <p className="leading-relaxed text-gray-300">{msg.text}</p>

                    {/* Rendered SVG Result (if message has SVG) */}
                    {msg.svg && (
                      <div className="space-y-4 pt-2">
                        {/* Vector Viewport Canvas */}
                        <div className="relative rounded-2xl overflow-hidden border border-[#CBB28D] bg-gradient-to-br from-[#F6EEDC] via-[#ECE1C8] to-[#E2D2B5] min-h-[320px] sm:min-h-[380px] flex items-center justify-center p-6 shadow-2xl">
                          {/* CAD Grid */}
                          <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />

                          {/* Floating Layer Badges */}
                          <div className="absolute top-3 right-3 bg-black/85 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 text-[10px] space-y-1 shadow-lg z-20">
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
                            className="w-full h-full max-h-[340px] flex items-center justify-center relative z-10 [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:w-auto [&>svg]:h-auto [&_.engrave]:fill-[#1A1108] [&_.cut]:stroke-[#EF4444] drop-shadow-[0_4px_12px_rgba(40,25,12,0.35)]"
                            dangerouslySetInnerHTML={{ __html: msg.svg }}
                          />

                          {/* ==================================================== */}
                          {/* OVERLAY SIGN UP TO UNLOCK CARD ("moraha yban liih")   */}
                          {/* ==================================================== */}
                          {!isUnlocked && (
                            <div
                              id="laser-unlock-card"
                              className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/45 backdrop-blur-[2px]"
                            >
                              <motion.div
                                initial={{ scale: 0.93, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="w-full max-w-sm bg-[#16181D]/95 backdrop-blur-2xl border border-[#FE7733]/40 rounded-3xl p-5 sm:p-6 shadow-2xl text-center space-y-3.5"
                              >
                                <div className="w-11 h-11 mx-auto rounded-2xl bg-gradient-to-br from-[#FE7733] to-[#FF8F50] flex items-center justify-center text-white shadow-lg shadow-[#FE7733]/30">
                                  <Lock size={22} />
                                </div>

                                <div>
                                  <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-[#B1FA63] px-2 py-0.5 rounded-full bg-[#B1FA63]/10 border border-[#B1FA63]/20">
                                    ⚡ Vector CAD Ready
                                  </span>
                                  <h3 className="text-lg sm:text-xl font-bold font-[Outfit] text-white mt-1.5">
                                    Sign Up Free to Unlock
                                  </h3>
                                  <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                                    Closed cutlines and engrave layers synthesized. Register free in 5 seconds to unblur and export your clean SVG.
                                  </p>
                                </div>

                                {/* 1-Click Google OAuth */}
                                <button
                                  type="button"
                                  id="google-signin-btn"
                                  onClick={() => handleGoogleSignIn(msg.svg, msg.prompt)}
                                  disabled={googleLoading}
                                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-gray-100 text-gray-900 font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                                >
                                  {googleLoading ? (
                                    <RefreshCw size={14} className="animate-spin text-gray-700" />
                                  ) : (
                                    <>
                                      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
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
                                <div className="flex items-center gap-2 my-1 text-[10px] text-gray-500 uppercase tracking-wider">
                                  <div className="flex-1 h-px bg-white/10" />
                                  <span>or with email</span>
                                  <div className="flex-1 h-px bg-white/10" />
                                </div>

                                {/* Auth Tab Toggle */}
                                <div className="flex p-1 bg-black/40 rounded-xl border border-white/10 text-xs">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setAuthMode("signup");
                                      setAuthError(null);
                                    }}
                                    className={`flex-1 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                                      authMode === "signup"
                                        ? "bg-[#FE7733] text-white shadow"
                                        : "text-gray-400 hover:text-white"
                                    }`}
                                  >
                                    ⚡ Free Sign Up
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setAuthMode("login");
                                      setAuthError(null);
                                    }}
                                    className={`flex-1 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                                      authMode === "login"
                                        ? "bg-white/10 text-white"
                                        : "text-gray-400 hover:text-white"
                                    }`}
                                  >
                                    Log In
                                  </button>
                                </div>

                                {/* Auth Form */}
                                <form onSubmit={handleAuthSubmit} className="space-y-2.5 text-left">
                                  <div>
                                    <input
                                      type="email"
                                      required
                                      value={authEmail}
                                      onChange={(e) => setAuthEmail(e.target.value)}
                                      placeholder="Your email address"
                                      className="w-full bg-[#111317] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FE7733]"
                                    />
                                  </div>
                                  <div>
                                    <input
                                      type="password"
                                      required
                                      minLength={6}
                                      value={authPassword}
                                      onChange={(e) => setAuthPassword(e.target.value)}
                                      placeholder="Password (min 6 chars)"
                                      className="w-full bg-[#111317] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FE7733]"
                                    />
                                  </div>

                                  {authError && (
                                    <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-1.5">
                                      <AlertCircle size={13} className="flex-shrink-0" />
                                      <span>{authError}</span>
                                    </div>
                                  )}

                                  <button
                                    type="submit"
                                    disabled={authLoading}
                                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FE7733] to-[#FF8F50] hover:brightness-110 text-white font-extrabold text-xs transition-all shadow-lg shadow-[#FE7733]/25 flex items-center justify-center gap-2 cursor-pointer"
                                  >
                                    {authLoading ? (
                                      <RefreshCw size={14} className="animate-spin" />
                                    ) : (
                                      <>
                                        <Unlock size={14} />
                                        <span>
                                          {authMode === "signup"
                                            ? "⚡ Sign Up & Reveal Unblurred Vector"
                                            : "Log In & Reveal Vector"}
                                        </span>
                                      </>
                                    )}
                                  </button>
                                </form>

                                <div className="text-[10px] text-gray-400 flex items-center justify-center gap-2 pt-0.5">
                                  <span>✓ 100% Free</span>
                                  <span>·</span>
                                  <span>✓ Zero Card Needed</span>
                                  <span>·</span>
                                  <span>✓ LightBurn Ready</span>
                                </div>
                              </motion.div>
                            </div>
                          )}
                        </div>

                        {/* Export Action Toolbar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white/5 border border-white/10 rounded-2xl">
                          <div className="text-xs">
                            {isUnlocked ? (
                              <span className="text-[#10B981] font-mono font-semibold flex items-center gap-1.5">
                                <Check size={14} />
                                <span>Vector Unlocked (Closed CAD Paths)</span>
                              </span>
                            ) : (
                              <span className="text-[#FE7733] font-mono font-semibold flex items-center gap-1.5">
                                <Lock size={14} />
                                <span>Blurred Preview · Sign Up Free to Unlock</span>
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCopySvg(msg.svg)}
                              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                              <Code2 size={13} />
                              <span>{copied ? "Copied SVG!" : "Copy SVG Code"}</span>
                            </button>
                            <button
                              onClick={() => handleDownloadSvg(msg.svg)}
                              className="px-4 py-1.5 rounded-xl bg-[#FE7733] hover:bg-[#E85F20] text-xs text-white font-bold flex items-center gap-1.5 transition-all shadow-md shadow-[#FE7733]/20 cursor-pointer"
                            >
                              <Download size={13} />
                              <span>Download Clean SVG</span>
                            </button>
                            <a
                              href="https://app.0machine.com"
                              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#B1FA63]/10 hover:bg-[#B1FA63]/20 border border-[#B1FA63]/25 text-[#B1FA63] text-xs font-bold transition-all"
                            >
                              <span>Studio CAM</span>
                              <ExternalLink size={12} />
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* ============================================================== */}
            {/* CHARGING PROGRESS BAR ("SAMTA KATCHARJA")                      */}
            {/* ============================================================== */}
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-[95%] sm:max-w-[90%] rounded-2xl rounded-tl-none p-5 bg-[#16181D] border border-[#FE7733]/40 text-gray-200 shadow-xl space-y-3"
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

                {/* The Charging Bar ("Samta") */}
                <div className="w-full bg-[#111317] h-3.5 rounded-full p-0.5 border border-white/10 overflow-hidden relative shadow-inner">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#FE7733] via-[#FFA559] to-[#B1FA63] shadow-lg shadow-[#FE7733]/40 relative"
                    style={{ width: `${progressPercent}%` }}
                    transition={{ ease: "easeOut", duration: 0.25 }}
                  >
                    {/* Glowing lead edge shine */}
                    <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/40 blur-[2px] rounded-full" />
                  </motion.div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-0.5 font-mono">
                  <span>0machine CAD Engine v2.0</span>
                  <span>Closed Perimeter · LightBurn C00/C01</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Quick Suggestion Pills ("Popular Presets") */}
          <div className="p-3.5 sm:p-4 border-t border-white/10 bg-[#16181D]/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Popular Presets (Tap to Load)
              </span>
              <span className="text-[10px] font-mono text-[#B1FA63] font-semibold">1-Click CAM Vector</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_PROMPTS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectSample(item)}
                  className="text-xs px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 text-gray-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{item.icon}</span>
                  <span className="font-medium">{item.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 sm:p-5 border-t border-white/10 bg-[#111317] space-y-3">
            {/* Mode selection chips */}
            <div className="flex items-center gap-2">
              {[
                { id: "cut-engrave", label: "✂️ Cut + Engrave" },
                { id: "keychain", label: "🔑 Keychain (3.5mm Hole)" },
                { id: "stencil", label: "🌿 Bridged Stencil" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActiveMode(m.id)}
                  className={`text-[11px] font-semibold px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                    activeMode === m.id
                      ? "bg-[#FE7733]/20 border-[#FE7733] text-[#FE7733]"
                      : "bg-white/5 border-white/5 text-gray-400 hover:text-white"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Prompt Input Box */}
            <div className="relative">
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
                placeholder="Describe your laser cut design (e.g. Wolf howling at moon keychain, geometric coaster, vintage sign)..."
                className="w-full bg-[#1A1D21] border border-white/10 rounded-2xl p-3.5 pr-28 text-xs sm:text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#FE7733] transition-colors resize-none font-mono"
              />

              <button
                onClick={() => handleSendPrompt()}
                disabled={isGenerating || !customPrompt.trim()}
                className={`absolute right-2.5 bottom-3 px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isGenerating || !customPrompt.trim()
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#FE7733] to-[#FF8F50] hover:brightness-110 text-white shadow-lg shadow-[#FE7733]/25"
                }`}
              >
                {isGenerating ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <>
                    <Zap size={14} />
                    <span>Generate</span>
                  </>
                )}
              </button>
            </div>

            {genError && (
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle size={14} className="flex-shrink-0" />
                <span>{genError}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] text-gray-500 pt-0.5">
              <span>Press Enter to send · Generates closed CAD vector SVG</span>
              <span className="text-[#B1FA63] font-mono">100% Whitelabel LaserAI</span>
            </div>
          </div>
        </div>

        {/* Value Badges Below Prompt Chat */}
        <div className="grid sm:grid-cols-3 gap-4 mt-8 text-xs">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
            <ShieldCheck size={18} className="text-[#10B981] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Kerf Compensated</span>
              <span className="text-gray-400 text-[11px]">Strict friction-fit outer offsets</span>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
            <ShieldCheck size={18} className="text-[#10B981] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Connected Stencils</span>
              <span className="text-gray-400 text-[11px]">Auto-bridges enclosed interior loops</span>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
            <ShieldCheck size={18} className="text-[#10B981] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">1-Click CAM Ready</span>
              <span className="text-gray-400 text-[11px]">Export direct to LightBurn & xTool</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
