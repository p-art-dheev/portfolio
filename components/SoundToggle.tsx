"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

import { isMuted, playSound, setMuted, subscribeMuted } from "@/lib/sound";
import { Button } from "@/components/ui/button";

export function SoundToggle() {
  const [muted, setMutedState] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMutedState(isMuted());
    setMounted(true);
    return subscribeMuted(setMutedState);
  }, []);

  function toggle() {
    const next = !muted;
    setMuted(next);
    // Confirm "sound on" audibly; turning it off stays silent.
    if (!next) playSound("toggle-on");
  }

  const title = mounted && muted ? "Sound off" : "Sound on";

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={toggle}
      aria-label="Interface sounds"
      aria-pressed={mounted ? !muted : undefined}
      title={title}
      data-sound="off"
    >
      {mounted && muted ? (
        <VolumeX className="size-4" />
      ) : (
        <Volume2 className="size-4" />
      )}
    </Button>
  );
}
