"use client";
import { useState, useEffect, useRef } from "react";
import {
  Code,
  Eye,
  Layout,
  Monitor,
  Smartphone,
  Tablet,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Plus,
  Wand2,
  RotateCcw,
  Copy,
  Info
} from "lucide-react";

export default function EmailDesignStudio({
  htmlContent,
  onChange,
  templates = [],
  onSelectTemplate,
  subject = "",
  onSubjectChange
}) {
  const [activeTab, setActiveTab] = useState("code"); // 'visual' | 'code' | 'preview'
  const [viewport, setViewport] = useState("desktop"); // 'desktop' | 'tablet' | 'mobile'
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [selectedTemplateToLoad, setSelectedTemplateToLoad] = useState(null);

  // Validation warnings state
  const [validations, setValidations] = useState([]);

  // Debounced Preview HTML
  const [previewHtml, setPreviewHtml] = useState(htmlContent);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPreviewHtml(htmlContent);
      runValidationChecks(htmlContent);
    }, 250);
    return () => clearTimeout(timer);
  }, [htmlContent]);

  const runValidationChecks = (html) => {
    const warnings = [];
    if (!html || html.trim().length === 0) {
      warnings.push({ type: "error", message: "Email HTML content is empty." });
      setValidations(warnings);
      return;
    }

    // Check for unsubscribe link
    if (!html.toLowerCase().includes("unsubscribe") && !html.toLowerCase().includes("{{unsubscribe_url}}")) {
      warnings.push({
        type: "warning",
        message: "Missing marketing unsubscribe link (required for CAN-SPAM compliance)."
      });
    }

    // Check for fixed-width layouts > 640px
    if (/width\s*:\s*([7-9]\d{2}|[1-9]\d{3})px/i.test(html)) {
      warnings.push({
        type: "warning",
        message: "Contains fixed width > 600px. May cause horizontal scrolling on mobile."
      });
    }

    // Check images missing max-width or alt tags
    if (/<img(?![^>]*style="[^"]*max-width)[^>]*>/i.test(html)) {
      warnings.push({
        type: "info",
        message: "Some images may be missing 'max-width: 100%' styling for fluid scaling."
      });
    }

    if (/<img(?![^>]*alt=)[^>]*>/i.test(html)) {
      warnings.push({
        type: "info",
        message: "Some images are missing descriptive 'alt' attribute text for screen readers."
      });
    }

    // Check for viewport meta tag
    if (!html.toLowerCase().includes("viewport")) {
      warnings.push({
        type: "info",
        message: "Recommend adding '<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">'."
      });
    }

    setValidations(warnings);
  };

  const handleTemplateClick = (tmpl) => {
    if (htmlContent && htmlContent.trim() !== tmpl.body_html.trim()) {
      setSelectedTemplateToLoad(tmpl);
      setResetModalOpen(true);
    } else {
      onSelectTemplate(tmpl);
    }
  };

  const confirmLoadTemplate = () => {
    if (selectedTemplateToLoad) {
      onSelectTemplate(selectedTemplateToLoad);
      setSelectedTemplateToLoad(null);
    }
    setResetModalOpen(false);
  };

  const handleInsertBlock = (snippet) => {
    onChange(htmlContent + "\n" + snippet);
  };

  const formatHtml = () => {
    let formatted = htmlContent
      .replace(/></g, ">\n<")
      .replace(/(<[^\/][^>]*>)/g, "$1")
      .trim();
    onChange(formatted);
  };

  // Helper for line numbers
  const lineNumbers = htmlContent ? htmlContent.split("\n").map((_, i) => i + 1) : [1];

  return (
    <div className="bg-[#13151F] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col min-h-[640px]">
      {/* Studio Top Control Bar */}
      <div className="bg-[#0A0C12] border-b border-white/10 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Workspace Mode Tabs */}
        <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("code")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "code" ? "bg-[#FE7733] text-white shadow-md" : "text-gray-400 hover:text-white"
            }`}
          >
            <Code size={14} />
            <span>HTML Code</span>
          </button>

          <button
            onClick={() => setActiveTab("visual")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "visual" ? "bg-[#FE7733] text-white shadow-md" : "text-gray-400 hover:text-white"
            }`}
          >
            <Layout size={14} />
            <span>Visual Blocks</span>
          </button>

          <button
            onClick={() => setActiveTab("preview")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "preview" ? "bg-[#FE7733] text-white shadow-md" : "text-gray-400 hover:text-white"
            }`}
          >
            <Eye size={14} />
            <span>Live Preview</span>
          </button>
        </div>

        {/* Viewport Width Controls */}
        <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-xl">
          <button
            onClick={() => setViewport("desktop")}
            className={`p-2 rounded-lg text-xs transition-colors ${
              viewport === "desktop" ? "bg-white/20 text-white font-bold" : "text-gray-400 hover:text-white"
            }`}
            title="Desktop Viewport (600px)"
          >
            <Monitor size={16} />
          </button>
          <button
            onClick={() => setViewport("tablet")}
            className={`p-2 rounded-lg text-xs transition-colors ${
              viewport === "tablet" ? "bg-white/20 text-white font-bold" : "text-gray-400 hover:text-white"
            }`}
            title="Tablet Viewport (520px)"
          >
            <Tablet size={16} />
          </button>
          <button
            onClick={() => setViewport("mobile")}
            className={`p-2 rounded-lg text-xs transition-colors ${
              viewport === "mobile" ? "bg-white/20 text-white font-bold" : "text-gray-400 hover:text-white"
            }`}
            title="Mobile Viewport (375px)"
          >
            <Smartphone size={16} />
          </button>
        </div>

        {/* Format Action Toolbar */}
        <div className="flex items-center gap-2">
          <button
            onClick={formatHtml}
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5"
            title="Format HTML code spacing"
          >
            <Wand2 size={13} className="text-[#FE7733]" />
            <span>Format HTML</span>
          </button>
        </div>
      </div>

      {/* Template Selector Bar */}
      {templates && templates.length > 0 && (
        <div className="bg-[#13151F] border-b border-white/5 px-4 py-3 overflow-x-auto flex items-center gap-2 scrollbar-thin">
          <span className="text-[10px] font-bold uppercase text-gray-500 font-mono shrink-0 mr-2">Templates:</span>
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => handleTemplateClick(t)}
              className="bg-white/5 hover:bg-[#FE7733]/15 border border-white/10 hover:border-[#FE7733]/40 text-xs font-semibold text-gray-300 hover:text-white px-3 py-1 rounded-lg shrink-0 transition-all"
            >
              {t.name}
            </button>
          ))}
        </div>
      )}

      {/* Split WorkArea Workspace */}
      <div className="flex-1 flex flex-col md:flex-row min-h-[520px] overflow-hidden">
        {/* Left Panel: Code / Visual Editor */}
        <div className={`flex-1 flex flex-col border-b md:border-b-0 md:border-r border-white/10 ${
          activeTab === "preview" ? "hidden md:flex" : "flex"
        }`}>
          {activeTab === "code" && (
            <div className="flex-1 flex bg-[#0A0C12] font-mono text-xs overflow-hidden relative">
              {/* Line Numbers */}
              <div className="w-12 bg-black/40 border-r border-white/5 py-4 text-right pr-3 select-none text-gray-600 font-mono text-[11px] leading-6">
                {lineNumbers.map((num) => (
                  <div key={num}>{num}</div>
                ))}
              </div>

              {/* Code Textarea */}
              <textarea
                value={htmlContent}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 bg-transparent p-4 text-gray-100 font-mono text-xs leading-6 resize-none focus:outline-none scrollbar-thin overflow-y-auto"
                placeholder="<!-- Write or paste email HTML markup here -->"
                spellCheck={false}
              />
            </div>
          )}

          {activeTab === "visual" && (
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              <h4 className="text-sm font-bold text-white font-[Outfit]">Visual Block Quick-Inserter</h4>
              <p className="text-xs text-gray-400">Click any block component to insert responsive email markup into your template.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => handleInsertBlock(`
