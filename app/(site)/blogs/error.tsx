"use client";

import Link from "next/link";

import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";

export default function BlogsError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <Container className="py-24 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">
        Couldn&apos;t load the blog
      </h1>
      <p className="text-muted-foreground mx-auto mt-2 max-w-sm text-sm">
        Something went wrong on our side. Please try again in a moment.
      </p>
      <div className="mt-6 flex justify-center gap-2">
        <Button onClick={reset}>Try again</Button>
        <Button asChild variant="outline">
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </Container>
  );
}
