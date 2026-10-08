"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { FileText, Plus, Eye, Code, Edit } from "lucide-react";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    const { data } = await supabase.from("templates").select("*").order("name", { ascending: true });
    if (data) setTemplates(data);
    setLoading(false);
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white font-[Outfit]">0machine Email Templates</h1>
          <p className="text-sm text-gray-400 mt-1">Pre-styled email designs for onboarding, promotional offers, and product releases.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map((tmpl) => (
          <div key={tmpl.id} className="bg-[#13151F] border border-white/10 p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-[#FE7733]/40 transition-all">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300">
                {tmpl.category}
              </span>
              <h3 className="text-sm font-bold text-white font-[Outfit] mt-2">{tmpl.name}</h3>
              <p className="text-xs text-gray-400 mt-1 line-clamp-2">{tmpl.subject}</p>
            </div>
            <button
              onClick={() => setSelectedTemplate(tmpl)}
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold py-2 rounded-xl flex items-center justify-center gap-1.5"
            >
              <Eye size={14} />
              <span>Preview Template</span>
            </button>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#13151F] border border-white/10 rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h3 className="text-base font-bold text-white font-[Outfit]">{selectedTemplate.name}</h3>
                <p className="text-xs text-gray-400">Subject: {selectedTemplate.subject}</p>
              </div>
              <button onClick={() => setSelectedTemplate(null)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <div
              className="bg-white p-6 rounded-xl text-gray-900 text-sm overflow-hidden"
              dangerouslySetInnerHTML={{ __html: selectedTemplate.body_html }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
