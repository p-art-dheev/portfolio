"use client";

import dynamic from "next/dynamic";

import { GithubHeatmapSkeleton } from "@/components/GithubHeatmapSkeleton";

export const GithubHeatmapLazy = dynamic(
  () =>
    import("@/components/GitHubActivitySection").then(
      (mod) => mod.GithubHeatmap,
    ),
  {
    ssr: false,
    loading: () => <GithubHeatmapSkeleton />,
  },
);
