"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { UserX, ShieldAlert, Plus, Trash2 } from "lucide-react";

export default function SuppressionSettingsPage() {
  const [suppressions, setSuppressions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const [reason, setReason] = useState("unsubscribed");

  useEffect(() => {
    fetchSuppressions();
  }, []);

  const fetchSuppressions = async () => {
    setLoading(true);
    const { data } = await supabase.from("suppressions").select("*").order("created_at", { ascending: false });
    if (data) setSuppressions(data);
    setLoading(false);
  };

  const handleAddSuppression = async (e) => {
    e.preventDefault();
    if (!newEmail || !newEmail.includes("@")) return;

    try {
      await supabase.from("suppressions").insert([{
        email: newEmail.toLowerCase().trim(),
        reason,
        source: "admin_manual"
      }]);
      setNewEmail("");
      fetchSuppressions();
    } catch (err) {
      alert(`Error adding suppression: ${err.message}`);
    }
  };

  const handleRemoveSuppression = async (id) => {
    if (!confirm("Are you sure you want to unblock this email address?")) return;
    try {
      await supabase.from("suppressions").delete().eq("id", id);
      fetchSuppressions();
    } catch (err) {
      alert(`Error removing suppression: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white font-[Outfit]">Suppression List & Deliverability Protection</h2>
        <p className="text-xs text-gray-400">Contacts on this list are permanently blocked from all marketing email dispatches across all providers.</p>
      </div>

      {/* Manual Add Form */}
      <form onSubmit={handleAddSuppression} className="bg-[#13151F] border border-white/10 p-4 rounded-2xl flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          placeholder="Block email address (e.g. user@example.com)"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="flex-1 bg-[#0A0C12] border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
          required
        />
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="bg-[#0A0C12] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
        >
          <option value="unsubscribed">Unsubscribed</option>
          <option value="bounced">Hard Bounce</option>
          <option value="complained">Spam Complaint</option>
        </select>
        <button type="submit" className="bg-[#FE7733] text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center justify-center gap-1.5">
          <Plus size={14} />
          <span>Add to Suppression List</span>
        </button>
      </form>

      {/* List */}
      <div className="bg-[#13151F] border border-white/10 rounded-2xl p-6 space-y-4">
        {loading ? (
          <div className="text-center py-8 text-gray-400 text-xs font-mono">Loading suppression records...</div>
        ) : suppressions.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-xs font-mono">
            No suppressed contacts. Deliverability status clean.
          </div>
        ) : (
          <div className="space-y-2">
            {suppressions.map((s) => (
              <div key={s.id} className="p-3.5 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <UserX size={16} className="text-red-400" />
                  <div>
                    <span className="font-semibold text-white block">{s.email}</span>
                    <span className="text-[10px] text-gray-500 font-mono">Added: {new Date(s.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-400">
                    {s.reason}
                  </span>
                  <button onClick={() => handleRemoveSuppression(s.id)} className="p-1.5 text-gray-400 hover:text-white rounded-lg">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
