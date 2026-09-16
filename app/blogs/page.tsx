import { placeholderMetadata } from "@/components/PlaceholderPage";
import { Container } from "@/components/Container";

export const metadata = placeholderMetadata(
  "Blogs",
  "Writing on development, AI, and ideas. Coming soon.",
);

export default function BlogsPage() {
  return (
    <Container className="py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Blogs</h1>
      <p className="text-muted-foreground mt-3 max-w-xl">
        Writing on development, AI, and ideas. Working on some posts — check back soon.
      </p>
      <div className="border-border mt-10 rounded-xl border border-dashed p-10 text-center">
        <p className="text-muted-foreground text-sm">Posts coming soon</p>
      </div>
    </Container>
  );
}
