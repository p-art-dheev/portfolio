"use client";

import { useEffect, useRef, useState } from "react";
import { GitHubCalendar } from "react-github-calendar";

import { Github } from "@/components/icons";
import { githubUsernameFromUrl } from "@/lib/sanitize";

const githubTheme = {
  dark: ["#2a2a2a", "#0e4429", "#006d32", "#26a641", "#39d353"],
  light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
};

// Fixed tile geometry: the calendar never stretches with the viewport. When
// a year of weeks doesn't fit, it scrolls sideways instead (see globals.css).
const HEATMAP_BLOCK_SIZE = 10;
const HEATMAP_BLOCK_MARGIN = 3;
const HEATMAP_FONT_SIZE = 12;

const WEEKDAY_LABELS = [
  { label: "Mon", row: 1 },
  { label: "Wed", row: 3 },
  { label: "Fri", row: 5 },
];
// Mirrors the library's layout: scroll-container top padding, then a month
// label row (font size + 8px margin), then the 7 day rows.
const GRID_TOP = Math.ceil(0.1 * HEATMAP_FONT_SIZE) + HEATMAP_FONT_SIZE + 8;

export function GithubHeatmap({ githubUrl }: { githubUrl: string }) {
  const githubUsername = githubUsernameFromUrl(githubUrl);
  const [colorScheme, setColorScheme] = useState<"light" | "dark">("dark");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [hasGrid, setHasGrid] = useState(false);
  const [edges, setEdges] = useState({ start: true, end: true });

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

  // Keep the most recent weeks in view on narrow screens, like GitHub does,
  // until the visitor scrolls back through the year themselves.
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let scroller: HTMLElement | null = null;
    let userScrolled = false;

    const updateEdges = () => {
      if (!scroller) return;
      const max = scroller.scrollWidth - scroller.clientWidth;
      setEdges({
        start: scroller.scrollLeft <= 1,
        end: scroller.scrollLeft >= max - 1,
      });
    };
    const onUserScroll = () => {
      userScrolled = true;
    };

    const attach = () => {
      const next = wrapper.querySelector<HTMLElement>(
        ".react-activity-calendar__scroll-container",
      );
      if (next !== scroller) {
        scroller?.removeEventListener("scroll", updateEdges);
        scroller?.removeEventListener("pointerdown", onUserScroll);
        scroller?.removeEventListener("wheel", onUserScroll);
        scroller?.removeEventListener("touchstart", onUserScroll);
        scroller = next;
        scroller?.addEventListener("scroll", updateEdges, { passive: true });
        scroller?.addEventListener("pointerdown", onUserScroll);
        scroller?.addEventListener("wheel", onUserScroll, { passive: true });
        scroller?.addEventListener("touchstart", onUserScroll, {
          passive: true,
        });
        setHasGrid(Boolean(scroller));
      }
      if (scroller && !userScrolled) {
        scroller.scrollLeft = scroller.scrollWidth;
      }
      updateEdges();
    };

    attach();
    // The calendar swaps its loading placeholder for real data (or an error
    // message) after mount, and the viewport can be resized at any time.
    const mutations = new MutationObserver(attach);
    mutations.observe(wrapper, { childList: true, subtree: true });
    const resizes = new ResizeObserver(attach);
    resizes.observe(wrapper);

    return () => {
      mutations.disconnect();
      resizes.disconnect();
      scroller?.removeEventListener("scroll", updateEdges);
      scroller?.removeEventListener("pointerdown", onUserScroll);
      scroller?.removeEventListener("wheel", onUserScroll);
      scroller?.removeEventListener("touchstart", onUserScroll);
    };
  }, []);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-medium tracking-tight">GitHub Activity</h2>
        <a
          href={githubUrl}
          target="_blank"
          rel="noreferrer"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          <Github className="size-4" aria-hidden />@{githubUsername}
        </a>
      </div>

      <div
        ref={wrapperRef}
        className="heatmap relative pl-8"
        data-at-start={edges.start || undefined}
        data-at-end={edges.end || undefined}
      >
        {hasGrid && (
          <div
            className="text-muted-foreground pointer-events-none absolute top-0 left-0"
            style={{ fontSize: HEATMAP_FONT_SIZE }}
            aria-hidden
          >
            {WEEKDAY_LABELS.map(({ label, row }) => (
              <span
                key={label}
                className="absolute left-0 -translate-y-1/2 leading-none"
                style={{
                  top:
                    GRID_TOP +
                    row * (HEATMAP_BLOCK_SIZE + HEATMAP_BLOCK_MARGIN) +
                    HEATMAP_BLOCK_SIZE / 2,
                }}
              >
                {label}
              </span>
            ))}
          </div>
        )}
        <GitHubCalendar
          username={githubUsername}
          year="last"
          blockSize={HEATMAP_BLOCK_SIZE}
          blockMargin={HEATMAP_BLOCK_MARGIN}
          blockRadius={2}
          fontSize={HEATMAP_FONT_SIZE}
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
