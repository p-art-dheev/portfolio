import { NextResponse } from "next/server";

import { createAnonSupabaseClient } from "@/lib/supabase/anon";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { isVisitorId } from "@/lib/visitor";

// Toggles this visitor's like. One like per visitor id; sending liked:false
// removes it. Returns the resulting total.
export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  }
  const { slug } = await context.params;
  const body = (await request.json().catch(() => null)) as {
    visitorId?: unknown;
    liked?: unknown;
  } | null;
  if (slug.length > 120 || !isVisitorId(body?.visitorId)) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const { data, error } = await createAnonSupabaseClient().rpc(
    "set_post_like",
    { post_slug: slug, vid: body.visitorId, want: body.liked !== false },
  );
  if (error?.code === "PGRST202" && body.liked !== false) {
    // Migration not applied yet: legacy counter (still un-deduplicated).
    const legacy = await createAnonSupabaseClient().rpc(
      "increment_post_likes",
      {
        post_slug: slug,
      },
    );
    if (!legacy.error)
      return NextResponse.json({ likes: Number(legacy.data) || 0 });
  }
  if (error) {
    return NextResponse.json({ error: "Could not save like" }, { status: 502 });
  }
  return NextResponse.json({ likes: Number(data) || 0 });
}
