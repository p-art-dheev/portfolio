import { Mail } from "lucide-react";

import { featuredProjects, site } from "@/lib/data";
import { Container } from "@/components/Container";
import { Hero } from "@/components/Hero";
import { Github, Linkedin } from "@/components/icons";
import { ProjectCard } from "@/components/ProjectCard";
import { EducationCard } from "@/components/EducationCard";
import { TechStackGrid } from "@/components/TechStackGrid";
import { Button } from "@/components/ui/button";
import GithubHeatmap from "@/components/GithubHeatmap";

const socials = [
  { href: site.socials.linkedin, label: "LinkedIn", icon: Linkedin },
  { href: site.socials.github, label: "GitHub", icon: Github },
  { href: site.socials.email, label: "Mail", icon: Mail },
] as const;

export function HomePage() {
  return (
    <Container as="div" className="flex flex-col gap-16 py-12 sm:py-16">
      <Hero />
      <section className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
        <EducationCard />
        <div className="flex flex-col gap-3 sm:items-end">
          <Button className="w-full sm:w-36" asChild>
            <a href={site.resume} target="_blank" rel="noreferrer">
              Read Resume
            </a>
          </Button>
          <Button type="button" variant="outline" className="w-full sm:w-36">
            Contact
          </Button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium tracking-tight">About</h2>
        <p className="text-muted-foreground w-full leading-7 text-justify">
          {site.bio}
        </p>
        <p className="text-sm font-medium">{site.tagline}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium tracking-tight">Connect</h2>
        <div className="flex items-center gap-2">
          {socials.map(({ href, label, icon: Icon }) => (
            <Button key={label} variant="outline" size="icon" asChild>
              <a
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel={href.startsWith("mailto:") ? undefined : "noreferrer"}
                aria-label={label}
              >
                <Icon className="size-4" />
              </a>
            </Button>
          ))}
        </div>
      </section>

      <TechStackGrid />

      <GithubHeatmap />

      <section className="space-y-4">
        <h2 className="text-lg font-medium tracking-tight">
          Featured projects
        </h2>
        <div className="grid gap-8 sm:grid-cols-2">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
    </Container>
  );
}
