"use client";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  const { t } = useLanguage();

  const footerLinks = {
    [t("nav.features") === "Features" ? "Product" : t("nav.features") === "Fonctionnalités" ? "Produit" : "Producto"]: [
      { label: t("nav.features"), href: "/#features" },
      { label: t("nav.pricing"), href: "/#pricing" },
      { label: t("nav.benefits"), href: "/#benefits" },
      { label: t("nav.workflow"), href: "/#workflow" },
    ],
    [t("nav.features") === "Features" ? "Resources" : t("nav.features") === "Fonctionnalités" ? "Ressources" : "Recursos"]: [
      { label: t("nav.trial"), href: "https://app.0machine.com" },
      { label: t("nav.signin"), href: "https://app.0machine.com" },
      { label: t("nav.features") === "Features" ? "About Us" : t("nav.features") === "Fonctionnalités" ? "À Propos" : "Sobre Nosotros", href: "/about" },
      { label: t("nav.features") === "Features" ? "Contact Us" : t("nav.features") === "Fonctionnalités" ? "Contactez-nous" : "Contáctenos", href: "/contact" },
      { label: t("nav.features") === "Features" ? "Privacy Policy" : t("nav.features") === "Fonctionnalités" ? "Politique de Confidentialité" : "Política de Privacidad", href: "/privacy" },
      { label: t("nav.features") === "Features" ? "Terms of Service" : t("nav.features") === "Fonctionnalités" ? "Conditions d'Utilisation" : "Términos de Servicio", href: "/terms" },
    ],
    [t("nav.features") === "Features" ? "Free Tools" : t("nav.features") === "Fonctionnalités" ? "Outils Gratuits" : "Herramientas Gratis"]: [
      { label: "Free Tools Hub", href: "/tools" },
      { label: "LaserAI Vector Studio", href: "/#laser-ai" },
      { label: "Laser Box Generator", href: "/tools/box-generator" },
      { label: "Cost & Quote Calculator", href: "/calculator" },
      { label: "Commercial Designs Vault", href: "/#designs-vault" },
      { label: t("features.tab.nesting"), href: "https://app.0machine.com" },
    ],
  };

  return (
    <footer className="relative border-t border-[#42433d]/40 bg-[#0e100f] pt-16 pb-12">
      <div className="absolute inset-0 grid-pattern opacity-15 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="flex items-center gap-2.5 mb-4 group">
              <img 
                src="/logo.webp" 
                alt="0Machine Logo" 
                width={160}
                height={40}
                className="h-9 w-auto object-contain transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(254,119,51,0.45)]" 
              />
            </a>
            <p className="text-sm text-[#7c7c6f] leading-relaxed mb-4">
              {t("foot.desc")}
            </p>
            <div className="space-y-2 text-xs text-[#7c7c6f]">
              <p className="font-semibold text-[#fffce1]">COOLDELO LABS LLC</p>
              <div className="flex items-start gap-2">
                <MapPin size={13} strokeWidth={1.75} className="mt-0.5 shrink-0 text-[#7c7c6f]" />
                <span>1209 Mountain Rd Pl NE, Ste R, Albuquerque, NM 87110, United States</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={13} strokeWidth={1.75} className="shrink-0 text-[#7c7c6f]" />
                <span>+1 (917) 814-3657</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={13} strokeWidth={1.75} className="shrink-0 text-[#7c7c6f]" />
                <span>support@0machine.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={13} strokeWidth={1.75} className="shrink-0 text-[#7c7c6f]" />
                <span>{t("foot.hours")}</span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <p className="text-sm font-bold text-[#fffce1] mb-4 font-[Outfit] tracking-tight">{title}</p>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-[#7c7c6f] hover:text-[#fffce1] transition-colors"
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
        <div className="border-t border-[#42433d]/30 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p className="text-xs text-[#7c7c6f]">
            {t("foot.copyright")}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4">
            <span className="text-xs text-[#7c7c6f]">
              {t("foot.payments")}
            </span>
            <span className="text-xs text-[#42433d] hidden sm:inline">•</span>
            <span className="text-xs text-[#7c7c6f]">{t("foot.billed")}</span>
            <span className="text-xs text-[#42433d] hidden sm:inline">•</span>
            <span className="text-xs text-[#7c7c6f]">{t("foot.cancel")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
