"use client";

import { useState, useTransition } from "react";

import { uploadMediaFile } from "@/lib/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
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
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt=""
          className="border-border max-h-48 w-full rounded-lg border object-contain"
        />
      ) : null}
      <Input
        id={`${name}-file`}
        type="file"
        accept={accept}
        onChange={onFileChange}
        disabled={pending}
      />
      <Input
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        placeholder="Or paste an image URL"
      />
      {pending ? (
        <p className="text-muted-foreground text-xs">Uploading…</p>
      ) : null}
      {error ? <p className="text-destructive text-xs">{error}</p> : null}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setUrl("")}
        disabled={!url}
      >
        Clear
      </Button>
    </div>
  );
}
