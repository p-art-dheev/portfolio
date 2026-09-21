import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";

import { Container } from "@/components/Container";
import { getPublishedPost, getPublishedPosts } from "@/lib/queries";
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
  const post = await getPublishedPost(slug);
  if (!post) notFound();

  const html = sanitizePostHtml(post.contentHtml);

  return (
    <Container className="py-16">
      <article className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight">{post.title}</h1>
        {post.publishedAt ? (
          <p className="text-muted-foreground mt-3 text-sm">
            {new Date(post.publishedAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        ) : null}
        {post.coverUrl ? (
          <Image
            src={post.coverUrl}
            alt=""
            width={1200}
            height={630}
            className="mt-8 aspect-video w-full rounded-xl object-cover"
          />
        ) : null}
        <div
          className="blog-content mt-8"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
    </Container>
  );
}
