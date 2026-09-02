import {
  PlaceholderPage,
  placeholderMetadata,
} from "@/components/PlaceholderPage";

export const metadata = placeholderMetadata(
  "Projects",
  "Selected work and case studies. Content coming soon.",
);

export default function ProjectsPage() {
  return (
    <PlaceholderPage
      title="Projects"
      description="A full project index will live here. Featured work is already sketched on the home page."
    />
  );
}
