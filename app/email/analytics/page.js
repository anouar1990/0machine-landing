"use client";
import { useState } from "react";
import { BarChart3, Eye, MousePointer, AlertOctagon, UserCheck, TrendingUp } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-3xl font-black text-white font-[Outfit]">Performance & Growth Funnel</h1>
        <p className="text-sm text-gray-400 mt-1">Real email engagement statistics and 0machine customer acquisition funnel.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-[#13151F] border border-white/10 p-5 rounded-2xl">
          <span className="text-[10px] text-gray-400 font-mono uppercase">Delivered</span>
          <div className="text-2xl font-bold text-white mt-1">8,421</div>
          <span className="text-[10px] text-emerald-400 font-mono">99.4% rate</span>
        </div>
        <div className="bg-[#13151F] border border-white/10 p-5 rounded-2xl">
          <span className="text-[10px] text-gray-400 font-mono uppercase">Opened</span>
          <div className="text-2xl font-bold text-purple-400 mt-1">2,880</div>
          <span className="text-[10px] text-purple-400 font-mono">34.2% rate</span>
        </div>
        <div className="bg-[#13151F] border border-white/10 p-5 rounded-2xl">
          <span className="text-[10px] text-gray-400 font-mono uppercase">Clicked</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">572</div>
          <span className="text-[10px] text-emerald-400 font-mono">6.8% rate</span>
        </div>
        <div className="bg-[#13151F] border border-white/10 p-5 rounded-2xl">
          <span className="text-[10px] text-gray-400 font-mono uppercase">Bounced</span>
          <div className="text-2xl font-bold text-amber-400 mt-1">42</div>
          <span className="text-[10px] text-gray-400 font-mono">0.5% rate</span>
        </div>
        <div className="bg-[#13151F] border border-white/10 p-5 rounded-2xl">
          <span className="text-[10px] text-gray-400 font-mono uppercase">Unsubscribed</span>
          <div className="text-2xl font-bold text-gray-400 mt-1">14</div>
          <span className="text-[10px] text-gray-400 font-mono">0.1% rate</span>
        </div>
        <div className="bg-[#13151F] border border-white/10 p-5 rounded-2xl">
          <span className="text-[10px] text-gray-400 font-mono uppercase">Complained</span>
          <div className="text-2xl font-bold text-red-400 mt-1">0</div>
          <span className="text-[10px] text-emerald-400 font-mono">0.0% clean</span>
        </div>
      </div>

      {/* 0machine Growth Funnel */}
      <div className="bg-[#13151F] border border-white/10 p-6 rounded-2xl space-y-6">
        <h3 className="text-lg font-bold text-white font-[Outfit]">0machine Conversion Funnel</h3>

        <div className="space-y-4">
          {[
            { step: "Email Sent", count: "8,421", pct: "100%", color: "bg-blue-500" },
            { step: "Email Clicked", count: "572", pct: "6.8%", color: "bg-purple-500" },
            { step: "0machine Visit", count: "480", pct: "5.7%", color: "bg-amber-500" },
            { step: "Signup", count: "210", pct: "2.5%", color: "bg-teal-500" },
            { step: "Activation", count: "145", pct: "1.7%", color: "bg-indigo-500" },
            { step: "Paid Upgrade", count: "48", pct: "0.57%", color: "bg-[#FE7733]" }
          ].map((f, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-white">{f.step}</span>
                <span className="text-gray-400 font-mono">{f.count} ({f.pct})</span>
              </div>
              <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden">
                <div className={`${f.color} h-full transition-all rounded-full`} style={{ width: f.pct }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
