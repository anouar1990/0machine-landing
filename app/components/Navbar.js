"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Benefits", href: "#benefits" },
  { label: "How It Works", href: "#workflow" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-dark-950/80 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/20"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center shadow-lg shadow-white/5 group-hover:bg-white/15 transition-all">
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
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-gray-400 hover:text-white transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent-500 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://app.0machine.com"
              className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2"
            >
              Sign In
            </a>
            <a
              href="https://app.0machine.com"
              className="glow-btn text-sm !py-2.5 !px-6"
            >
              Start Free Trial
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
          >
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="w-6 h-0.5 bg-white block"
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-6 h-0.5 bg-white block"
            />
            <motion.span
              animate={
                mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }
              }
              className="w-6 h-0.5 bg-white block"
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-dark-950/98 backdrop-blur-xl pt-24 px-8 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-2xl font-semibold text-white font-[Outfit]"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="https://app.0machine.com"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="glow-btn text-center mt-6 text-lg"
              >
                Start Free Trial
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
