"use client";
import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { Monitor, Tablet, Smartphone, Layers, Sparkles, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

function WhatsAppIcon({ className = "w-3.5 h-3.5", ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662a11.838 11.838 0 005.711 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}

export default function ProductShowcase() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeDevice, setActiveDevice] = useState("all"); // 'all' | 'desktop' | 'tablet' | 'mobile'

  return (
    <section id="showcase" ref={ref} className="relative py-28 sm:py-36 overflow-hidden bg-dark-950/70">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-500/20 to-transparent" />
      <div className="absolute inset-0 grid-pattern opacity-25 pointer-events-none" />

      {/* Radial ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-accent-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-1.5 text-xs text-accent-400 tracking-[0.2em] uppercase font-semibold bg-accent-500/10 px-3.5 py-1.5 rounded-full border border-accent-500/20 mb-4">
            <Sparkles size={13} />
            <span>{t("showcase.badge")}</span>
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-[Outfit] text-white mt-2 mb-4 tracking-tight">
            {t("showcase.title")}
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            {t("showcase.subtitle")}
          </p>
        </motion.div>

        {/* Device Switcher Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-14"
        >
          <div className="inline-flex items-center p-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl gap-1 max-w-full overflow-x-auto scrollbar-none">
            {[
              { id: "all", label: "All Devices", icon: Layers },
              { id: "desktop", label: "Desktop Web", icon: Monitor },
              { id: "tablet", label: "Workshop Tablet", icon: Tablet },
              { id: "mobile", label: "Mobile Companion", icon: Smartphone },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeDevice === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveDevice(tab.id)}
                  className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg shadow-accent-500/25"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* DEVICES SHOWCASE CONTAINER */}
        <div className="relative max-w-6xl mx-auto space-y-10">
          {/* DESKTOP WEB FRAME */}
          {(activeDevice === "all" || activeDevice === "desktop") && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="relative z-10"
            >
              <div className="glass-card rounded-2xl border border-white/15 overflow-hidden shadow-2xl shadow-black/90 bg-dark-950">
                {/* Mac Chrome Header */}
                <div className="bg-dark-900/95 backdrop-blur-md px-4 py-3 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/70" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                      <div className="w-3 h-3 rounded-full bg-green-500/70" />
                    </div>
                    <div className="ml-4 text-[11px] text-gray-500 font-mono hidden sm:inline-block">
                      MacBook Pro 16&quot; · Workshop OS
                    </div>
                  </div>

                  <div className="bg-dark-950/90 border border-white/10 rounded-lg px-4 sm:px-6 py-1 text-xs text-gray-300 font-mono flex items-center gap-2 max-w-sm sm:max-w-md w-full justify-center">
                    <span className="text-green-400 text-[10px]">🔒 https://</span>
                    <span className="text-white font-medium truncate">app.0machine.com/dashboard</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-accent-400 font-semibold bg-accent-500/10 border border-accent-500/20 px-2.5 py-0.5 rounded-md hidden sm:inline-block">
                      PRO ACTIVE
                    </span>
                    <a
                      href="https://app.0machine.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-semibold text-accent-400 hover:text-accent-300 transition-colors"
                    >
                      ↗
                    </a>
                  </div>
                </div>

                {/* Real Desktop Screenshot */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-dark-950">
                  <img
                    src="/screenshots/screenshot-dashboard.webp"
                    alt="0Machine Desktop Workshop Dashboard with revenue, live orders, and material telemetry"
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-dark-950/80 to-transparent pointer-events-none" />
                </div>

                {/* Footer highlights */}
                <div className="bg-dark-900/80 px-6 py-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-gray-300 font-medium">
                      <CheckCircle2 size={13} className="text-green-400" />
                      Live Workshop Revenue Telemetry
                    </span>
                    <span className="hidden sm:flex items-center gap-1.5 text-gray-300 font-medium">
                      <ShieldCheck size={13} className="text-blue-400" />
                      End-to-End Job Cost Accounting
                    </span>
                  </div>
                  <a
                    href="https://app.0machine.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-400 hover:text-accent-300 font-semibold flex items-center gap-1"
                  >
                    <span>Launch app.0machine.com</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}

          {/* TABLET & MOBILE RESPONSIVE GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* WORKSHOP TABLET MOCKUP FRAME */}
            {(activeDevice === "all" || activeDevice === "tablet") && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className={activeDevice === "tablet" ? "md:col-span-2 max-w-3xl mx-auto w-full" : "relative"}
              >
                <div className="glass-card rounded-[32px] border-4 border-gray-800 p-3 sm:p-4 shadow-2xl bg-dark-900 relative">
                  {/* Tablet Top Camera Pinhole */}
                  <div className="flex justify-center mb-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-800 border border-gray-700" />
                  </div>

                  {/* Tablet Display Content Frame */}
                  <div className="bg-dark-950 rounded-2xl overflow-hidden border border-white/10">
                    <div className="bg-dark-900/90 px-4 py-2.5 flex items-center justify-between border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <Tablet size={16} className="text-accent-400" />
                        <span className="font-bold text-white text-xs font-[Outfit]">
                          Workshop Tablet · Live Job Queue
                        </span>
                      </div>
                      <span className="text-[10px] bg-accent-500/20 text-accent-400 font-semibold px-2 py-0.5 rounded">
                        Hands-Free Bench
                      </span>
                    </div>

                    {/* Real Tablet Screenshot: Workshop Production Tracker */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-dark-950">
                      <img
                        src="/screenshots/screenshot-production.webp"
                        alt="0Machine Workshop Production Job Tracker on Benchtop Tablet"
                        className="w-full h-full object-cover object-top"
                        loading="lazy"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-dark-950/80 to-transparent pointer-events-none" />
                    </div>
                  </div>

                  {/* Tablet Callout */}
                  <div className="mt-3 px-2 flex items-center justify-between text-[11px] text-gray-400">
                    <span className="font-medium text-white flex items-center gap-1.5">
                      <Zap size={13} className="text-amber-400" />
                      Operators track status & cutting times in real-time
                    </span>
                    <span className="text-accent-400 font-semibold">Touch-Optimized</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* MOBILE SMARTPHONE MOCKUP FRAME */}
            {(activeDevice === "all" || activeDevice === "mobile") && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className={activeDevice === "mobile" ? "md:col-span-2 max-w-md mx-auto w-full flex justify-center" : "relative flex justify-center"}
              >
                <div className="glass-card w-full max-w-[340px] rounded-[42px] border-4 border-gray-800 p-3 shadow-2xl bg-dark-900 relative">
                  {/* Dynamic Island Notch */}
                  <div className="w-24 h-4 bg-black rounded-full mx-auto mb-2 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-gray-900 border border-gray-800" />
                  </div>

                  {/* Mobile Screen Display */}
                  <div className="bg-dark-950 rounded-[30px] overflow-hidden border border-white/10">
                    {/* Status Bar */}
                    <div className="flex justify-between items-center px-4 pt-1.5 pb-2 text-[11px] border-b border-white/5 bg-dark-900/90">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <Smartphone size={13} className="text-accent-400" />
                        <span>Mobile Companion</span>
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">9:41 AM</span>
                    </div>

                    {/* Real Mobile Screenshot: Quotes & Invoices */}
                    <div className="relative aspect-[9/14] w-full overflow-hidden bg-dark-950">
                      {/* Floating WhatsApp indicator badge */}
                      <div className="absolute top-2.5 right-2.5 z-10 bg-[#25D366] text-black font-extrabold text-[10px] px-2.5 py-1 rounded-full shadow-lg shadow-[#25D366]/30 flex items-center gap-1.5 backdrop-blur-sm">
                        <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
                        <span>WhatsApp Quotes</span>
                      </div>
                      <img
                        src="/screenshots/screenshot-quotes.webp"
                        alt="0Machine Client PDF Quote Generator on Mobile Companion"
                        className="w-full h-full object-cover object-top"
                        loading="lazy"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-dark-950/80 to-transparent pointer-events-none" />
                    </div>
                  </div>

                  {/* Mobile Callout */}
                  <div className="mt-3 px-2 flex items-center justify-between text-[11px] text-gray-400">
                    <span className="font-medium text-white flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center flex-shrink-0">
                        <WhatsAppIcon className="w-3 h-3 fill-current" />
                      </span>
                      <span>Send client quotes &amp; invoices via WhatsApp on-the-go</span>
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
