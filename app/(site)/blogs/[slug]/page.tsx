import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogArticle } from "@/components/blog/BlogArticle";
import { Container } from "@/components/Container";
import { relatedPosts, wordCount } from "@/lib/blog";
import { SITE_NAME, SITE_URL, absoluteUrl, jsonLdString } from "@/lib/seo";
import {
  getPublishedPost,
  getPublishedPosts,
  getSiteSettings,
} from "@/lib/queries";
import { sanitizePostHtml } from "@/lib/sanitize";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return { title: "Post not found" };
  const description = post.excerpt || post.title;
  return {
    title: post.title,
    description,
    alternates: { canonical: `/blogs/${post.slug}` },
    keywords: post.tags,
    openGraph: {
      type: "article",
      title: post.title,
      description,
      url: `/blogs/${post.slug}`,
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt ?? undefined,
      tags: post.tags,
      images: post.coverUrl
        ? [{ url: post.coverUrl, alt: post.coverAlt || post.title }]
        : undefined,
    },
    twitter: {
      card: post.coverUrl ? "summary_large_image" : "summary",
      title: post.title,
      description,
      images: post.coverUrl ? [post.coverUrl] : undefined,
    },
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

  const url = absoluteUrl(`/blogs/${post.slug}`);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      headline: post.title,
      description: post.excerpt || undefined,
      image: post.coverUrl ? [post.coverUrl] : undefined,
      datePublished: post.publishedAt ?? undefined,
      dateModified: post.updatedAt ?? post.publishedAt ?? undefined,
      keywords: post.tags.join(", ") || undefined,
      articleSection: post.category || undefined,
      wordCount: wordCount(post.contentHtml),
      inLanguage: "en",
      author: { "@type": "Person", name: SITE_NAME, url: SITE_URL },
      publisher: { "@type": "Person", name: SITE_NAME, url: SITE_URL },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: absoluteUrl("/blogs"),
        },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ];

  return (
    <Container className="py-10 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <BlogArticle
        post={post}
        html={sanitizePostHtml(post.contentHtml)}
        site={site}
        related={relatedPosts(post, all)}
      />
    </Container>
  );
}
