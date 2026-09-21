"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Eye,
  ExternalLink,
  LoaderCircle,
  PenLine,
  TriangleAlert,
} from "lucide-react";

import { savePost } from "@/lib/admin/actions";
import { BLOG_CATEGORIES, normalizeTags, readingTimeMinutes } from "@/lib/blog";
import { slugify } from "@/lib/slug";
import type { AdminPost, SiteContent } from "@/lib/content-types";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { PublishBadge } from "@/components/admin/StatusBadge";
import { BlogArticle } from "@/components/blog/BlogArticle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Intent = "save" | "draft" | "publish" | "unpublish";

const EXCERPT_MAX = 200;

export function PostForm({
  post,
  site,
  notice,
}: {
  post?: AdminPost;
  site: Pick<SiteContent, "name" | "role" | "avatars">;
  notice?: string;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();

  const [tab, setTab] = useState<"write" | "preview">("write");
  const [title, setTitle] = useState(post?.title ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [category, setCategory] = useState(post?.category ?? "");
  const [tags, setTags] = useState(post?.tags.join(", ") ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [coverUrl, setCoverUrl] = useState(post?.coverUrl ?? "");
  const [coverAlt, setCoverAlt] = useState(post?.coverAlt ?? "");
  const [html, setHtml] = useState(post?.contentHtml ?? "");

  const [published, setPublished] = useState(post?.published ?? false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(notice ?? null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [liveSlug, setLiveSlug] = useState(post?.slug ?? "");

  const isNew = !post;
  const slugChanged = Boolean(post?.published && post.slug !== slug);

  // Warn before losing unsaved work (tab close, reload, hard navigation).
  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  function submit(intent: Intent) {
    const form = formRef.current;
    if (!form || pending) return;
    if (
      intent === "unpublish" &&
      !window.confirm(
        "Unpublish this post? It will disappear from the public blog until you publish it again.",
      )
    ) {
      return;
    }
    if (slugChanged && intent !== "draft" && intent !== "unpublish") {
      const ok = window.confirm(
        `You changed the URL from /blogs/${post?.slug} to /blogs/${slugify(slug)}.\n\nExisting links will break and the read count restarts. Continue?`,
      );
      if (!ok) return;
    }

    const data = new FormData(form);
    data.set("intent", intent);
    if (post?.id) data.set("id", post.id);
    setError(null);
    setMessage(null);

    startTransition(async () => {
      let result;
      try {
        result = await savePost(data);
      } catch {
        setError(
          "Couldn't reach the server. Your changes are still here. Try again.",
        );
        return;
      }
      if (result.error) {
        setError(result.error);
        return;
      }
      setDirty(false);
      setSavedAt(new Date());
      setPublished(Boolean(result.published));
      setLiveSlug(result.slug ?? slug);
      if (result.slug) setSlug(result.slug);
      if (isNew && result.id) {
        router.replace(
          `/admin/blogs/${result.id}?saved=${result.published ? "published" : "draft"}`,
        );
        return;
      }
      setMessage(
        intent === "publish"
          ? "Published. The post is live."
          : intent === "unpublish"
            ? "Unpublished. The post is now a draft."
            : result.published
              ? "Changes saved and live."
              : "Draft saved.",
      );
    });
  }

  // Cmd/Ctrl+S saves without changing publish state.
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        submit("save");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  const previewPost = {
    slug: slug || "preview",
    title,
    excerpt: excerpt || "",
    coverUrl: coverUrl || null,
    coverAlt,
    publishedAt: post?.publishedAt ?? null,
    tags: normalizeTags(tags),
    category,
    readsCount: 0,
    likesCount: 0,
    readingMinutes: readingTimeMinutes(html),
  };

  return (
    <form
      ref={formRef}
      onSubmit={(event) => {
        event.preventDefault();
        submit("save");
      }}
      onChange={() => setDirty(true)}
      className="space-y-6 pb-28"
    >
      {message ? (
        <p
          role="status"
          className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300"
        >
          <CheckCircle2 className="size-4 shrink-0" />
          <span className="min-w-0 flex-1">{message}</span>
          {published && liveSlug ? (
            <Link
              href={`/blogs/${liveSlug}`}
              target="_blank"
              className="inline-flex shrink-0 items-center gap-1 font-medium underline underline-offset-2"
            >
              View <ExternalLink className="size-3.5" />
            </Link>
          ) : null}
        </p>
      ) : null}

      <div
        role="tablist"
        aria-label="Editor mode"
        className="bg-muted/50 inline-flex rounded-xl p-1"
      >
        {(
          [
            ["write", "Write", PenLine],
            ["preview", "Preview", Eye],
          ] as const
        ).map(([id, label, Icon]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={cn(
              "inline-flex h-9 items-center gap-1.5 rounded-lg px-4 text-sm font-medium transition-colors",
              tab === id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === "preview" ? (
        <div className="border-border rounded-2xl border p-4 sm:p-8">
          <p className="text-muted-foreground mb-6 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
            Preview of how readers will see this post. Nothing here is saved or
            counted.
          </p>
          <BlogArticle post={previewPost} html={html} site={site} preview />
        </div>
      ) : null}

      <div className={cn("space-y-6", tab === "preview" && "hidden")}>
        <section className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              required
              value={title}
              placeholder="A clear, specific headline"
              className="h-12 text-base sm:text-lg"
              onChange={(event) => {
                setTitle(event.target.value);
                if (!slugTouched) setSlug(slugify(event.target.value));
              }}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <Label htmlFor="excerpt">Subtitle / excerpt</Label>
              <span
                className={cn(
                  "text-xs",
                  excerpt.length > EXCERPT_MAX
                    ? "text-destructive"
                    : "text-muted-foreground",
                )}
              >
                {excerpt.length}/{EXCERPT_MAX}
              </span>
            </div>
            <Textarea
              id="excerpt"
              name="excerpt"
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              placeholder="One or two sentences shown on the blog list, under the title, and in link previews."
            />
            <p className="text-muted-foreground text-xs">
              Leave blank to use the opening of the post.
            </p>
          </div>
        </section>

        <ImageUpload
          name="cover_url"
          folder="posts"
          label="Cover / banner image"
          defaultUrl={coverUrl}
          cover
          hint="Shown 16:9 on the list, the post, and social previews. Best at 1600×900 or larger."
          onChange={(url) => {
            setCoverUrl(url);
            setDirty(true);
          }}
        />
        {coverUrl ? (
          <div className="space-y-2">
            <Label htmlFor="cover_alt">Cover description (alt text)</Label>
            <Input
              id="cover_alt"
              name="cover_alt"
              value={coverAlt}
              onChange={(event) => setCoverAlt(event.target.value)}
              placeholder="Describe the image for screen readers and link previews"
            />
          </div>
        ) : null}

        <div className="space-y-2">
          <Label>Body</Label>
          <RichTextEditor
            name="content_html"
            defaultHtml={post?.contentHtml}
            onChange={(next) => {
              setHtml(next);
              setDirty(true);
            }}
          />
        </div>

        <section className="border-border space-y-5 rounded-2xl border p-4 sm:p-5">
          <h2 className="text-sm font-medium">Details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="border-input bg-background h-11 w-full rounded-lg border px-3 text-sm"
              >
                <option value="">Uncategorized</option>
                {BLOG_CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                name="tags"
                value={tags}
                onChange={(event) => setTags(event.target.value)}
                placeholder="nextjs, supabase, notes"
              />
              <p className="text-muted-foreground text-xs">
                Comma separated, up to 8.
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">URL</Label>
            <div className="border-input bg-background focus-within:ring-ring/50 flex items-center overflow-hidden rounded-lg border focus-within:ring-3">
              <span className="text-muted-foreground bg-muted/40 border-input hidden h-11 items-center border-r px-3 text-sm sm:flex">
                /blogs/
              </span>
              <input
                id="slug"
                name="slug"
                required
                value={slug}
                onChange={(event) => {
                  setSlugTouched(true);
                  setSlug(slugify(event.target.value));
                }}
                className="h-11 w-full bg-transparent px-3 text-sm outline-none"
              />
            </div>
            {slugChanged ? (
              <p className="flex items-start gap-1.5 text-xs text-amber-700 dark:text-amber-300">
                <TriangleAlert className="mt-0.5 size-3.5 shrink-0" />
                This post is live. Changing the URL breaks existing links and
                restarts its read count.
              </p>
            ) : null}
          </div>
        </section>
      </div>

      {error ? (
        <p
          role="alert"
          className="text-destructive border-destructive/20 bg-destructive/10 flex items-start gap-2 rounded-xl border px-3 py-2 text-sm"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      ) : null}

      <div className="border-border bg-background/95 sticky bottom-[4.5rem] z-20 -mx-4 flex flex-col gap-3 border-t px-4 py-3 backdrop-blur sm:flex-row sm:items-center sm:justify-between md:bottom-0 md:mx-0 md:rounded-2xl md:border">
        <div className="flex items-center gap-2 text-sm">
          <PublishBadge published={published} />
          <span className="text-muted-foreground text-xs" aria-live="polite">
            {pending
              ? "Saving…"
              : dirty
                ? "Unsaved changes"
                : savedAt
                  ? `Saved ${savedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                  : isNew
                    ? "Not saved yet"
                    : "All changes saved"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/blogs"
            className="text-muted-foreground hover:text-foreground inline-flex h-11 items-center px-3 text-sm"
          >
            {dirty ? "Discard" : "Back"}
          </Link>
          {published ? (
            <>
              <Button
                type="button"
                variant="outline"
                className="h-11 flex-1 sm:flex-none sm:px-4"
                disabled={pending}
                onClick={() => submit("unpublish")}
              >
                Unpublish
              </Button>
              <Button
                type="button"
                className="h-11 flex-1 sm:flex-none sm:px-6"
                disabled={pending || !dirty}
                onClick={() => submit("save")}
              >
                {pending ? <LoaderCircle className="animate-spin" /> : null}
                Save changes
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                className="h-11 flex-1 sm:flex-none sm:px-4"
                disabled={pending}
                onClick={() => submit("draft")}
              >
                Save draft
              </Button>
              <Button
                type="button"
                className="h-11 flex-1 sm:flex-none sm:px-6"
                disabled={pending}
                onClick={() => submit("publish")}
              >
                {pending ? <LoaderCircle className="animate-spin" /> : null}
                Publish
              </Button>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
