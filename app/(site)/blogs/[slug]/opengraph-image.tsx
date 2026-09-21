import { ImageResponse } from "next/og";

import { getPublishedPost } from "@/lib/queries";
import { SITE_NAME } from "@/lib/seo";
import { site } from "@/lib/data";

export const alt = "Blog post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Used for posts without a cover image; posts with one point at the cover.
export default async function PostOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  const title = post?.title ?? "Blog";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: "#0a0a0a",
        color: "#fafafa",
      }}
    >
      <div style={{ fontSize: 30, color: "#a3a3a3" }}>
        {`${site.domain}/blogs${post?.category ? ` · ${post.category}` : ""}`}
      </div>
      <div
        style={{
          fontSize: title.length > 60 ? 60 : 76,
          fontWeight: 700,
          letterSpacing: -2,
          lineHeight: 1.1,
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: 30, color: "#a3a3a3" }}>
        {`${SITE_NAME} · ${post?.readingMinutes ?? 1} min read`}
      </div>
    </div>,
    size,
  );
}
