import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ParticleField from "../components/ParticleField";
import { DESIGN_CATEGORIES } from "../content/designsCatalog";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Layers,
  Zap,
  FolderOpen,
  FileCode,
  Tag,
} from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "300,000+ Laser Cutting & CNC Designs Vault (Commercial License) | 0Machine",
  description:
    "Explore 300,000+ commercial laser-ready DXF, SVG, and AI design files. Download 3D wall art, living hinge boxes, jewelry, and seasonal decor with full resale rights.",
  keywords: [
    "laser cutting designs",
    "dxf files for laser cutting",
    "svg files for laser cutting",
    "free laser cut files",
    "commercial laser files",
    "lightburn ready designs",
    "cnc wood cut files",
  ].join(", "),
  alternates: {
    canonical: "https://www.0machine.com/designs",
  },
  openGraph: {
    title: "300,000+ Laser Cutting & CNC Designs Vault | 0Machine",
    description:
      "Instant downloads of production-ready DXF and SVG vectors with commercial resale license.",
    url: "https://www.0machine.com/designs",
    siteName: "0Machine",
    type: "website",
    images: [
      {
        url: "https://www.0machine.com/assets/hero-laser-workshop.jpg",
        width: 1200,
        height: 675,
        alt: "0Machine 300,000+ Designs Vault",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "300,000+ Laser Cutting & CNC Designs Vault | 0Machine",
    description: "Production-ready laser vector files with commercial resale license.",
  },
};

export default function DesignsHubPage() {
  const categoriesList = Object.values(DESIGN_CATEGORIES);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: "0Machine 300,000+ Commercial Laser Designs Vault",
        description:
          "Universal vector CAD library for laser cutters, plasma tables, and CNC routers with commercial resale license.",
        image: "https://www.0machine.com/assets/hero-laser-workshop.jpg",
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "USD",
          lowPrice: "0.00",
          highPrice: "19.00",
          offerCount: "300000",
          availability: "https://schema.org/InStock",
        },
        brand: {
          "@type": "Brand",
          name: "0Machine",
        },
      },
      {
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
            name: "Designs Vault",
            item: "https://www.0machine.com/designs",
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ParticleField />
      <Navbar />

      <main className="min-h-screen pt-32 pb-24 relative z-10 bg-[#0e100f] text-gray-300">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#abff84] bg-[#abff84]/10 border border-[#abff84]/20 px-4 py-1.5 rounded-full mb-4">
              <Zap size={13} className="text-[#0ae448]" />
              <span>Commercial Resale License Included</span>
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-[Outfit] text-[#fffce1] mb-5">
              300,000+ Laser & CNC <br />
              <span className="text-[#fe7733]">Design Files</span>
            </h1>
            <p className="text-[#7c7c6f] text-sm sm:text-base leading-relaxed">
              Curated, production-verified vector designs across 50+ categories: 3D shadowboxes, jewelry,
              living hinge boxes, wall clocks, and holiday gifts. Calibrated for LightBurn, Glowforge, and AutoCAD.
            </p>
          </div>

          {/* Featured Collections / Programmatic Hubs */}
          <div className="grid md:grid-cols-2 gap-6 mb-20">
            {categoriesList.map((cat) => (
              <Link
                key={cat.slug}
                href={`/designs/${cat.slug}`}
                className="bg-[#121311] border border-[#42433d]/70 hover:border-[#fe7733]/60 rounded-2xl p-7 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#fe7733] bg-[#fe7733]/10 border border-[#fe7733]/25 px-3 py-1 rounded-full">
                      {cat.keyword}
                    </span>
                    <span className="text-xs font-mono text-[#abff84]">{cat.searchVolume}</span>
                  </div>

                  <h2 className="text-2xl font-bold font-[Outfit] text-[#fffce1] group-hover:text-[#fe7733] transition-colors mb-3">
                    {cat.title}
                  </h2>

                  <p className="text-xs text-[#7c7c6f] leading-relaxed mb-6">
                    {cat.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {cat.formats.map((fmt) => (
                      <span
                        key={fmt}
                        className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-[#191919] border border-[#42433d]/50 text-[#fffce1]"
                      >
                        {fmt}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#42433d]/50 flex items-center justify-between text-xs font-mono text-[#fffce1] group-hover:text-[#fe7733] transition-colors">
                  <span>Explore {cat.keyword} Collection</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          {/* Master CTA Banner */}
          <div className="bg-gradient-to-r from-[#191919] via-[#121311] to-[#191919] border border-[#fe7733]/40 rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden">
            <h2 className="text-3xl sm:text-4xl font-bold font-[Outfit] text-[#fffce1] mb-3">
              One Subscription. 300,000+ Production Vectors.
            </h2>
            <p className="text-sm text-[#7c7c6f] max-w-xl mx-auto mb-8 leading-relaxed">
              Stop paying $15 for individual Etsy vector files. Access the entire 0Machine library with
              unlimited downloads and commercial fabrication licenses.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/#pricing"
                className="px-7 py-3.5 bg-[#fe7733] hover:bg-[#e06526] text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-[#fe7733]/20"
              >
                <span>Unlock Full Access</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/tools"
                className="px-6 py-3.5 bg-[#191919] hover:bg-[#232323] text-[#fffce1] border border-[#42433d] font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
              >
                <span>Browse Free Tools Suite</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
