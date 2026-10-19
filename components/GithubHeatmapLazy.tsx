"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

import { GithubHeatmapSkeleton } from "@/components/GithubHeatmapSkeleton";

/**
 * The calendar library and its GitHub contributions request are only loaded
 * once the section is about to scroll into view, so they stay out of the
 * initial page load.
 */
export function GithubHeatmapLazy({ githubUrl }: { githubUrl: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { rootMargin: "300px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {visible ? (
        <GithubHeatmapWithFallback githubUrl={githubUrl} />
      ) : (
        <GithubHeatmapSkeleton githubUrl={githubUrl} />
      )}
    </div>
  );
}

const GithubHeatmapWithFallback = dynamic(
  () =>
    import("@/components/GitHubActivitySection").then(
      (mod) => mod.GithubHeatmap,
    ),
  {
    ssr: false,
    loading: () => <GithubHeatmapSkeleton githubUrl="" />,
  },
);
