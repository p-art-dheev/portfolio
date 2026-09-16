import { featuredProjects } from "@/lib/data";
import { Reveal } from "@/components/Reveal";
import { ProjectCard } from "@/components/ProjectCard";

export function FeaturedProjects() {
  return (
    <Reveal>
      <section className="space-y-4">
        <h2 className="text-lg font-medium tracking-tight">Featured projects</h2>
        <div className="grid gap-8 sm:grid-cols-2">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
    </Reveal>
  );
}
