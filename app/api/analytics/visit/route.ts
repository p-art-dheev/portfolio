import { NextResponse } from "next/server";

import { createAnonSupabaseClient } from "@/lib/supabase/anon";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { isVisitorId } from "@/lib/visitor";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ visitors: 0 });
  }
  const { data, error } = await createAnonSupabaseClient().rpc(
    "get_site_visitor_count",
  );
  if (error) return NextResponse.json({ visitors: 0 });
  return NextResponse.json({ visitors: Number(data) || 0 });
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ visitors: 0 });
  }
  const body = (await request.json().catch(() => null)) as {
    visitorId?: unknown;
  } | null;
  if (!isVisitorId(body?.visitorId)) {
    return NextResponse.json({ visitors: 0 }, { status: 400 });
  }
  const { data, error } = await createAnonSupabaseClient().rpc(
    "record_site_visitor",
    { vid: body.visitorId },
  );
  if (error) return NextResponse.json({ visitors: 0 });
  return NextResponse.json({ visitors: Number(data) || 0 });
}
