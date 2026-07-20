"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import { trackEvent } from "../lib/analytics";

export default function Pricing() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const plans = [
    {
      name: t("price.hobby.name"),
      price: t("price.hobby.price"),
      period: t("price.hobby.period"),
      description: t("price.hobby.desc"),
      features: [
        t("price.hobby.f1"),
        t("price.hobby.f2"),
        t("price.hobby.f3"),
        t("price.hobby.f4"),
        t("price.hobby.f5"),
        t("price.hobby.f6"),
      ],
      cta: t("price.hobby.cta"),
      href: "https://app.0machine.com",
      highlighted: false,
    },
    {
      name: t("price.pro.name"),
      price: t("price.pro.price"),
      period: t("price.pro.period"),
      description: t("price.pro.desc"),
      features: [
        t("price.pro.f1"),
        t("price.pro.f2"),
        t("price.pro.f3"),
        t("price.pro.f4"),
        t("price.pro.f5"),
        t("price.pro.f6"),
      ],
      cta: t("price.pro.cta"),
      href: "https://app.0machine.com",
      highlighted: true,
      badge: t("price.popular"),
    },
    {
      name: t("price.biz.name"),
      price: t("price.biz.price"),
      period: t("price.biz.period"),
      description: t("price.biz.desc"),
      features: [
        t("price.biz.f1"),
        t("price.biz.f2"),
        t("price.biz.f3"),
        t("price.biz.f4"),
        t("price.biz.f5"),
        t("price.biz.f6"),
      ],
      cta: t("price.biz.cta"),
      href: "https://app.0machine.com",
      highlighted: false,
    },
  ];

  const trustBadges = [
    t("foot.payments") || "🔒 Secure payment via Stripe & PayPal",
    t("foot.cancel") || "📅 Cancel anytime",
    "⚡ " + (t("price.pro.cta") === "Accès Pro" ? "Accès instantané" : t("price.pro.cta") === "Acceso Pro" ? "Acceso instantáneo" : "Instant access"),
    "💳 " + (t("price.pro.cta") === "Accès Pro" ? "Sans carte pour l'essai" : t("price.pro.cta") === "Acceso Pro" ? "Sin tarjeta para prueba" : "No card for trial"),
  ];

  return (
    <section id="pricing" ref={ref} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      {/* Background glows */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-500/5 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-2/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-xs text-accent-400 tracking-[0.2em] uppercase font-medium">
            {t("price.badge")}
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-[Outfit] text-white mt-4 mb-6">
            {t("price.title")}
            <br />
            <span className="gradient-text-accent">{t("price.titleAccent")}</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            {t("price.subtitle")}
          </p>
        </motion.div>

        {/* Pricing Cards Grid (3 Columns) */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name || i}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              className={`relative flex flex-col h-full ${
                plan.highlighted 
                  ? "md:-translate-y-4 md:scale-105 z-10" 
                  : "z-0"
              }`}
            >
              {/* Highlight background glow */}
              {plan.highlighted && (
                <div className="absolute inset-0 bg-gradient-to-b from-accent-500/10 to-transparent rounded-[20px] blur-xl -z-10" />
              )}

              <div
                className={`relative glass-card p-8 sm:p-10 h-full flex flex-col justify-between transition-all duration-300 ${
                  plan.highlighted 
                    ? "border-accent-500/40 shadow-2xl shadow-accent-500/10 bg-dark-900/80" 
                    : "border-white/5 bg-white/[0.02] hover:border-white/10"
                }`}
              >
                {/* Popular Badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-accent-500 to-accent-400 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg shadow-accent-500/25 uppercase tracking-wider text-[10px]">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div>
                  {/* Plan header */}
                  <div className="mb-8">
                    <h3 className={`text-xl font-bold font-[Outfit] mb-2 ${plan.highlighted ? "text-accent-400" : "text-white"}`}>
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline gap-1 mt-4">
                      <span className="text-5xl font-bold text-white font-[Outfit]">
                        {plan.price}
                      </span>
                      <span className="text-gray-500 text-sm font-medium">{plan.period}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <div key={feature || idx} className="flex items-start gap-3">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            plan.highlighted
                              ? "bg-accent-500/15"
                              : "bg-white/5"
                          }`}
                        >
                          <svg
                            className={`w-3 h-3 ${
                              plan.highlighted ? "text-accent-400" : "text-gray-400"
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <span className={`text-sm ${feature.includes("❌") ? "text-gray-600 line-through" : "text-gray-300"}`}>
                          {feature.replace("❌ ", "")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <a
                  href={plan.href}
                  onClick={() => trackEvent('cta_click', { button: 'pricing_plan', plan: plan.name })}
                  className={`text-center w-full block text-sm !py-3.5 !px-6 ${
                    plan.highlighted
                      ? "glow-btn"
                      : "glow-btn-outline"
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* PayPal & Card Trust Logos */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center items-center gap-3 mt-16 opacity-40 hover:opacity-70 transition-opacity duration-300"
        >
          <span className="text-[10px] uppercase tracking-wider font-bold border border-white/10 px-2.5 py-1 rounded bg-white/5 text-gray-400">Visa</span>
          <span className="text-[10px] uppercase tracking-wider font-bold border border-white/10 px-2.5 py-1 rounded bg-white/5 text-gray-400">Mastercard</span>
          <span className="text-[10px] uppercase tracking-wider font-bold border border-white/10 px-2.5 py-1 rounded bg-white/5 text-gray-400">Amex</span>
          <span className="text-[10px] uppercase tracking-wider font-bold border border-white/10 px-2.5 py-1 rounded bg-white/5 text-gray-400">Apple Pay</span>
          <span className="text-[10px] uppercase tracking-wider font-bold border border-white/10 px-2.5 py-1 rounded bg-white/5 text-gray-400">Google Pay</span>
          <span className="text-[10px] uppercase tracking-wider font-bold border border-accent-500/30 px-2.5 py-1 rounded bg-accent-500/10 text-accent-400">PayPal</span>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-6 mt-8 text-xs text-gray-600"
        >
          {trustBadges.map((badge) => (
            <span key={badge} className="flex items-center gap-1">
              {badge}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
