import Link from "next/link";

import { LoginForm } from "@/components/admin/LoginForm";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="border-border w-full max-w-sm rounded-2xl border p-6 sm:p-8">
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          Studio
        </p>
        <h1 className="mt-1 text-xl font-semibold tracking-tight">Sign in</h1>
        <p className="text-muted-foreground mt-2 mb-6 text-sm">
          Private dashboard for updating the site.
        </p>
        <LoginForm configured={isSupabaseConfigured()} />
        <p className="text-muted-foreground mt-6 text-center text-xs">
          <Link href="/" className="hover:text-foreground">
            Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}
