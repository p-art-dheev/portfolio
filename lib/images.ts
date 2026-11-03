const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : null;

/** next/image only optimizes local files and Supabase Storage (next.config). */
export function canOptimize(src: string) {
  if (src.startsWith("/") && !src.startsWith("//")) return true;
  try {
    return supabaseHost !== null && new URL(src).hostname === supabaseHost;
  } catch {
    return false;
  }
}
