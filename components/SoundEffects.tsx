"use client";

import { useEffect } from "react";

import { playSound, unlockAudio, type SoundName } from "@/lib/sound";

// One set of document-level listeners gives every link and button a soft
// click. An element can opt out or play its own sound by setting
// data-sound="off" | "toggle" | ... on itself or an ancestor.
const INTERACTIVE =
  'a[href], button, [role="button"], [role="menuitem"], [role="tab"], summary, label[for], input[type="checkbox"], input[type="radio"]';

function soundFor(target: EventTarget | null): {
  el: Element;
  sound: SoundName | string | null;
} | null {
  if (!(target instanceof Element)) return null;
  const el = target.closest(INTERACTIVE);
  if (!el) return null;
  if (el.matches(":disabled, [aria-disabled='true']")) return null;
  const override = el.closest("[data-sound]")?.getAttribute("data-sound");
  return { el, sound: override ?? null };
}

export function SoundEffects() {
  useEffect(() => {
    function onFirstGesture() {
      unlockAudio();
    }

    function onClick(event: MouseEvent) {
      const hit = soundFor(event.target);
      // Any data-sound value means the element handles (or skips) its own
      // sound, e.g. the theme toggle plays a two-note chime instead.
      if (!hit || hit.sound !== null) return;
      playSound("click");
    }

    document.addEventListener("pointerdown", onFirstGesture, { passive: true });
    document.addEventListener("keydown", onFirstGesture, { passive: true });
    document.addEventListener("click", onClick, { passive: true });
    return () => {
      document.removeEventListener("pointerdown", onFirstGesture);
      document.removeEventListener("keydown", onFirstGesture);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
