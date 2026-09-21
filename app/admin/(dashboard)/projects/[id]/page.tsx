import { notFound } from "next/navigation";

import { ProjectForm } from "@/components/admin/ProjectForm";
import { getAdminProject } from "@/lib/queries";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getAdminProject(id);
  if (!project) notFound();

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold tracking-tight">Edit project</h1>
      <ProjectForm project={project} />
    </div>
  );
}
