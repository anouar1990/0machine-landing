"use client";
import { useState } from "react";
import { Send, ShieldCheck, Zap, Sliders } from "lucide-react";

export default function SendingConfigPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white font-[Outfit]">Sending & Rate Limit Configuration</h2>
        <p className="text-xs text-gray-400">Configure global rate limits, primary/fallback routing rules, and queue batch sizes.</p>
      </div>

      <div className="bg-[#13151F] border border-white/10 p-6 rounded-2xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-3">
            <h3 className="text-sm font-bold text-white font-[Outfit] flex items-center gap-2">
              <Zap size={16} className="text-[#FE7733]" />
              <span>Marketing Emails Purpose</span>
            </h3>
            <div className="text-xs text-gray-400 space-y-1 font-mono">
              <div><strong className="text-gray-300">Primary Provider:</strong> <span className="text-[#FE7733]">Amazon SES (Default Primary)</span></div>
              <div><strong className="text-gray-300">Fallback Provider:</strong> <span className="text-purple-400">Resend API (Fallback)</span></div>
              <div><strong className="text-gray-300">Rate Awareness:</strong> <span className="text-emerald-400">14 emails/sec max</span></div>
            </div>
          </div>

          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-3">
            <h3 className="text-sm font-bold text-white font-[Outfit] flex items-center gap-2">
              <ShieldCheck size={16} className="text-blue-400" />
              <span>Transactional Receipts Purpose</span>
            </h3>
            <div className="text-xs text-gray-400 space-y-1 font-mono">
              <div><strong className="text-gray-300">Primary Provider:</strong> <span className="text-blue-400">Amazon SES</span></div>
              <div><strong className="text-gray-300">Fallback Provider:</strong> <span className="text-purple-400">Resend API</span></div>
              <div><strong className="text-gray-300">Delivery SLA:</strong> <span className="text-emerald-400">Instant (&lt; 2.5s)</span></div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs rounded-xl flex items-center gap-3 font-mono">
          <Sliders size={18} className="shrink-0" />
          <span>Fallback routing activates automatically when the primary provider encounters network timeouts, rate limits, or 5xx server errors. Permanent recipient errors (suppressions/unsubscribes) never trigger fallback sending.</span>
        </div>
      </div>
    </div>
  );
}
