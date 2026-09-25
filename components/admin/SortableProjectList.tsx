"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type Modifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check, Globe, GripVertical, Loader2 } from "lucide-react";

import { deleteProject, reorderProjects } from "@/lib/admin/actions";
import type { AdminProject } from "@/lib/content-types";
import { cn } from "@/lib/utils";
import { Github } from "@/components/icons";
import { DeleteButton } from "@/components/admin/DeleteButton";
import {
  ProjectStatusBadge,
  PublishBadge,
} from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";

type SaveState = "idle" | "saving" | "saved" | "error";

// Same as @dnd-kit/modifiers' restrictToVerticalAxis, without the extra package.
const restrictToVerticalAxis: Modifier = ({ transform }) => ({
  ...transform,
  x: 0,
});

export function SortableProjectList({
  projects: initial,
}: {
  projects: AdminProject[];
}) {
  const [projects, setProjects] = useState(initial);
  const [state, setState] = useState<SaveState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Server data wins after a revalidation (e.g. a project was deleted).
  useEffect(() => setProjects(initial), [initial]);

  useEffect(() => {
    if (state !== "saved") return;
    const timer = setTimeout(() => setState("idle"), 2000);
    return () => clearTimeout(timer);
  }, [state]);

  const sensors = useSensors(
    // A small distance keeps clicks on Edit/Delete from starting a drag.
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function onDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    const previous = projects;
    const from = previous.findIndex((p) => p.id === active.id);
    const to = previous.findIndex((p) => p.id === over.id);
    if (from < 0 || to < 0) return;
    const next = arrayMove(previous, from, to);

    setProjects(next);
    setState("saving");
    setError(null);
    startTransition(async () => {
      let message: string | undefined;
      try {
        ({ error: message } = await reorderProjects(next.map((p) => p.id)));
      } catch {
        // Thrown by the action on an expired session or a network failure.
        message = "you may have been signed out. Refresh and try again.";
      }
      if (message) {
        setProjects(previous);
        setState("error");
        setError(message);
      } else {
        setState("saved");
      }
    });
  }

  return (
    <div className="space-y-3">
      <div className="text-muted-foreground flex min-h-5 items-center justify-between gap-3 text-xs">
        <span>
          Drag <GripVertical className="inline size-3.5 align-text-bottom" /> to
          reorder. The order is the same on Home and /projects.
        </span>
        <SaveIndicator state={state} />
      </div>
      {error ? (
        <p className="text-destructive text-sm">
          Couldn&apos;t save the new order: {error}
        </p>
      ) : null}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={projects.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="space-y-3">
            {projects.map((project, index) => (
              <SortableRow
                key={project.id}
                project={project}
                position={index + 1}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SaveIndicator({ state }: { state: SaveState }) {
  if (state === "saving") {
    return (
      <span className="inline-flex items-center gap-1">
        <Loader2 className="size-3.5 animate-spin" /> Saving order…
      </span>
    );
  }
  if (state === "saved") {
    return (
      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
        <Check className="size-3.5" /> Order saved
      </span>
    );
  }
  return null;
}

function SortableRow({
  project,
  position,
}: {
  project: AdminProject;
  position: number;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        "border-border bg-background relative flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between",
        isDragging && "z-10 shadow-lg ring-2 ring-sky-500/40",
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        <button
          type="button"
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          aria-label={`Reorder ${project.title} (position ${position})`}
          className="text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring/50 -my-1 -ml-1 flex size-9 shrink-0 cursor-grab touch-none items-center justify-center rounded-lg outline-none focus-visible:ring-3 active:cursor-grabbing"
        >
          <GripVertical className="size-4" />
        </button>
        <div className="min-w-0 space-y-1.5">
          <p className="truncate font-medium tracking-tight">
            <span className="text-muted-foreground mr-2 text-xs tabular-nums">
              {position}.
            </span>
            {project.title}
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            <PublishBadge published={project.published} />
            <ProjectStatusBadge status={project.status} />
            {project.featured ? (
              <span className="inline-flex rounded-full bg-sky-500/15 px-2 py-0.5 text-[11px] font-medium text-sky-700 dark:text-sky-300">
                Featured
              </span>
            ) : null}
            <LinkChip
              href={project.githubUrl}
              label="GitHub"
              icon={<Github className="size-3" />}
            />
            <LinkChip
              href={project.liveUrl}
              label={project.liveLabel || "Live demo"}
              icon={<Globe className="size-3" />}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 pl-10 sm:pl-0">
        <Button asChild size="sm" variant="outline">
          <Link href={`/admin/projects/${project.id}`}>Edit</Link>
        </Button>
        <DeleteButton action={deleteProject} id={project.id} label="project" />
      </div>
    </li>
  );
}

/** Shows which links are set; a missing link shows as struck-through. */
function LinkChip({
  href,
  label,
  icon,
}: {
  href?: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <span
      title={href ?? `No ${label} link`}
      className={cn(
        "inline-flex max-w-40 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
        href
          ? "bg-muted text-foreground"
          : "text-muted-foreground/70 line-through",
      )}
    >
      {icon}
      <span className="truncate">{label}</span>
    </span>
  );
}
