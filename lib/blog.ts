export const BLOG_CATEGORIES = [
  "Development",
  "AI",
  "Design",
  "Personal",
  "Notes",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export function readingTimeMinutes(html: string) {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = text ? text.split(" ").length : 0;
  return Math.max(1, Math.round(words / 220));
}

export function formatPostDate(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
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
