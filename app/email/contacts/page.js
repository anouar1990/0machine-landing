"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import {
  Users,
  Plus,
  Upload,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Tag,
  Calendar,
  Sparkles,
  FileSpreadsheet,
  AlertCircle
} from "lucide-react";

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [planFilter, setPlanFilter] = useState("all");

  // CSV Importer state
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [csvText, setCsvText] = useState("");
  const [importSummary, setImportSummary] = useState(null);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setContacts(data);
      }
    } catch (err) {
      console.error("Error fetching contacts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessCsv = async () => {
    if (!csvText.trim()) return;
    setImporting(true);
    setImportSummary(null);

    const lines = csvText.trim().split("\n");
    let processed = 0;
    let imported = 0;
    let updated = 0;
    let duplicates = 0;
    let invalid = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || i === 0 && line.toLowerCase().includes("email")) continue; // skip header
      processed++;

      const parts = line.split(",").map(p => p.trim().replace(/^["']|["']$/g, ""));
      const email = parts[0];
      const firstName = parts[1] || "";
      const plan = parts[2] || "free";

      if (!email || !email.includes("@")) {
        invalid++;
        continue;
      }

      // Upsert into Supabase
      const { data: existing } = await supabase.from("contacts").select("id").eq("email", email.toLowerCase()).single();
      if (existing) {
        updated++;
        duplicates++;
      } else {
        imported++;
      }

      await supabase.from("contacts").upsert({
        email: email.toLowerCase(),
        first_name: firstName,
        plan,
        tags: ["csv-imported"],
        updated_at: new Date().toISOString()
      }, { onConflict: "email" });
    }

    setImportSummary({ processed, imported, updated, duplicates, invalid });
    setImporting(false);
    fetchContacts();
  };

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.first_name && c.first_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPlan = planFilter === "all" || c.plan === planFilter;
    return matchesSearch && matchesPlan;
  });

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white font-[Outfit]">Contacts & Product Activity</h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage 0machine makers, dynamic tags, product event activity, and CSV imports.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setImportModalOpen(true)}
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all"
          >
            <Upload size={16} />
            <span>Import CSV</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#13151F] border border-white/10 p-4 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search email or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#FE7733]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-gray-400" />
          <span className="text-xs text-gray-400 font-mono">Plan:</span>
          {["all", "free", "pro"].map((p) => (
            <button
              key={p}
              onClick={() => setPlanFilter(p)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase border transition-all ${
                planFilter === p ? "bg-[#FE7733]/15 border-[#FE7733]/40 text-white" : "border-transparent text-gray-400"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Contacts Table */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading contacts...</div>
      ) : (
        <div className="bg-[#13151F] border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-white/[0.02] border-b border-white/5 uppercase text-[10px] text-gray-500 font-mono tracking-wider">
              <tr>
                <th className="py-3.5 px-6">Contact / Email</th>
                <th className="py-3.5 px-4">Plan</th>
                <th className="py-3.5 px-4">Tags</th>
                <th className="py-3.5 px-6">0machine Product Events</th>
                <th className="py-3.5 px-4 text-right">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredContacts.map((c) => (
                <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 font-semibold text-white">
                    <div>{c.first_name ? `${c.first_name} ${c.last_name || ""}` : c.email.split("@")[0]}</div>
                    <div className="text-[11px] text-gray-400 font-normal">{c.email}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                      c.plan === "pro" ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400" : "bg-gray-500/15 border-gray-500/30 text-gray-400"
                    }`}>
                      {c.plan || "free"}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {(c.tags || ["free-user"]).map((t, idx) => (
                        <span key={idx} className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[10px] font-mono text-gray-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 size={12} /> Signed Up</span>
                      <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 size={12} /> Verified</span>
                      <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 size={12} /> Used Calculator</span>
                      <span className={c.plan === 'pro' ? 'text-emerald-400 flex items-center gap-1' : 'text-gray-600 flex items-center gap-1'}>
                        {c.plan === 'pro' ? <CheckCircle2 size={12} /> : <XCircle size={12} />} Upgraded
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right font-mono text-gray-400">
                    {new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CSV Import Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#13151F] border border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-base font-bold text-white font-[Outfit] flex items-center gap-2">
                <FileSpreadsheet size={18} className="text-[#FE7733]" />
                <span>Import CSV Contacts</span>
              </h3>
              <button onClick={() => setImportModalOpen(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-gray-400">Paste raw CSV data formatted as: <code>email, first_name, plan</code></p>

            <textarea
              rows={6}
              placeholder="email,first_name,plan&#10;john@example.com,John,free&#10;sarah@example.com,Sarah,pro"
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              className="w-full bg-[#0A0C12] border border-white/10 rounded-xl p-3 font-mono text-xs text-white focus:outline-none focus:border-[#FE7733]"
            />

            {importSummary && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl font-mono space-y-1">
                <div>Processed: {importSummary.processed}</div>
                <div>Imported New: {importSummary.imported}</div>
                <div>Updated Duplicates: {importSummary.updated}</div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setImportModalOpen(false)} className="px-4 py-2 bg-white/5 text-gray-300 text-xs rounded-xl">Close</button>
              <button
                onClick={handleProcessCsv}
                disabled={importing}
                className="px-5 py-2 bg-[#FE7733] text-white text-xs font-semibold rounded-xl"
              >
                {importing ? "Processing..." : "Process & Import CSV"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
