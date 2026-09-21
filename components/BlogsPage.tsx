import { Container } from "@/components/Container";
import { BlogCardSkeleton } from "@/components/blog/BlogCard";
import { BlogList } from "@/components/blog/BlogList";
import type { PostListItem } from "@/lib/content-types";

export function BlogsPage({ posts }: { posts: PostListItem[] }) {
  return (
    <Container className="py-12 sm:py-16">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Blogs</h1>
        <p className="text-muted-foreground mt-3 max-w-xl">
          Writing on development, AI, art, and ideas.
          {posts.length > 0 ? (
            <span className="ml-1">
              {posts.length} {posts.length === 1 ? "post" : "posts"}.
            </span>
          ) : null}
        </p>
      </header>
      {posts.length === 0 ? (
        <div className="border-border mt-10 rounded-2xl border border-dashed px-6 py-16 text-center">
          <p className="font-medium">Nothing published yet</p>
          <p className="text-muted-foreground mt-1 text-sm">
            New posts will show up here when they go live.
          </p>
        </div>
      ) : (
        <BlogList posts={posts} />
      )}
    </Container>
  );
}

export function BlogsGridSkeleton() {
  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2">
      {Array.from({ length: 4 }, (_, index) => (
        <BlogCardSkeleton key={index} />
      ))}
    </div>
  );
}
