"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Discord has no public profile URL for a username, so this copies the
 * username to the clipboard and briefly confirms it in place. If the
 * clipboard is unavailable, the username itself is shown so it can be
 * copied by hand.
 */
export function DiscordLink({
  username,
  className,
  children,
  copiedLabel,
  "aria-label": ariaLabel,
}: {
  username: string;
  className?: string;
  children: ReactNode;
  /** What to show while the "copied" confirmation is up. */
  copiedLabel?: ReactNode;
  "aria-label"?: string;
}) {
  const [state, setState] = useState<"idle" | "copied" | "manual">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => clearTimeout(timer.current ?? undefined), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(username);
      setState("copied");
    } catch {
      setState("manual");
    }
    clearTimeout(timer.current ?? undefined);
    timer.current = setTimeout(() => setState("idle"), 2200);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={cn("cursor-pointer", className)}
      aria-label={ariaLabel ?? `Copy Discord username ${username}`}
      title={`Discord: ${username}`}
    >
      {state === "idle"
        ? children
        : state === "copied"
          ? (copiedLabel ?? children)
          : username}
      <span role="status" aria-live="polite" className="sr-only">
        {state === "copied"
          ? `Copied ${username}`
          : state === "manual"
            ? `Discord username: ${username}`
            : ""}
      </span>
    </button>
  );
}
