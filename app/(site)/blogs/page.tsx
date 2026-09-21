import type { Metadata } from "next";

import { BlogsPage } from "@/components/BlogsPage";
import { getPublishedPosts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Writing on full-stack development, AI, art, and ideas by Pardheev Vatturu.",
  alternates: {
    canonical: "/blogs",
    types: { "application/rss+xml": "/blogs/rss.xml" },
  },
  openGraph: { title: "Blog · Pardheev Vatturu", url: "/blogs" },
};

export default async function BlogsRoute() {
  const posts = await getPublishedPosts();
  return <BlogsPage posts={posts} />;
}
