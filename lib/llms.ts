import { htmlToMarkdown } from "@/lib/markdown";
import {
  getPostFeed,
  getPublishedPost,
  getPublishedProjects,
  getSiteSettings,
} from "@/lib/queries";
import { sanitizePostHtml } from "@/lib/sanitize";
import { SITE_DESCRIPTION, SITE_NAME, absoluteUrl } from "@/lib/seo";

/** Plain-text responses for AI agents, cached like the sitemap and RSS. */
export function markdownResponse(body: string) {
  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "noindex",
    },
  });
}

function oneLine(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

/** The /llms.txt index: who Pardheev is, plus links to everything else. */
export async function buildLlmsTxt() {
  const [site, projects, posts] = await Promise.all([
    getSiteSettings(),
    getPublishedProjects(),
    getPostFeed(),
  ]);

  const lines: string[] = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    oneLine(site.bio),
    "",
    `- Role: ${site.role}`,
    `- Education: ${site.branch}, ${site.college} (${site.year})`,
    `- Location: ${site.location}`,
    `- Skills: ${site.techStack.map((item) => item.label).join(", ")}`,
    "",
    "## Contact and profiles",
    "",
    `- [Website](${absoluteUrl("/")})`,
    `- [Resume (PDF)](${absoluteUrl(site.resume)})`,
    `- [GitHub](${site.socials.github})`,
    `- [LinkedIn](${site.socials.linkedin})`,
    `- Email: ${site.socials.email.replace("@", " [at] ").replace(/\.(?=[^.]*$)/, " [dot] ")}`,
    "",
    "## Projects",
    "",
  ];

  for (const project of projects) {
    const links = [
      `[case study](${absoluteUrl(`/projects/${project.slug}`)})`,
      project.githubUrl ? `[source](${project.githubUrl})` : "",
      project.liveUrl ? `[live](${project.liveUrl})` : "",
    ]
      .filter(Boolean)
      .join(", ");
    const tags = project.tags.length ? ` (${project.tags.join(", ")})` : "";
    lines.push(
      `- **${project.title}**${tags}: ${oneLine(project.description)}${links ? ` ${links}` : ""}`,
    );
  }

  lines.push("", "## Blog posts", "");
  if (posts.length === 0) {
    lines.push("No posts published yet.");
  } else {
    for (const post of posts) {
      const summary = post.excerpt ? `: ${oneLine(post.excerpt)}` : "";
      lines.push(
        `- [${post.title}](${absoluteUrl(`/blogs/${post.slug}.md`)})${summary}`,
      );
    }
  }

  lines.push(
    "",
    "## Optional",
    "",
    `- [Full text of every blog post](${absoluteUrl("/llms-full.txt")})`,
    `- [Projects page](${absoluteUrl("/projects")})`,
    `- [Artworks](${absoluteUrl("/artworks")}): realism drawings and digital art`,
    `- [Books](${absoluteUrl("/books")}): books Pardheev has been reading`,
    `- [RSS feed](${absoluteUrl("/blogs/rss.xml")})`,
    "",
  );

  return lines.join("\n");
}

/** One post as a standalone Markdown document. */
export async function buildPostMarkdown(slug: string) {
  const post = await getPublishedPost(slug);
  if (!post) return null;

  const meta = [
    `- URL: ${absoluteUrl(`/blogs/${post.slug}`)}`,
    `- Author: ${SITE_NAME}`,
    post.publishedAt ? `- Published: ${post.publishedAt.slice(0, 10)}` : "",
    post.updatedAt ? `- Updated: ${post.updatedAt.slice(0, 10)}` : "",
    post.category ? `- Category: ${post.category}` : "",
    post.tags.length ? `- Tags: ${post.tags.join(", ")}` : "",
  ].filter(Boolean);

  return [
    `# ${post.title}`,
    "",
    post.excerpt ? `> ${oneLine(post.excerpt)}\n` : "",
    ...meta,
    "",
    htmlToMarkdown(sanitizePostHtml(post.contentHtml)),
    "",
  ].join("\n");
}

/** /llms-full.txt: the index followed by the full text of every post. */
export async function buildLlmsFullTxt() {
  const [index, posts] = await Promise.all([buildLlmsTxt(), getPostFeed()]);
  const bodies = await Promise.all(
    posts.map((post) => buildPostMarkdown(post.slug)),
  );
  const sections = bodies
    .filter((body): body is string => Boolean(body))
    .map((body) => body.replace(/^# /, "## "));

  return [index.trimEnd(), "", "---", "", "# Blog posts", "", ...sections].join(
    "\n",
  );
}
