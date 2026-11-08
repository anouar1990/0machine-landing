"use client";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ParticleField from "../components/ParticleField";
import Link from "next/link";
import { Calendar, User, ArrowRight, Search, Clock, Zap, BookOpen, Layers } from "lucide-react";
import localBlogs from "../content/blogs.json";

const CATEGORIES = [
  "All Articles",
  "Cost & Quoting",
  "Boxes & Kerf",
  "Test & Calibration",
  "Living Hinges",
  "Nesting & Scrap",
  "AI & Vectors",
];

export default function BlogHome() {
  const [blogs, setBlogs] = useState(localBlogs);
  const [selectedCategory, setSelectedCategory] = useState("All Articles");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("published_at", { ascending: false });

      if (!error && data && data.length > 0) {
        // Merge with local metadata (category, read_time)
        const merged = data.map((d) => {
          const match = localBlogs.find((l) => l.slug === d.slug);
          return {
            ...match,
            ...d,
          };
        });
        setBlogs(merged);
      }
    } catch (err) {
      console.warn("Supabase fetch fallback to local blogs:", err.message);
    }
  };

  // Filtered blogs
  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      const matchesCategory =
        selectedCategory === "All Articles" || b.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.excerpt && b.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (b.primary_keyword && b.primary_keyword.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [blogs, selectedCategory, searchQuery]);

  const featuredPost = filteredBlogs[0];
  const regularPosts = filteredBlogs.slice(1);

  return (
    <>
      <ParticleField />
      <Navbar />

      <main className="min-h-screen pt-32 pb-24 relative z-10 max-w-6xl mx-auto px-6 text-gray-300">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 text-xs text-[#FE7733] font-bold uppercase tracking-[0.2em] bg-[#FE7733]/10 px-4 py-1.5 rounded-full border border-[#FE7733]/25 mb-4">
            <BookOpen size={13} />
            <span>0MACHINE KNOWLEDGE HUB</span>
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-[Outfit] text-white mb-4">
            Laser & CNC Workshop <br />
            <span className="text-[#FE7733]">Engineering Guides</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            In-depth technical tutorials, mathematical pricing formulas, kerf guides, and scrap reduction strategies to build a profitable digital fabrication business.
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="mb-12 space-y-6">
          {/* Search bar */}
          <div className="relative max-w-xl mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search guides (e.g. kerf offset, pricing formula, living hinge)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1A1D21] border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white text-sm outline-none focus:border-[#FE7733] transition-all"
            />
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedCategory === cat ? "bg-[#FE7733] text-white shadow-lg shadow-[#FE7733]/25" : "bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Hero Article */}
        {featuredPost && (
          <div className="mb-16">
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="bg-[#1A1D21] border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all grid lg:grid-cols-12 group block"
            >
              <div className="lg:col-span-7 h-64 sm:h-80 lg:h-full relative overflow-hidden bg-[#23262C]">
                {featuredPost.cover_image && (
                  <img
                    src={featuredPost.cover_image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                )}
                <div className="absolute top-4 left-4 bg-[#FE7733] text-white font-bold text-[11px] uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                  Featured Guide
                </div>
              </div>

              <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                    <span className="font-bold text-[#B1FA63] uppercase tracking-wider">
                      {featuredPost.category || "Laser Guide"}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {featuredPost.read_time || "8 min read"}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-white font-[Outfit] mb-4 group-hover:text-[#FE7733] transition-colors leading-snug">
                    {featuredPost.title}
                  </h2>

                  <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs">
                  <span className="text-gray-400">{featuredPost.author || "0Machine Team"}</span>
                  <span className="text-[#FE7733] font-bold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Read Article</span>
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Regular Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {regularPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="bg-[#1A1D21] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="h-48 relative overflow-hidden bg-[#23262C] border-b border-white/5">
                  {post.cover_image && (
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <span className="absolute top-3 left-3 bg-[#111317]/80 backdrop-blur-md text-[10px] font-bold text-[#FE7733] uppercase px-2.5 py-1 rounded-md border border-white/10">
                    {post.category || "Article"}
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {post.read_time || "8 min"}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {new Date(post.published_at || Date.now()).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white font-[Outfit] mb-2 leading-snug group-hover:text-[#FE7733] transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 flex items-center justify-between text-xs border-t border-white/5">
                <span className="text-gray-400 text-[11px]">{post.author || "0Machine Team"}</span>
                <span className="text-[#FE7733] font-bold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Read Guide</span>
                  <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Free Tools Direct Navigation Banner */}
        <div className="bg-gradient-to-r from-[#1A1D21] via-[#23262C] to-[#1A1D21] border border-[#FE7733]/30 rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-2xl">
          <span className="text-xs text-[#B1FA63] font-extrabold uppercase tracking-widest block mb-2">
            PRACTICE WHAT YOU LEARN
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3 font-[Outfit]">
            Explore 0Machine Free Workshop CAD Tools
          </h2>
          <p className="text-gray-400 text-sm max-w-2xl mx-auto mb-8">
            Try our 100% free online CAD calculators and generators with zero sign-up. Export clean DXF and SVG files directly to LightBurn.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/calculator" className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl text-xs border border-white/10 transition-all">
              💰 Job Cost Calculator
            </Link>
            <Link href="/tools/box-generator" className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl text-xs border border-white/10 transition-all">
              📦 Box Generator
            </Link>
            <Link href="/tools/test-matrix" className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl text-xs border border-white/10 transition-all">
              ⚡ Test Matrix
            </Link>
            <Link href="/tools/living-hinge" className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl text-xs border border-white/10 transition-all">
              🌀 Living Hinge
            </Link>
            <Link href="/tools/nesting" className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl text-xs border border-white/10 transition-all">
              🧩 Nesting Estimator
            </Link>
            <a href="/#laser-ai" className="px-4 py-2 bg-[#FE7733] hover:bg-[#E85F20] text-white font-bold rounded-xl text-xs transition-all shadow-md">
              🤖 LaserAI Vector
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
