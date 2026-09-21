"use client";

import { Container } from "@/components/Container";
import { GalleryPhotogrid } from "@/components/GalleryPhotogrid";
import type { ArtworkItem } from "@/lib/content-types";

export function ArtworksPage({ artworks }: { artworks: ArtworkItem[] }) {
  const photos = artworks.map((artwork) => ({
    src: artwork.image.src,
    alt: artwork.image.alt,
    title: artwork.title,
    width: artwork.image.width,
    height: artwork.image.height,
  }));

  return (
    <Container className="py-8 sm:py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Artworks</h1>
      <p className="text-muted-foreground mt-3 mb-8 max-w-xl">
        Realism drawings and digital art. Click any piece to view full size.
      </p>
      <GalleryPhotogrid photos={photos} />
    </Container>
  );
}
