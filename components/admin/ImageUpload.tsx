"use client";

import { useState, useTransition } from "react";
import { ImagePlus, LoaderCircle } from "lucide-react";

import { uploadMediaFile } from "@/lib/admin/actions";
import { prepareImage } from "@/lib/admin/prepare-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type ImageUploadProps = {
  name: string;
  folder: string;
  label: string;
  defaultUrl?: string;
  accept?: string;
  onMeta?: (meta: { width: number; height: number }) => void;
  /** Show the preview cropped to 16:9, exactly as blog covers are displayed. */
  cover?: boolean;
  hint?: string;
  /** Called whenever the image URL changes (upload, paste, remove). */
  onChange?: (url: string) => void;
};

export function ImageUpload({
  name,
  folder,
  label,
  defaultUrl = "",
  accept = "image/*",
  onMeta,
  cover = false,
  hint,
  onChange,
}: ImageUploadProps) {
  const [url, setUrl] = useState(defaultUrl);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [dragging, setDragging] = useState(false);

  function setValue(next: string) {
    setUrl(next);
    onChange?.(next);
  }

  function upload(original: File) {
    setError(null);
    if (
      !original.type.startsWith("image/") &&
      original.type !== "application/pdf"
    ) {
      setError("Choose an image (JPG, PNG, WebP, GIF or AVIF).");
      return;
    }
    startTransition(async () => {
      const file = await prepareImage(original);
      if (file.size > 10 * 1024 * 1024) {
        setError("That image is still over 10 MB after compression.");
        return;
      }
      await send(file);
    });
  }

  async function send(file: File) {
    if (file.type.startsWith("image/") && onMeta) {
      const preview = URL.createObjectURL(file);
      const image = new window.Image();
      image.onload = () => {
        onMeta({ width: image.naturalWidth, height: image.naturalHeight });
        URL.revokeObjectURL(preview);
      };
      image.src = preview;
    }

    const data = new FormData();
    data.set("file", file);
    data.set("folder", folder);
    try {
      const result = await uploadMediaFile(data);
      if (result.error || !result.url) {
        setError(result.error ?? "Upload failed.");
        return;
      }
      setValue(result.url);
    } catch {
      setError("Upload failed. Check your connection and try again.");
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={`${name}-file`}>{label}</Label>
      <input type="hidden" name={name} value={url} />
      <label
        htmlFor={`${name}-file`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          const file = event.dataTransfer.files?.[0];
          if (file) upload(file);
        }}
        className={cn(
          "border-input flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-4 py-8 text-center transition-colors",
          dragging ? "bg-muted/70" : "bg-muted/20 hover:bg-muted/40",
        )}
      >
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt=""
            className={cn(
              "mb-3 w-full rounded-xl",
              cover ? "aspect-video object-cover" : "max-h-48 object-contain",
            )}
          />
        ) : (
          <ImagePlus className="text-muted-foreground mb-2 size-8" />
        )}
        <p className="text-sm font-medium">
          {pending
            ? "Uploading…"
            : url
              ? "Replace image"
              : "Tap or drop an image"}
        </p>
        <p className="text-muted-foreground mt-1 text-xs">
          {hint ??
            "Works from camera roll or desktop. Large photos are resized automatically."}
        </p>
        {pending ? <LoaderCircle className="mt-2 size-4 animate-spin" /> : null}
      </label>
      <Input
        id={`${name}-file`}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) upload(file);
        }}
        disabled={pending}
      />
      <Input
        value={url}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Or paste an image URL"
      />
      {error ? <p className="text-destructive text-xs">{error}</p> : null}
      {url ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setValue("")}
        >
          Remove
        </Button>
      ) : null}
    </div>
  );
}
