"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import {
  GitFork,
  Plus,
  Play,
  Pause,
  CheckCircle2,
  Clock,
  Zap,
  MoreVertical,
  Layers,
  Sparkles
} from "lucide-react";

export default function AutomationsListPage() {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("workflows")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setWorkflows(data);
      }
    } catch (err) {
      console.error("Error fetching workflows:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleWorkflowStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    try {
      await supabase
        .from("workflows")
        .update({ status: newStatus })
        .eq("id", id);

      setWorkflows(workflows.map(w => w.id === id ? { ...w, status: newStatus } : w));
    } catch (err) {
      alert(`Error updating workflow: ${err.message}`);
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white font-[Outfit]">Automations</h1>
          <p className="text-sm text-gray-400 mt-1">
            Visual workflow automation engine triggered by 0machine product events & marketing signals.
          </p>
        </div>
        <Link
          href="/email/automations/new"
          className="bg-[#FE7733] hover:bg-[#ff8547] text-white font-semibold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-[#FE7733]/20"
        >
          <Plus size={16} />
          <span>New Visual Workflow</span>
        </Link>
      </div>

      {/* Workflows List Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading workflows...</div>
      ) : workflows.length === 0 ? (
        <div className="text-center py-16 bg-[#13151F] border border-dashed border-white/10 rounded-2xl p-8">
          <GitFork size={32} className="text-gray-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No automated workflows found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1 mb-6">
            Click "Install 0machine Growth Flows" in the sidebar or build a custom workflow trigger.
          </p>
          <Link
            href="/email/automations/new"
            className="bg-[#FE7733] text-white text-xs font-semibold px-4 py-2.5 rounded-xl inline-flex items-center gap-2"
          >
            <Plus size={14} />
            <span>Create Visual Workflow</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflows.map((flow) => (
            <div key={flow.id} className="bg-[#13151F] border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-[#FE7733]/40 transition-all group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${
                    flow.trigger_type === 'event' ? 'bg-blue-500/15 border-blue-500/30 text-blue-400' : 'bg-purple-500/15 border-purple-500/30 text-purple-400'
                  }`}>
                    {flow.trigger_type} trigger
                  </span>

                  <button
                    onClick={() => toggleWorkflowStatus(flow.id, flow.status)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border flex items-center gap-1.5 transition-all ${
                      flow.status === 'active' ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25' : 'bg-gray-500/15 border-gray-500/30 text-gray-400 hover:bg-gray-500/25'
                    }`}
                  >
                    {flow.status === 'active' ? <Play size={10} className="fill-current" /> : <Pause size={10} />}
                    <span>{flow.status}</span>
                  </button>
                </div>

                <h3 className="text-base font-bold text-white font-[Outfit] group-hover:text-[#FE7733] transition-colors">
                  {flow.name}
                </h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                  {flow.description || "Automated email sequence workflow"}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                <div className="text-[11px] text-gray-500 font-mono">
                  Trigger: <span className="text-gray-300">{flow.trigger_event || flow.trigger_type}</span>
                </div>
                <Link
                  href={`/email/automations/${flow.id}`}
                  className="text-xs text-[#FE7733] font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Edit Flow</span>
                  <Zap size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
