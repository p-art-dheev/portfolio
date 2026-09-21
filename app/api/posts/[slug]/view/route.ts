import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import { isSupabaseConfigured } from "@/lib/supabase/env";

function client() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export async function POST(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ views: 0 });
  }
  const { slug } = await context.params;
  const { data, error } = await client().rpc("increment_post_views", {
    post_slug: slug,
  });
  if (error) {
    return NextResponse.json({ views: 0 });
  }
  return NextResponse.json({ views: Number(data) || 0 });
}
