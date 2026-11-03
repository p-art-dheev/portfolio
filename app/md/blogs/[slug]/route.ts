import { buildPostMarkdown, markdownResponse } from "@/lib/llms";

export const revalidate = 3600;

// Served at /blogs/<slug>.md through a rewrite in next.config.ts.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const body = await buildPostMarkdown(slug);
  if (!body) {
    return new Response("Post not found\n", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
  return markdownResponse(body);
}
