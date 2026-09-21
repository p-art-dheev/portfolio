import type { Project } from "@/lib/content-types";
import { Reveal } from "@/components/Reveal";
import { ProjectCard } from "@/components/ProjectCard";

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  return (
    <Reveal>
      <section className="space-y-4">
        <h2 className="text-lg font-medium tracking-tight">Featured projects</h2>
        <div className="grid gap-8 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
    </Reveal>
  );
}
