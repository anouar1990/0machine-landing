"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const testimonials = [
  {
    name: "Jason R.",
    role: "Laser Engraving Shop Owner",
    text: "I used to track everything in a messy Notes app. Now I have full cost breakdowns for every project and I know exactly what to charge. The PDF export alone is worth it.",
    avatar: "JR",
    rating: 5,
  },
  {
    name: "Maria C.",
    role: "Custom Sign Maker",
    text: "The client manager feature is brilliant. I have 12 repeat customers and I can now see at a glance how much revenue each one brings in. Game changer for my side business.",
    avatar: "MC",
    rating: 5,
  },
  {
    name: "Tyler P.",
    role: "CNC Workshop Owner",
    text: "Machine profiles changed everything. I have 3 machines with completely different settings — now I load the profile and I'm ready to go. Never mess up settings again.",
    avatar: "TP",
    rating: 5,
  },
  {
    name: "Emma K.",
    role: "Craft Fair Vendor",
    text: "Super clean UI and super fast. I love that the app works offline too. I use it at craft fairs to show clients exactly what the project will cost before I commit.",
    avatar: "EK",
    rating: 5,
  },
  {
    name: "David M.",
    role: "Etsy Laser Creator",
    text: "The templates feature is a massive time saver. I have templates set up for my most popular laser cut items and I can start a new job in 10 seconds flat. Love it.",
    avatar: "DM",
    rating: 5,
  },
  {
    name: "Rachel S.",
    role: "Small Batch Producer",
    text: "3 day free trial sealed the deal. I had it set up with 5 projects within the first hour. By day 2 I already knew I wasn't cancelling. Worth every dollar.",
    avatar: "RS",
    rating: 5,
  },
];

const stats = [
  { value: 2400, label: "Projects Tracked", suffix: "+" },
  { value: 98, label: "Customer Satisfaction", suffix: "%" },
  { value: 850, label: "Hours Saved Monthly", suffix: "+" },
  { value: 4.9, label: "App Store Rating", suffix: "/5", decimals: 1 },
];

function AnimatedCounter({ value, suffix = "", decimals = 0 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(eased * value);
      if (progress < 1) requestAnimationFrame(tick);
    };
    tick();
  }, [isInView, value]);

  return (
    <span ref={ref} className="text-4xl sm:text-5xl font-bold text-white font-[Outfit]">
      {decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}
      {suffix}
    </span>
  );
}

export default function SocialProof() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 gradient-mesh opacity-40" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-500/20 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-24"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center glass-card p-6 sm:p-8"
            >
              <AnimatedCounter
                value={stat.value}
                suffix={stat.suffix}
                decimals={stat.decimals || 0}
              />
              <p className="text-sm text-gray-500 mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mb-16"
        >
          <span className="text-xs text-accent-400 tracking-[0.2em] uppercase font-medium">
            Trusted by Makers
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-[Outfit] text-white mt-4 mb-6">
            Makers Love
            <br />
            <span className="gradient-text-accent">0Machine</span>
          </h2>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
              className="glass-card-hover p-6 sm:p-8"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <svg
                    key={j}
                    className="w-4 h-4 text-accent-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-gray-300 leading-relaxed mb-6 italic">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-500/30 to-accent-600/30 flex items-center justify-center border border-accent-500/20">
                  <span className="text-xs font-bold text-accent-400">
                    {t.avatar}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
