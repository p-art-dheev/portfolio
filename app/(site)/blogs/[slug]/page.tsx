import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogArticle } from "@/components/blog/BlogArticle";
import { Container } from "@/components/Container";
import { getPublishedPost, getPublishedPosts, getSiteSettings } from "@/lib/queries";
import { sanitizePostHtml } from "@/lib/sanitize";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return { title: "Post" };
  return {
    title: post.title,
    description: post.excerpt || post.title,
  };
}

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export const dynamicParams = true;

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, all, site] = await Promise.all([
    getPublishedPost(slug),
    getPublishedPosts(),
    getSiteSettings(),
  ]);
  if (!post) notFound();

  const related = all
    .filter((item) => item.slug !== post.slug)
    .sort((a, b) => {
      const sameA = a.category && a.category === post.category ? 1 : 0;
      const sameB = b.category && b.category === post.category ? 1 : 0;
      return sameB - sameA;
    })
    .slice(0, 2);

  return (
    <Container className="py-10 sm:py-16">
      <BlogArticle
        post={post}
        html={sanitizePostHtml(post.contentHtml)}
        site={site}
        related={related}
      />
    </Container>
  );
}
