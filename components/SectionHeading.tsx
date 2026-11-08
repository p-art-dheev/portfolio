import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Home page section heading: a small numbered eyebrow in the accent ink
 * ("01 · About") over a display-serif title, with an optional action
 * (a link, for example) on the right.
 */
export function SectionHeading({
  index,
  eyebrow,
  title,
  action,
  className,
}: {
  index: number;
  eyebrow: string;
  title: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-end justify-between gap-4", className)}>
      <div className="space-y-1.5">
        <p className="text-link font-mono text-[0.7rem] tracking-[0.2em] uppercase">
          {String(index).padStart(2, "0")} · {eyebrow}
        </p>
        <h2 className="metal-text font-display text-[1.95rem] leading-[1.1] font-normal tracking-[-0.005em] sm:text-[2.2rem]">
          {title}
        </h2>
      </div>
      {action ? <div className="shrink-0 pb-1">{action}</div> : null}
    </div>
  );
}
