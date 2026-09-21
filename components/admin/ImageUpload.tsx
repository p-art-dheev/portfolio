"use client";

import { useState, useTransition } from "react";
import { ImagePlus, LoaderCircle } from "lucide-react";

import { uploadMediaFile } from "@/lib/admin/actions";
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
};

export function ImageUpload({
  name,
  folder,
  label,
  defaultUrl = "",
  accept = "image/*",
  onMeta,
}: ImageUploadProps) {
  const [url, setUrl] = useState(defaultUrl);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [dragging, setDragging] = useState(false);

  function upload(file: File) {
    setError(null);
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
    startTransition(async () => {
      const result = await uploadMediaFile(data);
      if (result.error || !result.url) {
        setError(result.error ?? "Upload failed.");
        return;
      }
      setUrl(result.url);
    });
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
            className="mb-3 max-h-48 w-full rounded-xl object-contain"
          />
        ) : (
          <ImagePlus className="text-muted-foreground mb-2 size-8" />
        )}
        <p className="text-sm font-medium">
          {pending ? "Uploading…" : url ? "Replace image" : "Tap or drop an image"}
        </p>
        <p className="text-muted-foreground mt-1 text-xs">
          Works from camera roll or desktop. Max 10 MB.
        </p>
        {pending ? (
          <LoaderCircle className="mt-2 size-4 animate-spin" />
        ) : null}
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
        onChange={(event) => setUrl(event.target.value)}
        placeholder="Or paste an image URL"
      />
      {error ? <p className="text-destructive text-xs">{error}</p> : null}
      {url ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setUrl("")}
        >
          Remove
        </Button>
      ) : null}
    </div>
  );
}
