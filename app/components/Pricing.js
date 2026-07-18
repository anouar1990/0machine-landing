"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function Pricing() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const plans = [
    {
      name: t("price.trial.name"),
      price: t("price.trial.price"),
      period: t("price.trial.period"),
      description: t("price.trial.desc"),
      features: [
        t("price.trial.f1"),
        t("price.trial.f2"),
        t("price.trial.f3"),
        t("price.trial.f4"),
        t("price.trial.f5"),
        t("price.trial.f6"),
      ],
      cta: t("price.trial.cta"),
      href: "https://app.0machine.com",
      highlighted: false,
    },
    {
      name: t("price.pro.name"),
      price: t("price.pro.price"),
      period: t("price.pro.period"),
      description: t("price.pro.desc"),
      features: [
        t("price.pro.f.title"),
        t("price.pro.f1"),
        t("price.pro.f2"),
        t("price.pro.f3"),
        t("price.pro.f4"),
        t("price.pro.f5"),
        t("price.pro.f6"),
        t("price.pro.f7"),
        t("price.pro.f8"),
        t("price.pro.f9"),
      ],
      cta: t("price.pro.cta"),
      href: "https://app.0machine.com",
      highlighted: true,
      badge: t("price.popular"),
    },
  ];

  const trustBadges = [
    t("foot.payments") || "🔒 Secure payment via Stripe",
    t("foot.cancel") || "📅 Cancel anytime",
    "⚡ " + (t("price.trial.cta") === "Essai Gratuit" ? "Accès instantané" : t("price.trial.cta") === "Iniciar Prueba Gratis" ? "Acceso instantáneo" : "Instant access"),
    "💳 " + (t("price.trial.cta") === "Essai Gratuit" ? "Sans carte bancaire" : t("price.trial.cta") === "Iniciar Prueba Gratis" ? "Sin tarjeta para prueba" : "No card for trial"),
  ];

  return (
    <section id="pricing" ref={ref} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-500/5 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
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
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            {t("price.subtitle")}
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name || i}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className={`relative ${plan.highlighted ? "pricing-highlight" : ""}`}
            >
              <div
                className={`relative glass-card p-8 sm:p-10 h-full flex flex-col ${
                  plan.highlighted ? "border-accent-500/30" : ""
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-accent-500 to-accent-400 text-white text-xs font-semibold px-4 py-1.5 rounded-full">
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Plan header */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white font-[Outfit] mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold text-white font-[Outfit]">
                      {plan.price}
                    </span>
                    <span className="text-gray-500 text-sm">{plan.period}</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-3">
                    {plan.description}
                  </p>
                </div>

                {/* Features */}
                <div className="flex-1 space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <div key={feature || idx} className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                          plan.highlighted
                            ? "bg-accent-500/15"
                            : "bg-white/5"
                        }`}
                      >
                        <svg
                          className={`w-3 h-3 ${
                            plan.highlighted ? "text-accent-400" : "text-gray-500"
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <a
                  href={plan.href}
                  className={
                    plan.highlighted
                      ? "glow-btn text-center w-full block text-base"
                      : "glow-btn-outline text-center w-full block text-base"
                  }
                >
                  {plan.cta}
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-6 mt-12 text-xs text-gray-600"
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
