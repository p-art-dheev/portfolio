"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";

export function DeleteButton({
  action,
  id,
  label,
}: {
  action: (formData: FormData) => Promise<{ error?: string } | void>;
  id: string;
  label: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    if (!window.confirm(`Delete this ${label}? This cannot be undone.`)) return;
    startTransition(async () => {
      const result = await action(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form action={onSubmit}>
      <input type="hidden" name="id" value={id} />
      <Button type="submit" variant="destructive" size="sm" disabled={pending}>
        {pending ? "Deleting…" : "Delete"}
      </Button>
      {error ? <p className="text-destructive mt-1 text-xs">{error}</p> : null}
    </form>
  );
}
