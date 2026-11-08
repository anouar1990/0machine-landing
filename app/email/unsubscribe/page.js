"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, AlertCircle, CheckCircle2, MailX, ArrowLeft } from "lucide-react";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [unsubscribeAll, setUnsubscribeAll] = useState(true);

  useEffect(() => {
    if (!token) {
      setError("Missing unsubscribe token. Please click the unsubscribe link in your email.");
      return;
    }

    try {
      // Decode token payload client-side for immediate email display
      const decoded = atob(token.replace(/-/g, "+").replace(/_/g, "/"));
      const parts = decoded.split("|");
      if (parts.length >= 1 && parts[0].includes("@")) {
        setEmail(parts[0]);
      }
    } catch (e) {
      // Failed client-side decode; server will validate
    }
  }, [token]);

  const handleConfirm = async () => {
    if (!token) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/email/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, unsubscribeAll })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
      } else {
        setError(data.error || "Failed to process unsubscribe request.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-[#13151F] border border-white/10 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl backdrop-blur-2xl">
        <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-400">
          <CheckCircle2 size={28} />
        </div>
        <h1 className="text-2xl font-bold font-[Outfit] text-white mb-2">You Have Been Unsubscribed</h1>
        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
          {email ? <strong className="text-white block font-mono mb-2">{email}</strong> : null}
          You will no longer receive marketing communications from 0machine.
        </p>
        <Link
          href="https://0machine.com"
          className="inline-flex items-center justify-center gap-2 w-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-semibold text-xs py-3 px-4 rounded-xl transition-all"
        >
          <ArrowLeft size={14} />
          <span>Return to 0machine</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#13151F] border border-white/10 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl backdrop-blur-2xl">
      <div className="w-14 h-14 bg-[#FE7733]/10 border border-[#FE7733]/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#FE7733]">
        <MailX size={28} />
      </div>

      <h1 className="text-2xl font-bold font-[Outfit] text-white mb-2">Confirm Unsubscribe</h1>
      
      {email && (
        <div className="inline-block bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs font-mono text-[#FE7733] mb-4">
          {email}
        </div>
      )}

      <p className="text-sm text-gray-400 mb-6 leading-relaxed">
        You are about to unsubscribe from 0machine marketing emails. You will not receive future campaign announcements.
      </p>

      {error && (
        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 flex items-center gap-2 text-left">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-3">
        <label className="flex items-center gap-2 justify-center text-xs text-gray-400 cursor-pointer select-none pb-2">
          <input
            type="checkbox"
            checked={unsubscribeAll}
            onChange={(e) => setUnsubscribeAll(e.target.checked)}
            className="rounded border-white/20 text-[#FE7733] focus:ring-[#FE7733]"
          />
          <span>Unsubscribe from all marketing broadcasts</span>
        </label>

        <button
          onClick={handleConfirm}
          disabled={loading || !token}
          className="w-full bg-[#FE7733] hover:bg-[#ff8547] disabled:opacity-50 text-white font-semibold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#FE7733]/20 cursor-pointer"
        >
          {loading ? "Unsubscribing..." : "Confirm Unsubscribe"}
        </button>

        <Link
          href="https://0machine.com"
          className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-semibold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors block"
        >
          <span>Cancel / Keep Subscription</span>
        </Link>
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <div className="min-h-screen bg-[#0A0C12] text-white flex items-center justify-center p-6">
      <Suspense fallback={<div className="text-gray-400 text-sm">Loading unsubscribe options...</div>}>
        <UnsubscribeContent />
      </Suspense>
    </div>
  );
}
