"use client";

import { useState } from "react";

import { saveBook } from "@/lib/admin/actions";
import type { AdminBook } from "@/lib/content-types";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function BookForm({ book }: { book?: AdminBook }) {
  const [error, setError] = useState<string | null>(null);

  async function action(formData: FormData) {
    const result = await saveBook(formData);
    if (result?.error) setError(result.error);
  }

  return (
    <form action={action} className="space-y-5">
      {book ? <input type="hidden" name="id" value={book.id} /> : null}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required defaultValue={book?.title} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="subtitle">Subtitle</Label>
        <Input id="subtitle" name="subtitle" defaultValue={book?.subtitle} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="author">Author</Label>
        <Input id="author" name="author" defaultValue={book?.author} />
      </div>
      <ImageUpload
        name="cover_url"
        folder="books"
        label="Cover image"
        defaultUrl={book?.coverUrl}
      />
      <div className="space-y-2">
        <Label htmlFor="cover_alt">Cover alt text</Label>
        <Input
          id="cover_alt"
          name="cover_alt"
          defaultValue={book?.coverAlt}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="sort_order">Sort order</Label>
        <Input
          id="sort_order"
          name="sort_order"
          type="number"
          defaultValue={book?.sortOrder ?? 0}
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="published"
          defaultChecked={book?.published ?? false}
          className="size-4"
        />
        Published
      </label>
      {error ? <p className="text-destructive text-sm">{error}</p> : null}
      <Button type="submit" className="h-11 w-full sm:w-auto">
        Save book
      </Button>
    </form>
  );
}
