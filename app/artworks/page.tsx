import {
  PlaceholderPage,
  placeholderMetadata,
} from "@/components/PlaceholderPage";

export const metadata = placeholderMetadata(
  "Artworks",
  "Art and visual work. Content coming soon.",
);

export default function ArtworksPage() {
  return (
    <PlaceholderPage
      title="Artworks"
      description="Artwork will be collected here. This is a placeholder page for the More menu."
    />
  );
}
