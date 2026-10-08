"use client";
import { useState, useEffect } from "react";
import {
  Server,
  Plus,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Send,
  Trash2,
  Edit,
  Star,
  ShieldCheck,
  Zap,
  Check,
  X
} from "lucide-react";

export default function ProvidersSettingsPage() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testingId, setTestingId] = useState(null);
  const [testResults, setTestResults] = useState({});

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  const [sendTestModalOpen, setSendTestModalOpen] = useState(false);
  const [selectedTestProvider, setSelectedTestProvider] = useState(null);
  const [testRecipient, setTestRecipient] = useState("");
  const [sendingTestMail, setSendingTestMail] = useState(false);
  const [testMailResult, setTestMailResult] = useState(null);

  // Provider Form State
  const [form, setForm] = useState({
    name: "",
    provider_type: "aws_ses", // aws_ses, resend, smtp
    from_email: "0machine@cooldelo.com",
    from_name: "0machine Marketing",
    daily_limit: 10000,
    rate_limit: 14,
    is_primary: false,
    is_active: true,
    marketing_enabled: true,
    transactional_enabled: true,
    credentials: {
      region: "us-east-1",
      access_key_id: "",
      secret_access_key: "",
      api_key: "",
      host: "smtp.mailtrap.io",
      port: 587,
      username: "",
      password: "",
      encryption: "tls"
    }
  });

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/providers");
      const data = await res.json();
      if (data.providers) {
        setProviders(data.providers);
      }
    } catch (err) {
      console.error("Error fetching email providers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async (providerId) => {
    setTestingId(providerId);
    setTestResults((prev) => ({ ...prev, [providerId]: null }));
    try {
      const res = await fetch("/api/providers/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider_id: providerId })
      });
      const data = await res.json();
      setTestResults((prev) => ({
        ...prev,
        [providerId]: {
          success: data.success,
          message: data.message || data.error
        }
      }));
      fetchProviders();
    } catch (err) {
      setTestResults((prev) => ({
        ...prev,
        [providerId]: { success: false, message: err.message }
      }));
    } finally {
      setTestingId(null);
    }
  };

  const handleSendTestMail = async () => {
    if (!testRecipient) return;
    setSendingTestMail(true);
    setTestMailResult(null);
    try {
      const res = await fetch("/api/providers/send-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider_id: selectedTestProvider?.id,
          recipient: testRecipient
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTestMailResult({ success: true, message: `✓ Test email sent via ${data.provider}. Message ID: ${data.messageId}` });
      } else {
        setTestMailResult({ success: false, message: `✕ Failed: ${data.error || "Send error"}` });
      }
    } catch (err) {
      setTestMailResult({ success: false, message: `✕ Error: ${err.message}` });
    } finally {
      setSendingTestMail(false);
    }
  };

  const handleSetPrimary = async (providerId) => {
    try {
      await fetch("/api/providers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: providerId, is_primary: true })
      });
      fetchProviders();
    } catch (err) {
      alert(`Error setting primary provider: ${err.message}`);
    }
  };

  const handleToggleActive = async (provider) => {
    try {
      await fetch("/api/providers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: provider.id, is_active: !provider.is_active })
      });
      fetchProviders();
    } catch (err) {
      alert(`Error toggling provider: ${err.message}`);
    }
  };

  const handleDeleteProvider = async (providerId) => {
    if (!confirm("Are you sure you want to delete this email provider?")) return;
    try {
      await fetch(`/api/providers?id=${providerId}`, { method: "DELETE" });
      fetchProviders();
    } catch (err) {
      alert(`Error deleting provider: ${err.message}`);
    }
  };

  const handleSaveProvider = async (e) => {
    e.preventDefault();
    try {
      const method = editingProvider ? "PUT" : "POST";
      const payload = editingProvider ? { id: editingProvider.id, ...form } : form;

      const res = await fetch("/api/providers", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingProvider(null);
        fetchProviders();
      } else {
        const errData = await res.json();
        alert(`Save failed: ${errData.error}`);
      }
    } catch (err) {
      alert(`Error saving provider: ${err.message}`);
    }
  };

  const openAddModal = () => {
    setEditingProvider(null);
    setForm({
      name: "",
      provider_type: "aws_ses",
      from_email: "0machine@cooldelo.com",
      from_name: "0machine Marketing",
      daily_limit: 10000,
      rate_limit: 14,
      is_primary: false,
      is_active: true,
      marketing_enabled: true,
      transactional_enabled: true,
      credentials: {
        region: "us-east-1",
        access_key_id: "",
        secret_access_key: "",
        api_key: "",
        host: "smtp.mailtrap.io",
        port: 587,
        username: "",
        password: "",
        encryption: "tls"
      }
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProvider(p);
    setForm({
      name: p.name,
      provider_type: p.provider_type,
      from_email: p.from_email,
      from_name: p.from_name,
      daily_limit: p.daily_limit,
      rate_limit: p.rate_limit,
      is_primary: p.is_primary,
      is_active: p.is_active,
      marketing_enabled: p.marketing_enabled,
      transactional_enabled: p.transactional_enabled,
      credentials: p.credentials_masked || {}
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white font-[Outfit]">Configured Email Providers</h2>
          <p className="text-xs text-gray-400">Dynamic sending adapters, rate limits, primary routing, and connection validation.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-[#FE7733] hover:bg-[#ff8547] text-white font-semibold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-[#FE7733]/20 cursor-pointer"
        >
          <Plus size={16} />
          <span>+ Add Provider</span>
        </button>
      </div>

      {/* Provider List Cards */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading email providers...</div>
      ) : providers.length === 0 ? (
        <div className="text-center py-12 bg-[#13151F] border border-dashed border-white/10 rounded-2xl p-8">
          <Server size={32} className="text-gray-500 mx-auto mb-2" />
          <p className="text-sm font-bold text-white">No email providers configured</p>
          <button onClick={openAddModal} className="mt-4 bg-[#FE7733] text-white text-xs font-semibold px-4 py-2 rounded-xl">
            Add First Provider
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {providers.map((p) => {
            const result = testResults[p.id];
            return (
              <div
                key={p.id}
                className={`bg-[#13151F] border rounded-2xl p-6 space-y-5 transition-all relative ${
                  p.is_primary ? "border-[#FE7733]/50 shadow-lg shadow-[#FE7733]/5" : "border-white/10 hover:border-white/20"
                }`}
              >
                {/* Provider Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white font-[Outfit]">{p.name}</h3>
                      {p.is_primary && (
                        <span className="bg-[#FE7733]/15 border border-[#FE7733]/40 text-[#FE7733] text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Star size={10} className="fill-current" /> Primary
                        </span>
                      )}
                      {!p.is_primary && (
                        <span className="bg-gray-500/15 border border-gray-500/30 text-gray-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                          Fallback
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 uppercase font-mono block mt-0.5">
                      Type: <strong className="text-white">{p.provider_type.replace("_", " ")}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(p)}
                      className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
                      title="Edit Configuration"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteProvider(p.id)}
                      className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-white/5"
                      title="Delete Provider"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Configuration Specs Grid */}
                <div className="grid grid-cols-2 gap-3 bg-white/[0.02] border border-white/5 p-3 rounded-xl text-xs font-mono">
                  <div>
                    <span className="text-gray-500 block text-[10px]">Sender Email</span>
                    <span className="text-white truncate block font-medium">{p.from_email}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">Rate Limit</span>
                    <span className="text-emerald-400 font-medium">{p.rate_limit} req/sec</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">Daily Limit</span>
                    <span className="text-gray-200 font-medium">{p.daily_limit.toLocaleString()} / day</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">Capabilities</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {p.marketing_enabled && <span className="bg-purple-500/15 text-purple-300 text-[9px] px-1.5 py-0.2 rounded">MKT</span>}
                      {p.transactional_enabled && <span className="bg-blue-500/15 text-blue-300 text-[9px] px-1.5 py-0.2 rounded">TXN</span>}
                    </div>
                  </div>
                </div>

                {/* Connection Test Result */}
                {result && (
                  <div className={`p-3 rounded-xl text-xs font-mono flex items-center gap-2 ${
                    result.success ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300" : "bg-red-500/15 border border-red-500/30 text-red-300"
                  }`}>
                    {result.success ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                    <span>{result.message}</span>
                  </div>
                )}

                {/* Action Toolbar */}
                <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleTestConnection(p.id)}
                      disabled={testingId === p.id}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-1.5 px-3 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RefreshCw size={12} className={testingId === p.id ? "animate-spin text-[#FE7733]" : ""} />
                      <span>{testingId === p.id ? "Testing..." : "Test Connection"}</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedTestProvider(p);
                        setSendTestModalOpen(true);
                      }}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white py-1.5 px-3 rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <Send size={12} />
                      <span>Send Test Email</span>
                    </button>
                  </div>

                  {!p.is_primary && (
                    <button
                      onClick={() => handleSetPrimary(p.id)}
                      className="text-[11px] text-[#FE7733] font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>Set as Primary</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Provider Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#13151F] border border-white/10 rounded-2xl max-w-xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="text-lg font-bold text-white font-[Outfit]">
                {editingProvider ? "Edit Email Provider" : "Add Email Provider"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProvider} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 mb-1 font-semibold">Provider Name</label>
                <input
                  type="text"
                  placeholder="e.g. AWS SES Production Primary"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#FE7733]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Provider Type</label>
                  <select
                    value={form.provider_type}
                    onChange={(e) => setForm({ ...form, provider_type: e.target.value })}
                    className="w-full bg-[#0A0C12] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#FE7733]"
                  >
                    <option value="aws_ses">Amazon SES</option>
                    <option value="resend">Resend API</option>
                    <option value="smtp">Custom SMTP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Sender Email</label>
                  <input
                    type="email"
                    value={form.from_email}
                    onChange={(e) => setForm({ ...form, from_email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white"
                    required
                  />
                </div>
              </div>

              {/* Dynamic Credentials Form depending on type */}
              {form.provider_type === "aws_ses" && (
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-3">
                  <h4 className="font-mono text-[#FE7733] text-[11px] uppercase font-bold">AWS SES Credentials</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-400 mb-1">AWS Region</label>
                      <input
                        type="text"
                        placeholder="us-east-1"
                        value={form.credentials.region || "us-east-1"}
                        onChange={(e) => setForm({ ...form, credentials: { ...form.credentials, region: e.target.value } })}
                        className="w-full bg-[#0A0C12] border border-white/10 rounded-lg px-3 py-1.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1">Access Key ID</label>
                      <input
                        type="text"
                        placeholder="AKIA..."
                        value={form.credentials.access_key_id || ""}
                        onChange={(e) => setForm({ ...form, credentials: { ...form.credentials, access_key_id: e.target.value } })}
                        className="w-full bg-[#0A0C12] border border-white/10 rounded-lg px-3 py-1.5 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Secret Access Key</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={form.credentials.secret_access_key || ""}
                      onChange={(e) => setForm({ ...form, credentials: { ...form.credentials, secret_access_key: e.target.value } })}
                      className="w-full bg-[#0A0C12] border border-white/10 rounded-lg px-3 py-1.5 text-white"
                    />
                  </div>
                </div>
              )}

              {form.provider_type === "resend" && (
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-3">
                  <h4 className="font-mono text-[#FE7733] text-[11px] uppercase font-bold">Resend API Key</h4>
                  <div>
                    <label className="block text-gray-400 mb-1">API Key</label>
                    <input
                      type="password"
                      placeholder="re_..."
                      value={form.credentials.api_key || ""}
                      onChange={(e) => setForm({ ...form, credentials: { ...form.credentials, api_key: e.target.value } })}
                      className="w-full bg-[#0A0C12] border border-white/10 rounded-lg px-3 py-1.5 text-white"
                    />
                  </div>
                </div>
              )}

              {form.provider_type === "smtp" && (
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-3">
                  <h4 className="font-mono text-[#FE7733] text-[11px] uppercase font-bold">SMTP Connection Details</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="block text-gray-400 mb-1">SMTP Host</label>
                      <input
                        type="text"
                        placeholder="smtp.mailtrap.io"
                        value={form.credentials.host || ""}
                        onChange={(e) => setForm({ ...form, credentials: { ...form.credentials, host: e.target.value } })}
                        className="w-full bg-[#0A0C12] border border-white/10 rounded-lg px-3 py-1.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1">Port</label>
                      <input
                        type="number"
                        placeholder="587"
                        value={form.credentials.port || 587}
                        onChange={(e) => setForm({ ...form, credentials: { ...form.credentials, port: e.target.value } })}
                        className="w-full bg-[#0A0C12] border border-white/10 rounded-lg px-3 py-1.5 text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-400 mb-1">Username</label>
                      <input
                        type="text"
                        value={form.credentials.username || ""}
                        onChange={(e) => setForm({ ...form, credentials: { ...form.credentials, username: e.target.value } })}
                        className="w-full bg-[#0A0C12] border border-white/10 rounded-lg px-3 py-1.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1">Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={form.credentials.password || ""}
                        onChange={(e) => setForm({ ...form, credentials: { ...form.credentials, password: e.target.value } })}
                        className="w-full bg-[#0A0C12] border border-white/10 rounded-lg px-3 py-1.5 text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Limits */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Rate Limit (emails/sec)</label>
                  <input
                    type="number"
                    value={form.rate_limit}
                    onChange={(e) => setForm({ ...form, rate_limit: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Daily Sending Limit</label>
                  <input
                    type="number"
                    value={form.daily_limit}
                    onChange={(e) => setForm({ ...form, daily_limit: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_primary}
                    onChange={(e) => setForm({ ...form, is_primary: e.target.checked })}
                    className="rounded text-[#FE7733]"
                  />
                  <span className="text-white font-semibold">Primary Provider</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.marketing_enabled}
                    onChange={(e) => setForm({ ...form, marketing_enabled: e.target.checked })}
                    className="rounded text-[#FE7733]"
                  />
                  <span className="text-white">Marketing Emails</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.transactional_enabled}
                    onChange={(e) => setForm({ ...form, transactional_enabled: e.target.checked })}
                    className="rounded text-[#FE7733]"
                  />
                  <span className="text-white">Transactional</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-white/5 text-gray-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#FE7733] hover:bg-[#ff8547] text-white font-semibold rounded-xl shadow-md"
                >
                  {editingProvider ? "Update Provider" : "Save Provider"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Send Test Email Modal */}
      {sendTestModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#13151F] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-base font-bold text-white font-[Outfit]">
                Send Test Email ({selectedTestProvider?.name})
              </h3>
              <button onClick={() => setSendTestModalOpen(false)} className="text-gray-400 hover:text-white"><X size={18} /></button>
            </div>

            <p className="text-xs text-gray-400">
              Dispatches a real test email via <strong>{selectedTestProvider?.name}</strong> to verify deliverability.
            </p>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Recipient Email Address</label>
              <input
                type="email"
                placeholder="anouarkharbache@gmail.com"
                value={testRecipient}
                onChange={(e) => setTestRecipient(e.target.value)}
                className="w-full bg-[#0A0C12] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white"
              />
            </div>

            {testMailResult && (
              <div className={`p-3 rounded-xl text-xs font-mono ${
                testMailResult.success ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400" : "bg-red-500/15 border border-red-500/30 text-red-400"
              }`}>
                {testMailResult.message}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setSendTestModalOpen(false)} className="px-4 py-2 bg-white/5 text-gray-300 text-xs rounded-xl">Close</button>
              <button
                onClick={handleSendTestMail}
                disabled={sendingTestMail}
                className="px-5 py-2 bg-[#FE7733] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5"
              >
                <Send size={12} />
                <span>{sendingTestMail ? "Sending..." : "Dispatch Test Email"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
