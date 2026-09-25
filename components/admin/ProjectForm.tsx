"use client";

import { useState } from "react";
import { ArrowUpRight, Globe } from "lucide-react";

import { saveProject } from "@/lib/admin/actions";
import { slugify } from "@/lib/slug";
import type { AdminProject } from "@/lib/content-types";
import { Github } from "@/components/icons";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ProjectForm({ project }: { project?: AdminProject }) {
  const [error, setError] = useState<string | null>(null);
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [liveUrl, setLiveUrl] = useState(project?.liveUrl ?? "");
  const [liveLabel, setLiveLabel] = useState(project?.liveLabel ?? "");

  async function action(formData: FormData) {
    const result = await saveProject(formData);
    if (result?.error) setError(result.error);
  }

  return (
    <form action={action} className="space-y-5">
      {project ? <input type="hidden" name="id" value={project.id} /> : null}
      <Field label="Title" htmlFor="title">
        <Input
          id="title"
          name="title"
          required
          defaultValue={project?.title}
          onChange={(event) => {
            if (!project) setSlug(slugify(event.target.value));
          }}
        />
      </Field>
      <Field label="Slug" htmlFor="slug">
        <Input
          id="slug"
          name="slug"
          required
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
        />
      </Field>
      <Field label="Description" htmlFor="description">
        <Textarea
          id="description"
          name="description"
          required
          defaultValue={project?.description}
        />
      </Field>
      <ImageUpload
        name="banner"
        folder="projects"
        label="Banner image"
        defaultUrl={project?.banner}
      />
      <Field label="Tags (comma separated)" htmlFor="tags">
        <Input id="tags" name="tags" defaultValue={project?.tags.join(", ")} />
      </Field>
      <fieldset className="border-border space-y-4 rounded-2xl border p-4">
        <legend className="px-1 text-sm font-medium">Links</legend>
        <p className="text-muted-foreground -mt-1 text-xs">
          Leave a URL empty to hide its button on the card.
        </p>
        <Field label="GitHub repository URL" htmlFor="github_url">
          <div className="relative">
            <Github className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              id="github_url"
              name="github_url"
              type="text"
              inputMode="url"
              placeholder="https://github.com/p-art-dheev/repo"
              defaultValue={project?.githubUrl}
              className="pl-9"
            />
          </div>
        </Field>
        <div className="grid gap-4 sm:grid-cols-[1fr_12rem]">
          <Field label="Live / deployed URL" htmlFor="live_url">
            <div className="relative">
              <Globe className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                id="live_url"
                name="live_url"
                type="text"
                inputMode="url"
                placeholder="https://project.vercel.app"
                value={liveUrl}
                onChange={(event) => setLiveUrl(event.target.value)}
                className="pl-9"
              />
            </div>
          </Field>
          <Field label="Live button text" htmlFor="live_label">
            <Input
              id="live_label"
              name="live_label"
              maxLength={40}
              placeholder="Live demo"
              value={liveLabel}
              onChange={(event) => setLiveLabel(event.target.value)}
              disabled={!liveUrl.trim()}
            />
          </Field>
        </div>
        {liveUrl.trim() ? (
          <p className="text-muted-foreground flex items-center gap-2 text-xs">
            Card button preview:
            <span className="bg-primary text-primary-foreground inline-flex h-7 items-center gap-1 rounded-lg px-2.5 text-xs font-medium">
              {liveLabel.trim() || "Live demo"}
              <ArrowUpRight className="size-3" />
            </span>
          </p>
        ) : null}
      </fieldset>
      <Field label="Status" htmlFor="status">
        <select
          id="status"
          name="status"
          defaultValue={project?.status ?? "off"}
          className="border-input bg-background h-11 w-full rounded-lg border px-3 text-sm sm:h-9"
        >
          <option value="off">Off</option>
          <option value="live">Live</option>
          <option value="Building">Building</option>
        </select>
      </Field>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={project?.featured ?? true}
          className="size-4"
        />
        Featured on homepage
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="published"
          defaultChecked={project?.published ?? false}
          className="size-4"
        />
        Published
      </label>
      {error ? <p className="text-destructive text-sm">{error}</p> : null}
      <Button type="submit" className="h-11 w-full sm:w-auto">
        Save project
      </Button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
