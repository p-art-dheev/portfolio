import { OG_SIZE, renderOgImage } from "@/lib/og";
import { getPublishedPost } from "@/lib/queries";

export const alt = "Blog post";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function PostOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  return renderOgImage({
    section: post?.category ? `Blog · ${post.category}` : "Blog",
    title: post?.title ?? "Blog",
    description: post?.excerpt,
    image: post?.coverUrl,
    meta: `${post?.readingMinutes ?? 1} min read`,
  });
}
