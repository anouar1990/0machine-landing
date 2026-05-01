"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const withoutItems = [
  { icon: "📝", text: "Pricing calculated from gut feeling — losing money on every other job" },
  { icon: "📂", text: "Design files scattered across USB drives, desktop folders, and messaging apps" },
  { icon: "📊", text: "Revenue tracked in messy spreadsheets — no idea which projects are profitable" },
  { icon: "⚙️", text: "Laser settings written on sticky notes — wrong power, wasted material" },
  { icon: "🗓", text: "Orders managed in your head — missed deadlines and forgotten clients" },
  { icon: "📦", text: "Material shortages discovered mid-job — production halted, clients waiting" },
];

const withItems = [
  { icon: "⚡", text: "Cost Calculator shows real production cost and recommended selling price instantly" },
  { icon: "📁", text: "Every project organized with photos, costs, time, materials, and client info" },
  { icon: "📈", text: "Smart analytics show revenue, top projects, completion rates, and trends" },
  { icon: "🎯", text: "Laser Presets loaded in 10 seconds — perfect settings every time" },
  { icon: "📋", text: "Orders tracked from Pending to Completed with due dates and client names" },
  { icon: "📦", text: "Material Inventory shows stock levels and total value — never run out" },
];

export default function Comparison() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 gradient-mesh opacity-30" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-500/20 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-xs text-accent-400 tracking-[0.2em] uppercase font-medium">
            The Difference
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-[Outfit] text-white mt-4 mb-6">
            Before vs After
            <br />
            <span className="gradient-text-accent">0Machine</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Without */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-6 sm:p-8 comparison-bad"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <span className="text-red-400 text-lg">✕</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-[Outfit]">
                  Without 0Machine
                </h3>
                <p className="text-xs text-red-400/60">
                  Chaos, guesswork, lost revenue
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {withoutItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-red-500/[0.03] border border-red-500/[0.06]"
                >
                  <span className="text-sm mt-0.5">{item.icon}</span>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* With */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-card p-6 sm:p-8 comparison-good relative overflow-hidden"
          >
            {/* Subtle glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-500/5 rounded-full blur-[60px]" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <span className="text-green-400 text-lg">✓</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-[Outfit]">
                    With 0Machine
                  </h3>
                  <p className="text-xs text-green-400/60">
                    Organized, profitable, in control
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {withItems.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.5 + i * 0.08 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-green-500/[0.03] border border-green-500/[0.06]"
                  >
                    <span className="text-sm mt-0.5">{item.icon}</span>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {item.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
