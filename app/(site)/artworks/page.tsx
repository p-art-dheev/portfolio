import type { Metadata } from "next";

import { ArtworksPage } from "@/components/ArtworksPage";
import { getPublishedArtworks } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Artworks",
  description: "Drawings and paintings in a masonry photogrid gallery.",
};

export default async function ArtworksRoute() {
  const artworks = await getPublishedArtworks();
  return <ArtworksPage artworks={artworks} />;
}
