"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

import type { Project, ProjectStatus } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Github } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ProjectCardProps = {
  project: Project;
};

const statusStyles: Record<
  Exclude<ProjectStatus, "off">,
  { dot: string; ping: string; text: string }
> = {
  live: {
    dot: "bg-emerald-500",
    ping: "bg-emerald-400",
    text: "text-emerald-500",
  },
  Building: {
    dot: "bg-orange-500",
    ping: "bg-orange-400",
    text: "text-orange-500",
  },
};

function ProjectStatus({ status }: { status: ProjectStatus }) {
  if (status === "off") {
    return null;
  }

  const styles = statusStyles[status];

  return (
    <span className={`inline-flex items-center gap-2 text-sm ${styles.text}`}>
      <span className="relative flex size-2.5">
        <span
          className={`absolute inline-flex size-full animate-ping rounded-full opacity-60 ${styles.ping}`}
        />
        <span
          className={`relative inline-flex size-2.5 rounded-full ${styles.dot}`}
        />
      </span>
      <span>{status === "live" ? "Live" : status}</span>
    </span>
  );
}

function ProjectBanner({ project }: { project: Project }) {
  const [hasError, setHasError] = useState(false);

  if (!project.banner || hasError) {
    return (
      <div
        className="bg-muted/40 text-muted-foreground flex aspect-video w-full items-center justify-center rounded-xl text-xs"
        aria-hidden
      >
        Banner coming soon
      </div>
    );
  }

  return (
    <Image
      src={project.banner}
      alt={`${project.title} banner`}
      width={640}
      height={360}
      quality={75}
      sizes="(min-width: 640px) 40vw, 90vw"
      onError={() => setHasError(true)}
      className="aspect-video w-full rounded-xl object-cover"
    />
  );
}

/** Only http(s) and site-relative links are ever rendered. */
function safeHref(url?: string) {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/") && !url.startsWith("//")) return url;
  return undefined;
}

function linkProps(href: string) {
  return href.startsWith("/")
    ? { href }
    : { href, target: "_blank", rel: "noopener noreferrer" };
}

function ProjectLinks({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  const githubUrl = safeHref(project.githubUrl);
  const liveUrl = safeHref(project.liveUrl);
  if (!githubUrl && !liveUrl) return null;

  const liveLabel = project.liveLabel?.trim() || "Live demo";

  return (
    <CardFooter className={cn("gap-2 bg-transparent", className)}>
      {githubUrl ? (
        <Button
          asChild
          variant="outline"
          size="icon-lg"
          className="rounded-full"
        >
          <a
            {...linkProps(githubUrl)}
            aria-label={`${project.title} source code on GitHub`}
            title="View source on GitHub"
          >
            <Github className="size-4.5" />
          </a>
        </Button>
      ) : null}
      {liveUrl ? (
        <Button asChild size="sm" className="group/live ml-auto h-9 px-3.5">
          <a
            {...linkProps(liveUrl)}
            aria-label={`${liveLabel}: ${project.title}`}
          >
            {liveLabel}
            <ArrowUpRight className="size-3.5 transition-transform group-hover/live:translate-x-0.5 group-hover/live:-translate-y-0.5" />
          </a>
        </Button>
      ) : null}
    </CardFooter>
  );
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="h-full transition-transform hover:-translate-y-1">
      <Card className="h-full transition-shadow hover:shadow-md">
        <div className="px-(--card-spacing)">
          <ProjectBanner project={project} />
        </div>
        <CardHeader>
          <CardTitle>{project.title}</CardTitle>
          <CardAction>
            <ProjectStatus status={project.status} />
          </CardAction>
          <CardDescription>{project.description}</CardDescription>
        </CardHeader>
        {project.tags.length > 0 ? (
          <CardContent className="mt-auto flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </CardContent>
        ) : null}
        {/* Pin the footer to the bottom so buttons line up across a grid row. */}
        <ProjectLinks
          project={project}
          className={project.tags.length > 0 ? undefined : "mt-auto"}
        />
      </Card>
    </div>
  );
}
