"use client";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { Monitor, Tablet, Smartphone, Check, Zap, Layers, Sparkles } from "lucide-react";

export default function ProductShowcase() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeDevice, setActiveDevice] = useState("all"); // 'all' | 'desktop' | 'tablet' | 'mobile'

  return (
    <section id="showcase" ref={ref} className="relative py-32 overflow-hidden bg-dark-950/60">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-500/20 to-transparent" />
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Radial ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-accent-500/5 rounded-full blur-[140px] -z-10" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
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
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-[Outfit] text-white mt-2 mb-6">
            {t("showcase.title")}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            {t("showcase.subtitle")}
          </p>
        </motion.div>

        {/* Device Switcher Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-16"
        >
          <div className="inline-flex items-center p-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl gap-1">
            {[
              { id: "all", label: "All Devices", icon: Layers },
              { id: "desktop", label: "Desktop Web", icon: Monitor },
              { id: "tablet", label: "Workshop Tablet", icon: Tablet },
              { id: "mobile", label: "Mobile Companion", icon: Smartphone },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeDevice === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveDevice(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 ${
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
        <div className="relative max-w-6xl mx-auto">
          
          {/* ALL DEVICES OVERLAPPING COMPOSITION */}
          {(activeDevice === "all" || activeDevice === "desktop") && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative z-10"
            >
              {/* DESKTOP BROWSER FRAME */}
              <div className="glass-card rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-black/80 bg-dark-900">
                
                {/* Mac Chrome Header */}
                <div className="bg-dark-800 px-4 py-3 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/70" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                      <div className="w-3 h-3 rounded-full bg-green-500/70" />
                    </div>
                    <div className="ml-4 text-[10px] text-gray-500 font-mono hidden sm:inline-block">MacBook Pro 16" Workspace</div>
                  </div>

                  <div className="bg-dark-950/80 border border-white/10 rounded-lg px-6 py-1 text-xs text-gray-400 font-mono flex items-center gap-2 max-w-md w-full justify-center">
                    <span className="text-green-400 text-[10px]">🔒 https://</span>
                    <span>app.0machine.com/dashboard</span>
                  </div>

                  <div className="text-[10px] text-accent-400 font-semibold bg-accent-500/10 border border-accent-500/20 px-2.5 py-0.5 rounded-md hidden sm:block">
                    PRO ACTIVE
                  </div>
                </div>

                {/* Desktop App UI Content */}
                <div className="p-6 sm:p-8 bg-dark-950">
                  <div className="flex gap-6">
                    
                    {/* App Sidebar */}
                    <div className="hidden md:block w-52 shrink-0 border-r border-white/5 pr-6 space-y-6">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center font-bold text-white shadow-md shadow-accent-500/30">
                          0M
                        </div>
                        <div>
                          <span className="text-sm font-extrabold text-white font-[Outfit]">0Machine</span>
                          <span className="block text-[9px] text-accent-400 tracking-wider uppercase font-semibold">Laser OS v2.4</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        {[
                          { name: "Dashboard", active: true },
                          { name: "Cost Calculator", active: false },
                          { name: "Material Inventory", active: false },
                          { name: "Order Tracker", active: false },
                          { name: "Laser Presets", active: false },
                          { name: "Design Library 🌟", active: false },
                          { name: "Nesting Estimator 🌟", active: false },
                          { name: "Invoice PDF 🌟", active: false },
                        ].map((m, idx) => (
                          <div 
                            key={m.name}
                            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                              m.active ? "bg-accent-500/15 text-accent-400 border border-accent-500/20" : "text-gray-400 hover:text-white hover:bg-white/5"
                            }`}
                          >
                            <span>{m.name}</span>
                            {m.active && <div className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" />}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Main Workspace Body */}
                    <div className="flex-1 space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500">Workshop Operational Dashboard</p>
                          <h3 className="text-xl font-bold text-white font-[Outfit]">Laser Production Overview</h3>
                        </div>
                        <div className="flex gap-2">
                          <button className="bg-accent-500 text-white text-xs px-3.5 py-2 rounded-xl font-semibold flex items-center gap-1.5 shadow-lg shadow-accent-500/20">
                            <Zap size={14} />
                            <span>New Project Quote</span>
                          </button>
                        </div>
                      </div>

                      {/* Stat KPI Cards */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="bg-white/5 border border-white/5 p-4 rounded-xl">
                          <span className="text-xs text-gray-400 block mb-1">Active Laser Jobs</span>
                          <span className="text-2xl font-black text-white font-[Outfit]">12 Projects</span>
                          <span className="text-[10px] text-green-400 block mt-1">↑ 4 cutting now</span>
                        </div>
                        <div className="bg-white/5 border border-white/5 p-4 rounded-xl">
                          <span className="text-xs text-gray-400 block mb-1">Monthly Revenue</span>
                          <span className="text-2xl font-black text-accent-400 font-[Outfit]">$4,850.00</span>
                          <span className="text-[10px] text-accent-400 block mt-1">100% Margin verified</span>
                        </div>
                        <div className="bg-white/5 border border-white/5 p-4 rounded-xl">
                          <span className="text-xs text-gray-400 block mb-1">Material Stock</span>
                          <span className="text-2xl font-black text-white font-[Outfit]">142 Sheets</span>
                          <span className="text-[10px] text-blue-400 block mt-1">Birch, Acrylic, MDF</span>
                        </div>
                        <div className="bg-white/5 border border-white/5 p-4 rounded-xl">
                          <span className="text-xs text-gray-400 block mb-1">Sheet Yield</span>
                          <span className="text-2xl font-black text-purple-400 font-[Outfit]">94.2%</span>
                          <span className="text-[10px] text-purple-400 block mt-1">Nesting optimized</span>
                        </div>
                      </div>

                      {/* Live Job Feed Table */}
                      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">Live Laser Jobs Queue</span>
                          <span className="text-[11px] text-accent-400">Auto-calculated costs</span>
                        </div>
                        <div className="space-y-2 text-xs">
                          {[
                            { title: "Custom Birch Plywood Sign (600x400mm)", client: "Oak & Iron Decor", time: "18m 45s", cost: "$14.20", price: "$65.00", status: "Cutting" },
                            { title: "Red Acrylic LED Base Plates x 50", client: "TechCraft Studios", time: "42m 10s", cost: "$38.50", price: "$180.00", status: "Queued" },
                            { title: "Engraved Leather Keychains x 200", client: "Verve Goods", time: "25m 00s", cost: "$19.00", price: "$120.00", status: "Completed" },
                          ].map((row, i) => (
                            <div key={i} className="bg-white/5 border border-white/5 p-3 rounded-lg flex items-center justify-between flex-wrap gap-2">
                              <div>
                                <span className="font-bold text-white block">{row.title}</span>
                                <span className="text-[11px] text-gray-500">{row.client}</span>
                              </div>
                              <div className="flex items-center gap-4 text-right">
                                <div>
                                  <span className="text-[10px] text-gray-400 block">Est. Cost</span>
                                  <span className="font-semibold text-gray-300">{row.cost}</span>
                                </div>
                                <div>
                                  <span className="text-[10px] text-gray-400 block">Quote Price</span>
                                  <span className="font-bold text-accent-400">{row.price}</span>
                                </div>
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md ${
                                  row.status === 'Cutting' ? 'bg-green-500/20 text-green-400 border border-green-500/30 animate-pulse' :
                                  row.status === 'Queued' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                  'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                }`}>
                                  {row.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TABLET & MOBILE OVERLAPPING CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            
            {/* TABLET MOCKUP FRAME */}
            {(activeDevice === "all" || activeDevice === "tablet") && (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="glass-card rounded-[28px] border-4 border-gray-800 p-4 shadow-2xl bg-dark-900 relative">
                  
                  {/* Tablet Camera & Top Mic */}
                  <div className="flex justify-center mb-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-800 border border-gray-700" />
                  </div>

                  {/* Tablet Display Content */}
                  <div className="bg-dark-950 rounded-2xl p-5 border border-white/5 space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <div className="flex items-center gap-2">
                        <Tablet size={18} className="text-accent-400" />
                        <span className="font-bold text-white text-sm font-[Outfit]">Workbench Tablet View</span>
                      </div>
                      <span className="text-[10px] bg-accent-500/20 text-accent-400 font-semibold px-2 py-0.5 rounded">Hands-Free</span>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-white/5 p-3 rounded-xl">
                        <span className="text-[11px] text-gray-400 block font-semibold mb-1">Laser Machine Preset Loaded</span>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-white font-bold">3mm Birch Plywood (CO2 80W)</span>
                          <span className="text-green-400 font-mono font-bold">Speed: 25mm/s | Power: 65%</span>
                        </div>
                      </div>

                      <div className="bg-accent-500/10 border border-accent-500/20 p-3.5 rounded-xl">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-white">Cost & Profit Calculator</span>
                          <span className="text-xs font-bold text-accent-400">Rec. Price: $48.00</span>
                        </div>
                        <p className="text-[11px] text-gray-400">Material ($8.50) + Machine Time ($4.20) + Labor ($10.00)</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-center text-xs">
                        <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                          <span className="text-[10px] text-gray-400 block">Parts Nesting Yield</span>
                          <span className="font-bold text-purple-400 text-sm">24 Parts / Sheet</span>
                        </div>
                        <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                          <span className="text-[10px] text-gray-400 block">Est. Cutting Time</span>
                          <span className="font-bold text-white text-sm">14m 20s</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* MOBILE SMARTPHONE MOCKUP FRAME */}
            {(activeDevice === "all" || activeDevice === "mobile") && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative flex justify-center"
              >
                <div className="glass-card w-full max-w-[340px] rounded-[36px] border-4 border-gray-800 p-3 shadow-2xl bg-dark-900 relative">
                  
                  {/* Dynamic Island Notch */}
                  <div className="w-28 h-4 bg-black rounded-full mx-auto mb-3 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-900 border border-gray-800" />
                  </div>

                  {/* Smartphone Screen Content */}
                  <div className="bg-dark-950 rounded-[28px] p-4 border border-white/5 space-y-3">
                    <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <Smartphone size={14} className="text-accent-400" />
                        <span>Mobile Companion</span>
                      </span>
                      <span className="text-[10px] text-gray-400">9:41 AM</span>
                    </div>

                    <div className="bg-white/5 p-3 rounded-xl space-y-1">
                      <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">⚠️ Stock Alert</span>
                      <div className="text-xs font-bold text-white">Red Acrylic 3mm — Low Stock</div>
                      <p className="text-[10px] text-gray-400">Only 2 sheets remaining in workshop</p>
                    </div>

                    <div className="bg-white/5 p-3 rounded-xl space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white">Client PDF Quote</span>
                        <span className="text-[10px] bg-green-500/20 text-green-400 font-bold px-2 py-0.5 rounded">Ready</span>
                      </div>
                      <p className="text-[11px] text-gray-400">Invoice #INV-2026-042 ($240.00)</p>
                      <button className="w-full bg-accent-500 text-white text-[11px] font-bold py-1.5 rounded-lg flex items-center justify-center gap-1">
                        <Zap size={12} />
                        <span>Send PDF Quote to Client</span>
                      </button>
                    </div>
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

