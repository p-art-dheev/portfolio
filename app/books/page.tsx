import {
  PlaceholderPage,
  placeholderMetadata,
} from "@/components/PlaceholderPage";

export const metadata = placeholderMetadata(
  "Books",
  "Reading list and notes. Content coming soon.",
);

export default function BooksPage() {
  return (
    <PlaceholderPage
      title="Books"
      description="A books shelf will live here. This route exists so the More menu has somewhere to go."
    />
  );
}
