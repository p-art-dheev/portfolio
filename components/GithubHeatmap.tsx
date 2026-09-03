"use client";

import { GitHubCalendar } from "react-github-calendar";

export default function GithubHeatmap() {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-medium tracking-tight">GitHub Activity</h2>
      <a href="http://github.com/p-art-dheev">@p-art-dheev</a>

        
      <GitHubCalendar
        username="p-art-dheev"
        year="last"
        showWeekdayLabels={true}
      />
    </section>
  );
}