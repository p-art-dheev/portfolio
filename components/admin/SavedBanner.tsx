import { CheckCircle2 } from "lucide-react";

export function SavedBanner({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <p className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
      <CheckCircle2 className="size-4 shrink-0" />
      Saved. Public pages will show published content.
    </p>
  );
}
