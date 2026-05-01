"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function FinalCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 gradient-mesh" />

      {/* Large glow orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-500/8 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-600 shadow-xl shadow-accent-500/30 mb-8"
          >
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold font-[Outfit] text-white mb-6 leading-tight">
            Stop Managing Your
            <br />
            Workshop in
            <br />
            <span className="gradient-text-accent">Spreadsheets.</span>
          </h2>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join hundreds of laser and CNC makers who switched to 0Machine and
            finally know their real costs, track every job, and grow their
            business with confidence.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <a
              href="https://app.0machine.com"
              className="glow-btn text-lg px-10 py-5"
            >
              ⚡ Start Your Free Trial
            </a>
            <a href="#features" className="glow-btn-outline text-lg px-10 py-5">
              Explore Features
            </a>
          </div>

          <p className="text-sm text-gray-600">
            3 days free · $9/mo after · Cancel anytime · No credit card required
          </p>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3 mt-12"
          >
            {[
              "Cost Calculator",
              "Material Inventory",
              "Order Tracking",
              "Laser Presets",
              "Quote Generator",
              "PDF Reports",
              "Analytics",
              "Client Manager",
              "Templates",
              "Nesting Estimator",
            ].map((feature) => (
              <span
                key={feature}
                className="text-xs px-3 py-1.5 rounded-full bg-white/[0.03] text-gray-500 border border-white/5"
              >
                {feature}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
