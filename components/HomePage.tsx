import { Mail } from "lucide-react";

import { featuredProjects, site } from "@/lib/data";
import { Container } from "@/components/Container";
import { Hero } from "@/components/Hero";
import { Github, Linkedin } from "@/components/icons";
import { ProjectCard } from "@/components/ProjectCard";
import { StatusCard } from "@/components/StatusCard";
import { TechStackGrid } from "@/components/TechStackGrid";
import { Button } from "@/components/ui/button";

const socials = [
  { href: site.socials.linkedin, label: "LinkedIn", icon: Linkedin },
  { href: site.socials.github, label: "GitHub", icon: Github },
  { href: site.socials.email, label: "Mail", icon: Mail },
] as const;

export function HomePage() {
  return (
    <Container as="div" className="flex flex-col gap-16 py-12 sm:py-16">
      <Hero />
      <StatusCard />

      <section className="space-y-3">
        <h2 className="text-lg font-medium tracking-tight">About</h2>
        <p className="text-muted-foreground max-w-2xl leading-7 text-pretty">
          {site.bio}
        </p>
        <p className="text-sm font-medium">{site.tagline}</p>
      </section>

      <section className="flex flex-wrap gap-3">
        <Button type="button" size="lg">
          Read Resume
        </Button>
        <Button type="button" size="lg" variant="outline">
          Contact
        </Button>
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

      <section className="space-y-4">
        <h2 className="text-lg font-medium tracking-tight">GitHub heatmap</h2>
        <div className="border-border bg-muted/30 text-muted-foreground flex min-h-40 items-center justify-center rounded-xl border border-dashed px-4 text-center text-sm">
          Contribution graph placeholder — connect GitHub data later.
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium tracking-tight">
          Featured projects
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
    </Container>
  );
}
