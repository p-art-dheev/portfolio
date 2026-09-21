"use client";

import { useState } from "react";

import { saveProject } from "@/lib/admin/actions";
import { slugify } from "@/lib/slug";
import type { AdminProject } from "@/lib/content-types";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ProjectForm({ project }: { project?: AdminProject }) {
  const [error, setError] = useState<string | null>(null);
  const [slug, setSlug] = useState(project?.slug ?? "");

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
        <Input
          id="tags"
          name="tags"
          defaultValue={project?.tags.join(", ")}
        />
      </Field>
      <Field label="Project URL" htmlFor="href">
        <Input id="href" name="href" defaultValue={project?.href} />
      </Field>
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
      <Field label="Sort order" htmlFor="sort_order">
        <Input
          id="sort_order"
          name="sort_order"
          type="number"
          defaultValue={project?.sortOrder ?? 0}
        />
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
