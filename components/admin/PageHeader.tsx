import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export function PageHeader({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        <h1 className="metal-text font-display text-[2.1rem] leading-tight font-normal tracking-[-0.01em]">
          {title}
        </h1>
        {description ? (
          <p className="text-muted-foreground max-w-xl text-sm">
            {description}
          </p>
        ) : null}
      </div>
      {actionHref && actionLabel ? (
        <Button asChild className="h-10 w-full sm:w-auto">
          <Link href={actionHref}>
            <Plus className="size-4" />
            {actionLabel}
          </Link>
        </Button>
      ) : null}
    </div>
  );
}
