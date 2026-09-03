import type { Metadata } from "next";

import { ProjectsPage } from "@/components/ProjectsPage";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected work across full-stack apps, NLP, and applied ML.",
};

export default function ProjectsRoute() {
  return <ProjectsPage />;
}
