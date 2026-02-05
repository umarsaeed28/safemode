/**
 * Inline JSON-LD for Organization and WebSite. Rendered in root layout.
 * Helps search engines understand the site and reduces risk of thin-content flags.
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://safemode.com";

export default function JsonLd() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Safe Mode",
    url: SITE_URL,
    description: "Product and UX discovery. Fixed scope, capped sprints. We help founders and product teams make decisions and ship with a clear backlog and flows.",
    sameAs: [],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Safe Mode",
    url: SITE_URL,
    description: "Product and UX discovery studio. Decisions, not more options.",
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/blog?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({ ...organization, "@id": `${SITE_URL}/#organization` }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
