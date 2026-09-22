import Image from "next/image";
import Link from "next/link";
import { BookOpen, ExternalLink, Heart, Newspaper, Search } from "lucide-react";

import { DeleteButton } from "@/components/admin/DeleteButton";
import { EmptyState } from "@/components/admin/EmptyState";
import { PageHeader } from "@/components/admin/PageHeader";
import { PublishToggle } from "@/components/admin/PublishToggle";
import { SavedBanner } from "@/components/admin/SavedBanner";
import { PublishBadge, TypeBadge } from "@/components/admin/StatusBadge";
import { deletePost } from "@/lib/admin/actions";
import { categoryTone, formatPostDate } from "@/lib/blog";
import { listAdminPosts } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Filter = "all" | "published" | "draft";

export default async function AdminBlogsPage({
  searchParams,
}: {
  searchParams: Promise<{
    saved?: string;
    deleted?: string;
    status?: string;
    q?: string;
  }>;
}) {
  const { saved, deleted, status, q } = await searchParams;
  const filter: Filter =
    status === "published" || status === "draft" ? status : "all";
  const query = (q ?? "").trim().toLowerCase();

  const posts = await listAdminPosts();
  const counts = {
    all: posts.length,
    published: posts.filter((post) => post.published).length,
    draft: posts.filter((post) => !post.published).length,
  };
  const totalReads = posts.reduce((sum, post) => sum + post.readsCount, 0);
  const totalLikes = posts.reduce((sum, post) => sum + post.likesCount, 0);

  const visible = posts.filter(
    (post) =>
      (filter === "all" || (filter === "published") === post.published) &&
      (!query ||
        [post.title, post.slug, post.category, ...post.tags]
          .join(" ")
          .toLowerCase()
          .includes(query)),
  );

  const tab = (value: Filter, label: string) => (
    <Link
      key={value}
      href={{
        pathname: "/admin/blogs",
        query: {
          ...(value === "all" ? {} : { status: value }),
          ...(q ? { q } : {}),
        },
      }}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm transition-colors",
        filter === value
          ? "bg-background text-foreground font-medium shadow-sm"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
      <span className="text-muted-foreground text-xs">{counts[value]}</span>
    </Link>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blogs"
        description="Write, draft, and publish posts."
        actionHref="/admin/blogs/new"
        actionLabel="New post"
      />
      <Link
        href="/admin/blogs/categories"
        className="text-muted-foreground hover:text-foreground -mt-3 inline-flex items-center gap-1 text-sm underline underline-offset-2"
      >
        Manage categories
      </Link>
      <SavedBanner show={saved === "1"} />
      {deleted === "1" ? (
        <p className="border-border bg-muted/40 rounded-xl border px-3 py-2 text-sm">
          Post deleted.
        </p>
      ) : null}

      {posts.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          title="No posts yet"
          description="Start a draft. It stays off the public site until you publish."
          href="/admin/blogs/new"
          action="Write a post"
        />
      ) : (
        <>
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["Published", counts.published],
              ["Drafts", counts.draft],
              ["Unique reads", totalReads],
              ["Likes", totalLikes],
            ].map(([label, value]) => (
              <div
                key={label}
                className="border-border rounded-xl border px-4 py-3"
              >
                <dt className="text-muted-foreground text-xs">{label}</dt>
                <dd className="mt-0.5 text-xl font-semibold tracking-tight">
                  {Number(value).toLocaleString("en-US")}
                </dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="bg-muted/50 inline-flex self-start rounded-xl p-1">
              {tab("all", "All")}
              {tab("published", "Published")}
              {tab("draft", "Drafts")}
            </div>
            <form action="/admin/blogs" className="relative sm:w-64">
              {filter !== "all" ? (
                <input type="hidden" name="status" value={filter} />
              ) : null}
              <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
              <input
                type="search"
                name="q"
                defaultValue={q}
                placeholder="Search title, tag, slug"
                aria-label="Search posts"
                className="border-input bg-background h-9 w-full rounded-lg border pr-3 pl-8 text-sm"
              />
            </form>
          </div>

          {visible.length === 0 ? (
            <p className="text-muted-foreground border-border rounded-2xl border border-dashed px-6 py-12 text-center text-sm">
              No posts match your filters.
            </p>
          ) : (
            <ul className="space-y-3">
              {visible.map((post) => (
                <li
                  key={post.id}
                  className="border-border flex flex-col gap-4 rounded-2xl border p-3 sm:flex-row sm:items-center sm:p-4"
                >
                  <Link
                    href={`/admin/blogs/${post.id}`}
                    className="bg-muted relative aspect-[16/9] w-full shrink-0 overflow-hidden rounded-xl sm:w-32"
                    aria-label={`Edit ${post.title || "post"}`}
                  >
                    {post.coverUrl ? (
                      <Image
                        src={post.coverUrl}
                        alt=""
                        fill
                        sizes="(min-width: 640px) 128px, 100vw"
                        className="object-cover"
                      />
                    ) : null}
                  </Link>

                  <div className="min-w-0 flex-1 space-y-1.5">
                    <Link
                      href={`/admin/blogs/${post.id}`}
                      className="line-clamp-2 font-medium tracking-tight hover:underline"
                    >
                      {post.title || "Untitled"}
                    </Link>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <PublishBadge published={post.published} />
                      {post.category ? (
                        <TypeBadge
                          label={post.category}
                          className={categoryTone(post.categoryColor)}
                        />
                      ) : null}
                      <span className="text-muted-foreground text-xs">
                        {post.published
                          ? `Published ${formatPostDate(post.publishedAt) ?? ""}`
                          : `Edited ${formatPostDate(post.updatedAt) ?? ""}`}
                      </span>
                    </div>
                    <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                      <span className="truncate">/blogs/{post.slug}</span>
                      <span>{post.readingMinutes} min</span>
                      {post.published ? (
                        <>
                          <span className="inline-flex items-center gap-1">
                            <BookOpen className="size-3" /> {post.readsCount}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Heart className="size-3" /> {post.likesCount}
                          </span>
                        </>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-start gap-2 sm:justify-end">
                    <PublishToggle id={post.id} published={post.published} />
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/blogs/${post.id}`}>Edit</Link>
                    </Button>
                    {post.published ? (
                      <Button
                        asChild
                        size="sm"
                        variant="ghost"
                        title="View live"
                      >
                        <Link
                          href={`/blogs/${post.slug}`}
                          target="_blank"
                          aria-label="View live post"
                        >
                          <ExternalLink />
                        </Link>
                      </Button>
                    ) : null}
                    <DeleteButton
                      action={deletePost}
                      id={post.id}
                      label="post"
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
