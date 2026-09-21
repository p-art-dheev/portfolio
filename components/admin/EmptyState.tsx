import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function EmptyState({
  icon: Icon,
  title,
  description,
  href,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="border-border bg-card/40 flex flex-col items-center rounded-2xl border border-dashed px-6 py-14 text-center">
      <div className="bg-muted mb-4 flex size-12 items-center justify-center rounded-full">
        <Icon className="text-muted-foreground size-5" />
      </div>
      <p className="font-medium">{title}</p>
      <p className="text-muted-foreground mt-1 max-w-sm text-sm">{description}</p>
      {href && action ? (
        <Button asChild className="mt-5">
          <Link href={href}>{action}</Link>
        </Button>
      ) : null}
    </div>
  );
}
