import type { Metadata } from "next";

import { ProjectsPage } from "@/components/ProjectsPage";
import { getPublishedProjects } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected work across full-stack apps, NLP, and applied ML.",
  alternates: { canonical: "/projects" },
  openGraph: { title: "Projects", url: "/projects" },
};

export default async function ProjectsRoute() {
  const projects = await getPublishedProjects();
  return <ProjectsPage projects={projects} />;
}
