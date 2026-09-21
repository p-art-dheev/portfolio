"use client";

import { useState } from "react";
import Link from "next/link";

import { savePost } from "@/lib/admin/actions";
import { BLOG_CATEGORIES } from "@/lib/blog";
import { slugify } from "@/lib/slug";
import type { AdminPost } from "@/lib/content-types";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function PostForm({ post }: { post?: AdminPost }) {
  const [error, setError] = useState<string | null>(null);
  const [slug, setSlug] = useState(post?.slug ?? "");

  async function action(formData: FormData) {
    const result = await savePost(formData);
    if (result?.error) setError(result.error);
  }

  return (
    <form action={action} className="space-y-8 pb-24">
      {post ? <input type="hidden" name="id" value={post.id} /> : null}

      <section className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            required
            defaultValue={post?.title}
            placeholder="A clear, specific headline"
            className="h-12 text-base sm:text-lg"
            onChange={(event) => {
              if (!post) setSlug(slugify(event.target.value));
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="excerpt">Subtitle / excerpt</Label>
          <Textarea
            id="excerpt"
            name="excerpt"
            defaultValue={post?.excerpt}
            placeholder="One or two sentences shown on the blog list and under the title."
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              name="category"
              defaultValue={post?.category ?? ""}
              className="border-input bg-background h-11 w-full rounded-lg border px-3 text-sm"
            >
              <option value="">Uncategorized</option>
              {BLOG_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              name="tags"
              defaultValue={post?.tags.join(", ")}
              placeholder="nextjs, supabase, notes"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">URL slug</Label>
          <Input
            id="slug"
            name="slug"
            required
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
          />
          <p className="text-muted-foreground text-xs">/blogs/{slug || "your-slug"}</p>
        </div>
      </section>

      <ImageUpload
        name="cover_url"
        folder="posts"
        label="Cover / banner image"
        defaultUrl={post?.coverUrl ?? ""}
      />

      <div className="space-y-2">
        <Label>Body</Label>
        <RichTextEditor name="content_html" defaultHtml={post?.contentHtml} />
      </div>

      {error ? (
        <p className="text-destructive rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm">
          {error}
        </p>
      ) : null}

      <div className="border-border bg-background/95 sticky bottom-[4.5rem] z-20 -mx-4 flex flex-col gap-3 border-t px-4 py-3 backdrop-blur sm:flex-row sm:items-center sm:justify-between md:bottom-0 md:mx-0 md:rounded-2xl md:border">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="published"
            defaultChecked={post?.published ?? false}
            className="size-4"
          />
          Publish on the public blog
        </label>
        <div className="flex gap-2">
          <Link
            href="/admin/blogs"
            className="text-muted-foreground hover:text-foreground inline-flex h-11 items-center px-3 text-sm"
          >
            Cancel
          </Link>
          <SubmitButton className="h-11 flex-1 sm:flex-none sm:px-6">
            {post ? "Save post" : "Create post"}
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}
