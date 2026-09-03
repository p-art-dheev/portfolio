import type { Metadata } from "next";

import { ArtworksPage } from "@/components/ArtworksPage";

export const metadata: Metadata = {
  title: "Artworks",
  description: "Drawings and paintings on a pin-up board.",
};

export default function ArtworksRoute() {
  return <ArtworksPage />;
}
