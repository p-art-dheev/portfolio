import type { Metadata } from "next";

import { ArtworksPage } from "@/components/ArtworksPage";
import { getPublishedArtworks } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Artworks",
  description: "Realism drawings and digital art by Pardheev Vatturu.",
  alternates: { canonical: "/artworks" },
  openGraph: { title: "Artworks", url: "/artworks" },
};

export default async function ArtworksRoute() {
  const artworks = await getPublishedArtworks();
  return <ArtworksPage artworks={artworks} />;
}
