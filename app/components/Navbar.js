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

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navLinks = [
    { label: t("nav.vault"), href: "/#designs-vault" },
    { label: t("nav.laserai"), href: "/#laser-ai" },
    { label: t("nav.features"), href: "/#features" },
    { label: t("nav.tools"), href: "/tools" },
    { label: t("nav.calculator"), href: "/calculator" },
    { label: t("nav.benefits"), href: "/#benefits" },
    { label: t("nav.pricing"), href: "/#pricing" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#0e100f]/90 backdrop-blur-2xl border-b border-[#42433d]/50 shadow-2xl shadow-black/40"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center group transition-transform active:scale-95">
            <img 
              src="/logo.webp" 
              alt="0Machine Logo" 
              width={150}
              height={36}
              className="h-9 w-auto object-contain brightness-110" 
            />
          </a>

          {/* Desktop Links (GSAP Warm Stone to Cream Hover) */}
          <div className="hidden md:flex items-center gap-7 lg:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-[#7c7c6f] hover:text-[#fffce1] transition-colors relative group py-1"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-gradient-to-r from-[#abff84] to-[#0ae448] group-hover:w-full transition-all duration-300 rounded-full" />
              </a>
            ))}
          </div>

          {/* Desktop CTA & Language Selector */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language dropdown */}
            <div ref={langRef} className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                aria-label="Select language"
                aria-expanded={langOpen}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-[#7c7c6f] hover:text-[#fffce1] border border-[#42433d] bg-[#141513] hover:border-[#abff84]/50 transition-all font-medium font-[Outfit] cursor-pointer"
              >
                <span>{language === "en" ? "🇺🇸 EN" : language === "fr" ? "🇫🇷 FR" : "🇪🇸 ES"}</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-300 ${langOpen ? "rotate-180" : ""}`}
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
                    className="absolute right-0 mt-2 w-36 rounded-2xl border border-[#42433d] bg-[#141513]/98 backdrop-blur-2xl shadow-2xl p-1.5 z-50 flex flex-col gap-0.5"
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
                        className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                          language === lang.code
                            ? "text-[#0e100f] bg-[#abff84] font-bold"
                            : "text-[#7c7c6f] hover:text-[#fffce1] hover:bg-[#191919]"
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
              className="text-sm font-medium text-[#7c7c6f] hover:text-[#fffce1] transition-colors px-3 py-2 cursor-pointer"
            >
              {t("nav.signin")}
            </a>
            <a
              href="https://app.0machine.com"
              onClick={() => trackEvent('cta_click', { button: 'navbar_trial' })}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-tight text-[#0e100f] bg-[#fffce1] hover:bg-[#abff84] hover:shadow-[0_0_22px_rgba(171,255,132,0.35)] transition-all cursor-pointer font-[Outfit] active:scale-95 shadow-md shadow-black/20"
            >
              <span>{t("nav.trial")}</span>
              <span className="text-[10px] font-mono opacity-70">→</span>
            </a>
          </div>

          {/* Mobile Right Controls: Sign In Button + Hamburger Icon */}
          <div className="flex md:hidden items-center gap-2.5">
            <a
              href="https://app.0machine.com"
              onClick={() => trackEvent('cta_click', { button: 'navbar_signin_mobile_header' })}
              className="text-xs font-semibold text-[#fffce1] bg-[#141513] hover:bg-[#191919] border border-[#42433d] px-3.5 py-1.5 min-h-[38px] flex items-center rounded-full transition-all font-[Outfit] cursor-pointer focus-visible:ring-2 focus-visible:ring-[#abff84] focus-visible:outline-none active:scale-95"
            >
              {t("nav.signin")}
            </a>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex flex-col items-center justify-center gap-1.5 rounded-xl border border-[#42433d]/70 bg-[#141513] cursor-pointer focus-visible:ring-2 focus-visible:ring-[#abff84] focus-visible:outline-none active:scale-95"
              aria-label="Toggle navigation menu"
            >
              <motion.span
                animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className="w-5 h-0.5 bg-[#fffce1] block rounded-full"
              />
              <motion.span
                animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-5 h-0.5 bg-[#fffce1] block rounded-full"
              />
              <motion.span
                animate={
                  mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }
                }
                className="w-5 h-0.5 bg-[#fffce1] block rounded-full"
              />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[#0e100f]/98 backdrop-blur-2xl pt-24 px-6 md:hidden flex flex-col justify-between pb-8 overflow-y-auto overscroll-contain"
          >
            <div className="flex flex-col gap-5">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="text-2xl font-bold text-[#fffce1] hover:text-[#abff84] transition-colors font-[Outfit] tracking-tight"
                >
                  {link.label}
                </motion.a>
              ))}

              {/* Mobile Language Switcher */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="mt-2 border-t border-[#42433d]/40 pt-5"
              >
                <p className="text-[11px] font-mono text-[#7c7c6f] mb-3 font-semibold tracking-widest uppercase">Language</p>
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
                      className={`flex-1 py-2.5 px-3 rounded-full text-xs text-center font-bold border transition-all cursor-pointer ${
                        language === lang.code
                          ? "bg-[#abff84] border-[#abff84] text-[#0e100f] shadow-lg shadow-[#abff84]/20"
                          : "bg-[#141513] border-[#42433d] text-[#7c7c6f] hover:text-[#fffce1]"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Mobile CTAs: Sign In & Start Free */}
            <div className="flex flex-col gap-3 mt-6">
              <motion.a
                href="https://app.0machine.com"
                onClick={() => {
                  trackEvent('cta_click', { button: 'navbar_signin_mobile_drawer' });
                  setMobileOpen(false);
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="w-full text-center py-3.5 rounded-full border border-[#42433d] bg-[#141513] hover:bg-[#191919] text-[#fffce1] font-bold text-sm transition-all font-[Outfit]"
              >
                🔑 {t("nav.signin")}
              </motion.a>

              <motion.a
                href="https://app.0machine.com"
                onClick={() => {
                  trackEvent('cta_click', { button: 'navbar_trial_mobile' });
                  setMobileOpen(false);
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="w-full text-center py-3.5 rounded-full bg-[#fffce1] hover:bg-[#abff84] text-[#0e100f] font-black text-sm tracking-tight transition-all font-[Outfit] shadow-lg shadow-black/30"
              >
                ⚡ {t("nav.trial")}
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
