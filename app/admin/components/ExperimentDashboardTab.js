"use client";
import React, { useState, useMemo } from "react";
import {
  FlaskConical, TrendingUp, Users, ArrowUpRight, ArrowDownRight,
  Eye, CheckCircle2, ShieldCheck, AlertTriangle, ExternalLink, RefreshCw,
  Zap, Calendar, BarChart2, DollarSign
} from "lucide-react";

const VARIANTS = ["A", "B", "C", "D", "E"];

const VARIANT_INFO = {
  A: {
    name: "Variant A (Control)",
    angle: "Original Baseline",
    headline: "Precision Laser Business OS & LaserAI",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/25",
  },
  B: {
    name: "Variant B",
    angle: "All-in-One Workshop OS",
    headline: "Run Your Entire Laser & CNC Workshop in One Place",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
  },
  C: {
    name: "Variant C",
    angle: "Save Material & Increase Profits",
    headline: "Stop Wasting Material. Start Making More Profit.",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/25",
  },
  D: {
    name: "Variant D",
    angle: "Business Growth & Professionalism",
    headline: "Turn Your Laser Workshop Into a Real Business",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/25",
  },
  E: {
    name: "Variant E",
    angle: "300,000+ Designs & Creative Freedom",
    headline: "300,000+ Designs Ready to Use. Create Your Own. No Limits.",
    badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/25",
  },
};

