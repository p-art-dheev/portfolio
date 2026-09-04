import { Container } from "@/components/Container";
import { ProjectCard } from "@/components/ProjectCard";
import { featuredProjects } from "@/lib/data";

export function ProjectsPage() {
  return (
    <Container className="py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
      <p className="text-muted-foreground mt-3 max-w-xl">
        Selected work across full-stack apps, NLP, and applied ML.
      </p>
      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        {featuredProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </Container>
  );
}
