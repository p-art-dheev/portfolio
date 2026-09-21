import { HomePage } from "@/components/HomePage";
import { site } from "@/lib/data";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, jsonLdString } from "@/lib/seo";

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_NAME,
    url: SITE_URL,
    image: `${SITE_URL}${site.avatars[0]}`,
    jobTitle: site.role,
    description: SITE_DESCRIPTION,
    alumniOf: { "@type": "CollegeOrUniversity", name: site.college },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Coimbatore",
      addressCountry: "IN",
    },
    sameAs: [site.socials.github, site.socials.linkedin],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "en",
  },
];

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
      <HomePage />
    </>
  );
}
