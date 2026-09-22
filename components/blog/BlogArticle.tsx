import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ListTree } from "lucide-react";

import { TypeBadge } from "@/components/admin/StatusBadge";
import { BlogCardCompact } from "@/components/blog/BlogCard";
import {
  BlogEngagement,
  BlogEngagementPreview,
} from "@/components/blog/BlogEngagement";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { categoryTone, formatPostDate, withHeadingAnchors } from "@/lib/blog";
import type {
  PostDetail,
  PostListItem,
  SiteContent,
} from "@/lib/content-types";

type ArticlePost = Pick<
  PostDetail,
  | "slug"
  | "title"
  | "excerpt"
  | "coverUrl"
  | "coverAlt"
  | "publishedAt"
  | "tags"
  | "category"
  | "categoryColor"
  | "readsCount"
  | "likesCount"
  | "readingMinutes"
>;

export function BlogArticle({
  post,
  html,
  site,
  related = [],
  preview = false,
}: {
  post: ArticlePost;
  /** Sanitized body HTML. */
  html: string;
  site: Pick<SiteContent, "name" | "role" | "avatars">;
  related?: PostListItem[];
  /** Admin preview: no tracking, no breadcrumbs, no related posts. */
  preview?: boolean;
}) {
  const date = formatPostDate(post.publishedAt);
  const avatar = site.avatars[0];
  const { html: body, toc } = withHeadingAnchors(html);
  const articleId = `article-${post.slug || "preview"}`;

  return (
    <article id={articleId} className="mx-auto max-w-2xl">
      {preview ? null : <ReadingProgress targetId={articleId} />}

      {preview ? null : (
        <Link
          href="/blogs"
          className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft className="size-4" />
          All posts
        </Link>
      )}

      <header>
        <div className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1.5">
          {post.category ? (
            <TypeBadge
              label={post.category}
              className={categoryTone(post.categoryColor)}
            />
          ) : null}
          {date ? (
            <time
              dateTime={post.publishedAt ?? undefined}
              className="text-muted-foreground text-sm"
            >
              {date}
            </time>
          ) : preview ? (
            <span className="text-muted-foreground text-sm">
              Not published yet
            </span>
          ) : null}
          <span aria-hidden className="text-muted-foreground text-sm">
            ·
          </span>
          <span className="text-muted-foreground text-sm">
            {post.readingMinutes} min read
          </span>
        </div>

        <h1 className="text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
          {post.title || "Untitled post"}
        </h1>
        {post.excerpt ? (
          <p className="text-muted-foreground mt-4 text-lg leading-7 text-pretty">
            {post.excerpt}
          </p>
        ) : null}

        <div className="border-border mt-6 flex flex-col gap-4 border-y py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            {avatar ? (
              <Image
                src={avatar}
                alt=""
                width={40}
                height={40}
                className="size-10 rounded-full object-cover"
              />
            ) : null}
            <div>
              <p className="text-sm font-medium">{site.name}</p>
              <p className="text-muted-foreground text-xs">{site.role}</p>
            </div>
          </div>
          {preview ? (
            <BlogEngagementPreview />
          ) : (
            <BlogEngagement
              slug={post.slug}
              title={post.title}
              initialReads={post.readsCount}
              initialLikes={post.likesCount}
            />
          )}
        </div>
      </header>

      {post.coverUrl ? (
        <figure className="mt-8">
          <div className="bg-muted relative aspect-[16/9] overflow-hidden rounded-2xl">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.coverUrl}
                alt={post.coverAlt}
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              <Image
                src={post.coverUrl}
                alt={post.coverAlt}
                fill
                priority
                sizes="(min-width: 768px) 672px, 100vw"
                className="object-cover"
              />
            )}
          </div>
        </figure>
      ) : null}

      {toc.length >= 3 ? (
        <details className="border-border bg-muted/20 group mt-8 rounded-xl border px-4 py-3 text-sm">
          <summary className="flex cursor-pointer list-none items-center gap-2 font-medium select-none">
            <ListTree className="text-muted-foreground size-4" />
            In this post
            <span className="text-muted-foreground ml-auto text-xs group-open:hidden">
              {toc.length} sections
            </span>
          </summary>
          <ol className="mt-3 space-y-1.5">
            {toc.map((item) => (
              <li
                key={item.id}
                className={item.level === 3 ? "pl-4" : undefined}
              >
                <a
                  href={`#${item.id}`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ol>
        </details>
      ) : null}

      <div
        className="blog-content blog-article mt-10"
        dangerouslySetInnerHTML={{ __html: body }}
      />

      {post.tags.length > 0 ? (
        <ul
          className="border-border mt-12 flex flex-wrap gap-2 border-t pt-6"
          aria-label="Tags"
        >
          {post.tags.map((tag) => (
            <li key={tag}>
              {preview ? (
                <span className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs">
                  #{tag}
                </span>
              ) : (
                <Link
                  href={`/blogs?q=${encodeURIComponent(tag)}`}
                  className="bg-muted text-muted-foreground hover:text-foreground rounded-full px-3 py-1 text-xs transition-colors"
                >
                  #{tag}
                </Link>
              )}
            </li>
          ))}
        </ul>
      ) : null}

      {related.length > 0 ? (
        <section className="border-border mt-14 border-t pt-10">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-medium tracking-tight">Keep reading</h2>
            <Link
              href="/blogs"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              All posts
            </Link>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {related.map((item) => (
              <BlogCardCompact key={item.slug} post={item} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