<div style="background: #FE7733; color: white; padding: 14px 28px; text-align: center; border-radius: 10px; font-weight: bold; margin: 20px 0;">
  <a href="https://app.0machine.com" style="color: white; text-decoration: none;">Action Button CTA →</a>
</div>`)}
                  className="p-4 bg-white/5 border border-white/10 hover:border-[#FE7733] rounded-xl text-left hover:bg-white/10 transition-all"
                >
                  <span className="text-xs font-bold text-white block">🔘 Primary CTA Button</span>
                  <span className="text-[10px] text-gray-400 mt-1 block">Glowing orange action button with link</span>
                </button>

                <button
                  onClick={() => handleInsertBlock(`
<div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 20px; margin: 20px 0;">
  <h3 style="color: #FE7733; margin-top: 0;">Highlight Card</h3>
  <p style="color: #94A3B8; font-size: 14px; line-height: 1.6;">Card content describing features or special announcements.</p>
</div>`)}
                  className="p-4 bg-white/5 border border-white/10 hover:border-[#FE7733] rounded-xl text-left hover:bg-white/10 transition-all"
                >
                  <span className="text-xs font-bold text-white block">📦 Highlight Card Box</span>
                  <span className="text-[10px] text-gray-400 mt-1 block">Dark card block with border radius</span>
                </button>

                <button
                  onClick={() => handleInsertBlock(`
