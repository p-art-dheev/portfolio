import Link from "next/link";

import { LoginForm } from "@/components/admin/LoginForm";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="border-border w-full max-w-sm rounded-2xl border p-6">
        <h1 className="text-xl font-semibold tracking-tight">Admin sign in</h1>
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
