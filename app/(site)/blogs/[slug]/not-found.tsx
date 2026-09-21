import Link from "next/link";

import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";

export default function BlogPostNotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="text-muted-foreground text-sm">404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">
        This post doesn&apos;t exist
      </h1>
      <p className="text-muted-foreground mx-auto mt-2 max-w-sm text-sm">
        It may have been moved, unpublished, or the link is mistyped.
      </p>
      <Button asChild className="mt-6">
        <Link href="/blogs">Browse all posts</Link>
      </Button>
    </Container>
  );
}
