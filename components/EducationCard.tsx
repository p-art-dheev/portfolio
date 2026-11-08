import { GraduationCap, MapPin } from "lucide-react";

import type { SiteContent } from "@/lib/content-types";

/**
 * Reads "2023-2027" (any dash) as a degree that runs from August of the first
 * year to May of the last, and works out how far through it today is.
 * Returns null for anything it can't read, so the timeline is simply hidden.
 */
function degreeProgress(range: string, now = new Date()) {
  const match = range.match(/(\d{4})\s*[-–—]\s*(\d{4})/);
  if (!match) return null;
  const startYear = Number(match[1]);
  const endYear = Number(match[2]);
  if (endYear <= startYear) return null;

  const start = Date.UTC(startYear, 7, 1);
  const end = Date.UTC(endYear, 4, 31);
  const fraction = Math.min(
    1,
    Math.max(0, (now.getTime() - start) / (end - start)),
  );
  const totalYears = endYear - startYear;
  const year = Math.min(
    totalYears,
    Math.floor((now.getTime() - start) / (365.25 * 864e5)) + 1,
  );
  const label =
    fraction >= 1
      ? "Graduated"
      : fraction <= 0
        ? "Starting soon"
        : year === totalYears
          ? "Final year"
          : `Year ${year} of ${totalYears}`;

  return { startYear, endYear, fraction, label };
}

export function EducationCard({ site }: { site: SiteContent }) {
  const progress = degreeProgress(site.year);

  return (
    <div className="metal-edge max-w-2xl rounded-2xl p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <div className="metal-well text-foreground flex size-11 shrink-0 items-center justify-center rounded-xl">
          <GraduationCap className="size-5" aria-hidden />
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="font-display text-[1.45rem] leading-tight font-normal">
              {site.college}
            </h3>
            {progress ? (
              <span className="text-link font-mono text-[0.7rem] tracking-[0.18em] uppercase">
                {progress.label}
              </span>
            ) : null}
          </div>
          <p className="text-foreground/85 text-sm leading-relaxed">
            {site.branch}
          </p>
          <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
            <MapPin className="size-3.5 shrink-0" aria-hidden />
            {site.location}
          </p>
        </div>
      </div>

      {progress ? (
        <div className="mt-5 space-y-2 sm:pl-15">
          <div
            className="metal-well relative h-1.5 overflow-hidden rounded-full"
            role="progressbar"
            aria-label="Progress through the degree"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress.fraction * 100)}
          >
            <div
              className="bg-metal-bar absolute inset-y-0 left-0 rounded-full"
              style={{ width: `${progress.fraction * 100}%` }}
            />
          </div>
          <div className="text-muted-foreground flex justify-between font-mono text-xs tabular-nums">
            <span>{progress.startYear}</span>
            <span>{progress.endYear}</span>
          </div>
        </div>
      ) : (
        <p className="text-muted-foreground mt-4 font-mono text-xs sm:pl-15">
          {site.year}
        </p>
      )}
    </div>
  );
}
