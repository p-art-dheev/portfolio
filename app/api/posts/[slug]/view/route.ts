import { NextResponse } from "next/server";

import { createAnonSupabaseClient } from "@/lib/supabase/anon";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { isVisitorId } from "@/lib/visitor";

type Engagement = { reads: number; likes: number; liked: boolean };

// Records a unique read (one per visitor id) and returns the post's current
// reads, likes and whether this visitor already liked it.
export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const empty: Engagement = { reads: 0, likes: 0, liked: false };
  if (!isSupabaseConfigured()) return NextResponse.json(empty);

  const { slug } = await context.params;
  const body = (await request.json().catch(() => null)) as {
    visitorId?: unknown;
  } | null;
  if (slug.length > 120 || !isVisitorId(body?.visitorId)) {
    return NextResponse.json(empty, { status: 400 });
  }

  const supabase = createAnonSupabaseClient();
  const read = await supabase.rpc("record_post_read", {
    post_slug: slug,
    vid: body.visitorId,
  });
  if (read.error) console.error("record_post_read failed:", read.error.message);

  const engagement = await supabase.rpc("get_post_engagement", {
    post_slug: slug,
    vid: body.visitorId,
  });
  if (engagement.error || !engagement.data) {
    // Migration not applied yet: fall back to just the read count.
    if (read.error) return NextResponse.json(empty, { status: 502 });
    return NextResponse.json({ ...empty, reads: Number(read.data) || 0 });
  }
  const data = engagement.data as Partial<Engagement>;
  return NextResponse.json({
    reads: Number(data.reads) || 0,
    likes: Number(data.likes) || 0,
    liked: Boolean(data.liked),
  });
}
