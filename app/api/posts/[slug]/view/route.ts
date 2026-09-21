import { NextResponse } from "next/server";

import { createAnonSupabaseClient } from "@/lib/supabase/anon";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { isVisitorId } from "@/lib/visitor";

export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ reads: 0 });
  }
  const { slug } = await context.params;
  const body = (await request.json().catch(() => null)) as {
    visitorId?: unknown;
  } | null;
  if (!isVisitorId(body?.visitorId)) {
    return NextResponse.json({ reads: 0 }, { status: 400 });
  }
  const { data, error } = await createAnonSupabaseClient().rpc(
    "record_post_read",
    { post_slug: slug, vid: body.visitorId },
  );
  if (error) return NextResponse.json({ reads: 0 });
  return NextResponse.json({ reads: Number(data) || 0 });
}
