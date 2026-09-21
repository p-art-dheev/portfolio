"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";

import { getVisitorId } from "@/lib/visitor";

export function VisitorCount({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);

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

  if (count <= 0) return null;

  return (
    <p className="text-muted-foreground inline-flex items-center gap-1.5 text-sm">
      <Users className="size-3.5" aria-hidden />
      {count.toLocaleString()} unique {count === 1 ? "visitor" : "visitors"}
    </p>
  );
}
