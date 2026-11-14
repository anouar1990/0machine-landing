import "./globals.css";
import { Inter, Outfit } from "next/font/google";
import { LanguageProvider } from "./context/LanguageContext";
import AnalyticsTracker from "./components/AnalyticsTracker";
import PixelScripts from "./components/PixelScripts";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata = {
  title: "0Machine Planner — Run Your Laser Business Smarter, Faster, Easier",
  description:
    "The all-in-one project planner for laser cutters and CNC makers. Track materials, costs, time, clients, and more. Start your free trial today.",
  keywords: [
    "laser cutting software",
    "CNC project management",
    "laser business planner",
    "material tracking",
    "cost calculator",
    "quote generator",
  ],
  openGraph: {
    title: "0Machine Planner — Run Your Laser Business Smarter",
    description:
      "All-in-one tool for laser cutter and CNC hobbyists. Track materials, costs, time, clients — all in one beautiful app.",
    url: "https://0machine.com",
    siteName: "0Machine",
    type: "website",
  },
  verification: {
    other: {
      "facebook-domain-verification": "nq9iuye9c4rxjv3s1ev6awc05wom58",
    },
  },
};

export default function RootLayout({ children }) {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "0Machine Planner",
    "operatingSystem": "Web, iOS, Android, macOS, Windows",
    "applicationCategory": "DesignApplication, BusinessApplication",
    "description":
      "All-in-one workshop management, laser job cost calculator, true-shape nesting estimator, and LaserAI vector generator for laser cutting and CNC businesses.",
    "url": "https://0machine.com",
    "offers": [
      {
        "@type": "Offer",
        "name": "Free Forever Plan",
        "price": "0",
        "priceCurrency": "USD",
      },
      {
        "@type": "Offer",
        "name": "Starter Plan",
        "price": "7.90",
        "priceCurrency": "USD",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": "7.90",
          "priceCurrency": "USD",
          "unitText": "MONTH",
        },
      },
      {
        "@type": "Offer",
        "name": "Workshop Pro Plan",
        "price": "14.90",
        "priceCurrency": "USD",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": "14.90",
          "priceCurrency": "USD",
          "unitText": "MONTH",
        },
      },
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "184",
      "bestRating": "5",
      "worstRating": "1",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does 0Machine calculate laser cutting costs?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "0Machine factors in sheet material dimensions, off-cut remnant scrap, cutting speed (mm/s), pierce time, assist gas consumption, electricity rates, labor hourly wages, and machine wear depreciation to give you a real-time, precision-accurate cost breakdown.",
        },
      },
      {
        "@type": "Question",
        "name": "Can I export nesting layouts and AI designs directly to LightBurn?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Yes. 0Machine exports production-ready SVG and AutoCAD R12 DXF files with standardized layer colors: Layer 00 (Red hairline stroke) for CUT passes and Layer 01 (Solid black fill) for ENGRAVE passes, ready for instant drag-and-drop into LightBurn, Ruida, and xTool Creative Space.",
        },
      },
      {
        "@type": "Question",
        "name": "What is True-Shape Nesting and how does it save material?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "0Machine's ClipperLib nesting engine packs irregular polygons tightly across multiple full sheets and remnant off-cuts, reducing material scrap by 30% to 40% compared to manual layout placement.",
        },
      },
      {
        "@type": "Question",
        "name": "Is 0Machine free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Yes, 0Machine offers a Free Forever account with unlimited core projects, laser presets, material tracking, and job cost calculations without requiring a credit card. Upgrades to Starter ($7.90/mo) and Workshop Pro ($14.90/mo) unlock nesting optimization, commercial vector packs, and LaserAI Studio.",
        },
      },
    ],
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "0Machine",
    "url": "https://0machine.com",
    "logo": "https://0machine.com/logo.png",
    "sameAs": ["https://app.0machine.com"],
  };

  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <meta name="facebook-domain-verification" content="nq9iuye9c4rxjv3s1ev6awc05wom58" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="antialiased">
        <LanguageProvider>
          <AnalyticsTracker />
          <PixelScripts />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
