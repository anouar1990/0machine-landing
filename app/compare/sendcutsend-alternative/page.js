import SendCutSendAlternativeClient from "./SendCutSendAlternativeClient";

export const metadata = {
  title: "SendCutSend Alternative: In-House Laser Cutting vs Outsourcing | 0Machine",
  description:
    "Compare SendCutSend pricing against in-house laser cutting with 0Machine Nesting & Workshop OS. Calculate your exact break-even point and annual sheet savings.",
  keywords: [
    "sendcutsend alternative",
    "sendcutsend pricing",
    "sendcutsend vs in house laser cutting",
    "sendcutsend competitors",
    "sheet metal laser cutting cost",
    "laser cutting nesting software",
    "in house vs outsource laser cutting",
  ].join(", "),
  alternates: {
    canonical: "https://www.0machine.com/compare/sendcutsend-alternative",
  },
  openGraph: {
    title: "SendCutSend Alternative: In-House Laser Cutting vs Outsourcing | 0Machine",
    description:
      "Stop paying 400% supplier markups per part. See how shops save $12,000+/year by bringing laser cutting in-house with 0Machine True-Shape Nesting.",
    url: "https://www.0machine.com/compare/sendcutsend-alternative",
    siteName: "0Machine",
    type: "article",
    images: [
      {
        url: "https://www.0machine.com/assets/hero-laser-workshop.jpg",
        width: 1200,
        height: 675,
        alt: "0Machine vs SendCutSend Comparison",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SendCutSend Alternative: In-House Laser Cutting vs Outsourcing",
    description:
      "Compare costs, turnaround times, and nesting yields between SendCutSend outsourcing and in-house production.",
  },
};

export default function SendCutSendAlternativePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "SendCutSend Alternative: In-House Laser Cutting vs Outsourcing",
        url: "https://www.0machine.com/compare/sendcutsend-alternative",
        description:
          "Comprehensive guide and cost comparison analyzing the financial and operational trade-offs of outsourcing laser cutting vs in-house fabrication.",
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Is it cheaper to use SendCutSend or buy a laser cutter?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "For one-off hobbyist prototypes (under 10 parts/month), SendCutSend is convenient. However, once your volume exceeds 30–50 parts per month, in-house cutting with modern CO2 or Fiber lasers pays for itself in 3 to 6 months by eliminating supplier retail markups.",
            },
          },
          {
            "@type": "Question",
            name: "How does 0Machine software help in-house laser workshops?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "0Machine provides the complete digital operating system for in-house laser production: true-shape sheet nesting to minimize scrap waste, LaserAI vector generation with kerf compensation, job cost quoting, and a commercial library of 300,000+ cut-ready files.",
            },
          },
          {
            "@type": "Question",
            name: "What are the hidden costs of outsourcing laser cutting?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Hidden costs include expedited shipping fees, 4–8 day production lead times that slow down prototyping, minimum lot charges, and lost profit margins that you could capture as an in-house manufacturer.",
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
      <SendCutSendAlternativeClient />
    </>
  );
}
