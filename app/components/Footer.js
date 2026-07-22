"use client";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  const footerLinks = {
    [t("nav.features") === "Features" ? "Product" : t("nav.features") === "Fonctionnalités" ? "Produit" : "Producto"]: [
      { label: t("nav.features"), href: "#features" },
      { label: t("nav.pricing"), href: "#pricing" },
      { label: t("nav.benefits"), href: "#benefits" },
      { label: t("nav.workflow"), href: "#workflow" },
    ],
    [t("nav.features") === "Features" ? "Resources" : t("nav.features") === "Fonctionnalités" ? "Ressources" : "Recursos"]: [
      { label: t("nav.trial"), href: "https://app.0machine.com" },
      { label: t("nav.signin"), href: "https://app.0machine.com" },
      { label: t("nav.features") === "Features" ? "About Us" : t("nav.features") === "Fonctionnalités" ? "À Propos" : "Sobre Nosotros", href: "/about" },
      { label: t("nav.features") === "Features" ? "Contact Us" : t("nav.features") === "Fonctionnalités" ? "Contactez-nous" : "Contáctenos", href: "/contact" },
      { label: t("nav.features") === "Features" ? "Privacy Policy" : t("nav.features") === "Fonctionnalités" ? "Politique de Confidentialité" : "Política de Privacidad", href: "/privacy" },
      { label: t("nav.features") === "Features" ? "Terms of Service" : t("nav.features") === "Fonctionnalités" ? "Conditions d'Utilisation" : "Términos de Servicio", href: "/terms" },
    ],
    [t("nav.features") === "Features" ? "Tools" : t("nav.features") === "Fonctionnalités" ? "Outils" : "Herramientas"]: [
      { label: t("benefits.calc.feature"), href: "#features" },
      { label: t("benefits.quote.feature"), href: "#features" },
      { label: t("benefits.inv.feature"), href: "#features" },
      { label: t("benefits.presets.feature"), href: "#features" },
    ],
  };

  return (
    <footer className="relative border-t border-white/5 pt-16 pb-8">
      <div className="absolute inset-0 gradient-mesh opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="flex items-center gap-2.5 mb-4 group">
              <img 
                src="/logo.png" 
                alt="0Machine Logo" 
                className="h-9 w-auto object-contain" 
              />
            </a>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              {t("foot.desc")}
            </p>
            <div className="space-y-1.5 text-xs text-gray-500">
              <p className="font-semibold text-gray-400">COOLDELO LABS LLC</p>
              <p>📍 1209 Mountain Rd Pl NE, Ste R, Albuquerque, NM 87110, United States</p>
              <p>📞 +1 (917) 814-3657</p>
              <p>✉️ support@0machine.com</p>
              <p>🕒 {t("foot.hours")}</p>
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
            {t("foot.copyright")}
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-600">
              {t("foot.payments")}
            </span>
            <span className="text-xs text-gray-700">•</span>
            <span className="text-xs text-gray-600">{t("foot.billed")}</span>
            <span className="text-xs text-gray-700">•</span>
            <span className="text-xs text-gray-600">{t("foot.cancel")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
