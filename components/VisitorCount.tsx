"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";

import { callRpc } from "@/lib/supabase/rpc";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getVisitorId } from "@/lib/visitor";

export function VisitorCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    callRpc<number>("record_site_visitor", { vid: getVisitorId() })
      .then((visitors) => setCount(Number(visitors) || 0))
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
