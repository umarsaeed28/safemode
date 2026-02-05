/**
 * FAQPage and Service schema for the home page. Rendered in the DOM for crawlers.
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://safemode.com";

export default function HomeJsonLd() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What do you deliver?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Build-ready product and UX artifacts: a clear product brief, research synthesis, a prioritized backlog with acceptance criteria, UX flows, and design foundations your team can extend.",
        },
      },
      {
        "@type": "Question",
        name: "Who is this for?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Founders and product teams at any stage who need clarity, alignment, and momentum.",
        },
      },
      {
        "@type": "Question",
        name: "What problem do you actually solve?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ambiguity. Too many ideas, too many opinions, and not enough decisions.",
        },
      },
      {
        "@type": "Question",
        name: "How is this different from an agency or consultancy?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We optimize for decisions and shippable direction, not output or recommendations.",
        },
      },
      {
        "@type": "Question",
        name: "What happens after the engagement?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You own everything. Backlog, designs, decisions, and rationale. No dependency. No retainer.",
        },
      },
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Safe Mode",
    url: SITE_URL,
    description: "Product and UX discovery for founders and product teams. Fixed scope, capped sprints.",
    areaServed: "Worldwide",
    serviceType: ["Product discovery", "UX discovery", "Product audit", "Backlog grooming"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Safe Mode offerings",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Product & UX Audit",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Discovery Program",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Add a Sprint",
          },
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
    </>
  );
}
