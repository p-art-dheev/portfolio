import Image from "next/image";
import Link from "next/link";

import { BlogCardCompact } from "@/components/blog/BlogCard";
import { BlogEngagement } from "@/components/blog/BlogEngagement";
import { TypeBadge } from "@/components/admin/StatusBadge";
import {
  categoryTone,
  formatPostDate,
  readingTimeMinutes,
} from "@/lib/blog";
import type { PostDetail, PostListItem, SiteContent } from "@/lib/content-types";

export function BlogArticle({
  post,
  html,
  site,
  related,
}: {
  post: PostDetail;
  html: string;
  site: SiteContent;
  related: PostListItem[];
}) {
  const date = formatPostDate(post.publishedAt);
  const minutes = readingTimeMinutes(post.contentHtml || html);
  const avatar = site.avatars[0];

  return (
    <article className="mx-auto max-w-2xl">
      <p className="text-muted-foreground mb-6 text-sm">
        <Link href="/blogs" className="hover:text-foreground">
          Blogs
        </Link>
        <span className="mx-1.5">/</span>
        <span>{post.title}</span>
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {post.category ? (
          <TypeBadge
            label={post.category}
            className={categoryTone(post.category)}
          />
        ) : null}
        {date ? <span className="text-muted-foreground text-sm">{date}</span> : null}
        <span className="text-muted-foreground text-sm">{minutes} min read</span>
      </div>

      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        {post.title}
      </h1>
      {post.excerpt ? (
        <p className="text-muted-foreground mt-4 text-lg leading-7">{post.excerpt}</p>
      ) : null}

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
        <BlogEngagement
          slug={post.slug}
          initialViews={post.viewsCount}
          initialLikes={post.likesCount}
        />
      </div>

      {post.coverUrl ? (
        <div className="bg-muted relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl">
          <Image
            src={post.coverUrl}
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 672px, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}

      {post.tags.length > 0 ? (
        <ul className="mt-6 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <li
              key={tag}
              className="bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 text-xs"
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}

      <div
        className="blog-content mt-10"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {related.length > 0 ? (
        <section className="border-border mt-16 border-t pt-10">
          <h2 className="text-lg font-medium tracking-tight">More writing</h2>
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
