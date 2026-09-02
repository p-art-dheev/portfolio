import {
  PlaceholderPage,
  placeholderMetadata,
} from "@/components/PlaceholderPage";

export const metadata = placeholderMetadata(
  "Blogs",
  "Writing and notes. Content coming soon.",
);

export default function BlogsPage() {
  return (
    <PlaceholderPage
      title="Blogs"
      description="Posts will show up here once the writing pipeline is wired in."
    />
  );
}
