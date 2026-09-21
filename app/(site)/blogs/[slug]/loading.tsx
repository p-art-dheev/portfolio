import { Container } from "@/components/Container";

export default function BlogPostLoading() {
  return (
    <Container className="py-10 sm:py-16">
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="bg-muted h-4 w-20 animate-pulse rounded" />
        <div className="bg-muted mt-8 h-4 w-40 animate-pulse rounded" />
        <div className="bg-muted h-10 w-full animate-pulse rounded" />
        <div className="bg-muted h-10 w-2/3 animate-pulse rounded" />
        <div className="bg-muted mt-6 aspect-[16/9] animate-pulse rounded-2xl" />
        <div className="space-y-3 pt-6">
          {[100, 94, 98, 70, 96, 88].map((width, index) => (
            <div
              key={index}
              className="bg-muted h-3.5 animate-pulse rounded"
              style={{ width: `${width}%` }}
            />
          ))}
        </div>
      </div>
    </Container>
  );
}
