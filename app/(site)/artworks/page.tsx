import type { Metadata } from "next";

import { ArtworksPage } from "@/components/ArtworksPage";
import { getPublishedArtworks } from "@/lib/queries";
import { BASE_OPEN_GRAPH } from "@/lib/seo";

const DESCRIPTION = "Realism drawings and digital art by Pardheev Vatturu.";

export const metadata: Metadata = {
  title: "Artworks",
  description: DESCRIPTION,
  alternates: { canonical: "/artworks" },
  openGraph: {
    ...BASE_OPEN_GRAPH,
    title: "Artworks",
    description: DESCRIPTION,
    url: "/artworks",
  },
  twitter: {
    card: "summary_large_image",
    title: "Artworks",
    description: DESCRIPTION,
  },
};

export default async function ArtworksRoute() {
  const artworks = await getPublishedArtworks();
  return <ArtworksPage artworks={artworks} />;
}
