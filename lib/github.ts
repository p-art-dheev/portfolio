import type { Activity } from "react-activity-calendar";

const CONTRIBUTIONS_API = "https://github-contributions-api.jogruber.de/v4";

export type GithubContributions = {
  contributions: Activity[];
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
    const data = (await response.json()) as { contributions?: Activity[] };
    const contributions = Array.isArray(data.contributions)
      ? data.contributions
      : [];
    if (contributions.length === 0) return null;
    return { contributions };
  } catch {
    return null;
  }
}
