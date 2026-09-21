"use client";

import dynamic from "next/dynamic";

import { GithubHeatmapSkeleton } from "@/components/GithubHeatmapSkeleton";

export function GithubHeatmapLazy({ githubUrl }: { githubUrl: string }) {
  return <GithubHeatmapWithFallback githubUrl={githubUrl} />;
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
