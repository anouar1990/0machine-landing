"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Check, ShieldCheck, Zap, Lock, CreditCard, ArrowRight, RefreshCw } from "lucide-react";
import { trackEvent } from "../lib/analytics";

export default function LaserAiCreditModal({
  isOpen,
  onClose,
  savedPrompt = "",
  activeMode = "cut-engrave",
  onCreditsAcquired,
}) {
  const [selectedPack, setSelectedPack] = useState("maker"); // 'monthly' | 'basic' | 'maker' | 'studio'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const packs = [
    {
      id: "basic",
      name: "Basic",
      badge: null,
      credits: 15,
      price: "$9",
      amount: 9,
      unitPrice: "$0.60 per generation",
      savings: null,
      type: "one_time",
      desc: "Great for weekend projects & single client orders.",
    },
    {
      id: "maker",
      name: "Maker",
      badge: "⭐ Popular",
      credits: 40,
      price: "$15",
      amount: 15,
      unitPrice: "$0.37 per generation",
      savings: "Save 38%",
      type: "one_time",
      desc: "The sweet spot for active laser shops & craft fair sellers.",
    },
    {
      id: "studio",
      name: "Studio",
      badge: "🔥 Best Value",
      credits: 80,
      price: "$25",
      amount: 25,
      unitPrice: "$0.31 per generation",
      savings: "Save 48%",
      type: "one_time",
      desc: "Maximum savings for busy commercial production studios.",
    },
  ];

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    trackEvent("ai_paywall_checkout_click", { pack: selectedPack, prompt: savedPrompt });

    try {
      let payload = {};

      if (selectedPack === "monthly") {
        payload = {
          plan: "laser_ai_membership",
          cycle: "monthly",
          mode: "subscription",
          priceId: process.env.NEXT_PUBLIC_STRIPE_AI_MONTHLY_PRICE_ID || "price_ai_monthly_5",
          redirectOrigin: window.location.origin,
        };
      } else {
        const packObj = packs.find((p) => p.id === selectedPack);
        payload = {
          plan: `ai_credits_${selectedPack}`,
          mode: "payment",
          amount: packObj?.amount || 15,
          credits: packObj?.credits || 40,
          redirectOrigin: window.location.origin,
          prompt: savedPrompt,
        };
      }

      const res = await fetch("/api/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        // Fallback to app upgrade if direct checkout link not configured
        window.location.href = `https://app.0machine.com?upgrade=${selectedPack}&prompt=${encodeURIComponent(savedPrompt)}`;
        return;
      }

      window.location.href = data.url;
    } catch (err) {
      console.error("[LaserAiCreditModal] Checkout error:", err);
      // Seamless fallback to app
      window.location.href = `https://app.0machine.com?upgrade=${selectedPack}&prompt=${encodeURIComponent(savedPrompt)}`;
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          className="bg-[#1A1D21] border border-white/15 rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl my-8 text-gray-200"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-400 hover:text-white w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/10 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>

          {/* Modal Header */}
          <div className="text-center max-w-lg mx-auto mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B1FA63]/10 border border-[#B1FA63]/25 text-[#B1FA63] text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles size={13} />
              <span>INSTANT LASER VECTOR READY</span>
            </span>

            <h3 className="text-2xl sm:text-3xl font-black text-white font-[Outfit] tracking-tight">
              Your design is ready to generate
            </h3>

            <p className="text-xs sm:text-sm text-gray-400 mt-2">
              Pick credits to run it. <span className="text-[#FE7733] font-semibold">Your prompt is saved.</span> Each generation gives you the artwork plus traced, cut-ready SVG, DXF, and PNG files.
            </p>
          </div>

          {/* Saved Prompt Banner */}
          {savedPrompt && (
            <div className="p-3.5 bg-[#111317] border border-[#FE7733]/30 rounded-2xl mb-6 flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-[#FE7733] mt-1.5 flex-shrink-0 animate-ping" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] font-mono text-gray-500 uppercase font-bold">Saved Laser Prompt:</span>
                  <span className="text-[10px] font-mono text-[#B1FA63] font-bold uppercase">
                    {activeMode.replace("-", " ")}
                  </span>
                </div>
                <p className="text-xs text-white font-mono line-clamp-2 italic">
                  "{savedPrompt}"
                </p>
              </div>
            </div>
          )}

          {/* SECTION 1: Monthly Membership (Recommended) */}
          <div className="mb-5">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
              Monthly Membership (Recommended)
            </span>

            <div
              onClick={() => setSelectedPack("monthly")}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                selectedPack === "monthly"
                  ? "bg-[#23262C] border-[#FE7733] shadow-lg shadow-[#FE7733]/15 ring-1 ring-[#FE7733]"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  selectedPack === "monthly" ? "border-[#FE7733] bg-[#FE7733]" : "border-gray-500"
                }`}>
                  {selectedPack === "monthly" && <Check size={12} className="text-white" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">Monthly Maker Membership</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FE7733]/20 text-[#FE7733] border border-[#FE7733]/30">
                      Recommended
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    10 credits monthly · credits never expire · cancel online anytime
                  </p>
                </div>
              </div>

              <div className="text-right sm:flex-shrink-0">
                <span className="text-xl font-black text-white font-[Outfit]">$5</span>
                <span className="text-xs text-gray-400"> / mo</span>
              </div>
            </div>
          </div>

          {/* SECTION 2: Buy Once (Credit Packs) */}
          <div className="mb-6">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
              Or Buy Once (No Subscription)
            </span>

            <div className="grid sm:grid-cols-3 gap-3">
              {packs.map((pack) => {
                const isSelected = selectedPack === pack.id;
                return (
                  <div
                    key={pack.id}
                    onClick={() => setSelectedPack(pack.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative ${
                      isSelected
                        ? "bg-[#23262C] border-[#FE7733] shadow-lg shadow-[#FE7733]/15 ring-1 ring-[#FE7733]"
                        : "bg-white/5 border-white/10 hover:border-white/20"
                    }`}
                  >
                    {pack.badge && (
                      <span className={`absolute -top-2.5 right-3 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md ${
                        pack.id === "maker"
                          ? "bg-[#FE7733] text-white"
                          : "bg-[#B1FA63] text-black"
                      }`}>
                        {pack.badge}
                      </span>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-white font-[Outfit]">{pack.name}</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? "border-[#FE7733] bg-[#FE7733]" : "border-gray-500"
                        }`}>
                          {isSelected && <Check size={10} className="text-white" />}
                        </div>
                      </div>

                      <div className="text-2xl font-black text-white font-[Outfit] my-1">
                        {pack.price}
                      </div>

                      <div className="text-[11px] text-[#B1FA63] font-bold font-mono">
                        {pack.credits} Credits
                      </div>

                      <div className="text-[10px] text-gray-400 mt-0.5">
                        {pack.unitPrice}
                      </div>
                    </div>

                    {pack.savings && (
                      <div className="mt-3 pt-2 border-t border-white/10 text-[10px] font-bold text-[#FE7733]">
                        {pack.savings}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-3 px-4 bg-white/[0.03] rounded-2xl border border-white/5 mb-6 text-xs text-gray-300">
            <div className="flex items-center gap-1.5">
              <Check size={14} className="text-[#10B981] flex-shrink-0" />
              <span>Never expire</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check size={14} className="text-[#10B981] flex-shrink-0" />
              <span>Commercial use</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check size={14} className="text-[#10B981] flex-shrink-0" />
              <span>Cancel online</span>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl mb-4 text-center">
              {error}
            </div>
          )}

          {/* Primary CTA Button */}
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-[#FE7733] to-[#FF8F50] hover:brightness-110 text-white font-extrabold rounded-2xl text-sm transition-all shadow-xl shadow-[#FE7733]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Connecting to Secure Checkout...</span>
              </>
            ) : (
              <>
                <CreditCard size={16} />
                <span>
                  {selectedPack === "monthly"
                    ? "Start Membership ($5/mo) & Run Design"
                    : `Get ${selectedPack === "basic" ? "15" : selectedPack === "maker" ? "40" : "80"} Credits (${selectedPack === "basic" ? "$9" : selectedPack === "maker" ? "$15" : "$25"}) & Run Design`}
                </span>
                <ArrowRight size={15} />
              </>
            )}
          </button>

          {/* Refund Guarantee & Stripe Security Footnote */}
          <p className="text-[11px] text-gray-500 text-center mt-3">
            Failed generations are refunded automatically. 🔒 Secure checkout by Stripe.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

