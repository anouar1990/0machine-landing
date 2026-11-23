"use client";
import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { trackEvent } from "../lib/analytics";
import { Calculator, Sparkles, TrendingUp, DollarSign, Layers } from "lucide-react";

export default function RoiCalculator() {
  const { t } = useLanguage();
  const [sheetsPerMonth, setSheetsPerMonth] = useState(35);
  const [sheetPrice, setSheetPrice] = useState(30);

  // ROI calculations
  const monthlyMaterialSpent = sheetsPerMonth * sheetPrice;
  const materialSaved = monthlyMaterialSpent * 0.22; // 22% nesting scrap savings
  const unbilledTimeRecovered = sheetsPerMonth * 12; // $12 in unbilled pierces/consumables/gas per sheet
  const totalMonthlyGain = materialSaved + unbilledTimeRecovered;
  const annualGain = totalMonthlyGain * 12;

  const handleCta = () => {
    trackEvent("cta_click", {
      button: "roi_calculator_cta",
      sheets_per_month: sheetsPerMonth,
      sheet_price: sheetPrice,
      estimated_monthly_gain: Math.round(totalMonthlyGain),
    });
  };

  return (
    <section id="roi-calculator" className="py-20 sm:py-28 bg-[#0e100f] border-t border-[#42433d]/40 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-15 pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#42433d] bg-[#141513] mb-4 shadow-lg shadow-black/40">
            <span className="w-2 h-2 rounded-full bg-[#abff84] animate-pulse" />
            <span className="text-xs text-[#abff84] tracking-[0.2em] uppercase font-mono font-semibold">
              {t("calc.roi.badge") || "WORKSHOP ROI BENCHMARK"}
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-[Outfit] text-[#fffce1] tracking-[-0.04em] mb-3">
            {t("calc.roi.title")}
          </h2>
          <p className="text-[#7c7c6f] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {t("calc.roi.subtitle")}
          </p>
        </div>

        <div className="rounded-[28px] border border-[#42433d] bg-[#141513] p-5 sm:p-8 md:p-10 shadow-2xl">
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-10">
            {/* Slider 1: Sheets per month */}
            <div className="bg-[#0e100f] border border-[#42433d]/60 rounded-2xl p-4 sm:p-5">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="sheets-per-month" className="text-xs text-[#7c7c6f] font-mono uppercase tracking-wide">
                  {t("calc.roi.sheetsLabel")}
                </label>
                <span className="text-base sm:text-lg font-black text-[#abff84] font-[Outfit]">
                  {sheetsPerMonth} {t("calc.roi.sheetsSuffix")}
                </span>
              </div>
              <input
                id="sheets-per-month"
                aria-label={t("calc.roi.sheetsLabel")}
                type="range"
                min="5"
                max="200"
                step="5"
                value={sheetsPerMonth}
                onChange={(e) => setSheetsPerMonth(parseInt(e.target.value) || 5)}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-white/10 rounded-lg"
              />
              <span className="text-[11px] text-gray-400 block mt-2">
                {t("calc.roi.sheetsHelp")}
              </span>
            </div>

            {/* Slider 2: Average Sheet Price */}
            <div className="bg-[#0e100f] border border-[#42433d]/60 rounded-2xl p-4 sm:p-5">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="sheet-price" className="text-xs text-[#7c7c6f] font-mono uppercase tracking-wide">
                  {t("calc.roi.priceLabel")}
                </label>
                <span className="text-base sm:text-lg font-black text-[#abff84] font-[Outfit]">
                  ${sheetPrice}
                </span>
              </div>
              <input
                id="sheet-price"
                aria-label={t("calc.roi.priceLabel")}
                type="range"
                min="10"
                max="100"
                step="5"
                value={sheetPrice}
                onChange={(e) => setSheetPrice(parseInt(e.target.value) || 10)}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-white/10 rounded-lg"
              />
              <span className="text-[11px] text-gray-400 block mt-2">
                {t("calc.roi.priceHelp")}
              </span>
            </div>
          </div>

          {/* Results Grid */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0e100f] border border-[#42433d] grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <span className="text-xs text-gray-400 block font-semibold mb-1">
                {t("calc.roi.savedScrap")}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-amber-400 font-[Outfit]">
                +${materialSaved.toFixed(0)}{" "}
                <span className="text-xs font-normal text-gray-400">{t("calc.roi.perMonth")}</span>
              </span>
              <span className="text-[11px] text-gray-400 block mt-1">
                {t("calc.roi.savedScrapSub")}
              </span>
            </div>

            <div>
              <span className="text-xs text-gray-400 block font-semibold mb-1">
                {t("calc.roi.unbilledTime")}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-orange-400 font-[Outfit]">
                +${unbilledTimeRecovered.toFixed(0)}{" "}
                <span className="text-xs font-normal text-gray-400">{t("calc.roi.perMonth")}</span>
              </span>
              <span className="text-[11px] text-gray-400 block mt-1">
                {t("calc.roi.unbilledTimeSub")}
              </span>
            </div>

            <div className="sm:border-l sm:border-[#42433d]/60 sm:pl-6">
              <span className="text-xs text-[#abff84] block font-mono font-semibold mb-1">
                {t("calc.roi.totalGain")}
              </span>
              <span className="text-3xl sm:text-4xl font-black text-[#abff84] font-[Outfit]">
                +${totalMonthlyGain.toFixed(0)}{" "}
                <span className="text-xs font-normal text-[#fffce1]">{t("calc.roi.perMonth")}</span>
              </span>
              <span className="text-[11px] text-[#abff84]/80 font-mono font-semibold block mt-1">
                (+${annualGain.toLocaleString()} {t("calc.roi.annualGain")})
              </span>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href="https://app.0machine.com/register?ref=roi_calculator"
              onClick={handleCta}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-black text-sm tracking-tight bg-[#fffce1] hover:bg-[#abff84] text-[#0e100f] shadow-xl hover:shadow-[0_0_30px_rgba(171,255,132,0.35)] transition-all font-[Outfit] active:scale-95 cursor-pointer w-full sm:w-auto"
            >
              <span>{t("calc.roi.cta")}</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
