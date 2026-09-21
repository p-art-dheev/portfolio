"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";

import { setPostPublished } from "@/lib/admin/actions";
import { Button } from "@/components/ui/button";

export function PublishToggle({
  id,
  published,
}: {
  id: string;
  published: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function toggle() {
    if (
      published &&
      !window.confirm(
        "Unpublish this post? It will disappear from the public blog.",
      )
    ) {
      return;
    }
    const data = new FormData();
    data.set("id", id);
    data.set("published", published ? "false" : "true");
    setError(null);
    startTransition(async () => {
      const result = await setPostPublished(data);
      if (result.error) setError(result.error);
      else router.refresh();
    });
  }

  return (
    <div>
      <Button
        type="button"
        size="sm"
        variant={published ? "outline" : "default"}
        disabled={pending}
        onClick={toggle}
      >
        {pending ? (
          <LoaderCircle className="animate-spin" />
        ) : published ? (
          <EyeOff />
        ) : (
          <Eye />
        )}
        {published ? "Unpublish" : "Publish"}
      </Button>
      {error ? (
        <p role="alert" className="text-destructive mt-1 max-w-48 text-xs">
          {error}
        </p>
      ) : null}
    </div>
  );
}
