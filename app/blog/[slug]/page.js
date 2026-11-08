import { createClient } from "@supabase/supabase-js";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";
import { Calendar, User, ArrowLeft, Clock, Share2, ShieldCheck, Zap, ArrowRight, HelpCircle } from "lucide-react";
import { notFound } from "next/navigation";
import localBlogs from "../../content/blogs.json";

export async function generateStaticParams() {
  return localBlogs.map((b) => ({
    slug: b.slug,
  }));
}

async function getBlogPost(slug) {
  // 1. Check local repository cache first for guaranteed stability
  const localMatch = localBlogs.find((b) => b.slug === slug);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://kfydsuuelaxaffntdjxh.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("slug", slug)
      .single();

    if (!error && data) {
      // Merge with local metadata (faqs, category, read_time)
      return {
        ...localMatch,
        ...data,
      };
    }
  } catch (err) {
    console.error("Supabase fetch error, using local fallback:", err.message);
  }

  return localMatch || null;
}

// Generate dynamic metadata for Google search engines
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const post = await getBlogPost(resolvedParams.slug);

  if (!post) {
    return {
      title: "Article Not Found | 0Machine",
      description: "The requested article could not be found.",
    };
  }

  const canonicalUrl = `https://www.0machine.com/blog/${post.slug}`;
  const metaTitle = post.meta_title || `${post.title} | 0Machine`;
  const metaDesc = post.excerpt || "Expert advice and strategies for laser cut and CNC workshops.";
  const ogImage = post.cover_image ? `https://www.0machine.com${post.cover_image}` : "https://www.0machine.com/assets/hero-laser-workshop.jpg";

  return {
    title: metaTitle,
    description: metaDesc,
    keywords: post.secondary_keywords ? [post.primary_keyword, ...post.secondary_keywords].join(", ") : post.primary_keyword,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      url: canonicalUrl,
      siteName: "0Machine",
      type: "article",
      publishedTime: post.published_at,
      authors: [post.author || "0Machine Engineering Team"],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 675,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDesc,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({ params }) {
  const resolvedParams = await params;
  const post = await getBlogPost(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const canonicalUrl = `https://www.0machine.com/blog/${post.slug}`;
  const ogImage = post.cover_image ? `https://www.0machine.com${post.cover_image}` : "https://www.0machine.com/assets/hero-laser-workshop.jpg";

  // Structured Data: BlogPosting Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: [ogImage],
    datePublished: post.published_at || new Date().toISOString(),
    dateModified: post.updated_at || post.published_at || new Date().toISOString(),
    author: {
      "@type": "Organization",
      name: post.author || "0Machine Engineering Team",
      url: "https://www.0machine.com",
    },
    publisher: {
      "@type": "Organization",
      name: "0Machine",
      url: "https://www.0machine.com",
      logo: {
        "@type": "ImageObject",
        url: "https://www.0machine.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
  };

  // Structured Data: BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.0machine.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Knowledge Hub",
        item: "https://www.0machine.com/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: canonicalUrl,
      },
    ],
  };

  // Structured Data: FAQ Schema (if FAQs available)
  const faqSchema = post.faqs && post.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  } : null;

  // Related articles recommendation
  const relatedArticles = localBlogs
    .filter((b) => b.slug !== post.slug)
    .slice(0, 3);

  return (
    <>
      {/* Schema Markup for Google Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <Navbar />

      <main className="min-h-screen pt-32 pb-24 relative bg-[#111317] text-gray-300">
        <div className="max-w-4xl mx-auto px-6">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-white transition-colors">Resources</Link>
            <span>/</span>
            <span className="text-[#FE7733] truncate max-w-xs">{post.category || "Laser Guide"}</span>
          </nav>

          {/* Article Header */}
          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#FE7733]/15 text-[#FE7733] border border-[#FE7733]/30">
                {post.category || "Laser & CNC"}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock size={13} />
                <span>{post.read_time || "8 min read"}</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[Outfit] text-white leading-tight mb-6">
              {post.title}
            </h1>
            
            {/* Meta info */}
            <div className="flex flex-wrap items-center justify-between border-y border-white/10 py-4 text-xs text-gray-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-gray-300 font-medium">
                  <User size={13} className="text-[#FE7733]" />
                  <span>{post.author || "0Machine Engineering Team"}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} />
                  <span>
                    {new Date(post.published_at || Date.now()).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </span>
              </div>
              <span className="text-gray-400 font-mono text-[11px] hidden sm:inline">
                Verified for CO2 · Fiber · Diode
              </span>
            </div>
          </header>

          {/* Featured Image */}
          {post.cover_image && (
            <figure className="w-full h-80 sm:h-[420px] rounded-2xl overflow-hidden mb-12 border border-white/10 shadow-2xl relative bg-[#1A1D21]">
              <img 
                src={post.cover_image} 
                alt={post.title} 
                className="w-full h-full object-cover"
                loading="eager"
              />
            </figure>
          )}

          {/* Article Content Body */}
          <article 
            className="prose prose-invert prose-base sm:prose-lg max-w-none text-gray-300 leading-relaxed space-y-6 prose-headings:font-[Outfit] prose-headings:text-white prose-a:text-[#FE7733] prose-strong:text-white"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* FAQ Accordion Section (if available) */}
          {post.faqs && post.faqs.length > 0 && (
            <section className="mt-16 pt-10 border-t border-white/10">
              <h2 className="text-2xl font-bold font-[Outfit] text-white mb-6 flex items-center gap-2">
                <HelpCircle size={22} className="text-[#FE7733]" />
                <span>Frequently Asked Questions</span>
              </h2>
              <div className="space-y-4">
                {post.faqs.map((faq, idx) => (
                  <div key={idx} className="bg-[#1A1D21] border border-white/10 rounded-2xl p-6">
                    <h3 className="text-base font-bold text-white mb-2">{faq.question}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Author Bio Card */}
          <div className="my-14 bg-[#1A1D21] border border-white/10 rounded-2xl p-6 sm:p-8 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FE7733]/20 border border-[#FE7733]/40 flex items-center justify-center text-[#FE7733] font-bold text-lg flex-shrink-0">
              0M
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-[Outfit]">0Machine Engineering & Fablab Team</h3>
              <p className="text-xs text-gray-400 leading-relaxed mt-1">
                Authored by CNC specialists, mechanical CAD engineers, and digital fabrication workshop owners. We build free tools and SaaS software to help makers eliminate scrap and scale profitable laser businesses.
              </p>
            </div>
          </div>

          {/* Related Articles Grid */}
          <section className="pt-12 border-t border-white/10">
            <h2 className="text-xl font-bold font-[Outfit] text-white mb-6">Related Workshop Resources</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/blog/${rel.slug}`}
                  className="bg-[#1A1D21] border border-white/10 rounded-xl p-4 hover:border-white/20 hover:bg-[#23262C] transition-all group flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold text-[#FE7733] uppercase block mb-1">
                      {rel.category}
                    </span>
                    <h3 className="text-xs font-bold text-white group-hover:text-[#FE7733] transition-colors line-clamp-2">
                      {rel.title}
                    </h3>
                  </div>
                  <span className="text-[11px] text-gray-400 mt-4 flex items-center gap-1 group-hover:text-white">
                    <span>Read Guide</span>
                    <ArrowRight size={11} />
                  </span>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}
