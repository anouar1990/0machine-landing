"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Download, Check, ShieldCheck, FileType2, Eye, X, ArrowRight, Zap, Star } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const DESIGN_PACKS = [
  {
    id: "earrings",
    title: "50+ Geometric & Floral Earrings Bundle",
    category: "Jewelry",
    bestseller: true,
    downloads: "2,410",
    rating: "4.9",
    thumbnail: "/assets/designs/earring_bundle.png",
    format: "SVG · DXF · PDF · AI",
    layers: "Cut (Red) + Engrave (Black)",
    material: "3mm Birch Plywood & Acrylic",
    resalePrice: "$18 - $35 per pair",
    desc: "Huge collection of modern drop, teardrop, bohemian, and geometric earrings with pre-cut 1.5mm jump-ring eyelets.",
  },
  {
    id: "bear_3d",
    title: "6-Layer 3D Forest Bear Mandala Wall Art",
    category: "3D Layered",
    bestseller: true,
    downloads: "1,890",
    rating: "5.0",
    thumbnail: "/assets/designs/animal_bear_multilayer.png",
    format: "SVG · DXF · PDF",
    layers: "6 Separate Cut Layers with Alignment Holes",
    material: "3mm / 4mm Plywood or MDF",
    resalePrice: "$65 - $120 retail",
    desc: "Precision multi-depth shadowbox wall sculpture with pine forests, mountain horizon, and wilderness wildlife silhouettes.",
  },
  {
    id: "wall_clock",
    title: "Industrial Gear & Living Hinge Wall Clock",
    category: "Home Decor",
    bestseller: true,
    downloads: "1,640",
    rating: "4.9",
    thumbnail: "/assets/designs/wall_clock.png",
    format: "SVG · DXF · AI",
    layers: "Cut + Kerf Living Hinge + Engrave Numerals",
    material: "4mm & 6mm Plywood",
    resalePrice: "$45 - $80 retail",
    desc: "Functional mechanical gear wall clock with standard quartz movement hole (8mm shaft) and flexible living-hinge curved surround.",
  },
  {
    id: "gift_boxes",
    title: "Living Hinge & Finger-Joint Gift Box Suite",
    category: "Boxes",
    bestseller: false,
    downloads: "1,420",
    rating: "4.8",
    thumbnail: "/assets/designs/gift_boxes.png",
    format: "SVG · DXF · PDF",
    layers: "Cut + Living Hinge Flex + Engrave",
    material: "3mm Plywood & Basswood",
    resalePrice: "$15 - $30 each",
    desc: "5 distinct gift box templates: book-style box with curved spine living hinge, sliding lid box, and finger-joint latch boxes.",
  },
  {
    id: "layered_rose",
    title: "5-Tier Multilayer 3D Shadow Box Rose",
    category: "3D Layered",
    bestseller: true,
    downloads: "1,730",
    rating: "4.9",
    thumbnail: "/assets/designs/layered_rose.png",
    format: "SVG · DXF · PDF",
    layers: "5 Color-Coded Layer Stacks",
    material: "3mm Birch or Cardstock",
    resalePrice: "$35 - $60 retail",
    desc: "Captivating multi-tier blooming rose mandala. Designed for stained wood layers or multi-colored cast acrylic.",
  },
  {
    id: "christmas_pack",
    title: "75+ Holiday Ornaments & Baubles Mega Pack",
    category: "Seasonal",
    bestseller: true,
    downloads: "3,120",
    rating: "5.0",
    thumbnail: "/assets/designs/christmas_bundle.png",
    format: "SVG · DXF · PDF",
    layers: "Cut + Delicate Filigree Engrave",
    material: "3mm Wood, Mirrored Acrylic",
    resalePrice: "$8 - $15 each (3 for $25)",
    desc: "The proven holiday cash cow: intricate snowflakes, personalized family name baubles, reindeer silhouettes, and nativity scenes.",
  },
  {
    id: "cake_topper",
    title: "Wedding & Milestone Acrylic Cake Topper Pack",
    category: "Occasions",
    bestseller: false,
    downloads: "1,290",
    rating: "4.8",
    thumbnail: "/assets/designs/cake_topper_pack.png",
    format: "SVG · DXF · AI",
    layers: "Reinforced 4mm Stem Cut Outline",
    material: "3mm Gold/Silver Mirror Acrylic",
    resalePrice: "$20 - $40 per topper",
    desc: "Ready-to-cut calligraphy scripts: 'Mr & Mrs', 'Happy Birthday', 'Sweet 16', and customizable anniversary date headers.",
  },
  {
    id: "world_map",
    title: "3D Multi-Tier Architectural Layered World Map",
    category: "Home Decor",
    bestseller: true,
    downloads: "2,050",
    rating: "5.0",
    thumbnail: "/assets/designs/world_map.png",
    format: "SVG · DXF · PDF",
    layers: "3 Thickness Levels with Engraved Country Borders",
    material: "3mm, 6mm, 9mm Plywood Sheets",
    resalePrice: "$150 - $400 completed",
    desc: "Luxury architectural wooden world map with islands, ocean depth contours, and laser-engraved country capitals.",
  },
  {
    id: "3d_globe",
    title: "Interlocking 3D Mechanical Globe Puzzle",
    category: "3D Layered",
    bestseller: false,
    downloads: "980",
    rating: "4.8",
    thumbnail: "/assets/designs/3d_puzzle_globe.png",
    format: "SVG · DXF",
    layers: "Friction-Fit Interlocking Parts",
    material: "3mm Plywood (Zero Glue Required)",
    resalePrice: "$40 - $70 retail",
    desc: "Interactive 3D puzzle assembled from precision laser-cut interlocking rings and longitude ribs without adhesive.",
  },
  {
    id: "photo_frame",
    title: "Living Hinge Desktop Picture Frame",
    category: "Home Decor",
    bestseller: false,
    downloads: "1,110",
    rating: "4.7",
    thumbnail: "/assets/designs/photo_frame.png",
    format: "SVG · DXF · PDF",
    layers: "Cut + Flexible Back Stand",
    material: "4mm Wood & Clear Acrylic Face",
    resalePrice: "$25 - $45 retail",
    desc: "One-piece wooden photo frame with integrated living-hinge fold-out easel stand and laser-etched floral corners.",
  },
  {
    id: "birthday_bundle",
    title: "Birthday & Party Signage Celebration Pack",
    category: "Occasions",
    bestseller: false,
    downloads: "1,340",
    rating: "4.8",
    thumbnail: "/assets/designs/birthday_bundle.png",
    format: "SVG · DXF · AI",
    layers: "Layered Signage + Hanging Loops",
    material: "MDF & Cast Acrylic",
    resalePrice: "$30 - $65 per sign",
    desc: "Party laser vector pack with balloon arches, photo booth props, tiered table signs, and milestone number templates.",
  },
];

