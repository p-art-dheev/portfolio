import type { Metadata } from "next";

import { ArtworksPage } from "@/components/ArtworksPage";

export const metadata: Metadata = {
  title: "Artworks",
  description: "Drawings and paintings in a masonry photogrid gallery.",
};

export default function ArtworksRoute() {
  return <ArtworksPage />;
}
