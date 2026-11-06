import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, PlayCircle } from "lucide-react";

import type { Project } from "@/lib/content-types";
import { Github } from "@/components/icons";
import { canOptimize } from "@/lib/images";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function safeHref(url?: string) {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/") && !url.startsWith("//")) return url;
  return undefined;
}

function Paragraphs({ text }: { text: string }) {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph, index) => (
      <p key={index} className="text-muted-foreground leading-7">
        {paragraph}
      </p>
    ));
}

function Section({ title, text }: { title: string; text?: string }) {
  if (!text?.trim()) return null;
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-medium tracking-tight">{title}</h2>
      <Paragraphs text={text} />
    </section>
  );
}

function Screenshot({ src, alt }: { src: string; alt: string }) {
  const className =
    "border-border aspect-video w-full rounded-xl border object-cover object-top";
  return canOptimize(src) ? (
    <Image
      src={src}
      alt={alt}
      width={1600}
      height={900}
      sizes="(min-width: 768px) 672px, 100vw"
      className={className}
    />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} loading="lazy" className={className} />
  );
}

export function ProjectDetail({
  project,
  others,
}: {
  project: Project;
  others: Project[];
}) {
  const githubUrl = safeHref(project.githubUrl);
  const liveUrl = safeHref(project.liveUrl);
  const videoUrl = safeHref(project.videoUrl);
  const highlights = project.highlights ?? [];
  const gallery = (project.gallery ?? []).filter((src) => safeHref(src));
  const hasCaseStudy = Boolean(
    project.problem || project.approach || project.outcome,
  );

  return (
    <article className="mx-auto max-w-2xl">
      <Link
        href="/projects"
        className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft className="size-4" />
        All projects
      </Link>

      <header className="space-y-4">
        <h1 className="font-display text-[2.4rem] leading-[1.1] font-normal tracking-[-0.01em] text-balance sm:text-5xl">
          {project.title}
        </h1>
        <p className="text-muted-foreground text-lg leading-7 text-pretty">
          {project.description}
        </p>
        {project.tags.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5" aria-label="Tech used">
            {project.tags.map((tag) => (
              <li key={tag}>
                <Badge variant="secondary">{tag}</Badge>
              </li>
            ))}
          </ul>
        ) : null}
        {githubUrl || liveUrl || videoUrl ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {liveUrl ? (
              <Button asChild>
                <a href={liveUrl} target="_blank" rel="noopener noreferrer">
                  {project.liveLabel?.trim() || "Live demo"}
                  <ArrowUpRight className="size-4" />
                </a>
              </Button>
            ) : null}
            {githubUrl ? (
              <Button asChild variant="outline">
                <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="size-4" />
                  Source code
                </a>
              </Button>
            ) : null}
            {videoUrl ? (
              <Button asChild variant="outline">
                <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                  <PlayCircle className="size-4" />
                  Watch demo
                </a>
              </Button>
            ) : null}
          </div>
        ) : null}
      </header>

      {project.banner ? (
        <div className="mt-8">
          <Screenshot src={project.banner} alt={`${project.title} banner`} />
        </div>
      ) : null}

      {highlights.length > 0 ? (
        <section className="mt-10" aria-labelledby="key-results">
          <h2 id="key-results" className="sr-only">
            Key results
          </h2>
          <ul className="grid gap-3 sm:grid-cols-3">
            {highlights.map((item) => (
              <li
                key={item}
                className="border-border bg-card rounded-xl border p-4 text-sm leading-6"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="mt-10 space-y-10">
        <Section title="The problem" text={project.problem} />
        {project.role ? (
          <section className="space-y-3">
            <h2 className="text-lg font-medium tracking-tight">My role</h2>
            <p className="text-muted-foreground leading-7">{project.role}</p>
          </section>
        ) : null}
        <Section title="Approach" text={project.approach} />
        <Section title="Outcome" text={project.outcome} />

        {gallery.length > 0 ? (
          <section className="space-y-4">
            <h2 className="text-lg font-medium tracking-tight">Screenshots</h2>
            <div className="space-y-4">
              {gallery.map((src, index) => (
                <Screenshot
                  key={src}
                  src={src}
                  alt={`${project.title} screenshot ${index + 1}`}
                />
              ))}
            </div>
          </section>
        ) : null}

        {!hasCaseStudy && gallery.length === 0 ? (
          <p className="text-muted-foreground border-border rounded-xl border border-dashed p-4 text-sm">
            A full write-up for this project is on the way.
            {githubUrl ? " The source code is linked above." : ""}
          </p>
        ) : null}
      </div>

      {others.length > 0 ? (
        <section className="border-border mt-14 border-t pt-10">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-medium tracking-tight">
              More projects
            </h2>
            <Link
              href="/projects"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              View all
            </Link>
          </div>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {others.map((other) => (
              <li key={other.slug}>
                <Link
                  href={`/projects/${other.slug}`}
                  className="border-border bg-card group hover:bg-muted/50 flex h-full items-start justify-between gap-3 rounded-xl border p-4 transition-colors"
                >
                  <span>
                    <span className="block text-sm font-medium">
                      {other.title}
                    </span>
                    <span className="text-muted-foreground mt-1 line-clamp-2 block text-sm">
                      {other.description}
                    </span>
                  </span>
                  <ArrowUpRight className="text-muted-foreground size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
