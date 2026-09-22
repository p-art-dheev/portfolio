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

/** Fixed swatch palette categories are colored from — pick one per category. */
export const CATEGORY_COLORS = [
  "sky",
  "violet",
  "fuchsia",
  "amber",
  "emerald",
  "rose",
  "teal",
  "indigo",
  "orange",
  "slate",
] as const;

export type CategoryColor = (typeof CATEGORY_COLORS)[number];

export function isCategoryColor(value: string): value is CategoryColor {
  return (CATEGORY_COLORS as readonly string[]).includes(value);
}

const CATEGORY_TONE_CLASSES: Record<CategoryColor, string> = {
  sky: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  violet: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  fuchsia: "bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300",
  amber: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  emerald: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  rose: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  teal: "bg-teal-500/15 text-teal-700 dark:text-teal-300",
  indigo: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
  orange: "bg-orange-500/15 text-orange-700 dark:text-orange-300",
  slate: "bg-slate-500/15 text-slate-700 dark:text-slate-300",
};

/** Tailwind classes for a category's badge, from its stored color name. */
export function categoryTone(color: string | null | undefined) {
  return CATEGORY_TONE_CLASSES[
    isCategoryColor(color ?? "") ? (color as CategoryColor) : "slate"
  ];
}

const CATEGORY_DOT_CLASSES: Record<CategoryColor, string> = {
  sky: "bg-sky-500",
  violet: "bg-violet-500",
  fuchsia: "bg-fuchsia-500",
  amber: "bg-amber-500",
  emerald: "bg-emerald-500",
  rose: "bg-rose-500",
  teal: "bg-teal-500",
  indigo: "bg-indigo-500",
  orange: "bg-orange-500",
  slate: "bg-slate-500",
};

/** Solid swatch color for a category color picker. */
export function categoryDot(color: string | null | undefined) {
  return CATEGORY_DOT_CLASSES[
    isCategoryColor(color ?? "") ? (color as CategoryColor) : "slate"
  ];
}
