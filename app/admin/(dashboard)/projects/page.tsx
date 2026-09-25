import { SquareKanban } from "lucide-react";

import { EmptyState } from "@/components/admin/EmptyState";
import { PageHeader } from "@/components/admin/PageHeader";
import { SortableProjectList } from "@/components/admin/SortableProjectList";
import { listAdminProjects } from "@/lib/queries";

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
        <SortableProjectList projects={projects} />
      )}
    </div>
  );
}
