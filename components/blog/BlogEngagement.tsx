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
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { RpcError, callRpc } from "@/lib/supabase/rpc";
import { getVisitorId } from "@/lib/visitor";

type Engagement = { reads?: number; likes?: number; liked?: boolean };

/** Records a unique read, then returns reads, likes and this visitor's like. */
async function recordRead(slug: string): Promise<Engagement> {
  const vid = getVisitorId();
  const reads = await callRpc<number>("record_post_read", {
    post_slug: slug,
    vid,
  }).catch(() => null);
  try {
    return await callRpc<Engagement>("get_post_engagement", {
      post_slug: slug,
      vid,
    });
  } catch {
    // Before migrate-blog-v2.sql only the read count is available.
    if (reads === null) throw new Error("Could not record read");
    return { reads: Number(reads) || 0 };
  }
}

/** One like per visitor id; want=false removes it. Returns the new total. */
async function saveLike(slug: string, want: boolean): Promise<number> {
  try {
    return await callRpc<number>("set_post_like", {
      post_slug: slug,
      vid: getVisitorId(),
      want,
    });
  } catch (error) {
    // Migration not applied yet: legacy counter (still un-deduplicated).
    if (error instanceof RpcError && error.code === "PGRST202" && want) {
      return callRpc<number>("increment_post_likes", { post_slug: slug });
    }
    throw error;
  }
}

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

    if (!isSupabaseConfigured()) return;
    let cancelled = false;
    recordRead(slug)
      .then((data) => {
        if (cancelled) return;
        if (data.reads) setReads(Number(data.reads));
        if (Number(data.likes) > 0) setLikes(Number(data.likes));
        if (typeof data.liked === "boolean") setLiked(data.liked);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [slug, likedKey]);

  async function onLike() {
    if (busy) return;
    const next = !liked;
    setBusy(true);
    setLiked(next);
    setLikes((count) => Math.max(0, count + (next ? 1 : -1)));
    try {
      if (!isSupabaseConfigured()) throw new Error("Unavailable");
      setLikes(Number(await saveLike(slug, next)) || 0);
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
