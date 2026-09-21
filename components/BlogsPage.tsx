import { Container } from "@/components/Container";
import type { PostListItem } from "@/lib/content-types";
import Link from "next/link";

export function BlogsPage({ posts }: { posts: PostListItem[] }) {
  return (
    <Container className="py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Blogs</h1>
      <p className="text-muted-foreground mt-3 max-w-xl">
        Writing on development, AI, and ideas.
      </p>
      {posts.length === 0 ? (
        <div className="border-border mt-10 rounded-xl border border-dashed p-10 text-center">
          <p className="text-muted-foreground text-sm">Posts coming soon</p>
        </div>
      ) : (
        <ul className="mt-10 space-y-4">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blogs/${post.slug}`}
                className="border-border bg-card hover:bg-muted/40 block rounded-xl border p-5 transition-colors"
              >
                <h2 className="text-lg font-medium tracking-tight">
                  {post.title}
                </h2>
                {post.publishedAt ? (
                  <p className="text-muted-foreground mt-1 text-sm">
                    {new Date(post.publishedAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                ) : null}
                {post.excerpt ? (
                  <p className="text-muted-foreground mt-2 text-sm leading-6">
                    {post.excerpt}
                  </p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
