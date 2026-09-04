"use client";

import { ProjectPinUpField } from "@/components/ProjectPinUpField";
import { artworks } from "@/lib/artworks";

export function ArtworksPage() {
  return (
    <div className="bg-background relative h-[calc(100dvh-3.5rem)] w-full overflow-hidden dark:bg-black">
      <ProjectPinUpField items={artworks} hazeStrength={0} />
      <p className="text-muted-foreground pointer-events-none absolute bottom-4 left-4 z-[60] text-xs">
        Drag to pan · Scroll to zoom · Double-click a piece to focus
      </p>
    </div>
  );
}