const CATEGORIES = ["All Packs", "🔥 Bestsellers", "3D Layered", "Jewelry", "Home Decor", "Boxes", "Seasonal"];

export default function DesignsVault() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("All Packs");
  const [activeModalDesign, setActiveModalDesign] = useState(null);

  const filteredPacks = DESIGN_PACKS.filter((p) => {
    if (selectedCategory === "All Packs") return true;
    if (selectedCategory === "🔥 Bestsellers") return p.bestseller;
    return p.category === selectedCategory;
  });

  return (
    <section id="designs-vault" className="relative py-28 bg-[#0D0F12] text-gray-200 overflow-hidden border-t border-b border-white/5">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#FE7733]/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#B1FA63]/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute inset-0 grid-pattern opacity-25 pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FE7733]/10 border border-[#FE7733]/25 text-[#FE7733] text-xs font-extrabold uppercase tracking-[0.2em] mb-4">
            <Sparkles size={13} />
            <span>COMMERCIAL DESIGNS VAULT</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-[Outfit] text-white tracking-tight mb-5">
            5,000+ Ready-to-Cut <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FE7733] via-[#FFA559] to-[#B1FA63]">
              Bestselling Vector Bundles
            </span>
          </h2>

          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
            Stop wasting 5 hours drawing CAD files from scratch. Download proven, high-demand laser cutting templates with commercial licenses included. Tested on CO2, Fiber & Diode machines.
          </p>

          {/* Social Proof Metric Pill */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-6 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-white font-bold">$100k+ Commercial Resale Proof</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <ShieldCheck size={14} className="text-[#B1FA63]" />
              <span>Full Commercial Selling Rights</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Check size={14} className="text-[#FE7733]" />
              <span>LightBurn & xTool Ready</span>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? "bg-[#FE7733] text-white shadow-lg shadow-[#FE7733]/20 scale-105"
                  : "bg-[#1A1D21] text-gray-400 hover:text-white border border-white/10 hover:border-white/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Designs Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch mb-16">
          {filteredPacks.map((pack) => (
            <motion.div
              key={pack.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-[#16181D] border border-white/10 hover:border-[#FE7733]/50 rounded-2xl overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:shadow-2xl hover:shadow-[#FE7733]/10"
            >
              <div>
                {/* Image Thumbnail Container */}
                <div className="relative aspect-[4/3] bg-[#0A0C0E] overflow-hidden">
                  <img
                    src={pack.thumbnail}
                    alt={pack.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#16181D] via-transparent to-transparent opacity-80" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    {pack.bestseller && (
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-[#FE7733] text-white shadow">
                        ★ Bestseller
                      </span>
                    )}
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-[#B1FA63] border border-white/10">
                      {pack.category}
                    </span>
                  </div>

                  {/* Quick Format Badge */}
                  <div className="absolute bottom-3 left-3 text-[11px] font-mono text-gray-300 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
                    {pack.format}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <span className="flex items-center gap-1 text-[#F59E0B] font-bold">
                      <Star size={12} fill="#F59E0B" /> {pack.rating}
                    </span>
                    <span className="text-gray-500 font-mono">{pack.downloads} cuts</span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 font-[Outfit] leading-snug group-hover:text-[#FFA559] transition-colors">
                    {pack.title}
                  </h3>

                  <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-4">
                    {pack.desc}
                  </p>

                  <div className="space-y-1.5 pt-3 border-t border-white/5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Material:</span>
                      <span className="text-gray-300 font-medium">{pack.material}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Potential Profit:</span>
                      <span className="text-[#B1FA63] font-bold">{pack.resalePrice}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => setActiveModalDesign(pack)}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-white/5 hover:bg-[#FE7733] text-white border border-white/10 hover:border-[#FE7733] transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-[#FE7733]/20"
                >
                  <Eye size={14} />
                  <span>Inspect Vector Specs & Preview</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Vault Banner Call-To-Action */}
        <div className="bg-gradient-to-r from-[#1A1D21] via-[#23262C] to-[#1A1D21] border border-[#FE7733]/30 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#FE7733]/15 rounded-full blur-[100px] pointer-events-none" />
          
          <span className="text-xs font-extrabold text-[#B1FA63] uppercase tracking-[0.25em]">UNLIMITED DOWNLOADS</span>
          <h3 className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-4 font-[Outfit]">
            Unlock the Full 5,000+ Design Vault & Weekly New Releases
          </h3>
          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
            Never pay $5 to $15 per file on Etsy again. Get unlimited access to our entire commercial vector library, including all future weekly drops, with Workshop Pro for only $14.90/mo.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://app.0machine.com"
              className="w-full sm:w-auto px-8 py-4 bg-[#FE7733] hover:bg-[#E85F20] text-white font-extrabold rounded-xl text-sm transition-all shadow-xl shadow-[#FE7733]/30 flex items-center justify-center gap-2 scale-105"
            >
              <span>⚡ Unlock Full Vault with Pro</span>
              <ArrowRight size={16} />
            </a>
            <a
              href="#pricing"
              className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl text-sm border border-white/10 transition-all"
            >
              View Transparent Plans
            </a>
          </div>
        </div>
      </div>

      {/* Vector Specs Inspection Modal */}
      <AnimatePresence>
        {activeModalDesign && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="bg-[#1A1D21] border border-white/15 rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setActiveModalDesign(null)}
                className="absolute top-5 right-5 text-gray-400 hover:text-white w-9 h-9 rounded-full bg-white/5 flex items-center justify-center border border-white/10 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-[#FE7733] text-white">
                  {activeModalDesign.category}
                </span>
                <span className="text-xs text-[#B1FA63] font-bold">★ Commercial License Guaranteed</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-[Outfit]">
                {activeModalDesign.title}
              </h3>

              <div className="rounded-2xl overflow-hidden aspect-video bg-[#0A0C0E] mb-6 border border-white/10">
                <img
                  src={activeModalDesign.thumbnail}
                  alt={activeModalDesign.title}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-xs mb-6">
                <div className="p-4 bg-[#111317] rounded-xl border border-white/5">
                  <span className="text-gray-500 block mb-1">File Formats:</span>
                  <span className="text-white font-mono font-bold">{activeModalDesign.format}</span>
                </div>
                <div className="p-4 bg-[#111317] rounded-xl border border-white/5">
                  <span className="text-gray-500 block mb-1">CAM Layer Hierarchy:</span>
                  <span className="text-[#FE7733] font-medium">{activeModalDesign.layers}</span>
                </div>
                <div className="p-4 bg-[#111317] rounded-xl border border-white/5">
                  <span className="text-gray-500 block mb-1">Recommended Material:</span>
                  <span className="text-white font-medium">{activeModalDesign.material}</span>
                </div>
                <div className="p-4 bg-[#111317] rounded-xl border border-white/5">
                  <span className="text-gray-500 block mb-1">Typical Resale Margin:</span>
                  <span className="text-[#B1FA63] font-bold text-sm">{activeModalDesign.resalePrice}</span>
                </div>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed mb-8">
                {activeModalDesign.desc} Every vector in the 0Machine vault has been verified with 100% closed cutlines, zero overlapping segments, and kerf compensation for immediate cutting in LightBurn, xTool, and Ruida controllers.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <a
                  href="https://app.0machine.com"
                  className="w-full sm:flex-1 py-3.5 bg-[#FE7733] hover:bg-[#E85F20] text-white font-bold rounded-xl text-center text-sm transition-all shadow-lg shadow-[#FE7733]/25 flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  <span>Download Vectors in Vault</span>
                </a>
                <button
                  onClick={() => setActiveModalDesign(null)}
                  className="w-full sm:w-auto px-6 py-3.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-bold border border-white/10"
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

