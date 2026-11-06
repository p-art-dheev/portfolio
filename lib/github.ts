export type ContributionDay = {
  date: string;
  count: number;
  /** 0 (none) to 4 (most), as GitHub shades it. */
  level: number;
};

const CONTRIBUTIONS_API = "https://github-contributions-api.jogruber.de/v4";

export type GithubContributions = {
  contributions: ContributionDay[];
};

/**
 * Last year of GitHub contributions, fetched on the server and cached for a
 * day, so visitors' browsers never call the API (no rate limits, no layout
 * shift, and the calendar is in the prerendered HTML).
 */
export async function getGithubContributions(
  username: string,
): Promise<GithubContributions | null> {
  if (!username) return null;
  try {
    const response = await fetch(
      `${CONTRIBUTIONS_API}/${encodeURIComponent(username)}?y=last`,
      { next: { revalidate: 86_400 } },
    );
    if (!response.ok) return null;
    const data = (await response.json()) as {
      contributions?: ContributionDay[];
    };
    // Keep only what the calendar draws, so nothing extra reaches the page.
    const contributions = Array.isArray(data.contributions)
      ? data.contributions.map(({ date, count, level }) => ({
          date,
          count,
          level: Math.min(4, Math.max(0, Math.round(level) || 0)),
        }))
      : [];
    if (contributions.length === 0) return null;
    return { contributions };
  } catch {
    return null;
  }
}
