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
    <section id="roi-calculator" className="py-20 sm:py-28 bg-dark-900/60 border-y border-white/5 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Calculator size={13} />
            <span>{t("calc.roi.badge")}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-[Outfit] text-white tracking-tight mb-3">
            {t("calc.roi.title")}
          </h2>
          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
            {t("calc.roi.subtitle")}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-dark-950/90 backdrop-blur-xl p-5 sm:p-8 md:p-10 shadow-2xl">
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-10">
            {/* Slider 1: Sheets per month */}
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 sm:p-5">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="sheets-per-month" className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
                  {t("calc.roi.sheetsLabel")}
                </label>
                <span className="text-base sm:text-lg font-black text-amber-400 font-[Outfit]">
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
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 sm:p-5">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="sheet-price" className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
                  {t("calc.roi.priceLabel")}
                </label>
                <span className="text-base sm:text-lg font-black text-white font-[Outfit]">
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
          <div className="p-5 sm:p-6 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-emerald-500/10 border border-amber-500/25 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
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

            <div className="sm:border-l sm:border-white/10 sm:pl-6">
              <span className="text-xs text-emerald-400 block font-semibold mb-1">
                {t("calc.roi.totalGain")}
              </span>
              <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-[Outfit]">
                +${totalMonthlyGain.toFixed(0)}{" "}
                <span className="text-xs font-normal text-emerald-200">{t("calc.roi.perMonth")}</span>
              </span>
              <span className="text-[11px] text-emerald-300 font-semibold block mt-1">
                (+${annualGain.toLocaleString()} {t("calc.roi.annualGain")})
              </span>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href="https://app.0machine.com/register?ref=roi_calculator"
              onClick={handleCta}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black shadow-lg shadow-amber-500/25 transition-all cursor-pointer w-full sm:w-auto"
            >
              <span>{t("calc.roi.cta")}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
