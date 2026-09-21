import Link from "next/link";

import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteArtwork } from "@/lib/admin/actions";
import { listAdminArtworks } from "@/lib/queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function AdminArtworksPage() {
  const artworks = await listAdminArtworks();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Artworks</h1>
        <Button asChild>
          <Link href="/admin/artworks/new">New</Link>
        </Button>
      </div>
      <ul className="space-y-3">
        {artworks.map((artwork) => (
          <li
            key={artwork.id}
            className="border-border flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="font-medium">{artwork.title}</p>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={artwork.published ? "default" : "secondary"}>
                {artwork.published ? "Published" : "Draft"}
              </Badge>
              <Button asChild size="sm" variant="outline">
                <Link href={`/admin/artworks/${artwork.id}`}>Edit</Link>
              </Button>
              <DeleteButton
                action={deleteArtwork}
                id={artwork.id}
                label="artwork"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
