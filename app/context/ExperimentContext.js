"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { trackEvent } from "../lib/analytics";

const ExperimentContext = createContext({
  variant: "A",
  setVariant: () => {},
  isPreview: false,
  showToolbar: false,
  setShowToolbar: () => {},
  buildAppUrl: (path = "") => `https://app.0machine.com${path}`,
  handleCtaClick: () => {},
});

export const EXPERIMENT_ID = "exp_landing_positioning_v1";
export const VARIANTS = ["A", "B", "C", "D", "E"];

export const VARIANT_METADATA = {
  A: {
    id: "A",
    name: "Control (Original)",
    tagline: "Precision Laser Business OS & LaserAI",
    badge: "Variant A · Baseline",
    color: "from-blue-500 to-indigo-600",
  },
  B: {
    id: "B",
    name: "All-in-One Workshop OS",
    tagline: "Run Your Entire Laser & CNC Workshop in One Place",
    badge: "Variant B · Workshop OS",
    color: "from-emerald-500 to-teal-600",
  },
  C: {
    id: "C",
    name: "Save Material & Increase Profits",
    tagline: "Stop Wasting Material. Start Making More Profit.",
    badge: "Variant C · Profit & Yield",
    color: "from-amber-500 to-orange-600",
  },
  D: {
    id: "D",
    name: "Business Growth & Professionalism",
    tagline: "Turn Your Laser Workshop Into a Real Business",
    badge: "Variant D · Business Scale",
    color: "from-purple-500 to-pink-600",
  },
  E: {
    id: "E",
    name: "300,000+ Designs & Creative Freedom",
    tagline: "300,000+ Designs Ready to Use. Create Your Own. No Limits.",
    badge: "Variant E · Designs & Studio",
    color: "from-rose-500 to-red-600",
  },
};

function persistVariant(v) {
  try {
    if (typeof document === "undefined") return;
    document.cookie = `0machine_variant=${v}; path=/; max-age=31536000; SameSite=Lax`;
    localStorage.setItem("0machine_variant", v);
  } catch (e) {}
}

function getInitialVariant() {
  if (typeof window === "undefined") return "A";
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const urlVariant = urlParams.get("variant")?.toUpperCase();
    if (urlVariant && VARIANTS.includes(urlVariant)) return urlVariant;

    const cookieMatch = document.cookie.match(/(?:^|;\s*)0machine_variant=([A-Ea-e])/);
    if (cookieMatch && cookieMatch[1]) {
      const saved = cookieMatch[1].toUpperCase();
      if (VARIANTS.includes(saved)) return saved;
    }

    const localSaved = localStorage.getItem("0machine_variant")?.toUpperCase();
    if (localSaved && VARIANTS.includes(localSaved)) return localSaved;

    // Allocate random variant synchronously on first client run so there is zero post-mount layout swap
    const rand = Math.random();
    let chosen = "A";
    if (rand < 0.20) chosen = "A";
    else if (rand < 0.40) chosen = "B";
    else if (rand < 0.60) chosen = "C";
    else if (rand < 0.80) chosen = "D";
    else chosen = "E";

    persistVariant(chosen);
    return chosen;
  } catch (e) {}
  return "A";
}

