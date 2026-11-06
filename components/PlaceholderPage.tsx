import type { Metadata } from "next";

import { Container } from "@/components/Container";

type PlaceholderPageProps = {
  title: string;
  description: string;
};

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <Container className="py-16">
      <h1 className="font-display text-[2.6rem] leading-tight font-normal tracking-[-0.01em]">
        {title}
      </h1>
      <p className="text-muted-foreground mt-3 max-w-xl">{description}</p>
    </Container>
  );
}

export function placeholderMetadata(
  title: string,
  description: string,
): Metadata {
  return { title, description };
}
