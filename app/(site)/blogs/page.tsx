import type { Metadata } from "next";

import { BlogsPage } from "@/components/BlogsPage";
import { getPublishedPosts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Blogs",
  description: "Writing on development, AI, and ideas.",
};

export default async function BlogsRoute() {
  const posts = await getPublishedPosts();
  return <BlogsPage posts={posts} />;
}
