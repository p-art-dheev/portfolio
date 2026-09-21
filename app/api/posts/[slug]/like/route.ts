import { NextResponse } from "next/server";

import { createAnonSupabaseClient } from "@/lib/supabase/anon";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function POST(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ likes: 0 });
  }
  const { slug } = await context.params;
  const { data, error } = await createAnonSupabaseClient().rpc(
    "increment_post_likes",
    {
      post_slug: slug,
    },
  );
  if (error) {
    return NextResponse.json({ likes: 0 });
  }
  return NextResponse.json({ likes: Number(data) || 0 });
}
