import Link from "next/link";
import { ImageIcon } from "lucide-react";

import { DeleteButton } from "@/components/admin/DeleteButton";
import { EmptyState } from "@/components/admin/EmptyState";
import { PageHeader } from "@/components/admin/PageHeader";
import { PublishBadge } from "@/components/admin/StatusBadge";
import { deleteArtwork } from "@/lib/admin/actions";
import { listAdminArtworks } from "@/lib/queries";
import { Button } from "@/components/ui/button";

export default async function AdminArtworksPage() {
  const artworks = await listAdminArtworks();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Artworks"
        description="Pieces in the public gallery."
        actionHref="/admin/artworks/new"
        actionLabel="New artwork"
      />
      {artworks.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No artworks yet"
          description="Upload from your phone or desktop. Unpublished pieces stay hidden."
          href="/admin/artworks/new"
          action="Add artwork"
        />
      ) : (
        <ul className="space-y-3">
          {artworks.map((artwork) => (
            <li
              key={artwork.id}
              className="border-border flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1.5">
                <p className="font-medium tracking-tight">{artwork.title}</p>
                <PublishBadge published={artwork.published} />
              </div>
              <div className="flex flex-wrap items-center gap-2">
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
      )}
    </div>
  );
}
