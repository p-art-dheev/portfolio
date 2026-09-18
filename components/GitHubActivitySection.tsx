"use client";

import { useEffect, useState } from "react";
import { GitHubCalendar } from "react-github-calendar";

import { Github } from "@/components/icons";
import { site } from "@/lib/data";

const githubTheme = {
  dark: ["#2a2a2a", "#0e4429", "#006d32", "#26a641", "#39d353"],
  light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
};

const githubUsername = site.socials.github.replace("https://github.com/", "");

export function GithubHeatmap() {
  const [colorScheme, setColorScheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const updateColorScheme = () => {
      setColorScheme(
        document.documentElement.classList.contains("dark") ? "dark" : "light",
      );
    };

    updateColorScheme();

    const observer = new MutationObserver(updateColorScheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-medium tracking-tight">GitHub Activity</h2>
        <a
          href={site.socials.github}
          target="_blank"
          rel="noreferrer"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          <Github className="size-4" aria-hidden />
          @{githubUsername}
        </a>
      </div>

      <div className="heatmap-scroll">
        <GitHubCalendar
          username={githubUsername}
          year="last"
          showWeekdayLabels
          colorScheme={colorScheme}
          theme={githubTheme}
          tooltips={{
            activity: {
              text: (activity) => {
                const date = new Date(
                  `${activity.date}T00:00:00`,
                ).toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
                const label =
                  activity.count === 0
                    ? "No contributions"
                    : `${activity.count} contribution${
                        activity.count === 1 ? "" : "s"
                      }`;
                return `${label} on ${date}`;
              },
              withArrow: true,
              placement: "top",
              offset: 8,
              hoverRestMs: 40,
              transitionStyles: {
                initial: { opacity: 0 },
                open: { opacity: 1 },
                close: { opacity: 0 },
                duration: 130,
              },
            },
          }}
        />
      </div>
    </section>
  );
}
