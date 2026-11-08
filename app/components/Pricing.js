"use client";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { Check, Zap } from "lucide-react";

function WhatsAppIcon({ className = "w-4 h-4", ...props }) {
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

export default function Pricing() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [cycle, setCycle] = useState("annual"); // 'monthly' | 'annual'

  const plans = [
    {
      name: t("price.free.name") || "Free Forever",
      price: "$0",
      period: t("price.period.forever") || "forever",
      billingNote: t("price.free.billed_note") || "Free forever · No credit card required",
      description: t("price.free.desc") || "Perfect for hobbyists discovering 0Machine.",
      features: [
        t("price.free.f1") || "5 LaserAI Vector Generations (Trial)",
        t("price.free.f2") || "3 Free Commercial Design Packs",
        t("price.free.f3") || "Basic Job Cost Calculator",
        t("price.free.f4") || "1 Machine Profile & PDF Quotes",
        t("price.free.f5") || "Community Maker Support",
      ],
      cta: t("price.free.cta") || "Start Free",
      href: "https://app.0machine.com",
      highlighted: false,
    },
    {
      name: t("price.starter.name") || "Starter",
      price: cycle === "annual" ? (t("price.starter.price_yr") || "$7.90") : (t("price.starter.price_mo") || "$9"),
      originalPrice: cycle === "annual" ? (t("price.starter.original_yr") || "$9") : null,
      period: t("price.period.mo") || "/month",
      billingNote:
        cycle === "annual"
          ? (t("price.starter.billed_yr") || "Billed annually at $79/yr (Save ~15%)")
          : (t("price.billed_mo") || "Billed monthly"),
      description: t("price.starter.desc") || "Perfect for makers and small workshops.",
      features: [
        t("price.starter.f1") || "⚡ 50 LaserAI Vector Generations / mo",
        t("price.starter.f2") || "💎 50 Commercial Design Packs / mo",
        t("price.starter.f3") || "🧩 True-Shape Sheet Nesting (Up to 25 parts)",
        t("price.starter.f4") || "Unlimited Projects & Machine Profiles",
        t("price.starter.f5") || "Material Inventory & Laser Presets",
        t("price.starter.f6") || "PDF Quotes & Client Invoices",
      ],
      cta: t("price.starter.cta") || "Upgrade to Starter",
      href: "https://app.0machine.com",
      highlighted: true,
      badge: t("price.popular") || "⭐ Most Popular",
    },
    {
      name: t("price.pro.name") || "Workshop Pro",
      price: cycle === "annual" ? (t("price.pro.price_yr") || "$14.90") : (t("price.pro.price_mo") || "$19"),
      originalPrice: cycle === "annual" ? (t("price.pro.original_yr") || "$19") : null,
      period: t("price.period.mo") || "/month",
      billingNote:
        cycle === "annual"
          ? (t("price.pro.billed_yr") || "Billed annually at $149/yr (Save ~25%)")
          : (t("price.billed_mo") || "Billed monthly"),
      description: t("price.pro.desc") || "Everything in Starter plus advanced production optimization.",
      features: [
        t("price.pro.f1") || "⚡ 300 LaserAI Vector Generations / mo",
        t("price.pro.f2") || "💎 Unlimited Commercial Vault (5,000+ Packs)",
        t("price.pro.f3") || "🧩 Unlimited Multi-Sheet Nesting (ClipperLib)",
        t("price.pro.f4") || "⏱️ Kerf Compensation & Speed/Pierce Math",
        t("price.pro.f5") || "📲 1-Click WhatsApp Client Quote Sharing",
        t("price.pro.f6") || "🚀 Direct LightBurn & xTool DXF Export",
        t("price.pro.f7") || "🔥 Priority Server AI Pipeline",
      ],
      cta: t("price.pro.cta") || "Upgrade to Pro",
      href: "https://app.0machine.com",
      highlighted: false,
      badge: t("price.best_value") || "🔥 Best Value",
    },
  ];

  return (
    <section id="pricing" ref={ref} className="relative py-32 overflow-hidden bg-[#111317]">
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-xs text-[#B1FA63] tracking-[0.2em] uppercase font-bold">
            {t("price.badge") || "TRANSPARENT PRICING"}
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mt-3 mb-4 font-[Outfit]">
            {t("price.title") || "Run Your Entire Laser Workshop"} <br />
            <span className="text-[#FE7733]">{t("price.titleAccent") || "From One Dashboard."}</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-base">
            {t("price.subtitle") || "Start free forever. Upgrade anytime as your workshop grows."}
          </p>

          {/* Monthly vs Annual Cycle Toggle */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => setCycle("monthly")}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                cycle === "monthly"
                  ? "bg-[#FE7733] text-white shadow-lg shadow-[#FE7733]/20"
                  : "bg-[#1A1D21] text-gray-400 hover:text-white border border-white/10"
              }`}
            >
              {t("price.cycle.monthly") || "Monthly Billing"}
            </button>

            <button
              onClick={() => setCycle("annual")}
              className={`relative px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                cycle === "annual"
                  ? "bg-[#FE7733] text-white shadow-lg shadow-[#FE7733]/20"
                  : "bg-[#1A1D21] text-gray-400 hover:text-white border border-white/10"
              }`}
            >
              {t("price.cycle.annual") || "Annual Billing"}
              <span className="absolute -top-3 -right-3 bg-[#B1FA63] text-[#111317] text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full shadow">
                {t("price.cycle.save_badge") || "Save up to 35%"}
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
                  ? "bg-[#23262C] border-[#B1FA63] shadow-2xl shadow-[#B1FA63]/10 scale-105"
                  : "bg-[#1A1D21] border-white/10 hover:border-white/20"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#B1FA63] text-[#111317] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm min-h-[40px]">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-white tracking-tight">{plan.price}</span>
                  {plan.originalPrice && (
                    <span className="text-lg line-through text-gray-500 font-semibold">{plan.originalPrice}</span>
                  )}
                  <span className="text-gray-400 text-sm font-medium">{plan.period}</span>
                </div>
                {plan.billingNote && (
                  <p className={`text-xs mt-2 font-medium tracking-wide ${plan.highlighted ? "text-[#B1FA63]" : "text-gray-400"}`}>
                    {plan.billingNote}
                  </p>
                )}
              </div>

              <ul className="space-y-3.5 mb-8 flex-1">
                {plan.features.map((feat, idx) => {
                  const isWhatsApp =
                    feat.toLowerCase().includes("whatsapp") ||
                    feat.toLowerCase().includes("quote") ||
                    feat.toLowerCase().includes("invoice");
                  return (
                    <li key={idx} className="flex items-center gap-3 text-sm text-gray-300">
                      {isWhatsApp ? (
                        <span className="w-4 h-4 flex items-center justify-center text-[#25D366] flex-shrink-0">
                          <WhatsAppIcon className="w-4 h-4 fill-current" />
                        </span>
                      ) : (
                        <Check className="w-4 h-4 text-[#FE7733] flex-shrink-0" />
                      )}
                      <span className="flex items-center flex-wrap gap-1.5">
                        <span>{feat}</span>
                        {isWhatsApp && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/30 px-1.5 py-0.5 rounded-full">
                            WhatsApp
                          </span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <a
                href={plan.href}
                className={`w-full text-center py-3.5 px-6 rounded-xl font-bold text-sm transition-all ${
                  plan.highlighted
                    ? "bg-[#FE7733] hover:bg-[#E85F20] text-white shadow-lg shadow-[#FE7733]/25"
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
