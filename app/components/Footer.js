"use client";
import { motion } from "framer-motion";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Benefits", href: "#benefits" },
    { label: "How It Works", href: "#workflow" },
  ],
  Resources: [
    { label: "Start Free Trial", href: "https://app.0machine.com" },
    { label: "Sign In", href: "https://app.0machine.com" },
    { label: "Privacy Policy", href: "https://0machine.com/privacy.html" },
    { label: "Terms of Service", href: "https://0machine.com/terms.html" },
  ],
  Tools: [
    { label: "Cost Calculator", href: "#features" },
    { label: "Quote Generator", href: "#features" },
    { label: "Material Inventory", href: "#features" },
    { label: "Laser Presets", href: "#features" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 pt-16 pb-8">
      <div className="absolute inset-0 gradient-mesh opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <span className="text-lg font-bold text-white font-[Outfit]">
                0Machine
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              The all-in-one planner for laser cutters and CNC makers. Track
              everything. Grow your business.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-white mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-accent-400 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600">
            © 2026 0Machine Planner. Built for makers. ⚡
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-600">
              Secure payments via Stripe
            </span>
            <span className="text-xs text-gray-700">•</span>
            <span className="text-xs text-gray-600">Billed monthly</span>
            <span className="text-xs text-gray-700">•</span>
            <span className="text-xs text-gray-600">Cancel anytime</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
