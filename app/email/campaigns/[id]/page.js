"use client";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";
import {
  ArrowLeft,
  Play,
  Pause,
  XCircle,
  RefreshCw,
  Send,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  UserX,
  Zap
} from "lucide-react";

export default function CampaignQueueMonitoringPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const campaignId = params.id;

  const [campaign, setCampaign] = useState(null);
  const [queueStats, setQueueStats] = useState({
    total: 0,
    pending: 0,
    claimed: 0,
    sent: 0,
    failed: 0,
    suppressed: 0,
    retrying: 0,
    cancelled: 0
  });
  const [queueItems, setQueueItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchCampaignDetails();
    const interval = setInterval(fetchCampaignDetails, 4000); // refresh every 4s
    return () => clearInterval(interval);
  }, [campaignId]);

  const fetchCampaignDetails = async () => {
    try {
      // 1. Fetch Campaign Record
      const { data: camp } = await supabase
        .from("campaigns")
        .select("*")
        .eq("id", campaignId)
        .single();

      if (camp) setCampaign(camp);

      // 2. Fetch Queue Stats
      const { data: queueRecords } = await supabase
        .from("campaign_queue")
        .select("id, status, email, attempt_count, next_attempt_at, last_error, updated_at")
        .eq("campaign_id", campaignId)
        .order("updated_at", { ascending: false });

      if (queueRecords) {
        setQueueItems(queueRecords.slice(0, 50)); // display top 50 recent

        const stats = {
          total: queueRecords.length,
          pending: queueRecords.filter(r => r.status === "pending").length,
          claimed: queueRecords.filter(r => r.status === "claimed").length,
          sent: queueRecords.filter(r => r.status === "sent").length,
          failed: queueRecords.filter(r => r.status === "failed").length,
          suppressed: queueRecords.filter(r => r.status === "suppressed").length,
          retrying: queueRecords.filter(r => r.status === "retrying").length,
          cancelled: queueRecords.filter(r => r.status === "cancelled").length
        };
        setQueueStats(stats);
      }
    } catch (err) {
      console.error("Error fetching campaign queue details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleControlAction = async (action) => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/campaigns/control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaign_id: campaignId, action })
      });
      const data = await res.json();
      if (res.ok) {
        fetchCampaignDetails();
      } else {
        alert(`Action failed: ${data.error}`);
      }
    } catch (err) {
      alert(`Error executing action: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleTriggerWorker = async () => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/campaigns/process-queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaign_id: campaignId })
      });
      const data = await res.json();
      alert(`Worker batch processed! Sent: ${data.sentCount}, Retrying: ${data.retryingCount}, Failed: ${data.failedCount}`);
      fetchCampaignDetails();
    } catch (err) {
      alert(`Error triggering worker: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-gray-400">Loading campaign queue metrics...</div>;
  }

  if (!campaign) {
    return (
      <div className="p-10 text-center space-y-4">
        <p className="text-white font-bold">Campaign not found.</p>
        <Link href="/email/campaigns" className="text-xs text-[#FE7733]">← Back to Campaigns</Link>
      </div>
    );
  }

  const completionPct = queueStats.total > 0
    ? (((queueStats.sent + queueStats.failed + queueStats.suppressed + queueStats.cancelled) / queueStats.total) * 100).toFixed(1)
    : 0;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* Back button */}
      <Link href="/email/campaigns" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors">
        <ArrowLeft size={14} />
        <span>Back to Campaigns</span>
      </Link>

      {/* Header & Control Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-white font-[Outfit]">{campaign.name}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${
              campaign.status === "sending" ? "bg-amber-500/15 border-amber-500/30 text-amber-400" :
              campaign.status === "sent" ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400" :
              campaign.status === "paused" ? "bg-purple-500/15 border-purple-500/30 text-purple-400" :
              "bg-gray-500/15 border-gray-500/30 text-gray-400"
            }`}>
              {campaign.status}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">Subject: {campaign.subject}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {campaign.status === "sending" && (
            <button
              onClick={() => handleControlAction("pause")}
              disabled={actionLoading}
              className="bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5"
            >
              <Pause size={14} />
              <span>Pause Sending</span>
            </button>
          )}

          {campaign.status === "paused" && (
            <button
              onClick={() => handleControlAction("resume")}
              disabled={actionLoading}
              className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5"
            >
              <Play size={14} className="fill-current" />
              <span>Resume Sending</span>
            </button>
          )}

          {campaign.status !== "cancelled" && campaign.status !== "sent" && (
            <button
              onClick={() => handleControlAction("cancel")}
              disabled={actionLoading}
              className="bg-red-500/15 border border-red-500/30 text-red-400 font-semibold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5"
            >
              <XCircle size={14} />
              <span>Cancel Campaign</span>
            </button>
          )}

          <button
            onClick={handleTriggerWorker}
            disabled={actionLoading}
            className="bg-[#FE7733] hover:bg-[#ff8547] text-white font-semibold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 shadow-md shadow-[#FE7733]/20"
          >
            <Zap size={14} />
            <span>Process Worker Batch</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-[#13151F] border border-white/10 p-6 rounded-2xl space-y-3">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-gray-400">Delivery Progress: <strong className="text-white">{queueStats.sent} / {queueStats.total} Sent</strong></span>
          <span className="text-[#FE7733] font-bold">{completionPct}% Complete</span>
        </div>
        <div className="w-full bg-white/5 h-3.5 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-[#FE7733] to-amber-400 h-full transition-all rounded-full" style={{ width: `${completionPct}%` }} />
        </div>
      </div>

      {/* Queue Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-7 gap-3 font-mono text-xs">
        <div className="bg-[#13151F] border border-white/10 p-4 rounded-xl">
          <span className="text-gray-500 text-[10px] uppercase block">Total Queued</span>
          <span className="text-xl font-bold text-white mt-1 block">{queueStats.total}</span>
        </div>
        <div className="bg-[#13151F] border border-white/10 p-4 rounded-xl">
          <span className="text-gray-500 text-[10px] uppercase block">Pending</span>
          <span className="text-xl font-bold text-gray-300 mt-1 block">{queueStats.pending}</span>
        </div>
        <div className="bg-[#13151F] border border-white/10 p-4 rounded-xl">
          <span className="text-gray-500 text-[10px] uppercase block">Claimed</span>
          <span className="text-xl font-bold text-amber-400 mt-1 block">{queueStats.claimed}</span>
        </div>
        <div className="bg-[#13151F] border border-white/10 p-4 rounded-xl">
          <span className="text-gray-500 text-[10px] uppercase block">Sent / Accepted</span>
          <span className="text-xl font-bold text-emerald-400 mt-1 block">{queueStats.sent}</span>
        </div>
        <div className="bg-[#13151F] border border-white/10 p-4 rounded-xl">
          <span className="text-gray-500 text-[10px] uppercase block">Retrying</span>
          <span className="text-xl font-bold text-purple-400 mt-1 block">{queueStats.retrying}</span>
        </div>
        <div className="bg-[#13151F] border border-white/10 p-4 rounded-xl">
          <span className="text-gray-500 text-[10px] uppercase block">Suppressed</span>
          <span className="text-xl font-bold text-blue-400 mt-1 block">{queueStats.suppressed}</span>
        </div>
        <div className="bg-[#13151F] border border-white/10 p-4 rounded-xl">
          <span className="text-gray-500 text-[10px] uppercase block">Failed</span>
          <span className="text-xl font-bold text-red-400 mt-1 block">{queueStats.failed}</span>
        </div>
      </div>

      {/* Recipient Delivery Table */}
      <div className="bg-[#13151F] border border-white/10 rounded-2xl overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h3 className="text-base font-bold text-white font-[Outfit]">Recipient Delivery Records</h3>
          <span className="text-xs text-gray-500 font-mono">Showing top 50 recent</span>
        </div>

        {queueItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-xs font-mono">No recipient queue items.</div>
        ) : (
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-white/[0.02] border-b border-white/5 uppercase text-[10px] text-gray-500 font-mono">
              <tr>
                <th className="py-3 px-4">Recipient Email</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 font-right">Attempts</th>
                <th className="py-3 px-4">Provider Message ID / Error</th>
                <th className="py-3 px-4 text-right">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {queueItems.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02]">
                  <td className="py-3 px-4 font-semibold text-white font-mono">{item.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                      item.status === "sent" ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400" :
                      item.status === "claimed" ? "bg-amber-500/15 border-amber-500/30 text-amber-400" :
                      item.status === "retrying" ? "bg-purple-500/15 border-purple-500/30 text-purple-400" :
                      item.status === "suppressed" ? "bg-blue-500/15 border-blue-500/30 text-blue-400" :
                      item.status === "failed" ? "bg-red-500/15 border-red-500/30 text-red-400" :
                      "bg-gray-500/15 border-gray-500/30 text-gray-400"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-gray-400">{item.attempt_count || 0}</td>
                  <td className="py-3 px-4 font-mono text-xs">
                    {item.provider_message_id ? (
                      <span className="text-emerald-400">{item.provider_message_id}</span>
                    ) : item.last_error ? (
                      <span className="text-red-400">{item.last_error}</span>
                    ) : (
                      <span className="text-gray-600">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-gray-500">
                    {new Date(item.updated_at).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
