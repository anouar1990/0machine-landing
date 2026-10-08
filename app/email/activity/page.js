"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Activity, Clock, ShieldCheck } from "lucide-react";

export default function ActivityPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    const { data } = await supabase.from("email_activity_logs").select("*").order("created_at", { ascending: false });
    if (data) setLogs(data);
    setLoading(false);
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-3xl font-black text-white font-[Outfit]">System Activity Log</h1>
        <p className="text-sm text-gray-400 mt-1">Audit log of campaigns, workflows, settings changes, and real email dispatches.</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading audit log...</div>
      ) : logs.length === 0 ? (
        <div className="text-center py-12 text-gray-500 font-mono text-xs bg-[#13151F] border border-white/10 rounded-2xl">
          No audit entries recorded yet.
        </div>
      ) : (
        <div className="bg-[#13151F] border border-white/10 rounded-2xl p-6 space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex items-start justify-between gap-4 text-xs">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-[#FE7733] bg-[#FE7733]/10 px-2 py-0.5 rounded border border-[#FE7733]/20">
                  {log.action}
                </span>
                <p className="text-white font-medium mt-2">{log.description}</p>
              </div>
              <div className="text-[11px] text-gray-500 font-mono shrink-0">
                {new Date(log.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
