"use client";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { Check, Zap } from "lucide-react";

export default function Pricing() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [cycle, setCycle] = useState("annual"); // 'monthly' | 'annual'

  const plans = [
    {
      name: t("price.free.name") || "Free Forever",
      price: "$0",
      period: "forever",
      description: t("price.free.desc") || "Perfect for hobbyists discovering 0Machine.",
      features: [
        t("price.free.f1") || "3 Projects per Month",
        t("price.free.f2") || "1 Machine Profile",
        t("price.free.f3") || "Basic Job Cost Calculator",
        t("price.free.f4") || "PDF Quote Export",
        t("price.free.f5") || "Community Support",
      ],
      cta: t("price.free.cta") || "Start Free",
      href: "https://app.0machine.com",
      highlighted: false,
    },
    {
      name: t("price.starter.name") || "Starter",
      price: cycle === "annual" ? "$59" : "$9",
      period: cycle === "annual" ? "/year" : "/month",
      description: t("price.starter.desc") || "Perfect for makers and small workshops.",
      features: [
        t("price.starter.f1") || "Unlimited Projects & Machine Profiles",
        t("price.starter.f2") || "Material Inventory & Laser Presets",
        t("price.starter.f3") || "PDF Quotes & Invoices",
        t("price.starter.f4") || "Design Library Access",
        t("price.starter.f5") || "Basic Dashboard & Email Support",
      ],
      cta: t("price.starter.cta") || "Upgrade to Starter",
      href: "https://app.0machine.com",
      highlighted: true,
      badge: "⭐ Most Popular",
    },
    {
      name: t("price.pro.name") || "Workshop Pro",
      price: cycle === "annual" ? "$149" : "$19",
      period: cycle === "annual" ? "/year" : "/month",
      description: t("price.pro.desc") || "Everything in Starter plus advanced production optimization.",
      features: [
        t("price.pro.f1") || "Everything in Starter +",
        t("price.pro.f2") || "Nesting Yield Calculator",
        t("price.pro.f3") || "1-Click WhatsApp Sharing",
        t("price.pro.f4") || "CSV & Excel Data Exports",
        t("price.pro.f5") || "Team Workspace (3 Users)",
        t("price.pro.f6") || "Commercial Vector Packs & Priority Support",
      ],
      cta: t("price.pro.cta") || "Upgrade to Pro",
      href: "https://app.0machine.com",
      highlighted: false,
      badge: "🔥 Best Value",
    },
  ];

  return (
    <section id="pricing" ref={ref} className="relative py-32 overflow-hidden bg-[#0A0C12]">
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-xs text-[#FF6B35] tracking-[0.2em] uppercase font-bold">
            TRANSPARENT PRICING
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mt-3 mb-4 font-[Outfit]">
            Run Your Entire Laser Workshop <br />
            <span className="text-[#FF6B35]">From One Dashboard.</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-base">
            Start free forever. Upgrade anytime as your workshop grows.
          </p>

          {/* Monthly vs Annual Cycle Toggle */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => setCycle("monthly")}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                cycle === "monthly"
                  ? "bg-[#FF6B35] text-white shadow-lg shadow-[#FF6B35]/20"
                  : "bg-[#13151F] text-gray-400 hover:text-white border border-white/10"
              }`}
            >
              Monthly Billing
            </button>

            <button
              onClick={() => setCycle("annual")}
              className={`relative px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                cycle === "annual"
                  ? "bg-[#FF6B35] text-white shadow-lg shadow-[#FF6B35]/20"
                  : "bg-[#13151F] text-gray-400 hover:text-white border border-white/10"
              }`}
            >
              Annual Billing
              <span className="absolute -top-3 -right-3 bg-emerald-500 text-white text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full shadow">
                Save 45%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards Grid (3 Columns) */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name || i}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              className={`relative flex flex-col h-full rounded-2xl p-8 border transition-all ${
                plan.highlighted
                  ? "bg-[#161926] border-[#FF6B35] shadow-2xl shadow-[#FF6B35]/10 scale-105"
                  : "bg-[#13151F] border-white/10 hover:border-white/20"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#FF6B35] text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm min-h-[40px]">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                  <span className="text-gray-400 text-sm font-medium">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3.5 mb-8 flex-1">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-[#FF6B35] flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <a
                href={plan.href}
                className={`w-full text-center py-3.5 px-6 rounded-xl font-bold text-sm transition-all ${
                  plan.highlighted
                    ? "bg-[#FF6B35] hover:bg-[#e05a2b] text-white shadow-lg shadow-[#FF6B35]/25"
                    : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                }`}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
