import Link from "next/link";
import { SquareKanban } from "lucide-react";

import { DeleteButton } from "@/components/admin/DeleteButton";
import { EmptyState } from "@/components/admin/EmptyState";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProjectStatusBadge, PublishBadge } from "@/components/admin/StatusBadge";
import { deleteProject } from "@/lib/admin/actions";
import { listAdminProjects } from "@/lib/queries";
import { Button } from "@/components/ui/button";

export default async function AdminProjectsPage() {
  const projects = await listAdminProjects();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Cards on Home and /projects."
        actionHref="/admin/projects/new"
        actionLabel="New project"
      />
      {projects.length === 0 ? (
        <EmptyState
          icon={SquareKanban}
          title="No projects yet"
          description="Add a project and mark it featured to show it on the homepage."
          href="/admin/projects/new"
          action="Add project"
        />
      ) : (
        <ul className="space-y-3">
          {projects.map((project) => (
            <li
              key={project.id}
              className="border-border flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1.5">
                <p className="font-medium tracking-tight">{project.title}</p>
                <div className="flex flex-wrap items-center gap-1.5">
                  <PublishBadge published={project.published} />
                  <ProjectStatusBadge status={project.status} />
                  {project.featured ? (
                    <span className="inline-flex rounded-full bg-sky-500/15 px-2 py-0.5 text-[11px] font-medium text-sky-700 dark:text-sky-300">
                      Featured
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
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
      )}
    </div>
  );
}
