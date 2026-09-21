import type { MetadataRoute } from "next";

import { getPostFeed } from "@/lib/queries";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPostFeed();
  const latestPost = posts
    .map((post) => post.updatedAt ?? post.publishedAt)
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1);

  return [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    {
      url: absoluteUrl("/projects"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/blogs"),
      lastModified: latestPost,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/artworks"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    { url: absoluteUrl("/books"), changeFrequency: "monthly", priority: 0.5 },
    ...posts.map((post) => ({
      url: absoluteUrl(`/blogs/${post.slug}`),
      lastModified: post.updatedAt ?? post.publishedAt ?? undefined,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
