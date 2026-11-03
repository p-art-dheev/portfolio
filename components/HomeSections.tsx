import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { SiteContent } from "@/lib/content-types";
import { Reveal } from "@/components/Reveal";
import { EducationCard } from "@/components/EducationCard";

export function EducationSection({ site }: { site: SiteContent }) {
  return (
    <Reveal>
      <section className="space-y-3">
        <h2 className="sr-only">Education</h2>
        <EducationCard site={site} />
      </section>
    </Reveal>
  );
}

export function AboutSection({ site }: { site: SiteContent }) {
  return (
    <Reveal delay={0.05}>
      <section className="space-y-3">
        <h2 className="text-lg font-medium tracking-tight">About</h2>
        <p className="text-muted-foreground w-full leading-7">{site.bio}</p>
      </section>
    </Reveal>
  );
}

const exploreLinks = [
  {
    href: "/blogs",
    label: "Blog",
    description: "Notes on what I'm building and learning.",
  },
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
        <div className="grid gap-3 sm:grid-cols-3">
          {exploreLinks.map(({ href, label, description }) => (
            <Link
              key={href}
              href={href}
              className="border-border bg-card group hover:bg-muted/50 flex items-center justify-between rounded-xl border px-4 py-4 transition-colors"
            >
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-muted-foreground mt-0.5 text-sm">
                  {description}
                </p>
              </div>
              <ArrowUpRight className="text-muted-foreground size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          ))}
        </div>
      </section>
    </Reveal>
  );
}