export function ExperimentProvider({ children, initialVariant }) {
  const [variant, setVariantState] = useState(() => {
    if (initialVariant && VARIANTS.includes(initialVariant)) return initialVariant;
    return getInitialVariant();
  });
  const [isPreview, setIsPreview] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || initialized) return;
    setInitialized(true);

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlVariant = urlParams.get("variant")?.toUpperCase();
      const previewParam = urlParams.get("preview") === "true";

      if (urlVariant && VARIANTS.includes(urlVariant)) {
        setIsPreview(true);
        setShowToolbar(true);
      }

      const isAssigned = localStorage.getItem("0machine_assigned");
      if (!isAssigned) {
        localStorage.setItem("0machine_assigned", "true");
        trackEvent("experiment_assigned", {
          experiment_id: EXPERIMENT_ID,
          variant: variant,
        }, `assigned_${variant}`);
      }
    } catch (err) {
      console.warn("Experiment variant resolution error:", err);
    }
  }, [variant, initialized]);

  const setVariant = (newVariant, isManualPreview = true) => {
    if (!VARIANTS.includes(newVariant)) return;
    setVariantState(newVariant);
    persistVariant(newVariant);
    if (isManualPreview) {
      setIsPreview(true);
    }

    trackEvent("experiment_variant_switched", {
      experiment_id: EXPERIMENT_ID,
      variant: newVariant,
      is_manual_preview: isManualPreview,
    });
  };

  const buildAppUrl = (path = "") => {
    if (typeof window === "undefined") return `https://app.0machine.com${path}`;
    try {
      const url = new URL(`https://app.0machine.com${path}`);
      url.searchParams.set("variant", variant);
      url.searchParams.set("exp", EXPERIMENT_ID);

      // Forward UTMs
      const currentParams = new URLSearchParams(window.location.search);
      ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach((k) => {
        const val = currentParams.get(k);
        if (val) url.searchParams.set(k, val);
      });

      return url.toString();
    } catch (e) {
      return `https://app.0machine.com${path}?variant=${variant}`;
    }
  };

  const handleCtaClick = (ctaName, destinationUrl = null, extraMeta = {}) => {
    trackEvent("cta_click", {
      experiment_id: EXPERIMENT_ID,
      variant: variant,
      cta_name: ctaName,
      destination_url: destinationUrl,
      ...extraMeta,
    });

    // Also trigger signup_started funnel step if CTA is a registration/app launch button
    if (ctaName.toLowerCase().includes("start") || ctaName.toLowerCase().includes("signup") || ctaName.toLowerCase().includes("free")) {
      trackEvent("signup_started", {
        experiment_id: EXPERIMENT_ID,
        variant: variant,
        entry_cta: ctaName,
      });
    }

    if (destinationUrl && typeof window !== "undefined") {
      window.location.href = destinationUrl;
    }
  };

  return (
    <ExperimentContext.Provider
      value={{
        variant,
        setVariant,
        isPreview,
        showToolbar,
        setShowToolbar,
        buildAppUrl,
        handleCtaClick,
        initialized,
      }}
    >
      {children}
      {showToolbar && (
        <ExperimentPreviewToolbar
          variant={variant}
          onSelectVariant={(v) => setVariant(v, true)}
          onClose={() => setShowToolbar(false)}
        />
      )}
    </ExperimentContext.Provider>
  );
}

export function useExperiment() {
  return useContext(ExperimentContext);
}

/**
 * Interactive preview toolbar for administrators, reviewers, and testers.
 * Allows instant 1-click toggling between all 5 variants.
 */
function ExperimentPreviewToolbar({ variant, onSelectVariant, onClose }) {
  const [minimized, setMinimized] = useState(false);

  if (minimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setMinimized(false)}
          className="bg-dark-900/90 text-white border border-accent-500/40 shadow-2xl px-3 py-1.5 rounded-full text-xs font-mono font-bold flex items-center gap-2 hover:bg-dark-800 transition-all backdrop-blur-md"
        >
          <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
          <span>Split Test: Variant {variant}</span>
          <span className="text-[10px] text-gray-400">↑</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-[#0d0f12]/95 border-t border-accent-500/30 backdrop-blur-xl py-2.5 px-4 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-gray-300">
          <span className="w-2.5 h-2.5 rounded-full bg-accent-400 animate-pulse" />
          <span className="font-bold text-white uppercase tracking-wider font-mono">
            5-Variant Split Test:
          </span>
          <span className="text-gray-400 hidden sm:inline">
            Active: <strong className="text-white">{VARIANT_METADATA[variant]?.name}</strong>
          </span>
        </div>

        {/* Variant selector pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none">
          {VARIANTS.map((v) => {
            const isSelected = variant === v;
            const meta = VARIANT_METADATA[v];
            return (
              <button
                key={v}
                onClick={() => onSelectVariant(v)}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-accent-500 text-black shadow-lg shadow-accent-500/30 ring-1 ring-white/50"
                    : "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
                }`}
                title={meta.tagline}
              >
                <span>{v}</span>
                <span className="hidden md:inline font-normal opacity-85">
                  ({meta.name.split(" ")[0]})
                </span>
              </button>
            );
          })}
        </div>

        {/* Admin links and minimize */}
        <div className="flex items-center gap-2">
          <a
            href="/admin?tab=experiment"
            className="text-[11px] text-accent-400 hover:text-accent-300 underline font-semibold"
          >
            📊 Experiment Analytics
          </a>
          <button
            onClick={() => setMinimized(true)}
            className="text-gray-400 hover:text-white px-2 py-0.5 rounded text-[11px]"
            title="Minimize"
          >
            _
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white px-2 py-0.5 rounded text-[11px]"
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

