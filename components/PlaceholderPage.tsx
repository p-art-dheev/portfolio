import type { Metadata } from "next";

import { Container } from "@/components/Container";

type PlaceholderPageProps = {
  title: string;
  description: string;
};

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <Container className="py-16">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
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
