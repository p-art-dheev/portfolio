import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/Container";
import { JsonLd } from "@/components/JsonLd";
import { ProjectDetail } from "@/components/ProjectDetail";
import { getPublishedProject, getPublishedProjects } from "@/lib/queries";
import { BASE_OPEN_GRAPH } from "@/lib/seo";
import { projectJsonLd } from "@/lib/structured-data";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProject(slug);
  if (!project) return { title: "Project not found" };
  const url = `/projects/${project.slug}`;
  const images = project.banner
    ? [{ url: project.banner, alt: `${project.title} banner` }]
    : undefined;
  return {
    title: project.title,
    description: project.description,
    keywords: project.tags,
    alternates: { canonical: url },
    openGraph: {
      ...BASE_OPEN_GRAPH,
      type: "article",
      title: project.title,
      description: project.description,
      url,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      images: project.banner ? [project.banner] : undefined,
    },
  };
}

export default async function ProjectRoute({ params }: Props) {
  const { slug } = await params;
  const [project, all] = await Promise.all([
    getPublishedProject(slug),
    getPublishedProjects(),
  ]);
  if (!project) notFound();

  const others = all.filter((item) => item.slug !== project.slug).slice(0, 4);

  return (
    <Container className="py-10 sm:py-16">
      <JsonLd data={projectJsonLd(project)} />
      <ProjectDetail project={project} others={others} />
    </Container>
  );
}
