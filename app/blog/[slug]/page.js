import { createClient } from "@supabase/supabase-js";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

async function getBlogPost(slug) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");

  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data;
}

// Generate metadata dynamically for search engines
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const post = await getBlogPost(resolvedParams.slug);
  
  if (!post) {
    return {
      title: "Article Not Found | 0Machine Planner",
      description: "The requested article could not be found."
    };
  }

  return {
    title: `${post.title} | 0Machine Planner`,
    description: post.excerpt || "Expert advice and strategies for laser cut and CNC workshops.",
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.cover_image ? [{ url: post.cover_image }] : [],
    }
  };
}

export default async function BlogPostPage({ params }) {
  const resolvedParams = await params;
  const post = await getBlogPost(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-24 relative bg-dark-950 text-gray-300">
        <div className="max-w-3xl mx-auto px-6">
          
          {/* Back button */}
          <Link 
            href="/blog"
            className="text-xs font-bold text-gray-400 hover:text-white inline-flex items-center gap-1.5 mb-8 transition-colors self-start border-b border-transparent hover:border-white/20 pb-0.5"
          >
            <ArrowLeft size={12} />
            <span>Back to Hub</span>
          </Link>

          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[Outfit] text-white leading-tight mb-4">
              {post.title}
            </h1>
            
            {/* Meta info */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {new Date(post.published_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric"
                })}
              </span>
              <span className="flex items-center gap-1">
                <User size={12} />
                {post.author}
              </span>
            </div>
          </header>

          {/* Cover Image */}
          {post.cover_image && (
            <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden mb-10 border border-white/5">
              <img 
                src={post.cover_image} 
                alt={post.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content Body */}
          <article 
            className="prose prose-invert prose-sm sm:prose-base max-w-none text-gray-300 leading-relaxed space-y-6"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

        </div>
      </main>
      <Footer />
    </>
  );
}
