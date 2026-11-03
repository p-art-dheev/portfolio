import type { Metadata } from "next";

import { ProjectsPage } from "@/components/ProjectsPage";
import { getPublishedProjects } from "@/lib/queries";
import { BASE_OPEN_GRAPH } from "@/lib/seo";

const DESCRIPTION =
  "Selected work across full-stack apps, NLP, and applied ML.";

export const metadata: Metadata = {
  title: "Projects",
  description: DESCRIPTION,
  alternates: { canonical: "/projects" },
  openGraph: {
    ...BASE_OPEN_GRAPH,
    title: "Projects",
    description: DESCRIPTION,
    url: "/projects",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects",
    description: DESCRIPTION,
  },
};

export default async function ProjectsRoute() {
  const projects = await getPublishedProjects();
  return <ProjectsPage projects={projects} />;
}
