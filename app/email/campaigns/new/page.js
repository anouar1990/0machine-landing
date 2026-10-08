"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";
import EmailDesignStudio from "../../components/EmailDesignStudio";
import {
  ArrowLeft,
  Check,
  Send,
  Users,
  FileText,
  Eye,
  Mail,
  Sparkles,
  Calendar,
  Clock,
  AlertCircle
} from "lucide-react";

export default function NewCampaignWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [testSuccess, setTestSuccess] = useState("");

  const [segments, setSegments] = useState([]);
  const [templates, setTemplates] = useState([]);

  // Campaign Form State
  const [form, setForm] = useState({
    name: "",
    subject: "",
    type: "announcement", // announcement, newsletter, educational, promotional_offer, product_launch, re_engagement
    segment_id: "",
    template_id: "",
    html_content: "<h1>Hello {{first_name}}</h1><p>Welcome to 0machine updates.</p>",
    promotional_details: {
      offer_name: "",
      discount: "20% OFF",
      audience: "Free Users",
      expiration: "",
      cta: "Claim Discount",
      landing_url: "https://app.0machine.com/pricing"
    }
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    const { data: segs } = await supabase.from("segments").select("*");
    const { data: tmpls } = await supabase.from("templates").select("*");
    if (segs) setSegments(segs);
    if (tmpls) setTemplates(tmpls);
  };

  const handleSelectTemplate = (tId) => {
    const selected = templates.find((t) => t.id === tId);
    if (selected) {
      setForm((prev) => ({
        ...prev,
        template_id: tId,
        subject: selected.subject || prev.subject,
        html_content: selected.body_html || prev.html_content
      }));
    }
  };

  const handleSendTestEmail = async () => {
    if (!testEmail) {
      alert("Please enter a test email address.");
      return;
    }
    setSendingTest(true);
    setTestSuccess("");
    try {
      const res = await fetch("/api/campaigns/send-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: testEmail,
          subject: `[TEST] ${form.subject}`,
          html: form.html_content
        })
      });
      if (res.ok) {
        setTestSuccess(`✅ Test email sent to ${testEmail}`);
      } else {
        alert("Test send failed. Please check Resend/SES API settings.");
      }
    } catch (err) {
      alert(`Error sending test: ${err.message}`);
    } finally {
      setSendingTest(false);
    }
  };

  const handleCreateAndSend = async (status = "sent") => {
    if (!form.name || !form.subject) {
      alert("Campaign name and subject are required.");
      return;
    }
    setLoading(true);
    try {
      const initialStatus = status === "sent" ? "draft" : status;
      const { data, error } = await supabase
        .from("campaigns")
        .insert([{
          name: form.name,
          subject: form.subject,
          type: form.type,
          status: initialStatus,
          segment_id: form.segment_id || null,
          template_id: form.template_id || null,
          html_content: form.html_content,
          promotional_details: form.type === "promotional_offer" ? form.promotional_details : null,
          sent_count: 0
        }])
        .select()
        .single();

      if (error) throw error;

      if (status === "sent") {
        // Enqueue campaign for bulk background processing
        const res = await fetch("/api/campaigns/enqueue", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ campaign_id: data.id })
        });
        const enqueueData = await res.json();
        if (!res.ok) {
          alert(`Queueing error: ${enqueueData.error}`);
        } else {
          router.push(`/email/campaigns/${data.id}`);
          return;
        }
      }

      router.push("/email/campaigns");
    } catch (err) {
      alert(`Error creating campaign: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      {/* Back button */}
      <Link href="/email/campaigns" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors">
        <ArrowLeft size={14} />
        <span>Back to Campaigns</span>
      </Link>

      <div className="border-b border-white/5 pb-6">
        <h1 className="text-3xl font-black text-white font-[Outfit]">Create Campaign</h1>
        <p className="text-sm text-gray-400 mt-1">Design and broadcast emails to your 0machine maker audience.</p>
      </div>

      {/* Steps Indicator */}
      <div className="grid grid-cols-4 gap-2 border-b border-white/5 pb-4 font-mono text-xs">
        {[
          { num: 1, title: "1. Details" },
          { num: 2, title: "2. Audience" },
          { num: 3, title: "3. Design" },
          { num: 4, title: "4. Review & Send" }
        ].map((s) => (
          <button
            key={s.num}
            onClick={() => setStep(s.num)}
            className={`py-2 px-3 rounded-xl border text-left flex items-center gap-2 transition-all ${
              step === s.num
                ? "bg-[#FE7733]/15 border-[#FE7733]/40 text-white font-bold"
                : step > s.num
                ? "bg-white/5 border-white/10 text-emerald-400"
                : "border-transparent text-gray-500"
            }`}
          >
            {step > s.num ? <Check size={14} /> : <span>{s.num}.</span>}
            <span>{s.title}</span>
          </button>
        ))}
      </div>

      {/* STEP 1: Campaign Details */}
      {step === 1 && (
        <div className="bg-[#13151F] border border-white/10 p-6 rounded-2xl space-y-6">
          <h3 className="text-lg font-bold text-white font-[Outfit]">Campaign Information</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1 font-medium">Campaign Name</label>
              <input
                type="text"
                placeholder="e.g. October 2026 Laser Nesting Feature Release"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FE7733]"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1 font-medium">Email Subject Line</label>
              <input
                type="text"
                placeholder="e.g. 🧩 Save 35% acrylic sheet material with 0machine Nesting"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FE7733]"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1 font-medium">Campaign Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full bg-[#13151F] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FE7733]"
              >
                <option value="announcement">Announcement</option>
                <option value="newsletter">Newsletter</option>
                <option value="educational">Educational</option>
                <option value="promotional_offer">Promotional Offer</option>
                <option value="product_launch">Product Launch</option>
                <option value="re_engagement">Re-engagement</option>
              </select>
            </div>

            {/* Promotional Offer Fields */}
            {form.type === "promotional_offer" && (
              <div className="p-4 bg-[#FE7733]/5 border border-[#FE7733]/20 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-[#FE7733] uppercase tracking-wider font-mono">Promotional Offer Details</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Offer Name</label>
                    <input
                      type="text"
                      placeholder="Pro Upgrade 20% OFF"
                      value={form.promotional_details.offer_name}
                      onChange={(e) => setForm({ ...form, promotional_details: { ...form.promotional_details, offer_name: e.target.value } })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Discount Amount</label>
                    <input
                      type="text"
                      placeholder="20% OFF"
                      value={form.promotional_details.discount}
                      onChange={(e) => setForm({ ...form, promotional_details: { ...form.promotional_details, discount: e.target.value } })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(2)}
              className="bg-[#FE7733] text-white text-xs font-semibold px-6 py-2.5 rounded-xl"
            >
              Next: Select Audience →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Audience Selection */}
      {step === 2 && (
        <div className="bg-[#13151F] border border-white/10 p-6 rounded-2xl space-y-6">
          <h3 className="text-lg font-bold text-white font-[Outfit]">Select Audience Segment</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setForm({ ...form, segment_id: "" })}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                !form.segment_id ? "bg-[#FE7733]/15 border-[#FE7733]" : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              <h4 className="text-sm font-bold text-white">All Contacts (12,483)</h4>
              <p className="text-xs text-gray-400 mt-1">Broadcast to all active subscribers and registered 0machine users.</p>
            </div>

            {segments.map((seg) => (
              <div
                key={seg.id}
                onClick={() => setForm({ ...form, segment_id: seg.id })}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  form.segment_id === seg.id ? "bg-[#FE7733]/15 border-[#FE7733]" : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                <h4 className="text-sm font-bold text-white">{seg.name}</h4>
                <p className="text-xs text-gray-400 mt-1">{seg.description || "Dynamic audience segment"}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button onClick={() => setStep(1)} className="bg-white/5 text-gray-300 text-xs px-5 py-2.5 rounded-xl">← Back</button>
            <button onClick={() => setStep(3)} className="bg-[#FE7733] text-white text-xs font-semibold px-6 py-2.5 rounded-xl">Next: Email Content →</button>
          </div>
        </div>
      )}

      {/* STEP 3: Template & HTML Content - Upgraded Email Design Studio */}
      {step === 3 && (
        <div className="space-y-6">
          <EmailDesignStudio
            htmlContent={form.html_content}
            onChange={(newHtml) => setForm({ ...form, html_content: newHtml })}
            templates={templates}
            onSelectTemplate={(tmpl) => handleSelectTemplate(tmpl.id)}
            subject={form.subject}
            onSubjectChange={(newSubject) => setForm({ ...form, subject: newSubject })}
          />

          <div className="flex justify-between pt-4">
            <button onClick={() => setStep(2)} className="bg-white/5 text-gray-300 text-xs px-5 py-2.5 rounded-xl">← Back</button>
            <button onClick={() => setStep(4)} className="bg-[#FE7733] text-white text-xs font-semibold px-6 py-2.5 rounded-xl">Next: Review & Send →</button>
          </div>
        </div>
      )}

      {/* STEP 4: Review, Send Test & Launch */}
      {step === 4 && (
        <div className="bg-[#13151F] border border-white/10 p-6 rounded-2xl space-y-6">
          <h3 className="text-lg font-bold text-white font-[Outfit]">Review & Launch Campaign</h3>

          {/* Summary Box */}
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-2 text-xs">
            <div><strong className="text-gray-400">Campaign Name:</strong> <span className="text-white font-semibold">{form.name}</span></div>
            <div><strong className="text-gray-400">Subject:</strong> <span className="text-white font-semibold">{form.subject}</span></div>
            <div><strong className="text-gray-400">Campaign Type:</strong> <span className="text-white uppercase font-mono">{form.type}</span></div>
            <div><strong className="text-gray-400">Audience:</strong> <span className="text-emerald-400 font-semibold">{form.segment_id ? "Dynamic Segment" : "All Contacts (12,483)"}</span></div>
          </div>

          {/* Test Email Send */}
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <Mail size={14} className="text-[#FE7733]" />
              <span>Send Test Email</span>
            </h4>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="anouar@0machine.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="flex-1 bg-[#0A0C12] border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
              />
              <button
                onClick={handleSendTestEmail}
                disabled={sendingTest}
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-xl"
              >
                {sendingTest ? "Sending..." : "Send Test"}
              </button>
            </div>
            {testSuccess && <p className="text-xs text-emerald-400 font-medium">{testSuccess}</p>}
          </div>

          <div className="flex justify-between pt-6 border-t border-white/5">
            <button onClick={() => setStep(3)} className="bg-white/5 text-gray-300 text-xs px-5 py-2.5 rounded-xl">← Back</button>
            <div className="flex gap-3">
              <button
                onClick={() => handleCreateAndSend("draft")}
                disabled={loading}
                className="bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-semibold px-5 py-2.5 rounded-xl"
              >
                Save Draft
              </button>
              <button
                onClick={() => handleCreateAndSend("sent")}
                disabled={loading}
                className="bg-[#FE7733] hover:bg-[#ff8547] text-white text-xs font-semibold px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-[#FE7733]/20"
              >
                <Send size={14} />
                <span>{loading ? "Sending..." : "Schedule & Broadcast Campaign"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
