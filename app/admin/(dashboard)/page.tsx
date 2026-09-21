import Link from "next/link";

import { getAdminCounts } from "@/lib/queries";

export default async function AdminHomePage() {
  const counts = await getAdminCounts();

  const cards = [
    { href: "/admin/projects", label: "Projects", ...counts.projects },
    { href: "/admin/blogs", label: "Blogs", ...counts.posts },
    { href: "/admin/artworks", label: "Artworks", ...counts.artworks },
    { href: "/admin/books", label: "Books", ...counts.books },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Publish when you are ready. Drafts stay off the public site.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="border-border bg-card hover:bg-muted/40 rounded-xl border p-4 transition-colors"
          >
            <p className="text-sm font-medium">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold tabular-nums">
              {card.published}
              <span className="text-muted-foreground text-sm font-normal">
                {" "}
                published
              </span>
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              {card.total} total
            </p>
          </Link>
        ))}
      </div>
      <Link
        href="/admin/settings"
        className="text-sm underline-offset-4 hover:underline"
      >
        Edit homepage copy and socials
      </Link>
    </div>
  );
}
