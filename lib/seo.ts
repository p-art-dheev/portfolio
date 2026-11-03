import { site } from "@/lib/data";

/** Canonical origin. Override with NEXT_PUBLIC_SITE_URL for previews/staging. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || `https://${site.domain}`
).replace(/\/$/, "");

export const SITE_NAME = `${site.name} Vatturu`;

export const SITE_DESCRIPTION =
  "Portfolio of Pardheev Vatturu, a full-stack developer and AI engineering student. Projects, blog posts on development and AI, realism artworks, and books.";

export const SITE_KEYWORDS = [
  "Pardheev Vatturu",
  "Pardheev",
  "full-stack developer",
  "portfolio",
  "Next.js developer",
  "AI engineering",
  "realism drawing",
  "developer blog",
];

/**
 * Shared Open Graph fields. Next.js merges metadata shallowly, so a page that
 * sets its own `openGraph` must spread this in or it loses these fields.
 */
export const BASE_OPEN_GRAPH = {
  type: "website",
  siteName: SITE_NAME,
  locale: "en_US",
} as const;

export function absoluteUrl(path = "/") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Safe to embed inside a <script type="application/ld+json"> tag. */
export function jsonLdString(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\u003c");
}
