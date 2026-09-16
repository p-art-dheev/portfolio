import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { site } from "@/lib/data";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { EducationCard } from "@/components/EducationCard";

export function EducationSection() {
  return (
    <Reveal>
      <section className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
        <EducationCard />
        <div className="flex flex-row gap-3 sm:flex-col sm:items-end">
          <Button className="flex-1 sm:w-36 sm:flex-none" asChild>
            <a href={site.resume} target="_blank" rel="noreferrer">
              Read Resume
            </a>
          </Button>
          <Button
            variant="outline"
            className="flex-1 sm:w-36 sm:flex-none"
            asChild
          >
            <a href={`mailto:${site.socials.email}`}>Contact</a>
          </Button>
        </div>
      </section>
    </Reveal>
  );
}

export function AboutSection() {
  return (
    <Reveal delay={0.05}>
      <section className="space-y-3">
        <h2 className="text-lg font-medium tracking-tight">About</h2>
        <p className="text-muted-foreground w-full leading-7">
          {site.bio}
        </p>
        <p className="text-sm font-medium">{site.tagline}</p>
      </section>
    </Reveal>
  );
}

const exploreLinks = [
  {
    href: "/artworks",
    label: "Artworks",
    description: "Realism drawings and digital art.",
  },
  {
    href: "/books",
    label: "Books",
    description: "A few titles that have stuck with me.",
  },
] as const;

export function ExploreSection() {
  return (
    <Reveal>
      <section className="space-y-4">
        <h2 className="text-lg font-medium tracking-tight">Explore</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {exploreLinks.map(({ href, label, description }) => (
            <Link
              key={href}
              href={href}
              className="border-border bg-card group flex items-center justify-between rounded-xl border px-4 py-4 transition-colors hover:bg-muted/50"
            >
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-muted-foreground mt-0.5 text-sm">
                  {description}
                </p>
              </div>
              <ArrowUpRight className="text-muted-foreground size-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </section>
    </Reveal>
  );
}
