"use client";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ParticleField from "../../components/ParticleField";
import {
  Download,
  Star,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check,
  Zap,
  Sparkles,
  Eye,
  X,
  FileCode,
  Tag,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function DesignsCategoryClient({ categoryData, allCategories }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [downloadNotice, setDownloadNotice] = useState(null);

  const handleDownloadClick = (item) => {
    setDownloadNotice(item.title);
    setTimeout(() => setDownloadNotice(null), 3500);
  };

  return (
    <>
      <ParticleField />
      <Navbar />

      <main className="min-h-screen pt-32 pb-24 relative z-10 bg-[#0e100f] text-gray-300">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#abff84] bg-[#abff84]/10 border border-[#abff84]/20 px-3.5 py-1.5 rounded-full mb-4">
              <Zap size={13} className="text-[#0ae448]" />
              <span>{categoryData.badge}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold font-[Outfit] text-[#fffce1] mb-5 leading-tight">
              {categoryData.heroH1} <br />
              <span className="text-[#fe7733]">{categoryData.heroHighlight}</span>
            </h1>
            <p className="text-[#7c7c6f] text-sm sm:text-base leading-relaxed">
              {categoryData.description}
            </p>
          </div>

          {/* Programmatic Category Switcher Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-14">
            <span className="text-xs font-mono text-[#7c7c6f] uppercase mr-2">Collections:</span>
            {Object.values(allCategories).map((cat) => (
              <Link
                key={cat.slug}
                href={`/designs/${cat.slug}`}
                className={`text-xs px-3.5 py-2 rounded-xl border transition-all font-mono ${
                  cat.slug === categoryData.slug
                    ? "bg-[#fe7733]/15 text-[#fe7733] border-[#fe7733]/60 font-bold"
                    : "bg-[#121311] text-[#7c7c6f] border-[#42433d]/50 hover:text-white hover:border-[#42433d]"
                }`}
              >
                {cat.keyword}
              </Link>
            ))}
          </div>

          {/* Download Notification Banner */}
          {downloadNotice && (
            <div className="mb-8 p-4 bg-[#abff84]/15 border border-[#abff84]/50 rounded-xl text-center font-mono text-xs text-[#abff84] flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2">
              <Check size={16} />
              <span>Sample for "{downloadNotice}" ready. Accessing 300,000+ Master Vault...</span>
            </div>
          )}

          {/* Design Packs Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-20">
            {categoryData.items.map((item) => (
              <div
                key={item.id}
                className="bg-[#121311] border border-[#42433d]/70 hover:border-[#fe7733]/50 rounded-2xl p-6 transition-all group flex flex-col justify-between"
              >
                <div>
                  {/* Image Container with Zoom */}
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-5 bg-[#191919] border border-[#42433d]/40">
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#0e100f]/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 text-[11px] font-mono text-[#abff84]">
                      {item.format}
                    </div>
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="absolute bottom-3 right-3 p-2 bg-[#0e100f]/80 backdrop-blur-md hover:bg-[#fe7733] text-white rounded-lg transition-colors border border-white/10"
                      title="Zoom Preview"
                    >
                      <Eye size={15} />
                    </button>
                  </div>

                  {/* Title & Category */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#fe7733]">
                      {item.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-[#abff84] font-mono">
                      <Star size={12} fill="currentColor" />
                      <span>{item.rating}</span>
                      <span className="text-[#7c7c6f]">({item.downloads})</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold font-[Outfit] text-[#fffce1] mb-3 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#7c7c6f] leading-relaxed mb-4">
                    {item.desc}
                  </p>

                  {/* Technical Specs Tags */}
                  <div className="space-y-2 mb-6 text-xs font-mono">
                    <div className="flex items-center gap-2 text-[#7c7c6f]">
                      <Layers size={13} className="text-[#fe7733]" />
                      <span>Layers: {item.layers}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#7c7c6f]">
                      <Tag size={13} className="text-[#abff84]" />
                      <span>Material: {item.material}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#fffce1]">
                      <DollarSign size={13} className="text-[#0ae448]" />
                      <span className="font-bold">Resale Potential: {item.resalePrice}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-[#42433d]/50 flex items-center gap-3">
                  <Link
                    href="/#pricing"
                    className="flex-1 py-3 px-4 bg-[#fe7733] hover:bg-[#e06526] text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]"
                  >
                    <Download size={14} />
                    <span>Download Cut Files</span>
                  </Link>

                  <button
                    onClick={() => handleDownloadClick(item)}
                    className="py-3 px-4 bg-[#191919] hover:bg-[#232323] text-[#fffce1] border border-[#42433d]/70 text-xs font-mono rounded-xl transition-all"
                  >
                    Sample Info
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Micro-Tool Cross Promotion Bridges */}
          <div className="grid md:grid-cols-2 gap-6 mb-20">
            <div className="bg-[#121311] border border-[#42433d]/70 rounded-2xl p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#abff84] mb-2 block">
                  Free CAD Utility
                </span>
                <h3 className="text-xl font-bold font-[Outfit] text-[#fffce1] mb-2">
                  Need to turn your photo into a DXF cut file?
                </h3>
                <p className="text-xs text-[#7c7c6f] leading-relaxed mb-6">
                  Use our browser-based AutoCAD R12 DXF converter. Converts PNG/JPG into clean closed
                  polylines with millimeter scaling and zero watermarks.
                </p>
              </div>
              <Link
                href="/tools/image-to-dxf"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#abff84] hover:text-white transition-colors"
              >
                <span>Launch Image to DXF Tool</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="bg-[#121311] border border-[#42433d]/70 rounded-2xl p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#fe7733] mb-2 block">
                  Scrap Waste Optimizer
                </span>
                <h3 className="text-xl font-bold font-[Outfit] text-[#fffce1] mb-2">
                  Need to nest these parts onto raw sheets?
                </h3>
                <p className="text-xs text-[#7c7c6f] leading-relaxed mb-6">
                  Stop throwing away offcuts. 0Machine True-Shape Nesting packs parts automatically and
                  drops small elements into hollow holes to save 30% to 40% on sheet materials.
                </p>
              </div>
              <Link
                href="/tools/nesting"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#fe7733] hover:text-white transition-colors"
              >
                <span>Estimate Sheet Yield</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Master Vault CTA Banner */}
          <div className="bg-gradient-to-r from-[#191919] via-[#121311] to-[#191919] border border-[#fe7733]/40 rounded-2xl p-8 sm:p-12 text-center mb-20 relative overflow-hidden">
            <span className="text-xs font-mono uppercase tracking-widest text-[#fe7733] bg-[#fe7733]/10 border border-[#fe7733]/30 px-3.5 py-1.5 rounded-full mb-4 inline-block">
              Full Commercial License Included
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-[Outfit] text-[#fffce1] mb-3">
              Unlock the Entire 300,000+ Laser Designs Vault
            </h2>
            <p className="text-sm text-[#7c7c6f] max-w-xl mx-auto mb-8 leading-relaxed">
              Gain instant lifetime access to 300,000+ commercial laser cutting and CNC vector files across
              50+ categories: jewelry, 3D wall art, puzzles, boxes, furniture, and seasonal decors.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/#pricing"
                className="px-7 py-3.5 bg-[#fe7733] hover:bg-[#e06526] text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-[#fe7733]/20"
              >
                <span>Get Full Vault Access</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/#laser-ai"
                className="px-6 py-3.5 bg-[#191919] hover:bg-[#232323] text-[#fffce1] border border-[#42433d] font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
              >
                <span>Try LaserAI Studio</span>
              </Link>
            </div>
          </div>

          {/* FAQs Section */}
          <div className="max-w-4xl mx-auto space-y-8">
            <h3 className="text-2xl font-bold font-[Outfit] text-[#fffce1]">
              Frequently Asked Questions: {categoryData.title}
            </h3>
            <div className="space-y-4">
              {categoryData.faqs.map((faq, i) => (
                <div key={i} className="bg-[#121311] border border-[#42433d]/60 p-5 sm:p-6 rounded-xl">
                  <h4 className="text-sm font-bold text-[#fffce1] mb-2">{faq.q}</h4>
                  <p className="text-xs text-[#7c7c6f] leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Modal Zoom Preview */}
      {selectedItem && (
        <div
          onClick={() => setSelectedItem(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#121311] border border-[#42433d] rounded-2xl max-w-2xl w-full p-6 relative"
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-2 text-[#7c7c6f] hover:text-white"
            >
              <X size={20} />
            </button>
            <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden mb-4">
              <Image
                src={selectedItem.thumbnail}
                alt={selectedItem.title}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-lg font-bold text-[#fffce1] mb-1">{selectedItem.title}</h3>
            <p className="text-xs text-[#7c7c6f] mb-4">{selectedItem.desc}</p>
            <div className="flex justify-between items-center text-xs font-mono pt-4 border-t border-[#42433d]/50">
              <span className="text-[#abff84]">Formats: {selectedItem.format}</span>
              <span className="text-[#fe7733]">Resale: {selectedItem.resalePrice}</span>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
