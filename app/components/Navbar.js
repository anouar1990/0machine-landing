"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { trackEvent } from "../lib/analytics";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const langRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const navLinks = [
    { label: t("nav.features"), href: "#features" },
    { label: t("nav.benefits"), href: "#benefits" },
    { label: t("nav.workflow"), href: "#workflow" },
    { label: t("nav.pricing"), href: "#pricing" },
  ];

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
          <a href="#" className="flex items-center group">
            <img 
              src="/logo.png" 
              alt="0Machine Logo" 
              className="h-9 w-auto object-contain" 
            />
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

          {/* Desktop CTA & Language Selector */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language dropdown */}
            <div ref={langRef} className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-white border border-white/5 bg-white/5 hover:bg-white/10 transition-all font-medium font-[Outfit] cursor-pointer"
              >
                <span>{language === "en" ? "🇺🇸 EN" : language === "fr" ? "🇫🇷 FR" : "🇪🇸 ES"}</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${langOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-36 rounded-xl border border-white/10 bg-dark-950/95 backdrop-blur-2xl shadow-2xl p-1.5 z-50 flex flex-col gap-0.5"
                  >
                    {[
                      { code: "en", label: "🇺🇸 English" },
                      { code: "fr", label: "🇫🇷 Français" },
                      { code: "es", label: "🇪🇸 Español" },
                    ].map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setLangOpen(false);
                        }}
                        className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                          language === lang.code
                            ? "text-accent-400 bg-accent-500/10 font-semibold"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a
              href="https://app.0machine.com"
              onClick={() => trackEvent('cta_click', { button: 'navbar_signin' })}
              className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2"
            >
              {t("nav.signin")}
            </a>
            <a
              href="https://app.0machine.com"
              onClick={() => trackEvent('cta_click', { button: 'navbar_trial' })}
              className="glow-btn text-sm !py-2.5 !px-6"
            >
              {t("nav.trial")}
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

              {/* Mobile Language Switcher */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 border-t border-white/5 pt-6"
              >
                <p className="text-xs text-gray-500 mb-3 font-medium tracking-wide uppercase">Language</p>
                <div className="flex gap-2">
                  {[
                    { code: "en", label: "🇺🇸 EN" },
                    { code: "fr", label: "🇫🇷 FR" },
                    { code: "es", label: "🇪🇸 ES" },
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setMobileOpen(false);
                      }}
                      className={`flex-1 py-2.5 px-3 rounded-xl text-sm text-center font-medium border transition-all cursor-pointer ${
                        language === lang.code
                          ? "bg-accent-500 border-accent-600 text-white shadow-lg shadow-accent-500/20"
                          : "bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </motion.div>

              <motion.a
                href="https://app.0machine.com"
                onClick={() => trackEvent('cta_click', { button: 'navbar_trial_mobile' })}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="glow-btn text-center mt-6 text-lg"
              >
                {t("nav.trial")}
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
