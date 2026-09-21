import { cn } from "@/lib/utils";

export function PublishBadge({ published }: { published: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
        published
          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
          : "bg-amber-500/15 text-amber-700 dark:text-amber-400",
      )}
    >
      {published ? "Published" : "Draft"}
    </span>
  );
}

export function ProjectStatusBadge({
  status,
}: {
  status: "off" | "live" | "Building";
}) {
  const styles = {
    off: "bg-muted text-muted-foreground",
    live: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    Building: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
  } as const;

  const labels = { off: "Off", live: "Live", Building: "Building" } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
        styles[status],
      )}
    >
      {labels[status]}
    </span>
  );
}

export function TypeBadge({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
        className,
      )}
    >
      {label}
    </span>
  );
}
