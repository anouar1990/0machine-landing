"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, RefreshCw, Sparkles, ShieldCheck, AlertCircle, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ParticleField from "../components/ParticleField";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState("verifying"); // 'verifying' | 'activated' | 'timeout' | 'error'
  const [message, setMessage] = useState("Payment successful! Activating your Pro account...");
  const [elapsed, setElapsed] = useState(0);

  const appDashboardUrl = process.env.NEXT_PUBLIC_APP_URL || "https://app.0machine.com";

  useEffect(() => {
    if (!sessionId) {
      setStatus("timeout");
      setMessage("No session ID found. Redirecting to dashboard...");
      setTimeout(() => {
        if (typeof window !== "undefined") window.location.href = appDashboardUrl;
      }, 3000);
      return;
    }

    let isMounted = true;
    let pollCount = 0;
    const maxPolls = 15; // 15 polls * 2s = 30 seconds max timeout

    const checkSession = async () => {
      try {
        const res = await fetch(`/api/verify-session?session_id=${encodeURIComponent(sessionId)}`);
        const data = await res.json();

        if (data.isPro) {
          if (isMounted) {
            setStatus("activated");
            setMessage("🎉 Pro Account Activated! Redirecting to your dashboard...");
            setTimeout(() => {
              if (typeof window !== "undefined") window.location.href = appDashboardUrl;
            }, 1500);
          }
          return true;
        }
      } catch (err) {
        console.warn("Session verification check error:", err);
      }
      return false;
    };

    // Initial check
    checkSession();

    // Poll every 2 seconds
    const interval = setInterval(async () => {
      pollCount++;
      setElapsed(pollCount * 2);

      const isSuccess = await checkSession();
      if (isSuccess || pollCount >= maxPolls) {
        clearInterval(interval);
        if (!isSuccess && isMounted) {
          setStatus("timeout");
          setMessage("Your payment was received. Please refresh the page or contact support.");
        }
      }
    }, 2000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [sessionId, appDashboardUrl]);

  return (
    <div className="bg-dark-900 border border-white/10 rounded-3xl p-8 sm:p-12 max-w-xl w-full text-center shadow-2xl backdrop-blur-xl relative z-10">
      
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-accent-500/10 rounded-3xl blur-3xl -z-10 scale-90" />

      {status === "verifying" && (
        <div className="space-y-6">
          <div className="w-20 h-20 rounded-2xl bg-accent-500/20 border border-accent-500/30 flex items-center justify-center mx-auto text-accent-400">
            <RefreshCw className="animate-spin text-accent-400" size={36} />
          </div>
          <div>
            <span className="text-xs font-bold text-accent-400 uppercase tracking-widest bg-accent-500/10 px-3 py-1 rounded-full border border-accent-500/20">
              Activating Pro Status
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-[Outfit] mt-4">
              Payment Successful!
            </h1>
            <p className="text-gray-300 text-sm mt-2 font-medium">{message}</p>
          </div>

          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span>Verifying Stripe Session</span>
              <span className="text-accent-400 font-mono">{elapsed}s / 30s</span>
            </div>
            <div className="w-full bg-dark-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-accent-500 h-full transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(100, (elapsed / 30) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {status === "activated" && (
        <div className="space-y-6 animate-fade-in">
          <div className="w-20 h-20 rounded-2xl bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto text-green-400">
            <CheckCircle2 size={42} />
          </div>
          <div>
            <span className="text-xs font-bold text-green-400 uppercase tracking-widest bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
              Account Upgraded
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-[Outfit] mt-4">
              Welcome to 0Machine Pro!
            </h1>
            <p className="text-gray-300 text-sm mt-2 font-medium">{message}</p>
          </div>

          <a
            href={appDashboardUrl}
            className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-accent-500/20"
          >
            <span>Go to Workshop Dashboard</span>
            <ArrowRight size={18} />
          </a>
        </div>
      )}

      {status === "timeout" && (
        <div className="space-y-6">
          <div className="w-20 h-20 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <AlertCircle size={40} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white font-[Outfit]">Payment Received</h1>
            <p className="text-gray-300 text-sm mt-2">{message}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={() => typeof window !== "undefined" && window.location.reload()}
              className="bg-white/10 hover:bg-white/15 text-white font-semibold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2"
            >
              <RefreshCw size={14} />
              <span>Refresh Page</span>
            </button>
            <a
              href={appDashboardUrl}
              className="bg-accent-500 hover:bg-accent-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2"
            >
              <span>Open App Dashboard</span>
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      )}

      <div className="mt-8 border-t border-white/5 pt-6 flex items-center justify-center gap-2 text-[11px] text-gray-500">
        <ShieldCheck size={14} className="text-green-400" />
        <span>SSL Encrypted Checkout · Instant Pro Activation</span>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <>
      <ParticleField />
      <Navbar />
      <main className="min-h-screen pt-32 pb-24 relative z-10 flex items-center justify-center px-6">
        <Suspense fallback={<div className="text-white">Loading verification...</div>}>
          <SuccessContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
