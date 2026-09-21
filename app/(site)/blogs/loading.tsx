import { BlogsGridSkeleton } from "@/components/BlogsPage";
import { Container } from "@/components/Container";

export default function BlogsLoading() {
  return (
    <Container className="py-12 sm:py-16">
      <div className="bg-muted h-8 w-28 animate-pulse rounded" />
      <div className="bg-muted mt-4 h-4 w-72 max-w-full animate-pulse rounded" />
      <BlogsGridSkeleton />
    </Container>
  );
}
