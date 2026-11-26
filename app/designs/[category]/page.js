import { notFound } from "next/navigation";
import { DESIGN_CATEGORIES } from "../../content/designsCatalog";
import DesignsCategoryClient from "./DesignsCategoryClient";

// Generate static routes for all high-volume programmatic keyword categories
export async function generateStaticParams() {
  return Object.keys(DESIGN_CATEGORIES).map((slug) => ({
    category: slug,
  }));
}

// Generate dynamic metadata for Googlebot
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const data = DESIGN_CATEGORIES[resolvedParams.category];

  if (!data) {
    return {
      title: "Design Vault | 0Machine",
      description: "Explore 300,000+ commercial laser cutting and CNC vector files.",
    };
  }

  const canonicalUrl = `https://www.0machine.com/designs/${data.slug}`;

  return {
    title: data.metaTitle,
    description: data.metaDesc,
    keywords: [
      data.keyword,
      "laser cut files",
      "dxf files for laser",
      "svg laser cut files",
      "commercial laser designs",
      "lightburn ready vectors",
    ].join(", "),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: data.metaTitle,
      description: data.metaDesc,
      url: canonicalUrl,
      siteName: "0Machine",
      type: "website",
      images: [
        {
          url: "https://www.0machine.com/assets/hero-laser-workshop.jpg",
          width: 1200,
          height: 675,
          alt: data.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: data.metaTitle,
      description: data.metaDesc,
    },
  };
}

export default async function DesignCategoryPage({ params }) {
  const resolvedParams = await params;
  const categoryData = DESIGN_CATEGORIES[resolvedParams.category];

  if (!categoryData) {
    notFound();
  }

  const canonicalUrl = `https://www.0machine.com/designs/${categoryData.slug}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: categoryData.title,
        description: categoryData.description,
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
          {
            "@type": "ListItem",
            position: 3,
            name: categoryData.title,
            item: canonicalUrl,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: categoryData.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <DesignsCategoryClient categoryData={categoryData} allCategories={DESIGN_CATEGORIES} />
    </>
  );
}
