import Link from "next/link";

import type { Project } from "@/lib/content-types";
import { Reveal } from "@/components/Reveal";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/SectionHeading";

export function FeaturedProjects({
  projects,
  index,
}: {
  projects: Project[];
  index: number;
}) {
  if (projects.length === 0) return null;

  return (
    <Reveal>
      <section className="space-y-5">
        <SectionHeading
          index={index}
          eyebrow="Work"
          title="Featured projects"
          action={
            <Link
              href="/projects"
              className="link-draw text-muted-foreground hover:text-foreground text-sm"
            >
              All projects
            </Link>
          }
        />
        <div className="grid gap-8 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
    </Reveal>
  );
}
