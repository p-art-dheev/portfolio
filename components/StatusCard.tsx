"use client";

import { useEffect, useState } from "react";

import { site } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";

const clockFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
  timeZoneName: "short",
});

export function StatusCard() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-muted-foreground text-sm">Currently</p>
          <p className="font-medium">{site.college}</p>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <span className="inline-flex items-center gap-2">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="capitalize">{site.status}</span>
          </span>
          <time
            dateTime={now?.toISOString()}
            className="text-muted-foreground font-mono tabular-nums"
            suppressHydrationWarning
          >
            {now ? clockFormatter.format(now) : "—"}
          </time>
        </div>
      </CardContent>
    </Card>
  );
}
