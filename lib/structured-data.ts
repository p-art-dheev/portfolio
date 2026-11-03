import type {
  ArtworkItem,
  BookItem,
  Project,
  SiteContent,
} from "@/lib/content-types";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/seo";

/** Stable id so every page's JSON-LD points at the same Person. */
export const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const personRef = { "@id": PERSON_ID };

/** Site-relative paths become absolute; full URLs pass through. */
function toAbsolute(src: string) {
  return src.startsWith("/") ? absoluteUrl(src) : src;
}

export function personSchema(site: SiteContent) {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: SITE_NAME,
    alternateName: site.name,
    url: SITE_URL,
    image: site.avatars[0] ? toAbsolute(site.avatars[0]) : undefined,
    email: `mailto:${site.socials.email}`,
    jobTitle: site.role,
    description: SITE_DESCRIPTION,
    knowsAbout: site.techStack.map((item) => item.label),
    // Still a student, so affiliation rather than alumniOf.
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: site.college,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: site.location.split(",")[0]?.trim() || undefined,
      addressCountry: "IN",
    },
    sameAs: [site.socials.github, site.socials.linkedin],
  };
}

export function homeJsonLd(site: SiteContent) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      url: SITE_URL,
      name: `${SITE_NAME} | ${site.role}`,
      mainEntity: personSchema(site),
      isPartOf: { "@id": WEBSITE_ID },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      inLanguage: "en",
      publisher: personRef,
    },
  ];
}

export function projectsJsonLd(projects: Project[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Projects",
    url: absoluteUrl("/projects"),
    author: personRef,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: projects.length,
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "SoftwareSourceCode",
          name: project.title,
          description: project.description,
          keywords: project.tags.join(", ") || undefined,
          codeRepository: project.githubUrl || undefined,
          url: project.liveUrl || project.githubUrl || absoluteUrl("/projects"),
          image: project.banner ? toAbsolute(project.banner) : undefined,
          creativeWorkStatus:
            project.status === "live"
              ? "Published"
              : project.status === "Building"
                ? "Incomplete"
                : undefined,
          author: personRef,
        },
      })),
    },
  };
}

export function artworksJsonLd(artworks: ArtworkItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: "Artworks",
    description: "Realism drawings and digital art by Pardheev Vatturu.",
    url: absoluteUrl("/artworks"),
    author: personRef,
    hasPart: artworks.map((artwork) => ({
      "@type": "VisualArtwork",
      name: artwork.title,
      image: toAbsolute(artwork.image.src),
      description: artwork.image.alt || undefined,
      artform: "Drawing",
      creator: personRef,
    })),
  };
}

export function booksJsonLd(books: BookItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Books",
    url: absoluteUrl("/books"),
    about: personRef,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: books.length,
      itemListElement: books.map((book, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Book",
          name: book.title,
          alternativeHeadline: book.subtitle || undefined,
          author: { "@type": "Person", name: book.author },
          image: book.coverImage.src
            ? toAbsolute(book.coverImage.src)
            : undefined,
        },
      })),
    },
  };
}
