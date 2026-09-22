import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, ExternalLink, Heart } from "lucide-react";

import { PostForm } from "@/components/admin/PostForm";
import {
  getAdminPost,
  getBlogCategories,
  getSiteSettings,
} from "@/lib/queries";

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const [{ id }, { saved }] = await Promise.all([params, searchParams]);
  const [post, site, categories] = await Promise.all([
    getAdminPost(id),
    getSiteSettings(),
    getBlogCategories(),
  ]);
  if (!post) notFound();

  const notice =
    saved === "published"
      ? "Published. The post is live."
      : saved === "draft"
        ? "Draft saved. It stays private until you publish."
        : undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Edit post</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {post.published
              ? "This post is live."
              : "This post is still a draft."}
          </p>
        </div>
        {post.published ? (
          <div className="text-muted-foreground flex items-center gap-4 text-sm">
            <span
              className="inline-flex items-center gap-1.5"
              title="Unique reads"
            >
              <BookOpen className="size-4" /> {post.readsCount}
            </span>
            <span className="inline-flex items-center gap-1.5" title="Likes">
              <Heart className="size-4" /> {post.likesCount}
            </span>
            <Link
              href={`/blogs/${post.slug}`}
              target="_blank"
              className="hover:text-foreground inline-flex items-center gap-1.5"
            >
              View live <ExternalLink className="size-4" />
            </Link>
          </div>
        ) : null}
      </div>
      <PostForm
        key={post.id}
        post={post}
        site={site}
        categories={categories}
        notice={notice}
      />
    </div>
  );
}
