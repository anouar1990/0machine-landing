"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const mockupY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background effects */}
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute inset-0 grid-pattern" />

      {/* Radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-accent-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px]" />

      <motion.div
        style={{ opacity, scale }}
        className="relative z-10 max-w-7xl mx-auto px-6 text-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent-500/20 bg-accent-500/5 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse" />
          <span className="text-xs text-accent-400 font-medium tracking-wide">
            Built for Laser & CNC Makers
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-5xl sm:text-6xl lg:text-8xl font-bold font-[Outfit] leading-[1.05] tracking-tight mb-6"
        >
          <span className="text-white">Run Your Laser</span>
          <br />
          <span className="text-white">Business </span>
          <span className="gradient-text-accent">Smarter.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Track materials, calculate costs, manage clients, and generate
          quotes — all from one beautiful app designed for laser cutters and CNC
          makers.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6"
        >
          <a href="https://app.0machine.com" className="glow-btn text-base px-8 py-4">
            ⚡ Start Free Trial
          </a>
          <a href="#features" className="glow-btn-outline text-base px-8 py-4">
            See Features →
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-sm text-gray-600 mb-16"
        >
          3 days free · then $9/mo · cancel anytime
        </motion.p>

        {/* Floating Dashboard Mockup */}
        <motion.div
          style={{ y: mockupY }}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Glow behind mockup */}
          <div className="absolute inset-0 bg-accent-500/10 rounded-3xl blur-[60px] -z-10 scale-90" />

          {/* Main mockup card */}
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
            {/* Browser chrome */}
            <div className="bg-dark-800 px-4 py-3 flex items-center gap-2 border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-dark-700 rounded-lg px-4 py-1 text-xs text-gray-500 flex items-center gap-2">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  app.0machine.com
                </div>
              </div>
            </div>

            {/* Dashboard content - simulated UI */}
            <div className="bg-dark-900 p-6 sm:p-8">
              <div className="flex gap-6">
                {/* Sidebar */}
                <div className="hidden sm:block w-48 shrink-0">
                  <div className="flex items-center gap-2 mb-8">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white">0Machine</span>
                      <span className="block text-[8px] text-gray-500 tracking-wider">PLANNER</span>
                    </div>
                  </div>

                  {["Dashboard", "Cost Calculator", "Materials", "Orders", "Laser Presets", "Quote Generator", "Nesting Estimator"].map(
                    (item, i) => (
                      <div
                        key={item}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg mb-1 text-xs transition-colors ${
                          i === 0
                            ? "bg-accent-500/15 text-accent-400"
                            : "text-gray-500 hover:text-gray-300"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded ${i === 0 ? "bg-accent-500/30" : "bg-dark-700"}`} />
                        {item}
                      </div>
                    )
                  )}
                </div>

                {/* Main content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">⚡ Welcome back</p>
                      <h3 className="text-lg font-semibold text-white">Dashboard</h3>
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                    {[
                      { label: "Total Projects", value: "24", icon: "📊", color: "accent" },
                      { label: "In Progress", value: "8", icon: "⏱", color: "yellow" },
                      { label: "Completed", value: "16", icon: "✅", color: "green" },
                      { label: "Revenue", value: "$2,847", icon: "📈", color: "blue" },
                    ].map((stat, i) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.3 + i * 0.1 }}
                        className="glass-card p-4"
                      >
                        <span className="text-lg mb-1 block">{stat.icon}</span>
                        <p className="text-xl font-bold text-white">{stat.value}</p>
                        <p className="text-[10px] text-gray-500">{stat.label}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Recent projects */}
                  <div className="glass-card p-4">
                    <p className="text-xs text-gray-500 mb-3 tracking-wider uppercase">Recent Projects</p>
                    {[
                      { name: "Custom Coaster Set (x12)", client: "John Smith", cost: "$85.00", status: "In Progress" },
                      { name: "Wedding Decorations", client: "Sarah Lee", cost: "$320.00", status: "Pending" },
                      { name: "Acrylic Signage Batch", client: "Craft Studio", cost: "$195.00", status: "Completed" },
                    ].map((project, i) => (
                      <motion.div
                        key={project.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.6 + i * 0.15 }}
                        className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0"
                      >
                        <div>
                          <p className="text-xs font-medium text-white">{project.name}</p>
                          <p className="text-[10px] text-gray-500">{project.client}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold text-white">{project.cost}</p>
                          <span
                            className={`text-[9px] px-2 py-0.5 rounded-full ${
                              project.status === "Completed"
                                ? "bg-green-500/15 text-green-400"
                                : project.status === "In Progress"
                                ? "bg-accent-500/15 text-accent-400"
                                : "bg-yellow-500/15 text-yellow-400"
                            }`}
                          >
                            {project.status}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating elements around mockup */}
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -right-8 top-20 glass-card p-3 hidden lg:block"
          >
            <p className="text-[10px] text-gray-500 mb-1">Material Cost</p>
            <p className="text-sm font-bold text-white">$45.00</p>
            <p className="text-[9px] text-green-400">Oak 6mm · 3 sheets</p>
          </motion.div>

          <motion.div
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            className="absolute -left-6 bottom-32 glass-card p-3 hidden lg:block"
          >
            <p className="text-[10px] text-gray-500 mb-1">Time Tracked</p>
            <p className="text-sm font-bold text-white">3h 15m</p>
            <div className="w-16 h-1 bg-dark-700 rounded-full mt-1">
              <div className="w-3/4 h-full bg-accent-500 rounded-full" />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-gray-600 tracking-wider">SCROLL TO EXPLORE</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 rounded-full border border-gray-700 flex items-start justify-center p-1"
        >
          <div className="w-1 h-2 rounded-full bg-accent-500" />
        </motion.div>
      </motion.div>
    </section>
  );
}
