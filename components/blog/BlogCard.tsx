import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Heart } from "lucide-react";

import { TypeBadge } from "@/components/admin/StatusBadge";
import { categoryTone, formatPostDate } from "@/lib/blog";
import type { PostListItem } from "@/lib/content-types";
import { cn } from "@/lib/utils";

function CoverFallback({ post }: { post: PostListItem }) {
  return (
    <div
      aria-hidden
      className="from-muted to-muted/40 flex h-full w-full items-end bg-gradient-to-br p-4"
    >
      <span className="text-muted-foreground/40 line-clamp-2 text-2xl leading-tight font-semibold tracking-tight">
        {post.category || post.title}
      </span>
    </div>
  );
}

function Cover({
  post,
  sizes,
  priority,
  className,
}: {
  post: PostListItem;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("bg-muted relative overflow-hidden", className)}>
      {post.coverUrl ? (
        <Image
          src={post.coverUrl}
          alt=""
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        <CoverFallback post={post} />
      )}
    </div>
  );
}

function Meta({ post, className }: { post: PostListItem; className?: string }) {
  const date = formatPostDate(post.publishedAt);
  return (
    <div
      className={cn(
        "text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1 text-xs",
        className,
      )}
    >
      {date ? (
        <time dateTime={post.publishedAt ?? undefined}>{date}</time>
      ) : null}
      {date ? <span aria-hidden>·</span> : null}
      <span>{post.readingMinutes} min read</span>
    </div>
  );
}

function Stats({ post }: { post: PostListItem }) {
  if (post.readsCount === 0 && post.likesCount === 0) return null;
  return (
    <div className="text-muted-foreground flex items-center gap-3 text-xs">
      {post.readsCount > 0 ? (
        <span className="inline-flex items-center gap-1" title="Unique reads">
          <BookOpen className="size-3.5" />
          {post.readsCount.toLocaleString("en-US")}
        </span>
      ) : null}
      {post.likesCount > 0 ? (
        <span className="inline-flex items-center gap-1" title="Likes">
          <Heart className="size-3.5" />
          {post.likesCount.toLocaleString("en-US")}
        </span>
      ) : null}
    </div>
  );
}

const cardFocus =
  "focus-visible:ring-ring/50 outline-none focus-visible:ring-3";

export function BlogCard({
  post,
  priority,
}: {
  post: PostListItem;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/blogs/${post.slug}`}
      className={cn(
        "border-border bg-card hover:border-foreground/20 group flex h-full flex-col overflow-hidden rounded-2xl border transition-colors",
        cardFocus,
      )}
    >
      <Cover
        post={post}
        priority={priority}
        sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 100vw"
        className="aspect-[16/9]"
      />
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex flex-wrap items-center gap-2">
          {post.category ? (
            <TypeBadge
              label={post.category}
              className={categoryTone(post.categoryColor)}
            />
          ) : null}
          <Meta post={post} />
        </div>
        <h2 className="text-lg leading-snug font-semibold tracking-tight">
          {post.title}
        </h2>
        {post.excerpt ? (
          <p className="text-muted-foreground line-clamp-3 text-sm leading-6">
            {post.excerpt}
          </p>
        ) : null}
        <div className="mt-auto flex items-center justify-between pt-3">
          <Stats post={post} />
          <span className="text-muted-foreground group-hover:text-foreground ml-auto inline-flex items-center gap-1 text-xs font-medium transition-colors">
            Read
            <ArrowUpRight className="size-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Wide card used for the newest post at the top of the list. */
export function BlogCardFeatured({ post }: { post: PostListItem }) {
  return (
    <Link
      href={`/blogs/${post.slug}`}
      className={cn(
        "border-border bg-card hover:border-foreground/20 group grid overflow-hidden rounded-2xl border transition-colors md:grid-cols-5",
        cardFocus,
      )}
    >
      <Cover
        post={post}
        priority
        sizes="(min-width: 1024px) 34vw, (min-width: 768px) 50vw, 100vw"
        className="aspect-[16/9] md:col-span-3 md:aspect-auto md:min-h-64"
      />
      <div className="flex flex-col gap-3 p-5 sm:p-6 md:col-span-2">
        <div className="flex flex-wrap items-center gap-2">
          <TypeBadge label="Latest" className="bg-foreground text-background" />
          {post.category ? (
            <TypeBadge
              label={post.category}
              className={categoryTone(post.categoryColor)}
            />
          ) : null}
        </div>
        <h2 className="text-xl leading-snug font-semibold tracking-tight sm:text-2xl">
          {post.title}
        </h2>
        {post.excerpt ? (
          <p className="text-muted-foreground line-clamp-4 text-sm leading-6">
            {post.excerpt}
          </p>
        ) : null}
        <div className="mt-auto space-y-3 pt-2">
          <Meta post={post} />
          <div className="flex items-center justify-between">
            <Stats post={post} />
            <span className="text-muted-foreground group-hover:text-foreground ml-auto inline-flex items-center gap-1 text-xs font-medium transition-colors">
              Read post
              <ArrowUpRight className="size-3.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function BlogCardCompact({
  post,
  className,
}: {
  post: PostListItem;
  className?: string;
}) {
  return (
    <Link
      href={`/blogs/${post.slug}`}
      className={cn(
        "border-border bg-card hover:border-foreground/20 group flex h-full flex-col gap-2 rounded-xl border p-4 transition-colors",
        cardFocus,
        className,
      )}
    >
      {post.category ? (
        <TypeBadge
          label={post.category}
          className={cn("self-start", categoryTone(post.categoryColor))}
        />
      ) : null}
      <p className="leading-snug font-medium tracking-tight">{post.title}</p>
      {post.excerpt ? (
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {post.excerpt}
        </p>
      ) : null}
      <Meta post={post} className="mt-auto pt-1" />
    </Link>
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="border-border bg-card overflow-hidden rounded-2xl border">
      <div className="bg-muted aspect-[16/9] animate-pulse" />
      <div className="space-y-3 p-5">
        <div className="bg-muted h-3 w-1/3 animate-pulse rounded" />
        <div className="bg-muted h-5 w-4/5 animate-pulse rounded" />
        <div className="bg-muted h-3 w-full animate-pulse rounded" />
        <div className="bg-muted h-3 w-2/3 animate-pulse rounded" />
      </div>
    </div>
  );
}
