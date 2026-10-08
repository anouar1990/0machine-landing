"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Settings, ShieldCheck, Mail, AlertTriangle, CheckCircle2, UserX } from "lucide-react";

export default function SettingsPage() {
  const [suppressions, setSuppressions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuppressions();
  }, []);

  const fetchSuppressions = async () => {
    setLoading(true);
    const { data } = await supabase.from("suppressions").select("*").order("created_at", { ascending: false });
    if (data) setSuppressions(data);
    setLoading(false);
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-3xl font-black text-white font-[Outfit]">Email & Provider Settings</h1>
        <p className="text-sm text-gray-400 mt-1">Manage Amazon SES configuration, Resend keys, rate limits, and suppression list filtering.</p>
      </div>

      {/* Provider Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Amazon SES Card */}
        <div className="bg-[#13151F] border border-white/10 p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold">
                SES
              </div>
              <h3 className="text-base font-bold text-white font-[Outfit]">Amazon SES (Default)</h3>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
              <CheckCircle2 size={12} /> Active Backend
            </span>
          </div>

          <p className="text-xs text-gray-400">
            Primary high-deliverability email sender for 0machine marketing campaigns, lifecycle automations, and transactional receipts.
          </p>

          <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-1 font-mono text-xs">
            <div className="flex justify-between text-gray-400"><span>Sender Domain:</span> <span className="text-white">0machine.com</span></div>
            <div className="flex justify-between text-gray-400"><span>Sending Quota:</span> <span className="text-emerald-400">50,000 / day</span></div>
            <div className="flex justify-between text-gray-400"><span>Rate Limit:</span> <span className="text-white">14 emails / sec</span></div>
          </div>
        </div>

        {/* Resend API Card */}
        <div className="bg-[#13151F] border border-white/10 p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold">
                RE
              </div>
              <h3 className="text-base font-bold text-white font-[Outfit]">Resend API (Fallback)</h3>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-400">
              Connected
            </span>
          </div>

          <p className="text-xs text-gray-400">
            Secondary API integration for transactional receipts and instant email notifications.
          </p>

          <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-1 font-mono text-xs">
            <div className="flex justify-between text-gray-400"><span>API Key:</span> <span className="text-gray-300">re_LDzxxx6b_***</span></div>
            <div className="flex justify-between text-gray-400"><span>Monthly Limit:</span> <span className="text-white">3,000 emails</span></div>
          </div>
        </div>
      </div>

      {/* Suppression List Section */}
      <div className="bg-[#13151F] border border-white/10 p-6 rounded-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white font-[Outfit]">Suppression List Protection</h3>
            <p className="text-xs text-gray-400">Contacts who unsubscribed, bounced, or complained are automatically blocked from marketing emails.</p>
          </div>
          <span className="text-xs font-mono text-gray-400 bg-white/5 border border-white/10 px-3 py-1 rounded-lg">
            {suppressions.length} Blocked
          </span>
        </div>

        {suppressions.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-xs font-mono">
            No suppressed contacts. All recipient lists are clean.
          </div>
        ) : (
          <div className="space-y-2">
            {suppressions.map((s) => (
              <div key={s.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <UserX size={14} className="text-red-400" />
                  <span className="font-semibold text-white">{s.email}</span>
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-red-500/15 border border-red-500/30 text-red-400">
                  {s.reason}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
