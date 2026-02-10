/**
 * FAQPage and Service schema for the home page. Rendered in the DOM for crawlers.
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://shipgate.ai";

export default function HomeJsonLd() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What do you deliver",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Decision confidence your team can act on, delivered through shippable artifacts. This includes a clear product brief, research synthesis, a prioritized backlog with acceptance criteria, UX flows, and design foundations. No strategy decks. No ambiguity.",
        },
      },
      {
        "@type": "Question",
        name: "Who is this for",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Founders and product teams who are unsure what to build next, or who want to reduce risk before committing more engineering time.",
        },
      },
      {
        "@type": "Question",
        name: "What problem do you solve",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Too many ideas and opinions. Not enough certainty. We help teams make clear decisions about what to build or not build, so work starts or stops without second guessing.",
        },
      },
      {
        "@type": "Question",
        name: "How are you different from agencies or consultants",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We optimize for decisions and build ready output, not billable hours or long reports. Scope is fixed. Sprints are capped. Tradeoffs are explicit. We deliver clear bets and build ready output in weeks.",
        },
      },
      {
        "@type": "Question",
        name: "How does the Discovery Scorecard fit in",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The Discovery Scorecard is a free readiness check. It helps teams understand whether they are guessing, partially aligned, or truly ready to ship before investing more time or money.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between the Scorecard and the Discovery Program",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The Scorecard shows where you stand. The Discovery Program shows exactly what to do next and why, with evidence and build ready artifacts.",
        },
      },
      {
        "@type": "Question",
        name: "What happens after the engagement",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You keep everything. The backlog, decisions, rationale, and design foundations are yours to build on without dependency on us.",
        },
      },
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "shipgate",
    url: SITE_URL,
    description: "Product and UX discovery for founders and product teams. Fixed scope, capped sprints.",
    areaServed: "Worldwide",
    serviceType: ["Product discovery", "UX discovery", "Product audit", "Backlog grooming"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "shipgate offerings",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Discovery Scorecard",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Decision Gate",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Advisory",
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
