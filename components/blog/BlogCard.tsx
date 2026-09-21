import Image from "next/image";
import Link from "next/link";

import { categoryTone, formatPostDate, readingTimeMinutes } from "@/lib/blog";
import type { PostListItem } from "@/lib/content-types";
import { TypeBadge } from "@/components/admin/StatusBadge";
import { cn } from "@/lib/utils";

export function BlogCard({ post }: { post: PostListItem }) {
  const date = formatPostDate(post.publishedAt);
  const minutes = readingTimeMinutes(post.excerpt);

  return (
    <Link
      href={`/blogs/${post.slug}`}
      className="border-border bg-card hover:bg-muted/30 group overflow-hidden rounded-2xl border transition-colors"
    >
      {post.coverUrl ? (
        <div className="bg-muted relative aspect-[16/9] overflow-hidden">
          <Image
            src={post.coverUrl}
            alt=""
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      ) : null}
      <div className="space-y-2 p-5">
        <div className="flex flex-wrap items-center gap-1.5">
          {post.category ? (
            <TypeBadge
              label={post.category}
              className={categoryTone(post.category)}
            />
          ) : null}
          {date ? (
            <span className="text-muted-foreground text-xs">{date}</span>
          ) : null}
          <span className="text-muted-foreground text-xs">{minutes} min read</span>
        </div>
        <h2 className="text-lg font-semibold tracking-tight">{post.title}</h2>
        {post.excerpt ? (
          <p className="text-muted-foreground line-clamp-2 text-sm leading-6">
            {post.excerpt}
          </p>
        ) : null}
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
        "border-border hover:bg-muted/40 block rounded-xl border p-4 transition-colors",
        className,
      )}
    >
      {post.category ? (
        <TypeBadge
          label={post.category}
          className={cn("mb-2", categoryTone(post.category))}
        />
      ) : null}
      <p className="font-medium tracking-tight">{post.title}</p>
      {post.excerpt ? (
        <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
          {post.excerpt}
        </p>
      ) : null}
    </Link>
  );
}
