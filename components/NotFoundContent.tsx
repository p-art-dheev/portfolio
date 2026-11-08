import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

import { OpenCommandMenuButton } from "@/components/CommandMenu";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";

const suggestions = [
  { href: "/projects", label: "Projects" },
  { href: "/blogs", label: "Blog" },
  { href: "/artworks", label: "Artworks" },
  { href: "/books", label: "Books" },
] as const;

export function NotFoundContent() {
  return (
    <Container className="flex flex-1 flex-col items-center justify-center py-20 text-center sm:py-28">
      <p className="text-link font-mono text-[0.7rem] tracking-[0.2em] uppercase">
        Error 404
      </p>

      {/* The number is drawn as an outline in ink, like a page that was
          sketched but never filled in. */}
      <p
        aria-hidden
        className="not-found-number font-display mt-4 text-[8.5rem] leading-[0.85] sm:text-[11rem]"
      >
        404
      </p>

      <h1 className="metal-text font-display mt-6 text-4xl font-normal tracking-[-0.01em] sm:text-5xl">
        This page wandered off
      </h1>
      <p className="text-muted-foreground mx-auto mt-3 max-w-md leading-7">
        The link may be old or mistyped. Search the site, or head back home.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <Button asChild size="lg" className="group/home">
          <Link href="/">
            <ArrowLeft className="size-4 transition-transform group-hover/home:-translate-x-0.5" />
            Back to home
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <OpenCommandMenuButton>
            <Search className="size-4" />
            Search the site
          </OpenCommandMenuButton>
        </Button>
      </div>

      <div className="mt-12 flex w-full max-w-md items-center gap-4">
        <span className="bg-border h-px flex-1" />
        <span className="text-muted-foreground text-xs">or try</span>
        <span className="bg-border h-px flex-1" />
      </div>
      <nav
        aria-label="Suggested pages"
        className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm"
      >
        {suggestions.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="link-draw text-muted-foreground hover:text-foreground"
          >
            {label}
          </Link>
        ))}
      </nav>
    </Container>
  );
}
