"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

import type { Project, ProjectStatus } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
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
      <CardContent className="mt-auto flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <Link
          href={project.href}
          className="group/link inline-flex shrink-0 items-center gap-1 text-sm font-medium hover:underline"
        >
          View project
          <ArrowUpRight className="size-3.5 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
        </Link>
      </CardContent>
      </Card>
    </div>
  );
}
