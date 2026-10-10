"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";

import { getVisitorId } from "@/lib/visitor";

export function VisitorCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const visitorId = getVisitorId();
    fetch("/api/analytics/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId }),
    })
      .then((response) => response.json())
      .then((data: { visitors?: number }) => {
        if (typeof data.visitors === "number") setCount(data.visitors);
      })
      .catch(() => {});
  }, []);

  // Keep the line's height while the count loads so the hero doesn't shift.
  if (count <= 0) return <p className="h-5" aria-hidden />;

  return (
    <p className="text-muted-foreground inline-flex h-5 items-center gap-1.5 text-sm">
      <Users className="size-3.5" aria-hidden />
      {count.toLocaleString()} {count === 1 ? "visitor" : "visitors"}
    </p>
  );
}
