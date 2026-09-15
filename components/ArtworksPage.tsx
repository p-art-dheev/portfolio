"use client";

import { Container } from "@/components/Container";
import { GalleryPhotogrid } from "@/components/GalleryPhotogrid";
import { artworks } from "@/lib/artworks";

const photos = artworks.map((artwork) => ({
  src: artwork.image.src,
  alt: artwork.image.alt,
  title: artwork.title,
  width: artwork.image.width,
  height: artwork.image.height,
}));

export function ArtworksPage() {
  return (
    <Container className="py-8 sm:py-12">
      <GalleryPhotogrid photos={photos} />
    </Container>
  );
}
