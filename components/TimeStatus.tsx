"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

// Always Pardheev's local time (IST), whatever the visitor's time zone.
const clockFormatter = new Intl.DateTimeFormat(undefined, {
  timeZone: "Asia/Kolkata",
  weekday: "short",
  hour: "numeric",
  minute: "2-digit",
});

const hourFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  hour: "numeric",
  hourCycle: "h23",
});

/** "Available" 9:00–21:59 IST, "Away" otherwise, so the dot is honest. */
function isAvailable(date: Date) {
  const hour = Number(hourFormatter.format(date));
  return hour >= 9 && hour < 22;
}

type TimeStatusProps = {
  className?: string;
};

export function TimeStatus({ className }: TimeStatusProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const available = now ? isAvailable(now) : false;

  return (
    <div
      className={cn(
        "flex flex-col items-end justify-center gap-1 text-sm",
        className,
      )}
    >
      <span
        className={cn(
          "inline-flex items-center gap-2",
          // Hidden until the clock is known, so it never flashes the wrong state.
          !now && "invisible",
        )}
      >
        <span className="relative flex size-2.5">
          {available ? (
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
          ) : null}
          <span
            className={cn(
              "relative inline-flex size-2.5 rounded-full",
              available ? "bg-emerald-500" : "bg-zinc-400",
            )}
          />
        </span>
        <span>{available ? "Available" : "Away"}</span>
      </span>
      <div className="text-muted-foreground flex items-center gap-2">
        <time
          dateTime={now?.toISOString()}
          className="min-w-[9ch] tabular-nums"
          suppressHydrationWarning
        >
          {now ? clockFormatter.format(now) : "—"}
        </time>
        <span>India</span>
      </div>
    </div>
  );
}
