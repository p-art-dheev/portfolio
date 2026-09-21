"use client";

import { useState } from "react";

import { saveArtwork } from "@/lib/admin/actions";
import type { AdminArtwork } from "@/lib/content-types";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ArtworkForm({ artwork }: { artwork?: AdminArtwork }) {
  const [error, setError] = useState<string | null>(null);
  const [width, setWidth] = useState(artwork?.width ?? 1200);
  const [height, setHeight] = useState(artwork?.height ?? 1600);

  async function action(formData: FormData) {
    const result = await saveArtwork(formData);
    if (result?.error) setError(result.error);
  }

  return (
    <form action={action} className="space-y-5">
      {artwork ? <input type="hidden" name="id" value={artwork.id} /> : null}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required defaultValue={artwork?.title} />
      </div>
      <ImageUpload
        name="image_url"
        folder="artworks"
        label="Artwork image"
        defaultUrl={artwork?.imageUrl}
        onMeta={({ width: nextWidth, height: nextHeight }) => {
          setWidth(nextWidth);
          setHeight(nextHeight);
        }}
      />
      <div className="space-y-2">
        <Label htmlFor="alt">Alt text</Label>
        <Input id="alt" name="alt" defaultValue={artwork?.alt} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="width">Width</Label>
          <Input
            id="width"
            name="width"
            type="number"
            value={width}
            onChange={(event) => setWidth(Number(event.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="height">Height</Label>
          <Input
            id="height"
            name="height"
            type="number"
            value={height}
            onChange={(event) => setHeight(Number(event.target.value))}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="link">Link (optional)</Label>
        <Input id="link" name="link" defaultValue={artwork?.link ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="sort_order">Sort order</Label>
        <Input
          id="sort_order"
          name="sort_order"
          type="number"
          defaultValue={artwork?.sortOrder ?? 0}
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="published"
          defaultChecked={artwork?.published ?? false}
          className="size-4"
        />
        Published
      </label>
      {error ? <p className="text-destructive text-sm">{error}</p> : null}
      <Button type="submit" className="h-11 w-full sm:w-auto">
        Save artwork
      </Button>
    </form>
  );
}
