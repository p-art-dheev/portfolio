"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityCalendar } from "react-activity-calendar";

import { Github } from "@/components/icons";
import type { GithubContributions } from "@/lib/github";
import { githubUsernameFromUrl } from "@/lib/sanitize";

const githubTheme = {
  dark: ["#2c2823", "#0e4429", "#006d32", "#26a641", "#39d353"],
  light: ["#e3dbca", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
};

// Tiles grow so a year of weeks spans the full content width. Text keeps its
// size; only the squares scale. Below the minimum (phones), tiles stay at
// the minimum and the grid scrolls sideways instead (see globals.css).
const HEATMAP_MIN_BLOCK_SIZE = 10;
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

// One formatter, created once. toLocaleDateString(..., options) builds a new
// Intl formatter on every call, which adds up across a year of tiles.
const dateFormat = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
});

function tooltipText(date: string, count: number) {
  const label =
    count === 0
      ? "No contributions"
      : `${count} contribution${count === 1 ? "" : "s"}`;
  return `${label} on ${dateFormat.format(new Date(`${date}T00:00:00`))}`;
}

/** Columns the library draws: weeks start on Sunday, padded at the start. */
function weekCount(dates: { date: string }[]) {
  if (dates.length === 0) return 0;
  const firstDay = new Date(`${dates[0].date}T00:00:00`).getDay();
  return Math.ceil((firstDay + dates.length) / 7);
}

type Tip = { text: string; x: number; y: number; arrowX: number };

/**
 * Contribution data is fetched on the server (see lib/github.ts) and passed
 * in, so the calendar is part of the prerendered HTML.
 */
export function GithubHeatmap({
  githubUrl,
  data,
}: {
  githubUrl: string;
  data: GithubContributions | null;
}) {
  const githubUsername = githubUsernameFromUrl(githubUrl);
  const [colorScheme, setColorScheme] = useState<"light" | "dark">("dark");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [hasGrid, setHasGrid] = useState(false);
  const [edges, setEdges] = useState({ start: true, end: true });
  const [tip, setTip] = useState<Tip | null>(null);
  const [blockSize, setBlockSize] = useState(HEATMAP_MIN_BLOCK_SIZE);
  const weeks = useMemo(() => weekCount(data?.contributions ?? []), [data]);
  const tipRef = useRef<HTMLDivElement>(null);

  const counts = useMemo(
    () => new Map(data?.contributions.map((d) => [d.date, d.count]) ?? []),
    [data],
  );

  // A single tooltip for the whole calendar, driven by event delegation.
  // The library's own tooltips mount a floating-ui instance per tile (~370
  // of them), which froze the main thread for 20+ seconds on load.
  function showTip(target: EventTarget) {
    const wrapper = wrapperRef.current;
    if (!wrapper || !(target instanceof SVGRectElement)) return;
    const date = target.dataset.date;
    if (!date) return;
    const box = wrapper.getBoundingClientRect();
    const tile = target.getBoundingClientRect();
    const centre = tile.left + tile.width / 2 - box.left;
    // Keep the bubble inside the section; the arrow still points at the tile.
    const half = (tipRef.current?.offsetWidth ?? 200) / 2;
    const x = Math.min(Math.max(centre, half), box.width - half);
    setTip({
      text: tooltipText(date, counts.get(date) ?? 0),
      x,
      y: tile.top - box.top - 8,
      arrowX: centre - x,
    });
  }

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

    // Size tiles so the grid's width equals the space beside the day labels.
    const fit = () => {
      if (!weeks) return;
      const padding = parseFloat(getComputedStyle(wrapper).paddingLeft) || 0;
      const available = wrapper.clientWidth - padding;
      const ideal =
        (available + HEATMAP_BLOCK_MARGIN) / weeks - HEATMAP_BLOCK_MARGIN;
      const next = Math.max(
        HEATMAP_MIN_BLOCK_SIZE,
        Math.floor(ideal * 100) / 100,
      );
      setBlockSize((current) =>
        Math.abs(current - next) < 0.01 ? current : next,
      );
    };

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

    fit();
    attach();
    // The calendar swaps its loading placeholder for real data (or an error
    // message) after mount, and the viewport can be resized at any time.
    const mutations = new MutationObserver(attach);
    mutations.observe(wrapper, { childList: true, subtree: true });
    const resizes = new ResizeObserver(() => {
      fit();
      attach();
    });
    resizes.observe(wrapper);

    return () => {
      mutations.disconnect();
      resizes.disconnect();
      scroller?.removeEventListener("scroll", updateEdges);
      scroller?.removeEventListener("pointerdown", onUserScroll);
      scroller?.removeEventListener("wheel", onUserScroll);
      scroller?.removeEventListener("touchstart", onUserScroll);
    };
  }, [weeks]);

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
        onPointerOver={(e) => showTip(e.target)}
        onPointerLeave={() => setTip(null)}
        onScrollCapture={() => setTip(null)}
      >
        <div
          ref={tipRef}
          role="tooltip"
          className="heatmap-tooltip"
          data-open={tip ? "" : undefined}
          style={tip ? { left: tip.x, top: tip.y } : undefined}
        >
          {tip?.text}
          <span
            className="heatmap-tooltip-arrow"
            style={{ left: `calc(50% + ${tip?.arrowX ?? 0}px)` }}
          />
        </div>
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
                    row * (blockSize + HEATMAP_BLOCK_MARGIN) +
                    blockSize / 2,
                }}
              >
                {label}
              </span>
            ))}
          </div>
        )}
        {data ? (
          <ActivityCalendar
            data={data.contributions}
            maxLevel={4}
            labels={{ totalCount: "{{count}} contributions in the last year" }}
            blockSize={blockSize}
            blockMargin={HEATMAP_BLOCK_MARGIN}
            blockRadius={2}
            fontSize={HEATMAP_FONT_SIZE}
            colorScheme={colorScheme}
            theme={githubTheme}
          />
        ) : (
          <p className="text-muted-foreground text-sm">
            Contribution activity is unavailable right now.{" "}
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground underline underline-offset-2"
            >
              See it on GitHub
            </a>
            .
          </p>
        )}
      </div>
    </section>
  );
}
