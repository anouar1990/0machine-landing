import PhotoToSvgClient from "./PhotoToSvgClient";

export const metadata = {
  title: "Free Photo to SVG Converter for Laser Cutting & CNC | 0Machine",
  description:
    "Convert JPG and PNG photos into clean, closed vector SVG paths for laser cutting, CNC routing, and vinyl cutting. 100% free, instant LightBurn C00 ready with kerf preview.",
  keywords: [
    "photo to svg converter",
    "turn image into vector",
    "convert image to svg for laser",
    "image to vector free",
    "lightburn svg converter",
    "photo to laser cut dxf svg",
    "vectorize image for cnc",
  ].join(", "),
  alternates: {
    canonical: "https://www.0machine.com/tools/photo-to-svg",
  },
  openGraph: {
    title: "Free Photo to SVG Converter for Laser Cutting & CNC | 0Machine",
    description:
      "Instant client-side vector tracer. Turn raster photos into clean, closed laser-ready vector paths with LightBurn cut contours.",
    url: "https://www.0machine.com/tools/photo-to-svg",
    siteName: "0Machine",
    type: "website",
    images: [
      {
        url: "https://www.0machine.com/assets/hero-laser-workshop.jpg",
        width: 1200,
        height: 675,
        alt: "0Machine Photo to SVG Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Photo to SVG Converter for Laser Cutting | 0Machine",
    description:
      "Convert JPG and PNG photos to closed vector SVG paths for laser cutting and CNC. Instant download, 0 sign up.",
  },
};

export default function PhotoToSvgPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "0Machine Photo to SVG Converter",
        applicationCategory: "DesignApplication",
        operatingSystem: "Web Browser",
        offers: {
          "@type": "Offer",
          price: "0.00",
          priceCurrency: "USD",
        },
        description:
          "Free browser-based vector tracing software for CO2, Fiber, and Diode laser cutting workshops. Converts raster photos to closed SVG vectors.",
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
            name: "Tools",
            item: "https://www.0machine.com/tools",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Photo to SVG Converter",
            item: "https://www.0machine.com/tools/photo-to-svg",
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How do I convert a photo to an SVG for laser cutting?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Upload any PNG, JPG, or WebP photo into the 0Machine Photo to SVG dropzone. Adjust the contrast threshold slider to isolate your silhouette, then click 'Download Laser SVG'. The file is exported with closed vector loops ready to cut.",
            },
          },
          {
            "@type": "Question",
            name: "Can I import this SVG directly into LightBurn and LaserGRBL?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. The generated SVG uses standard red (#EF4444) contours which LightBurn automatically maps to Cut Layer C00. It also imports cleanly into LaserGRBL, RDWorks, and AutoCAD.",
            },
          },
          {
            "@type": "Question",
            name: "How is this different from 0Machine LaserAI Studio?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "This free tool performs client-side edge tracing on existing photos. 0Machine LaserAI Studio uses generative deep-learning to create brand-new original vectors from text prompts, automatically adds stencil bridges to keep interior islands connected, and applies kerf compensation.",
            },
          },
          {
            "@type": "Question",
            name: "Is this photo to vector converter 100% free?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, this converter is completely free to use directly in your browser with zero sign-up, no watermark, and unlimited downloads.",
            },
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
      <PhotoToSvgClient />
    </>
  );
}
