import ImageToDxfClient from "./ImageToDxfClient";

export const metadata = {
  title: "Free Image to DXF Converter for Laser Cutting & CNC | 0Machine",
  description:
    "Convert JPG and PNG images into clean AutoCAD R12 DXF vector polylines for laser cutters, plasma tables, and CNC routers. 100% free with LightBurn C00 layer compliance.",
  keywords: [
    "image to dxf",
    "convert image to dxf for laser cutting",
    "png to dxf converter",
    "jpg to dxf cnc",
    "autocad r12 dxf free",
    "lightburn dxf trace",
    "free dxf converter laser",
  ].join(", "),
  alternates: {
    canonical: "https://www.0machine.com/tools/image-to-dxf",
  },
  openGraph: {
    title: "Free Image to DXF Converter for Laser Cutting & CNC | 0Machine",
    description:
      "Instant browser-based image to CAD DXF vectorizer. Exports closed polylines calibrated for CNC routers and laser cutters.",
    url: "https://www.0machine.com/tools/image-to-dxf",
    siteName: "0Machine",
    type: "website",
    images: [
      {
        url: "https://www.0machine.com/assets/hero-laser-workshop.jpg",
        width: 1200,
        height: 675,
        alt: "0Machine Image to DXF Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Image to DXF Converter for CNC & Laser | 0Machine",
    description:
      "Convert PNG and JPG images into closed AutoCAD R12 DXF files with millimeter scaling.",
  },
};

export default function ImageToDxfPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "0Machine Image to DXF Converter",
        applicationCategory: "DesignApplication",
        operatingSystem: "Web Browser",
        offers: {
          "@type": "Offer",
          price: "0.00",
          priceCurrency: "USD",
        },
        description:
          "Free browser-based CAD vectorizer that converts raster graphics into AutoCAD R12 DXF files for laser cutting, plasma, and CNC routers.",
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
            name: "Image to DXF Converter",
            item: "https://www.0machine.com/tools/image-to-dxf",
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How do I convert an image to a DXF file for CNC cutting?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Upload your image (PNG or JPG) into the 0Machine Image to DXF converter. Adjust the threshold and smoothing sliders to refine the cut boundary, specify your target width in millimeters, then click 'Download Cut-Ready DXF'.",
            },
          },
          {
            "@type": "Question",
            name: "What version of DXF does this tool generate?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "It generates standard AutoCAD Release 12 (R12) ASCII DXF files using closed POLYLINE entities. R12 is universally compatible with LightBurn, AutoCAD, Fusion 360, Vectric Aspire, RDWorks, and plasma CNC controllers.",
            },
          },
          {
            "@type": "Question",
            name: "Are the coordinates scaled to millimeters?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. The DXF header defines $INSUNITS as 4 (Millimeters), and entity coordinates are mapped accurately to the target dimension you set in the tool.",
            },
          },
          {
            "@type": "Question",
            name: "Is there a file size limit or watermarking?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. The converter runs locally on your device with no watermarks, no account registration required, and unlimited downloads.",
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
      <ImageToDxfClient />
    </>
  );
}
