"use client";

import { useEffect, useState } from "react";

import { site } from "@/lib/data";
import { cn } from "@/lib/utils";

const clockFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
});

type TimeStatusProps = {
  className?: string;
};

export function TimeStatus({ className }: TimeStatusProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className={cn(
        "flex flex-col items-end justify-center gap-1 text-sm",
        className,
      )}
    >
      <span className="inline-flex items-center gap-2">
        <span className="relative flex size-2.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
        </span>
        <span className="capitalize">{site.status}</span>
      </span>
      <div className="text-muted-foreground flex items-center gap-2">
        <time
          dateTime={now?.toISOString()}
          className="font-mono tabular-nums"
          suppressHydrationWarning
        >
          {now ? clockFormatter.format(now) : "—"}
        </time>
        <span>India</span>
      </div>
    </div>
  );
}
