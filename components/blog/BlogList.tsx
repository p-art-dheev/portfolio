"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";

import { BlogCard, BlogCardFeatured } from "@/components/blog/BlogCard";
import { Button } from "@/components/ui/button";
import type { PostListItem } from "@/lib/content-types";
import { cn } from "@/lib/utils";

function matches(post: PostListItem, query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return [post.title, post.excerpt, post.category, ...post.tags]
    .join(" ")
    .toLowerCase()
    .includes(needle);
}

export function BlogList({ posts }: { posts: PostListItem[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  // Restore shared filters (?q=…&category=…) after hydration.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get("q") ?? "");
    setCategory(params.get("category") ?? "");
  }, []);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const post of posts) {
      if (post.category)
        counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [posts]);

  const filtered = posts.filter(
    (post) => (!category || post.category === category) && matches(post, query),
  );
  const filtering = Boolean(category || query.trim());

  function sync(nextQuery: string, nextCategory: string) {
    const url = new URL(window.location.href);
    if (nextQuery.trim()) url.searchParams.set("q", nextQuery.trim());
    else url.searchParams.delete("q");
    if (nextCategory) url.searchParams.set("category", nextCategory);
    else url.searchParams.delete("category");
    window.history.replaceState(null, "", url);
  }

  function update(nextQuery: string, nextCategory: string) {
    setQuery(nextQuery);
    setCategory(nextCategory);
    sync(nextQuery, nextCategory);
  }

  const showControls = posts.length > 3 || categories.length > 1;
  const [lead, ...rest] = filtered;
  const featured = !filtering && lead ? lead : null;
  const grid = featured ? rest : filtered;

  return (
    <div className="mt-8">
      {showControls ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {categories.length > 1 ? (
            <div
              role="group"
              aria-label="Filter by category"
              className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
            >
              <Chip active={!category} onClick={() => update(query, "")}>
                All
                <span className="text-muted-foreground ml-1.5">
                  {posts.length}
                </span>
              </Chip>
              {categories.map(([name, count]) => (
                <Chip
                  key={name}
                  active={category === name}
                  onClick={() => update(query, category === name ? "" : name)}
                >
                  {name}
                  <span className="text-muted-foreground ml-1.5">{count}</span>
                </Chip>
              ))}
            </div>
          ) : (
            <span />
          )}
          <div className="relative sm:w-56">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
            <input
              type="search"
              value={query}
              onChange={(event) => update(event.target.value, category)}
              placeholder="Search posts"
              aria-label="Search posts"
              className="border-input bg-background focus-visible:ring-ring/50 h-9 w-full rounded-lg border pr-8 pl-8 text-sm outline-none focus-visible:ring-3"
            />
            {query ? (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => update("", category)}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2"
              >
                <X className="size-3.5" />
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <div className="border-border mt-6 rounded-2xl border border-dashed px-6 py-14 text-center">
          <p className="font-medium">No posts match</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Try a different search or category.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => update("", "")}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {featured ? <BlogCardFeatured post={featured} /> : null}
          {grid.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {grid.map((post, index) => (
                <BlogCard
                  key={post.slug}
                  post={post}
                  priority={index < 2 && !featured}
                />
              ))}
            </div>
          ) : null}
        </div>
      )}
      {filtering && filtered.length > 0 ? (
        <p className="text-muted-foreground mt-4 text-xs" aria-live="polite">
          Showing {filtered.length} of {posts.length}{" "}
          {posts.length === 1 ? "post" : "posts"}
        </p>
      ) : null}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "focus-visible:ring-ring/50 inline-flex h-8 shrink-0 items-center rounded-full border px-3 text-xs font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-3",
        active
          ? "border-foreground bg-foreground text-background [&>span]:text-background/70"
          : "border-border hover:bg-muted",
      )}
    >
      {children}
    </button>
  );
}
