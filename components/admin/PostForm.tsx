"use client";

import { useState } from "react";

import { savePost } from "@/lib/admin/actions";
import { slugify } from "@/lib/slug";
import type { AdminPost } from "@/lib/content-types";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { Button } from "@/components/ui/button";
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
    <form action={action} className="space-y-5">
      {post ? <input type="hidden" name="id" value={post.id} /> : null}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          required
          defaultValue={post?.title}
          onChange={(event) => {
            if (!post) setSlug(slugify(event.target.value));
          }}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          name="slug"
          required
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea id="excerpt" name="excerpt" defaultValue={post?.excerpt} />
      </div>
      <ImageUpload
        name="cover_url"
        folder="posts"
        label="Cover image"
        defaultUrl={post?.coverUrl ?? ""}
      />
      <div className="space-y-2">
        <Label>Body</Label>
        <RichTextEditor name="content_html" defaultHtml={post?.contentHtml} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="published"
          defaultChecked={post?.published ?? false}
          className="size-4"
        />
        Published
      </label>
      {error ? <p className="text-destructive text-sm">{error}</p> : null}
      <Button type="submit" className="h-11 w-full sm:w-auto">
        Save post
      </Button>
    </form>
  );
}