<div style="text-align: center; padding: 24px 0; border-top: 1px solid rgba(255,255,255,0.1); border-bottom: 1px solid rgba(255,255,255,0.1); margin: 24px 0;">
  <h2 style="color: #ffffff; font-size: 22px;">Header Title Section</h2>
</div>`)}
                  className="p-4 bg-white/5 border border-white/10 hover:border-[#FE7733] rounded-xl text-left hover:bg-white/10 transition-all"
                >
                  <span className="text-xs font-bold text-white block">📰 Header Section</span>
                  <span className="text-[10px] text-gray-400 mt-1 block">Centered title section with borders</span>
                </button>

                <button
                  onClick={() => handleInsertBlock(`
<div style="text-align: center; font-size: 12px; color: #64748B; margin-top: 32px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.08);">
  0machine Marketing · <a href="{{unsubscribe_url}}" style="color: #FE7733;">Unsubscribe</a>
</div>`)}
                  className="p-4 bg-white/5 border border-white/10 hover:border-[#FE7733] rounded-xl text-left hover:bg-white/10 transition-all"
                >
                  <span className="text-xs font-bold text-white block">🔕 Unsubscribe Footer</span>
                  <span className="text-[10px] text-gray-400 mt-1 block">Compliant footer with unsubscribe tag</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel: Live Sandboxed Iframe Preview */}
        <div className={`flex-1 bg-[#0A0C12] p-4 flex flex-col items-center justify-start overflow-y-auto ${
          activeTab === "code" || activeTab === "visual" ? "hidden md:flex" : "flex"
        }`}>
          {/* Iframe Viewport Wrapper */}
          <div
            className="transition-all duration-300 bg-white rounded-xl shadow-2xl overflow-hidden my-auto max-w-full flex flex-col"
            style={{
              width: viewport === "mobile" ? "375px" : viewport === "tablet" ? "520px" : "640px",
              height: "560px"
            }}
          >
            {/* Viewport Device Top Header */}
            <div className="bg-gray-100 border-b px-4 py-2 flex items-center justify-between text-[11px] text-gray-600 font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
              </div>
              <span>{viewport === "mobile" ? "375px (Mobile)" : viewport === "tablet" ? "520px (Tablet)" : "640px (Desktop Email)"}</span>
            </div>

            {/* Sandboxed Iframe */}
            <iframe
              title="Live Email Preview"
              srcDoc={previewHtml}
              sandbox="allow-popups allow-popups-to-escape-sandbox"
              className="w-full flex-1 border-none bg-white"
            />
          </div>
        </div>
      </div>

      {/* HTML Quality & Validation Checklist Panel */}
      {validations.length > 0 && (
        <div className="bg-[#0A0C12] border-t border-white/10 p-4 space-y-2">
          <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Sparkles size={13} className="text-[#FE7733]" />
            <span>Email Quality Inspector ({validations.length})</span>
          </h5>
          <div className="flex flex-wrap gap-2 text-xs">
            {validations.map((v, idx) => (
              <div
                key={idx}
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 ${
                  v.type === "warning" ? "bg-amber-500/10 border-amber-500/20 text-amber-300" :
                  v.type === "error" ? "bg-red-500/10 border-red-500/20 text-red-300" :
                  "bg-blue-500/10 border-blue-500/20 text-blue-300"
                }`}
              >
                <AlertTriangle size={13} />
                <span>{v.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Template Reset Confirmation Modal */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#13151F] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-white font-[Outfit]">Replace Custom HTML Edits?</h3>
            <p className="text-xs text-gray-400">
              Loading template <strong>{selectedTemplateToLoad?.name}</strong> will overwrite your current unsaved HTML modifications.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setResetModalOpen(false)} className="px-4 py-2 bg-white/5 text-gray-300 text-xs rounded-xl">Keep Edits</button>
              <button onClick={confirmLoadTemplate} className="px-5 py-2 bg-[#FE7733] text-white text-xs font-semibold rounded-xl">Replace HTML</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
