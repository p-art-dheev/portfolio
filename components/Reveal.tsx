"use client";

import { useEffect, useRef, useState, type HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type RevealProps = HTMLAttributes<HTMLDivElement> & {
  /** Seconds, matching the old motion-based API. */
  delay?: number;
};

type Phase = "static" | "hidden" | "shown";

/**
 * Fades a section up as it scrolls into view. Content is visible in the
 * server HTML, so anything above the fold paints immediately (good LCP);
 * only sections that start below the fold are hidden, after hydration,
 * and revealed when they scroll in. Plain CSS keeps motion off these pages.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  style,
  ...props
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("static");

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (element.getBoundingClientRect().top < window.innerHeight) return;

    setPhase("hidden");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setPhase("shown");
        observer.disconnect();
      },
      { threshold: 0.2 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        phase !== "static" &&
          "transition-[opacity,transform] duration-500 ease-out",
        phase === "hidden" && "translate-y-5 opacity-0",
        className,
      )}
      style={
        phase === "shown" && delay > 0
          ? { ...style, transitionDelay: `${delay}s` }
          : style
      }
      {...props}
    >
      {children}
    </div>
  );
}
