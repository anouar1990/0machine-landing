"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import {
  Send,
  Plus,
  Search,
  Filter,
  Eye,
  MousePointer,
  Calendar,
  MoreVertical,
  CheckCircle2,
  Clock,
  Sparkles,
  Tag
} from "lucide-react";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setCampaigns(data);
      }
    } catch (err) {
      console.error("Error fetching campaigns:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white font-[Outfit]">Campaigns</h1>
          <p className="text-sm text-gray-400 mt-1">
            Create, schedule, and deliver marketing emails to 0machine users.
          </p>
        </div>
        <Link
          href="/email/campaigns/new"
          className="bg-[#FE7733] hover:bg-[#ff8547] text-white font-semibold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-[#FE7733]/20"
        >
          <Plus size={16} />
          <span>New Campaign</span>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#13151F] border border-white/10 p-4 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#FE7733]"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={14} className="text-gray-400 ml-2" />
          <span className="text-xs text-gray-400 font-mono">Status:</span>
          {["all", "draft", "scheduled", "sending", "sent"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase border transition-all ${
                statusFilter === st
                  ? "bg-[#FE7733]/15 border-[#FE7733]/40 text-white"
                  : "border-transparent text-gray-400 hover:text-gray-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Campaigns Table / List */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading campaigns...</div>
      ) : filteredCampaigns.length === 0 ? (
        <div className="text-center py-16 bg-[#13151F] border border-dashed border-white/10 rounded-2xl p-8">
          <Send size={32} className="text-gray-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No campaigns found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1 mb-6">
            Get started by launching a product launch announcement, promotional discount offer, or newsletter.
          </p>
          <Link
            href="/email/campaigns/new"
            className="bg-[#FE7733] text-white text-xs font-semibold px-4 py-2.5 rounded-xl inline-flex items-center gap-2"
          >
            <Plus size={14} />
            <span>Create Campaign</span>
          </Link>
        </div>
      ) : (
        <div className="bg-[#13151F] border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-white/[0.02] border-b border-white/5 uppercase text-[10px] text-gray-500 font-mono tracking-wider">
              <tr>
                <th className="py-3.5 px-6">Campaign Name</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Recipients</th>
                <th className="py-3.5 px-4 text-right">Open Rate</th>
                <th className="py-3.5 px-4 text-right">Click Rate</th>
                <th className="py-3.5 px-6 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCampaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 font-semibold text-white">
                    <div>{camp.name}</div>
                    <div className="text-[11px] text-gray-400 font-normal">{camp.subject}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-md text-[10px] uppercase font-mono text-gray-300">
                      {camp.type.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                      camp.status === "sent" ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400" :
                      camp.status === "sending" ? "bg-amber-500/15 border-amber-500/30 text-amber-400" :
                      camp.status === "scheduled" ? "bg-blue-500/15 border-blue-500/30 text-blue-400" :
                      "bg-gray-500/15 border-gray-500/30 text-gray-400"
                    }`}>
                      {camp.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right font-mono text-white">
                    {camp.sent_count || 0}
                  </td>
                  <td className="py-4 px-4 text-right font-mono text-purple-400">
                    {camp.sent_count > 0 ? `${((camp.open_count / camp.sent_count) * 100).toFixed(1)}%` : "0.0%"}
                  </td>
                  <td className="py-4 px-4 text-right font-mono text-emerald-400">
                    {camp.sent_count > 0 ? `${((camp.click_count / camp.sent_count) * 100).toFixed(1)}%` : "0.0%"}
                  </td>
                  <td className="py-4 px-6 text-right font-mono text-gray-400">
                    {new Date(camp.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
