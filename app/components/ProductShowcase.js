"use client";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const screenshots = [
  {
    src: "/screenshots/screenshot-dashboard.png",
    label: "Project Dashboard",
    desc: "Track every project with cost and time",
  },
  {
    src: "/screenshots/screenshot-detail.png",
    label: "Project Details",
    desc: "Full cost breakdown with PDF export",
  },
  {
    src: "/screenshots/screenshot-stats.png",
    label: "Smart Analytics",
    desc: "Revenue, completion rates, and trends",
  },
];

export default function ProductShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-500/20 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-xs text-accent-400 tracking-[0.2em] uppercase font-medium">
            Built for Mobile & Desktop
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-[Outfit] text-white mt-4 mb-6">
            Beautiful on
            <br />
            <span className="gradient-text-accent">Every Screen</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            Manage your workshop from your desk or on the shop floor. Works
            beautifully on any device.
          </p>
        </motion.div>

        {/* Horizontal parallax scroll */}
        <motion.div style={{ x }} className="flex gap-8 justify-center flex-wrap lg:flex-nowrap">
          {screenshots.map((screen, i) => (
            <motion.div
              key={screen.label}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className="relative group flex-shrink-0"
            >
              {/* Glow */}
              <div className="absolute inset-0 bg-accent-500/5 rounded-3xl blur-[40px] group-hover:bg-accent-500/10 transition-all -z-10" />

              <div className="glass-card overflow-hidden transition-all duration-500 group-hover:border-accent-500/20 group-hover:shadow-xl group-hover:shadow-accent-500/5">
                {/* Image */}
                <div className="relative overflow-hidden w-[280px] sm:w-[320px]">
                  <img
                    src={screen.src}
                    alt={screen.label}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                </div>

                {/* Label */}
                <div className="p-4">
                  <h4 className="text-sm font-semibold text-white font-[Outfit]">
                    {screen.label}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">{screen.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
