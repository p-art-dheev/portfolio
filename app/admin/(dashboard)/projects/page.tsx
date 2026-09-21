import Link from "next/link";

import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteProject } from "@/lib/admin/actions";
import { listAdminProjects } from "@/lib/queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function AdminProjectsPage() {
  const projects = await listAdminProjects();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
        <Button asChild>
          <Link href="/admin/projects/new">New</Link>
        </Button>
      </div>
      <ul className="space-y-3">
        {projects.map((project) => (
          <li
            key={project.id}
            className="border-border flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium">{project.title}</p>
              <p className="text-muted-foreground text-xs">{project.slug}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={project.published ? "default" : "secondary"}>
                {project.published ? "Published" : "Draft"}
              </Badge>
              <Button asChild size="sm" variant="outline">
                <Link href={`/admin/projects/${project.id}`}>Edit</Link>
              </Button>
              <DeleteButton
                action={deleteProject}
                id={project.id}
                label="project"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
