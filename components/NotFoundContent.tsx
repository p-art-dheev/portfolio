import Link from "next/link";

import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";

const suggestions = [
  { href: "/projects", label: "Projects" },
  { href: "/blogs", label: "Blog" },
  { href: "/artworks", label: "Artworks" },
] as const;

export function NotFoundContent() {
  return (
    <Container className="py-24 text-center">
      <p className="text-muted-foreground text-sm">404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">
        This page doesn&apos;t exist
      </h1>
      <p className="text-muted-foreground mx-auto mt-2 max-w-sm text-sm">
        The link may be old or mistyped. Here are a few places to go instead.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
        {suggestions.map(({ href, label }) => (
          <Button key={href} variant="outline" asChild>
            <Link href={href}>{label}</Link>
          </Button>
        ))}
      </div>
    </Container>
  );
}
