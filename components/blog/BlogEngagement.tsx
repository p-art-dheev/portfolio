"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Check,
  Heart,
  Link2,
  Mail,
  MoreHorizontal,
  Share2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getVisitorId } from "@/lib/visitor";

type Props = {
  slug: string;
  title: string;
  initialReads: number;
  initialLikes: number;
};

export function BlogEngagement({
  slug,
  title,
  initialReads,
  initialLikes,
}: Props) {
  const [reads, setReads] = useState(initialReads);
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [canNativeShare, setCanNativeShare] = useState(false);

  const likedKey = `blog-liked:${slug}`;

  function flash(message: string) {
    setStatus(message);
    window.setTimeout(() => setStatus(null), 2200);
  }

  useEffect(() => {
    setCanNativeShare(typeof navigator.share === "function");
    try {
      setLiked(window.localStorage.getItem(likedKey) === "1");
    } catch {}

    const controller = new AbortController();
    fetch(`/api/posts/${slug}/view`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId: getVisitorId() }),
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then(
        (data: { reads?: number; likes?: number; liked?: boolean } | null) => {
          if (!data) return;
          if (data.reads) setReads(data.reads);
          if (typeof data.likes === "number" && data.likes > 0)
            setLikes(data.likes);
          if (typeof data.liked === "boolean") setLiked(data.liked);
        },
      )
      .catch(() => {});
    return () => controller.abort();
  }, [slug, likedKey]);

  async function onLike() {
    if (busy) return;
    const next = !liked;
    setBusy(true);
    setLiked(next);
    setLikes((count) => Math.max(0, count + (next ? 1 : -1)));
    try {
      const response = await fetch(`/api/posts/${slug}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId: getVisitorId(), liked: next }),
      });
      if (!response.ok) throw new Error("failed");
      const data = (await response.json()) as { likes?: number };
      if (typeof data.likes === "number") setLikes(data.likes);
      try {
        window.localStorage.setItem(likedKey, next ? "1" : "0");
      } catch {}
    } catch {
      setLiked(!next);
      setLikes((count) => Math.max(0, count + (next ? -1 : 1)));
      flash("Couldn't save your like. Try again.");
    } finally {
      setBusy(false);
    }
  }

  const url = () => window.location.href.split("#")[0];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url());
      flash("Link copied");
    } catch {
      window.prompt("Copy this link", url());
    }
  }

  function open(target: string) {
    window.open(target, "_blank", "noopener,noreferrer,width=600,height=640");
  }

  const encoded = () => ({
    url: encodeURIComponent(url()),
    text: encodeURIComponent(title),
  });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className="text-muted-foreground mr-1 inline-flex items-center gap-1.5 text-sm"
        title="Unique readers"
      >
        <BookOpen className="size-4" />
        {reads.toLocaleString("en-US")} {reads === 1 ? "read" : "reads"}
      </span>
      <Button
        type="button"
        variant={liked ? "secondary" : "outline"}
        size="lg"
        className="gap-1.5"
        onClick={onLike}
        aria-pressed={liked}
        aria-label={liked ? "Unlike this post" : "Like this post"}
      >
        <Heart
          className={liked ? "size-4 fill-rose-500 text-rose-500" : "size-4"}
        />
        {likes}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="outline" size="lg" className="gap-1.5">
            <Share2 className="size-4" />
            Share
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onSelect={copyLink}>
            <Link2 />
            Copy link
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() =>
              open(
                `https://twitter.com/intent/tweet?url=${encoded().url}&text=${encoded().text}`,
              )
            }
          >
            <span className="w-4 text-center text-xs font-bold">𝕏</span>
            Post on X
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() =>
              open(
                `https://www.linkedin.com/sharing/share-offsite/?url=${encoded().url}`,
              )
            }
          >
            <span className="w-4 text-center text-[10px] font-bold">in</span>
            LinkedIn
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() =>
              open(`https://wa.me/?text=${encoded().text}%20${encoded().url}`)
            }
          >
            <span className="w-4 text-center text-[10px] font-bold">WA</span>
            WhatsApp
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              window.location.href = `mailto:?subject=${encoded().text}&body=${encoded().url}`;
            }}
          >
            <Mail />
            Email
          </DropdownMenuItem>
          {canNativeShare ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() =>
                  navigator.share({ title, url: url() }).catch(() => {})
                }
              >
                <MoreHorizontal />
                More options…
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      <span
        role="status"
        aria-live="polite"
        className="text-muted-foreground text-xs"
      >
        {status ? (
          <span className="inline-flex items-center gap-1">
            {status === "Link copied" ? <Check className="size-3.5" /> : null}
            {status}
          </span>
        ) : null}
      </span>
    </div>
  );
}

/** Static, non-tracking version used by the admin preview. */
export function BlogEngagementPreview() {
  return (
    <div className="text-muted-foreground flex items-center gap-2 text-sm">
      <span className="inline-flex items-center gap-1.5">
        <BookOpen className="size-4" /> 0 reads
      </span>
      <span className="border-border inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5">
        <Heart className="size-4" /> 0
      </span>
      <span className="border-border inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5">
        <Share2 className="size-4" /> Share
      </span>
    </div>
  );
}
