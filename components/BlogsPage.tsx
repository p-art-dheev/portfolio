import { Container } from "@/components/Container";
import { BlogCard } from "@/components/blog/BlogCard";
import type { PostListItem } from "@/lib/content-types";

export function BlogsPage({ posts }: { posts: PostListItem[] }) {
  return (
    <Container className="py-12 sm:py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Blogs</h1>
      <p className="text-muted-foreground mt-3 max-w-xl">
        Writing on development, AI, and ideas.
      </p>
      {posts.length === 0 ? (
        <div className="border-border mt-10 rounded-2xl border border-dashed px-6 py-16 text-center">
          <p className="font-medium">Nothing published yet</p>
          <p className="text-muted-foreground mt-1 text-sm">
            New posts will show up here when they go live.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </Container>
  );
}
