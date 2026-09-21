import type { User } from "@supabase/supabase-js";

/**
 * Optional allow-list. Set ADMIN_EMAILS="you@example.com,other@example.com" to
 * restrict the studio to those accounts even if another Supabase user exists.
 * When unset, any signed-in user is treated as admin (previous behaviour).
 */
export function isAdminUser(user: User | null): user is User {
  if (!user) return false;
  const allowed = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  if (allowed.length === 0) return true;
  return allowed.includes((user.email ?? "").toLowerCase());
}
