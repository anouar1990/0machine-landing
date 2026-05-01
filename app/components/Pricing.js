"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const plans = [
  {
    name: "Free Trial",
    price: "$0",
    period: "for 3 days",
    description: "Try every feature risk-free. No credit card required to start.",
    features: [
      "Unlimited projects",
      "Cost Calculator",
      "Material inventory",
      "Order management",
      "Laser Presets",
      "Basic analytics",
    ],
    cta: "Start Free Trial",
    href: "https://app.0machine.com",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    description: "Everything you need to run a profitable laser workshop.",
    features: [
      "Everything in Free, plus:",
      "PDF report export",
      "Advanced analytics & stats",
      "Client manager",
      "Project photos",
      "Project templates",
      "Machine profiles",
      "Quote generator",
      "Nesting estimator",
      "Priority support",
    ],
    cta: "Get Pro Access",
    href: "https://app.0machine.com",
    highlighted: true,
    badge: "Most Popular",
  },
];

export default function Pricing() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
            Simple Pricing
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-[Outfit] text-white mt-4 mb-6">
            One Plan. Everything
            <br />
            <span className="gradient-text-accent">Included.</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            Start free, upgrade when you're ready. No hidden fees, no feature
            gates per tier.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
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
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
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
          {[
            "🔒 Secure payment via Stripe",
            "📅 Cancel anytime",
            "⚡ Instant access",
            "💳 No card for trial",
          ].map((badge) => (
            <span key={badge} className="flex items-center gap-1">
              {badge}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
