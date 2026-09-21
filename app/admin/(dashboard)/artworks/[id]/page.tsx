import { notFound } from "next/navigation";

import { ArtworkForm } from "@/components/admin/ArtworkForm";
import { getAdminArtwork } from "@/lib/queries";

export default async function EditArtworkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const artwork = await getAdminArtwork(id);
  if (!artwork) notFound();

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold tracking-tight">Edit artwork</h1>
      <ArtworkForm artwork={artwork} />
    </div>
  );
}
