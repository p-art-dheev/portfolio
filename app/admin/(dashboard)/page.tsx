import Link from "next/link";
import {
  BookOpen,
  ImageIcon,
  Newspaper,
  Settings,
  SquareKanban,
} from "lucide-react";

import { getAdminCounts } from "@/lib/queries";
import { TypeBadge } from "@/components/admin/StatusBadge";
import { cn } from "@/lib/utils";

export default async function AdminHomePage() {
  const counts = await getAdminCounts();

  const cards = [
    {
      href: "/admin/projects",
      label: "Projects",
      hint: "Portfolio work",
      icon: SquareKanban,
      tone: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
      ...counts.projects,
    },
    {
      href: "/admin/blogs",
      label: "Blogs",
      hint: "Writing",
      icon: Newspaper,
      tone: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
      ...counts.posts,
    },
    {
      href: "/admin/artworks",
      label: "Artworks",
      hint: "Gallery",
      icon: ImageIcon,
      tone: "bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300",
      ...counts.artworks,
    },
    {
      href: "/admin/books",
      label: "Books",
      hint: "Reading list",
      icon: BookOpen,
      tone: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
      ...counts.books,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Drafts stay private until you publish.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {cards.map((card) => {
          const drafts = card.total - card.published;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="border-border bg-card hover:bg-muted/40 group rounded-2xl border p-5 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-xl",
                    card.tone,
                  )}
                >
                  <card.icon className="size-4" />
                </div>
                <TypeBadge
                  label={card.hint}
                  className="bg-muted text-muted-foreground"
                />
              </div>
              <p className="mt-4 text-sm font-medium">{card.label}</p>
              <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">
                {card.published}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                {card.published} live
                {drafts > 0 ? ` · ${drafts} draft${drafts === 1 ? "" : "s"}` : ""}
                {" · "}
                {card.total} total
              </p>
            </Link>
          );
        })}
      </div>

      <Link
        href="/admin/settings"
        className="border-border hover:bg-muted/40 inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm transition-colors"
      >
        <Settings className="size-4" />
        Edit homepage copy, socials, and tech stack
      </Link>
    </div>
  );
}
