"use client";

import { useEffect, useState } from "react";
import { Check, Eye, Heart, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export function BlogEngagement({
  slug,
  initialViews,
  initialLikes,
}: {
  slug: string;
  initialViews: number;
  initialLikes: number;
}) {
  const [views, setViews] = useState(initialViews);
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const viewedKey = `blog-viewed:${slug}`;
    const likedKey = `blog-liked:${slug}`;
    setLiked(window.localStorage.getItem(likedKey) === "1");

    if (sessionStorage.getItem(viewedKey)) return;
    sessionStorage.setItem(viewedKey, "1");
    fetch(`/api/posts/${slug}/view`, { method: "POST" })
      .then((response) => response.json())
      .then((data: { views?: number }) => {
        if (typeof data.views === "number") setViews(data.views);
      })
      .catch(() => {});
  }, [slug]);

  async function onLike() {
    if (liked) return;
    setLiked(true);
    setLikes((count) => count + 1);
    window.localStorage.setItem(`blog-liked:${slug}`, "1");
    const response = await fetch(`/api/posts/${slug}/like`, { method: "POST" });
    const data = (await response.json()) as { likes?: number };
    if (typeof data.likes === "number") setLikes(data.likes);
  }

  async function onShare() {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: document.title, url }).catch(() => {});
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-muted-foreground inline-flex items-center gap-1.5 text-sm">
        <Eye className="size-4" />
        {views} {views === 1 ? "view" : "views"}
      </span>
      <Button
        type="button"
        variant={liked ? "secondary" : "outline"}
        size="sm"
        className="gap-1.5"
        onClick={onLike}
        disabled={liked}
        aria-pressed={liked}
      >
        <Heart className={liked ? "size-3.5 fill-current" : "size-3.5"} />
        {likes}
      </Button>
      <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={onShare}>
        {copied ? <Check className="size-3.5" /> : <Share2 className="size-3.5" />}
        {copied ? "Copied" : "Share"}
      </Button>
    </div>
  );
}
