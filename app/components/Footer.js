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
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
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
                  className="w-5.5 h-5.5"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="6" cy="22" r="3" fill="#FFFFFF" />
                  <path d="M9 22L19 6" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
                  <path d="M18 6H24V12" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-lg font-bold text-white font-[Outfit]">
                0Machine
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              The all-in-one planner for laser cutters and CNC makers. Track
              everything. Grow your business.
            </p>
            <div className="space-y-1.5 text-xs text-gray-500">
              <p className="font-semibold text-gray-400">COOLDELO LABS LLC</p>
              <p>📍 1209 Mountain Rd Pl NE, Ste R, Albuquerque, NM 87110, United States</p>
              <p>📞 +1 (917) 814-3657</p>
              <p>✉️ support@0machine.com</p>
              <p>🕒 Mon - Fri: 9am - 5pm MST</p>
            </div>
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
