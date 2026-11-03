import type { Metadata } from "next";

import { BlogsPage } from "@/components/BlogsPage";
import { getBlogCategories, getPublishedPosts } from "@/lib/queries";
import { BASE_OPEN_GRAPH } from "@/lib/seo";

const DESCRIPTION =
  "Writing on full-stack development, AI, art, and ideas by Pardheev Vatturu.";

export const metadata: Metadata = {
  title: "Blog",
  description: DESCRIPTION,
  alternates: {
    canonical: "/blogs",
    types: { "application/rss+xml": "/blogs/rss.xml" },
  },
  openGraph: {
    ...BASE_OPEN_GRAPH,
    title: "Blog · Pardheev Vatturu",
    description: DESCRIPTION,
    url: "/blogs",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog · Pardheev Vatturu",
    description: DESCRIPTION,
  },
};

export default async function BlogsRoute() {
  const [posts, categories] = await Promise.all([
    getPublishedPosts(),
    getBlogCategories(),
  ]);
  return <BlogsPage posts={posts} categories={categories} />;
}
