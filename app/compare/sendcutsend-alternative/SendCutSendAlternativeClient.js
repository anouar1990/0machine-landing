"use client";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ParticleField from "../../components/ParticleField";
import {
  Check,
  X,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Clock,
  Layers,
  Zap,
  ShieldCheck,
  Cpu,
} from "lucide-react";
import Link from "next/link";

export default function SendCutSendAlternativeClient() {
  // Break-even calculator states
  const [monthlyParts, setMonthlyParts] = useState(150);
  const [outsourcePrice, setOutsourcePrice] = useState(14.5);
  const [inHouseRawCost, setInHouseRawCost] = useState(3.2);

  // Calculations
  const monthlyOutsourcedSpend = monthlyParts * outsourcePrice;
  const monthlyInHouseSpend = monthlyParts * (inHouseRawCost + 0.85); // 0.85 machine amort/elec
  const monthlySavings = monthlyOutsourcedSpend - monthlyInHouseSpend;
  const annualSavings = monthlySavings * 12;

  const comparisonRows = [
    {
      feature: "Cost Per Cut Part",
      outsource: "$12.00 – $38.00 (Retail Markups Included)",
      inhouse: "$1.80 – $4.50 (Raw Sheet Bulk Pricing)",
      winner: "In-House + 0Machine",
      advantage: "Save 70–85% on every batch",
    },
    {
      feature: "Turnaround & Lead Time",
      outsource: "4 to 8 Business Days (Plus Shipping)",
      inhouse: "15 to 30 Minutes on Machine Bed",
      winner: "In-House + 0Machine",
      advantage: "Same-day customer deliveries",
    },
    {
      feature: "Prototyping & Re-Cut Velocity",
      outsource: "Pay new minimum order & wait days",
      inhouse: "Adjust kerf by 0.05mm and cut instantly",
      winner: "In-House + 0Machine",
      advantage: "Iterate 5x in one afternoon",
    },
    {
      feature: "Sheet Yield & Scrap Optimization",
      outsource: "Supplier keeps offcuts & scrap value",
      inhouse: "0Machine True-Shape Nesting cuts inside holes",
      winner: "In-House + 0Machine",
      advantage: "30–40% material waste reduction",
    },
    {
      feature: "Minimum Order Fees",
      outsource: "$29.00 – $49.00 minimum batch charge",
      inhouse: "$0.00 — cut 1 washer or 500 brackets",
      winner: "In-House + 0Machine",
      advantage: "Zero order penalties",
    },
    {
      feature: "IP & Design Confidentiality",
      outsource: "Upload CAD files to 3rd-party vendor servers",
      inhouse: "100% private in-browser CAM & on-premise execution",
      winner: "In-House + 0Machine",
      advantage: "Client designs never leave your network",
    },
  ];

  return (
    <>
      <ParticleField />
      <Navbar />

      <main className="min-h-screen pt-32 pb-24 relative z-10 bg-[#0e100f] text-gray-300">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#fe7733] bg-[#fe7733]/10 border border-[#fe7733]/20 px-3.5 py-1.5 rounded-full mb-4">
              <TrendingUp size={13} className="text-[#fe7733]" />
              <span>Commercial Fabrication Economics</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold font-[Outfit] text-[#fffce1] mb-5 leading-tight">
              SendCutSend Alternative: <br />
              <span className="text-[#fe7733]">In-House Laser Fabrication</span> vs. Outsourcing
            </h1>
            <p className="text-[#7c7c6f] text-sm sm:text-base leading-relaxed">
              Why growing maker workshops, fablabs, and metal fabricators are transitioning from per-part
              outsourcing to in-house production powered by 0Machine True-Shape Nesting and Workshop OS.
            </p>
          </div>

          {/* Interactive Break-Even ROI Calculator */}
          <div className="bg-[#121311] border border-[#42433d]/80 rounded-2xl p-6 sm:p-8 mb-16 shadow-2xl">
            <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
              {/* Sliders (Left) */}
              <div className="w-full lg:w-7/12 space-y-6">
                <div>
                  <h3 className="text-xl font-bold font-[Outfit] text-[#fffce1] mb-1">
                    Calculate Your In-House Laser Break-Even Point
                  </h3>
                  <p className="text-xs text-[#7c7c6f]">
                    Adjust your monthly part volume to calculate retained gross profit.
                  </p>
                </div>

                {/* Parts slider */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-[#7c7c6f]">
                      Parts Cut Per Month
                    </label>
                    <span className="text-xs font-mono text-[#abff84] font-bold">
                      {monthlyParts} units
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="1000"
                    step="10"
                    value={monthlyParts}
                    onChange={(e) => setMonthlyParts(Number(e.target.value))}
                    className="w-full accent-[#fe7733] bg-[#191919] cursor-pointer"
                  />
                </div>

                {/* Outsource Price Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-[#7c7c6f]">
                      Current Outsourced Cost Per Part (SendCutSend avg)
                    </label>
                    <span className="text-xs font-mono text-[#fe7733] font-bold">
                      ${outsourcePrice.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="0.5"
                    value={outsourcePrice}
                    onChange={(e) => setOutsourcePrice(Number(e.target.value))}
                    className="w-full accent-[#fe7733] bg-[#191919] cursor-pointer"
                  />
                </div>

                {/* Raw Material Cost Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-[#7c7c6f]">
                      In-House Raw Sheet Material Cost Per Part
                    </label>
                    <span className="text-xs font-mono text-[#fffce1] font-bold">
                      ${inHouseRawCost.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="0.2"
                    value={inHouseRawCost}
                    onChange={(e) => setInHouseRawCost(Number(e.target.value))}
                    className="w-full accent-[#fe7733] bg-[#191919] cursor-pointer"
                  />
                </div>
              </div>

              {/* Readout Card (Right) */}
              <div className="w-full lg:w-5/12 bg-[#191919] border border-[#fe7733]/40 rounded-xl p-6 text-center space-y-4">
                <span className="text-xs font-mono uppercase tracking-wider text-[#7c7c6f] block">
                  Estimated Retained Annual Savings
                </span>
                <div className="text-4xl sm:text-5xl font-black font-mono text-[#abff84]">
                  ${Math.round(annualSavings).toLocaleString()}
                  <span className="text-xs font-normal text-[#7c7c6f] block mt-1">/ year in gross margin</span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#42433d]/50 text-left">
                  <div>
                    <span className="text-[11px] font-mono text-[#7c7c6f] block">Outsourced Total</span>
                    <span className="text-sm font-mono text-[#ef4444] font-bold">
                      ${Math.round(monthlyOutsourcedSpend * 12).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-[#7c7c6f] block">In-House Cost</span>
                    <span className="text-sm font-mono text-[#fffce1] font-bold">
                      ${Math.round(monthlyInHouseSpend * 12).toLocaleString()}
                    </span>
                  </div>
                </div>

                <Link
                  href="/calculator"
                  className="w-full py-2.5 px-4 bg-[#fe7733] hover:bg-[#e06526] text-white font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition-all mt-3"
                >
                  <span>Open Full Job Cost Calculator</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>

          {/* Detailed Side-by-Side Comparison Table */}
          <div className="mb-20">
            <h2 className="text-2xl sm:text-3xl font-bold font-[Outfit] text-[#fffce1] mb-6 text-center">
              Comprehensive Head-to-Head Comparison
            </h2>

            <div className="overflow-x-auto rounded-2xl border border-[#42433d]/70 bg-[#121311]">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[#42433d] bg-[#191919] text-[#7c7c6f] font-mono uppercase tracking-wider">
                    <th className="p-4 sm:p-5">Fabrication Vector</th>
                    <th className="p-4 sm:p-5">SendCutSend / Outsourcing</th>
                    <th className="p-4 sm:p-5 text-[#abff84]">In-House + 0Machine OS</th>
                    <th className="p-4 sm:p-5">Economic Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#42433d]/40 text-gray-300">
                  {comparisonRows.map((row) => (
                    <tr key={row.feature} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 sm:p-5 font-medium text-[#fffce1]">{row.feature}</td>
                      <td className="p-4 sm:p-5 text-[#7c7c6f]">{row.outsource}</td>
                      <td className="p-4 sm:p-5 font-mono text-[#abff84]">{row.inhouse}</td>
                      <td className="p-4 sm:p-5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#fe7733] bg-[#fe7733]/10 px-2.5 py-1 rounded-md border border-[#fe7733]/30">
                          {row.advantage}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Deep Dives */}
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            <div className="bg-[#121311] border border-[#42433d]/60 rounded-xl p-6">
              <span className="w-8 h-8 rounded-lg bg-[#fe7733]/15 text-[#fe7733] flex items-center justify-center font-bold text-sm mb-4">
                1
              </span>
              <h3 className="text-base font-bold text-[#fffce1] mb-2">Eliminate Supplier Sheet Margins</h3>
              <p className="text-xs text-[#7c7c6f] leading-relaxed">
                When you buy full 4x8 or 5x10 raw sheets of aluminum, stainless steel, or Baltic birch,
                your material unit cost drops to pennies per square inch. Outsourcers charge retail part
                pricing plus handling fees on every cut.
              </p>
            </div>

            <div className="bg-[#121311] border border-[#42433d]/60 rounded-xl p-6">
              <span className="w-8 h-8 rounded-lg bg-[#abff84]/15 text-[#abff84] flex items-center justify-center font-bold text-sm mb-4">
                2
              </span>
              <h3 className="text-base font-bold text-[#fffce1] mb-2">Same-Day Prototyping Velocity</h3>
              <p className="text-xs text-[#7c7c6f] leading-relaxed">
                Need a 0.15mm looser slot on an interlocking tab? With in-house cutting, you edit CAD and
                have a freshly cut test piece in your hands 12 minutes later instead of waiting 6 days for
                delivery trucks.
              </p>
            </div>

            <div className="bg-[#121311] border border-[#42433d]/60 rounded-xl p-6">
              <span className="w-8 h-8 rounded-lg bg-[#fffce1]/15 text-[#fffce1] flex items-center justify-center font-bold text-sm mb-4">
                3
              </span>
              <h3 className="text-base font-bold text-[#fffce1] mb-2">True-Shape Scrap Harvesting</h3>
              <p className="text-xs text-[#7c7c6f] leading-relaxed">
                0Machine Nesting Studio automatically places small brackets, washers, and tabs inside
                the hollow drop holes of large decorative pieces. What used to be wasted scrap becomes
                100% free product inventory.
              </p>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="bg-gradient-to-r from-[#191919] via-[#121311] to-[#191919] border border-[#42433d] rounded-2xl p-8 sm:p-10 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold font-[Outfit] text-[#fffce1] mb-3">
              Ready to Maximize In-House Laser Margins?
            </h2>
            <p className="text-sm text-[#7c7c6f] max-w-xl mx-auto mb-6">
              Explore 0Machine True-Shape Nesting, LaserAI vector generation, and our curated library of
              300,000+ commercial laser files.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/tools/nesting"
                className="px-6 py-3 bg-[#fe7733] hover:bg-[#e06526] text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-[#fe7733]/20"
              >
                <span>Launch Free Nesting Tool</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/#pricing"
                className="px-6 py-3 bg-[#191919] hover:bg-[#232323] text-[#fffce1] border border-[#42433d] font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
              >
                <span>View Workshop Pro Plans</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
