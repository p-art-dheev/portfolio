import { createClient } from "@supabase/supabase-js";

import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

export function createAnonSupabaseClient() {
  return createClient(getSupabaseUrl(), getSupabaseAnonKey());
}
