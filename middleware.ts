import { type NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

// Only the admin studio needs the Supabase session. Running this on public
// pages added an auth round trip to every request and kept them off the CDN.
export const config = {
  matcher: ["/admin/:path*"],
};
