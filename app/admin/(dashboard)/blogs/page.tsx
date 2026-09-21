import Link from "next/link";
import { Newspaper } from "lucide-react";

import { DeleteButton } from "@/components/admin/DeleteButton";
import { EmptyState } from "@/components/admin/EmptyState";
import { PageHeader } from "@/components/admin/PageHeader";
import { SavedBanner } from "@/components/admin/SavedBanner";
import { PublishBadge, TypeBadge } from "@/components/admin/StatusBadge";
import { deletePost } from "@/lib/admin/actions";
import { categoryTone } from "@/lib/blog";
import { listAdminPosts } from "@/lib/queries";
import { Button } from "@/components/ui/button";

export default async function AdminBlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const posts = await listAdminPosts();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blogs"
        description="Write, draft, and publish posts."
        actionHref="/admin/blogs/new"
        actionLabel="New post"
      />
      <SavedBanner show={saved === "1"} />
      {posts.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          title="No posts yet"
          description="Start a draft. It stays off the public site until you publish."
          href="/admin/blogs/new"
          action="Write a post"
        />
      ) : (
        <ul className="space-y-3">
          {posts.map((post) => (
            <li
              key={post.id}
              className="border-border flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 space-y-1.5">
                <p className="font-medium tracking-tight">{post.title || "Untitled"}</p>
                <div className="flex flex-wrap items-center gap-1.5">
                  <PublishBadge published={post.published} />
                  {post.category ? (
                    <TypeBadge
                      label={post.category}
                      className={categoryTone(post.category)}
                    />
                  ) : null}
                  <span className="text-muted-foreground text-xs">{post.slug}</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/admin/blogs/${post.id}`}>Edit</Link>
                </Button>
                <DeleteButton action={deletePost} id={post.id} label="post" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
