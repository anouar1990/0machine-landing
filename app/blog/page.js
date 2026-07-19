"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ParticleField from "../components/ParticleField";
import Link from "next/link";
import { RefreshCw, Calendar, User, ArrowRight } from "lucide-react";

export default function BlogHome() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("published_at", { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (err) {
      console.error("Error fetching blogs:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ParticleField />
      <Navbar />
      <main className="min-h-screen pt-32 pb-24 relative z-10 max-w-6xl mx-auto px-6 text-gray-300">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs text-accent-400 tracking-[0.2em] uppercase font-medium">
            0Machine Resources
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-[Outfit] text-white mt-4 mb-4">
            Workshop Knowledge Hub
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            Expert advice, tutorials, and business tips to help you run a highly profitable laser cut or CNC manufacturing workshop.
          </p>
        </div>

        {/* Blog grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <RefreshCw className="animate-spin text-accent-500" size={28} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((post) => (
              <div 
                key={post.id} 
                className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 hover:bg-white/[0.07] transition-all flex flex-col group"
              >
                {/* Cover Image */}
                <div className="h-48 relative overflow-hidden bg-dark-900 border-b border-white/5 flex items-center justify-center">
                  {post.cover_image ? (
                    <img 
                      src={post.cover_image} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <span className="text-4xl">⚙️</span>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Meta info */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(post.published_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <User size={12} />
                        {post.author}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white font-[Outfit] mb-2 leading-snug group-hover:text-accent-400 transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-3 mb-6">
                      {post.excerpt || "Learn how to optimize your laser cutter workshop settings, nesting layouts, and billing methods with 0Machine."}
                    </p>
                  </div>

                  <Link 
                    href={`/blog/${post.slug}`}
                    className="text-xs font-bold text-white group-hover:text-accent-400 inline-flex items-center gap-1.5 transition-colors self-start border-b border-white/10 pb-0.5"
                  >
                    <span>Read Article</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
            
            {blogs.length === 0 && (
              <div className="col-span-full py-16 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl">
                No articles published yet. Check back soon!
              </div>
            )}
          </div>
        )}

      </main>
      <Footer />
    </>
  );
}
