import { OG_SIZE, renderOgImage } from "@/lib/og";
import { getPublishedProject } from "@/lib/queries";

export const alt = "Project";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function ProjectOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getPublishedProject(slug);
  return renderOgImage({
    section: "Project",
    title: project?.title ?? "Project",
    description: project?.description,
    image: project?.banner,
    tags: project?.tags,
  });
}
