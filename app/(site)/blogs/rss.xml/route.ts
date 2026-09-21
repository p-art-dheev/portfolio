import { getPostFeed } from "@/lib/queries";
import { SITE_DESCRIPTION, SITE_NAME, absoluteUrl, escapeXml } from "@/lib/seo";

export const revalidate = 3600;

export async function GET() {
  const posts = await getPostFeed();
  const items = posts
    .map((post) => {
      const url = absoluteUrl(`/blogs/${post.slug}`);
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      ${post.publishedAt ? `<pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>` : ""}
      <description>${escapeXml(post.excerpt)}</description>
      ${post.category ? `<category>${escapeXml(post.category)}</category>` : ""}
      ${post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("\n      ")}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}: Blog</title>
    <link>${absoluteUrl("/blogs")}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en</language>
    <atom:link href="${absoluteUrl("/blogs/rss.xml")}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