export default function ExperimentDashboardTab({ analyticsEvents = [], usersList = [] }) {
  const [dateFilter, setDateFilter] = useState("all"); // 'today' | '7d' | '30d' | '90d' | 'all'

  // 1. Filter events by timeframe
  const filteredEvents = useMemo(() => {
    if (!analyticsEvents || analyticsEvents.length === 0) return [];
    if (dateFilter === "all") return analyticsEvents;

    const daysMap = { today: 1, "7d": 7, "30d": 30, "90d": 90 };
    const days = daysMap[dateFilter] || 0;
    if (days === 0) return analyticsEvents;

    // Use latest event timestamp as reference point for pure reproducible filtering
    const latestTime = analyticsEvents.reduce((max, e) => {
      const t = e.created_at ? new Date(e.created_at).getTime() : 0;
      return t > max ? t : max;
    }, 0);

    const cutoffMs = days * 24 * 60 * 60 * 1000;
    return analyticsEvents.filter((e) => {
      const t = e.created_at ? new Date(e.created_at).getTime() : 0;
      return t >= latestTime - cutoffMs;
    });
  }, [analyticsEvents, dateFilter]);

  // 2. Compute metrics for each variant
  const stats = useMemo(() => {
    const data = {};

    VARIANTS.forEach((v) => {
      // Find all events belonging to this variant
      const vEvents = filteredEvents.filter((e) => {
        const evVariant = (e.metadata?.variant || e.metadata?.utm_variant || "A").toUpperCase();
        return evVariant === v;
      });

      // Unique visitors (by session_id)
      const sessions = new Set(vEvents.map((e) => e.session_id).filter(Boolean));
      const visitors = Math.max(sessions.size, vEvents.filter((e) => e.event_name === "pageview").length > 0 ? 1 : 0);

      // Funnel event counts
      const ctaClicks = vEvents.filter((e) => e.event_name === "cta_click").length;
      const signupStarts = vEvents.filter((e) => e.event_name === "signup_started").length;
      const signupsCompleted = vEvents.filter((e) => e.event_name === "signup_completed" || e.event_name === "sign_up").length;
      const verifiedUsers = vEvents.filter((e) => e.event_name === "email_verified" || e.event_name === "user_verified").length;
      const firstToolUsage = vEvents.filter((e) =>
        ["activated", "cost_calculated", "project_created", "quote_created", "box_generated", "vector_generated"].includes(e.event_name)
      ).length;
      const proUpgrades = vEvents.filter((e) =>
        e.event_name === "pro_feature_viewed" || e.event_name === "checkout_started" || e.event_name === "pro_upgrade_clicked"
      ).length;
      const paidSubscriptions = vEvents.filter((e) => e.event_name === "subscription_paid" || e.event_name === "purchase").length;

      // Estimated revenue
      const revenue = vEvents
        .filter((e) => e.event_name === "subscription_paid" || e.event_name === "purchase")
        .reduce((sum, e) => sum + (parseFloat(e.metadata?.amount) || 19), 0);

      // Conversion rates
      const ctaCtr = visitors > 0 ? ((ctaClicks / visitors) * 100).toFixed(1) : "0.0";
      const visitorToSignup = visitors > 0 ? ((signupsCompleted / visitors) * 100).toFixed(1) : "0.0";
      const signupToVerified = signupsCompleted > 0 ? ((verifiedUsers / signupsCompleted) * 100).toFixed(1) : "0.0";
      const verifiedToActive = verifiedUsers > 0 ? ((firstToolUsage / verifiedUsers) * 100).toFixed(1) : "0.0";
      const visitorToPaid = visitors > 0 ? ((paidSubscriptions / visitors) * 100).toFixed(1) : "0.0";
      const revenuePerVisitor = visitors > 0 ? (revenue / visitors).toFixed(2) : "0.00";

      // Overall conversion rate (visitor to signup or paid)
      const overallRate = visitors > 0 ? ((signupsCompleted / visitors) * 100) : 0;

      data[v] = {
        visitors,
        ctaClicks,
        ctaCtr,
        signupStarts,
        signupsCompleted,
        visitorToSignup,
        verifiedUsers,
        signupToVerified,
        firstToolUsage,
        verifiedToActive,
        proUpgrades,
        paidSubscriptions,
        visitorToPaid,
        revenue,
        revenuePerVisitor,
        overallRate,
      };
    });

    // Total visitors across all variants
    const totalVisitors = Object.values(data).reduce((sum, d) => sum + d.visitors, 0) || 1;

    // Traffic distribution and lift vs Variant A
    const controlRate = data["A"]?.overallRate || 0;

    VARIANTS.forEach((v) => {
      data[v].trafficShare = ((data[v].visitors / totalVisitors) * 100).toFixed(1);

      if (v === "A") {
        data[v].lift = "Baseline";
      } else if (controlRate === 0) {
        data[v].lift = data[v].overallRate > 0 ? "+100%" : "0.0%";
      } else {
        const diff = ((data[v].overallRate - controlRate) / controlRate) * 100;
        data[v].lift = (diff >= 0 ? "+" : "") + diff.toFixed(1) + "%";
      }

      // Statistical confidence calculation (Z-score heuristic)
      const n = data[v].visitors;
      if (v === "A") {
        data[v].confidence = "Control Baseline";
      } else if (n < 30) {
        data[v].confidence = "Collecting data (n < 30)";
      } else if (n < 100) {
        data[v].confidence = "Preliminary (Need n ≥ 100)";
      } else {
        const p1 = data[v].overallRate / 100;
        const p2 = controlRate / 100;
        const se = Math.sqrt((p1 * (1 - p1) + p2 * (1 - p2)) / n);
        const z = se > 0 ? Math.abs(p1 - p2) / se : 0;
        if (z >= 1.96) {
          data[v].confidence = "95% Statistically Significant";
        } else if (z >= 1.44) {
          data[v].confidence = "85% Trending (More data needed)";
        } else {
          data[v].confidence = "Inconclusive vs Control";
        }
      }
    });

    return data;
  }, [filteredEvents]);

  const totalAllVisitors = useMemo(() => {
    return Object.values(stats).reduce((sum, s) => sum + s.visitors, 0);
  }, [stats]);

  const totalAllSignups = useMemo(() => {
    return Object.values(stats).reduce((sum, s) => sum + s.signupsCompleted, 0);
  }, [stats]);

  const totalAllRevenue = useMemo(() => {
    return Object.values(stats).reduce((sum, s) => sum + s.revenue, 0);
  }, [stats]);

  return (
    <div className="space-y-8">
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white/5 border border-white/10 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-accent-500/10 text-accent-400 border border-accent-500/20">
              <FlaskConical size={20} />
            </span>
            <div>
              <h2 className="text-xl font-black text-white font-[Outfit]">
                Landing Page 5-Variant Split Test
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Experiment ID: <span className="font-mono text-accent-400">exp_landing_positioning_v1</span> · Allocation: <span className="text-white font-semibold">20% A / 20% B / 20% C / 20% D / 20% E</span>
              </p>
            </div>
          </div>
        </div>

        {/* Date Filter & Launch Preview */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-dark-900 border border-white/10 p-1 rounded-xl text-xs">
            {[
              { id: "today", label: "Today" },
              { id: "7d", label: "7 Days" },
              { id: "30d", label: "30 Days" },
              { id: "90d", label: "90 Days" },
              { id: "all", label: "All Time" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setDateFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  dateFilter === f.id
                    ? "bg-accent-500 text-black shadow font-bold"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <a
            href="/?variant=A&preview=true"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/10 transition-colors"
          >
            <span>Live Preview</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* OVERVIEW KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
          <span className="text-xs text-gray-400 font-semibold block mb-1">Total Experiment Visitors</span>
          <span className="text-3xl font-black text-white font-[Outfit]">{totalAllVisitors}</span>
          <span className="text-[11px] text-gray-400 block mt-1">First-party persistent cookies</span>
        </div>

        <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
          <span className="text-xs text-gray-400 font-semibold block mb-1">Total Signups</span>
          <span className="text-3xl font-black text-accent-400 font-[Outfit]">{totalAllSignups}</span>
          <span className="text-[11px] text-gray-400 block mt-1">
            {totalAllVisitors > 0 ? ((totalAllSignups / totalAllVisitors) * 100).toFixed(1) : 0}% avg conversion
          </span>
        </div>

        <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
          <span className="text-xs text-gray-400 font-semibold block mb-1">Target Traffic Allocation</span>
          <span className="text-3xl font-black text-emerald-400 font-[Outfit]">20% Each</span>
          <span className="text-[11px] text-gray-400 block mt-1">Balanced 5-way split</span>
        </div>

        <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
          <span className="text-xs text-gray-400 font-semibold block mb-1">Tracked Pro Revenue</span>
          <span className="text-3xl font-black text-white font-[Outfit]">${totalAllRevenue.toFixed(0)}</span>
          <span className="text-[11px] text-gray-400 block mt-1">Attributed across variants</span>
        </div>
      </div>

      {/* VARIANT DIRECT PREVIEW PILLS */}
      <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
          <Eye size={14} className="text-accent-400" />
          <span>Click to preview each variant exactly as visitors see it:</span>
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {VARIANTS.map((v) => {
            const meta = VARIANT_INFO[v];
            return (
              <a
                key={v}
                href={`/?variant=${v}&preview=true`}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 hover:scale-105 ${meta.badgeColor}`}
              >
                <span>{meta.name}</span>
                <ExternalLink size={11} className="opacity-70" />
              </a>
            );
          })}
        </div>
      </div>

      {/* MASTER EXPERIMENT COMPARISON TABLE */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 bg-dark-900/90 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-bold text-white text-base font-[Outfit] flex items-center gap-2">
            <BarChart2 size={18} className="text-accent-400" />
            <span>Master A/B/C/D/E Metric Comparison</span>
          </h3>
          <span className="text-xs text-gray-400 font-mono">Real-time Supabase Telemetry</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-gray-400 font-mono">
                <th className="py-3.5 px-6 font-semibold w-56">Metric</th>
                {VARIANTS.map((v) => (
                  <th key={v} className="py-3.5 px-4 font-bold text-white text-center">
                    <div className="font-[Outfit] text-sm">{v}</div>
                    <div className="text-[10px] text-gray-400 font-normal truncate max-w-[120px]">
                      {VARIANT_INFO[v].angle.split(" ")[0]}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {/* Row: Angle Description */}
              <tr className="bg-white/[0.01]">
                <td className="py-3 px-6 text-gray-400 font-medium">Marketing Angle</td>
                {VARIANTS.map((v) => (
                  <td key={v} className="py-3 px-4 text-center">
                    <span className="text-[11px] font-semibold text-gray-200 block">
                      {VARIANT_INFO[v].angle}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row: Unique Visitors */}
              <tr>
                <td className="py-3 px-6 text-gray-300 font-semibold">1. Visitors (Unique)</td>
                {VARIANTS.map((v) => (
                  <td key={v} className="py-3 px-4 text-center font-bold text-white font-mono text-sm">
                    {stats[v]?.visitors || 0}
                  </td>
                ))}
              </tr>

              {/* Row: Traffic Distribution % */}
              <tr>
                <td className="py-3 px-6 text-gray-400">Traffic Distribution</td>
                {VARIANTS.map((v) => (
                  <td key={v} className="py-3 px-4 text-center text-gray-300 font-mono text-[11px]">
                    {stats[v]?.trafficShare || "0.0"}%
                  </td>
                ))}
              </tr>

              {/* Row: CTA Clicks */}
              <tr>
                <td className="py-3 px-6 text-gray-300 font-semibold">2. CTA Clicks</td>
                {VARIANTS.map((v) => (
                  <td key={v} className="py-3 px-4 text-center font-mono text-white">
                    {stats[v]?.ctaClicks || 0}
                  </td>
                ))}
              </tr>

              {/* Row: CTA CTR % */}
              <tr>
                <td className="py-3 px-6 text-gray-400">CTA Click-Through Rate (CTR)</td>
                {VARIANTS.map((v) => (
                  <td key={v} className="py-3 px-4 text-center text-blue-400 font-mono font-bold">
                    {stats[v]?.ctaCtr || "0.0"}%
                  </td>
                ))}
              </tr>

              {/* Row: Signup Starts */}
              <tr>
                <td className="py-3 px-6 text-gray-300 font-semibold">3. Signup Starts</td>
                {VARIANTS.map((v) => (
                  <td key={v} className="py-3 px-4 text-center font-mono text-white">
                    {stats[v]?.signupStarts || 0}
                  </td>
                ))}
              </tr>

              {/* Row: Signups Completed */}
              <tr className="bg-accent-500/[0.03]">
                <td className="py-3 px-6 text-accent-400 font-bold">4. Signups Completed</td>
                {VARIANTS.map((v) => (
                  <td key={v} className="py-3 px-4 text-center font-mono font-extrabold text-accent-400 text-sm">
                    {stats[v]?.signupsCompleted || 0}
                  </td>
                ))}
              </tr>

              {/* Row: Visitor to Signup Rate */}
              <tr className="bg-accent-500/[0.03]">
                <td className="py-3 px-6 text-gray-300 font-semibold">Visitor-to-Signup Rate</td>
                {VARIANTS.map((v) => (
                  <td key={v} className="py-3 px-4 text-center text-accent-300 font-mono font-bold">
                    {stats[v]?.visitorToSignup || "0.0"}%
                  </td>
                ))}
              </tr>

              {/* Row: Verified Users */}
              <tr>
                <td className="py-3 px-6 text-gray-300 font-semibold">5. Verified Users</td>
                {VARIANTS.map((v) => (
                  <td key={v} className="py-3 px-4 text-center font-mono text-white">
                    {stats[v]?.verifiedUsers || 0}
                  </td>
                ))}
              </tr>

              {/* Row: First Tool Usage (Activation) */}
              <tr>
                <td className="py-3 px-6 text-gray-300 font-semibold">6. First Tool Usage (Active)</td>
                {VARIANTS.map((v) => (
                  <td key={v} className="py-3 px-4 text-center font-mono text-emerald-400 font-bold">
                    {stats[v]?.firstToolUsage || 0}
                  </td>
                ))}
              </tr>

              {/* Row: Pro Upgrades */}
              <tr>
                <td className="py-3 px-6 text-gray-300 font-semibold">7. Pro Upgrade Clicks</td>
                {VARIANTS.map((v) => (
                  <td key={v} className="py-3 px-4 text-center font-mono text-purple-400">
                    {stats[v]?.proUpgrades || 0}
                  </td>
                ))}
              </tr>

              {/* Row: Paid Subscriptions */}
              <tr className="bg-emerald-500/[0.04]">
                <td className="py-3.5 px-6 text-emerald-400 font-black">8. Paid Subscriptions</td>
                {VARIANTS.map((v) => (
                  <td key={v} className="py-3.5 px-4 text-center font-mono font-black text-emerald-400 text-base">
                    {stats[v]?.paidSubscriptions || 0}
                  </td>
                ))}
              </tr>

              {/* Row: Visitor to Paid Rate */}
              <tr className="bg-emerald-500/[0.04]">
                <td className="py-3 px-6 text-gray-300 font-semibold">Visitor-to-Paid Rate</td>
                {VARIANTS.map((v) => (
                  <td key={v} className="py-3 px-4 text-center text-emerald-300 font-mono font-bold">
                    {stats[v]?.visitorToPaid || "0.0"}%
                  </td>
                ))}
              </tr>

              {/* Row: Revenue Per Visitor */}
              <tr>
                <td className="py-3 px-6 text-gray-300 font-semibold">Revenue Per Visitor (RPV)</td>
                {VARIANTS.map((v) => (
                  <td key={v} className="py-3 px-4 text-center font-mono text-white font-bold">
                    ${stats[v]?.revenuePerVisitor || "0.00"}
                  </td>
                ))}
              </tr>

              {/* Row: Lift vs Variant A */}
              <tr className="bg-white/[0.02]">
                <td className="py-3.5 px-6 text-white font-bold">Lift vs Control (Variant A)</td>
                {VARIANTS.map((v) => {
                  const lift = stats[v]?.lift || "0.0%";
                  const isPositive = lift.startsWith("+");
                  const isControl = v === "A";
                  return (
                    <td key={v} className="py-3.5 px-4 text-center font-mono font-bold">
                      {isControl ? (
                        <span className="text-gray-400 text-xs">Baseline</span>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-xs ${
                            isPositive
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-red-500/20 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                          <span>{lift}</span>
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Row: Statistical Confidence */}
              <tr className="bg-white/[0.01]">
                <td className="py-3.5 px-6 text-gray-400 font-medium">Statistical Confidence</td>
                {VARIANTS.map((v) => (
                  <td key={v} className="py-3.5 px-4 text-center">
                    <span className="text-[10px] font-mono text-gray-400 block max-w-[130px] mx-auto leading-tight">
                      {stats[v]?.confidence}
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* EXPERIMENT DECISION PROTOCOL (Section 7 from Brief) */}
      <div className="bg-gradient-to-r from-dark-900 to-dark-950 border border-white/10 rounded-2xl p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-accent-500/10 text-accent-400 rounded-xl border border-accent-500/20">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 className="text-base font-bold text-white font-[Outfit]">
              Experiment Evaluation Protocol &amp; Quality Priority Order
            </h4>
            <p className="text-xs text-gray-300 mt-1 leading-relaxed">
              Per test guidelines, the winning variant is not determined solely by raw signups. The priority order for identifying the true winner is:
            </p>
            <ol className="mt-3 grid sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
              <li className="bg-white/5 border border-white/5 rounded-xl p-3">
                <span className="text-accent-400 font-bold block mb-1">Priority 1</span>
                <span className="text-white font-medium">Visitor-to-Signup</span>
                <p className="text-[10px] text-gray-400 mt-1">Measures hook &amp; value resonance</p>
              </li>
              <li className="bg-white/5 border border-white/5 rounded-xl p-3">
                <span className="text-accent-400 font-bold block mb-1">Priority 2</span>
                <span className="text-white font-medium">Signup-to-Verified</span>
                <p className="text-[10px] text-gray-400 mt-1">Filters out bot &amp; fake emails</p>
              </li>
              <li className="bg-white/5 border border-white/5 rounded-xl p-3">
                <span className="text-accent-400 font-bold block mb-1">Priority 3</span>
                <span className="text-white font-medium">Verified-to-First-Tool</span>
                <p className="text-[10px] text-gray-400 mt-1">High-intent makers using tools</p>
              </li>
              <li className="bg-white/5 border border-white/5 rounded-xl p-3">
                <span className="text-accent-400 font-bold block mb-1">Priority 4</span>
                <span className="text-white font-medium">Visitor-to-Paid Pro</span>
                <p className="text-[10px] text-gray-400 mt-1">Bottom-line paying conversion</p>
              </li>
              <li className="bg-white/5 border border-white/5 rounded-xl p-3">
                <span className="text-accent-400 font-bold block mb-1">Priority 5</span>
                <span className="text-white font-medium">Revenue Per Visitor</span>
                <p className="text-[10px] text-gray-400 mt-1">Net commercial return per click</p>
              </li>
            </ol>
            <div className="mt-4 flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3.5 py-2 rounded-xl">
              <AlertTriangle size={15} />
              <span>
                <strong>Statistical Guardrail:</strong> Do not declare a winner prematurely. Collect a minimum of 100 visitors and 20 conversions per variant before shifting traffic.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

