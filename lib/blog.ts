export const BLOG_CATEGORIES = [
  "Development",
  "AI",
  "Design",
  "Personal",
  "Notes",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export function htmlToText(html: string) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function wordCount(html: string) {
  const text = htmlToText(html);
  return text ? text.split(" ").length : 0;
}

export function readingTimeMinutes(html: string) {
  return Math.max(1, Math.round(wordCount(html) / 220));
}

/** First ~160 characters of the body, cut on a word boundary. */
export function excerptFromHtml(html: string, max = 160) {
  const text = htmlToText(html);
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" ") > 80 ? cut.lastIndexOf(" ") : max).trim()}…`;
}

// Fixed locale + UTC so server and client always render the same string.
export function formatPostDate(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function normalizeTags(raw: string) {
  const seen = new Set<string>();
  const tags: string[] = [];
  for (const part of raw.split(",")) {
    const tag = part.trim().replace(/^#/, "").slice(0, 30);
    const key = tag.toLowerCase();
    if (!tag || seen.has(key)) continue;
    seen.add(key);
    tags.push(tag);
    if (tags.length === 8) break;
  }
  return tags;
}

export type TocItem = { id: string; text: string; level: 2 | 3 };

/**
 * Adds stable ids to h2/h3 headings (so they can be linked) and returns the
 * outline. Runs on already-sanitized HTML.
 */
export function withHeadingAnchors(html: string): {
  html: string;
  toc: TocItem[];
} {
  const toc: TocItem[] = [];
  const used = new Map<string, number>();
  const out = html.replace(
    /<h([23])(?:\s[^>]*)?>([\s\S]*?)<\/h\1>/g,
    (_match, level: string, inner: string) => {
      const text = htmlToText(inner);
      if (!text) return _match;
      const base =
        text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .slice(0, 60) || "section";
      const count = used.get(base) ?? 0;
      used.set(base, count + 1);
      const id = count ? `${base}-${count + 1}` : base;
      toc.push({ id, text, level: Number(level) as 2 | 3 });
      return `<h${level} id="${id}">${inner}</h${level}>`;
    },
  );
  return { html: out, toc };
}

/** Rank other posts by shared tags, then category, then recency. */
export function relatedPosts<
  T extends { slug: string; tags: string[]; category: string },
>(current: T, all: T[], limit = 3) {
  const tags = new Set(current.tags.map((tag) => tag.toLowerCase()));
  return all
    .filter((item) => item.slug !== current.slug)
    .map((item, index) => ({
      item,
      index,
      score:
        item.tags.filter((tag) => tags.has(tag.toLowerCase())).length * 2 +
        (item.category && item.category === current.category ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map(({ item }) => item);
}

export function categoryTone(category: string) {
  switch (category) {
    case "Development":
      return "bg-sky-500/15 text-sky-700 dark:text-sky-300";
    case "AI":
      return "bg-violet-500/15 text-violet-700 dark:text-violet-300";
    case "Design":
      return "bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300";
    case "Personal":
      return "bg-amber-500/15 text-amber-700 dark:text-amber-300";
    default:
      return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300";
  }
}
