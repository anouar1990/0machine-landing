"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Layers, Plus, Filter, Users, Sparkles } from "lucide-react";

export default function SegmentsPage() {
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSegments();
  }, []);

  const fetchSegments = async () => {
    setLoading(true);
    const { data } = await supabase.from("segments").select("*").order("created_at", { ascending: false });
    if (data) setSegments(data);
    setLoading(false);
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white font-[Outfit]">Dynamic Segments</h1>
          <p className="text-sm text-gray-400 mt-1">Target specific 0machine user groups based on plan, product usage, or activity.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {segments.map((seg) => (
          <div key={seg.id} className="bg-[#13151F] border border-white/10 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-[#FE7733]/15 border border-[#FE7733]/30 text-[#FE7733]">
                {seg.is_system ? "System Segment" : "Custom Segment"}
              </span>
              <Users size={16} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-white font-[Outfit]">{seg.name}</h3>
            <p className="text-xs text-gray-400">{seg.description || "Dynamic audience rule"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
