import type { CSSProperties } from "react";

import { HeatmapFrame } from "@/components/HeatmapFrame";
import { Github } from "@/components/icons";
import type { ContributionDay, GithubContributions } from "@/lib/github";
import { githubUsernameFromUrl } from "@/lib/sanitize";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const WEEKDAY_LABELS = [
  { label: "Mon", row: 1 },
  { label: "Wed", row: 3 },
  { label: "Fri", row: 5 },
];

/** Month labels above the grid: one per month, starting at its first week. */
function monthLabels(days: ContributionDay[], offset: number, weeks: number) {
  const starts: { week: number; label: string }[] = [];
  let previous = -1;
  days.forEach((day, i) => {
    const week = Math.floor((offset + i) / 7);
    // Only the first day drawn in each week column decides its month.
    if (i > 0 && Math.floor((offset + i - 1) / 7) === week) return;
    const month = Number(day.date.slice(5, 7)) - 1;
    if (month !== previous) starts.push({ week, label: MONTHS[month] });
    previous = month;
  });
  return starts
    .map((start, i) => ({
      ...start,
      span: (starts[i + 1]?.week ?? weeks) - start.week,
    }))
    .filter(
      // Like GitHub: skip a partial first month, and any month too narrow
      // for its name.
      (label, i) => label.span >= (i === 0 ? 3 : 2),
    );
}

/**
 * The year of contributions is drawn on the server as a CSS grid, so the
 * browser downloads no calendar library and does no layout work in JS:
 * tiles size themselves to fill the content width with container query
 * units (see `.heatmap` in globals.css). HeatmapFrame adds the tooltip and
 * the sideways scrolling on narrow screens.
 */
export function GithubHeatmap({
  githubUrl,
  data,
}: {
  githubUrl: string;
  data: GithubContributions | null;
}) {
  const githubUsername = githubUsernameFromUrl(githubUrl);

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

      {data ? (
        <Calendar days={data.contributions} />
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
    </section>
  );
}

function Calendar({ days }: { days: ContributionDay[] }) {
  // Weeks start on Sunday; the first column is padded up to the first day.
  const first = days[0].date;
  const offset = new Date(`${first}T00:00:00Z`).getUTCDay();
  const weeks = Math.ceil((offset + days.length) / 7);
  const months = monthLabels(days, offset, weeks);
  const total = days.reduce((sum, day) => sum + day.count, 0);
  const summary = `${total.toLocaleString("en-US")} contribution${total === 1 ? "" : "s"} in the last year`;

  return (
    <HeatmapFrame weeks={weeks}>
      <div className="heatmap-days" aria-hidden>
        {WEEKDAY_LABELS.map(({ label, row }) => (
          <span key={label} style={{ "--row": row } as CSSProperties}>
            {label}
          </span>
        ))}
      </div>
      <div className="heatmap-scroll">
        <div className="heatmap-months" aria-hidden>
          {months.map(({ week, span, label }) => (
            <span
              key={week}
              style={{ gridColumn: `${week + 1} / span ${span}` }}
            >
              {label}
            </span>
          ))}
        </div>
        <div className="heatmap-grid" role="img" aria-label={summary}>
          {offset > 0 ? <span style={{ gridRow: `span ${offset}` }} /> : null}
          {days.map((day) => (
            <i
              key={day.date}
              data-d={day.date}
              data-c={day.count}
              data-l={day.level}
            />
          ))}
        </div>
      </div>
      <div className="heatmap-footer">
        <span>{summary}</span>
        <span className="heatmap-legend" aria-hidden>
          Less
          {[0, 1, 2, 3, 4].map((level) => (
            <i key={level} data-l={level} />
          ))}
          More
        </span>
      </div>
    </HeatmapFrame>
  );
}
