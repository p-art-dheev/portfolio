"use client";

import { useEffect } from "react";

import { playSound, unlockAudio, type SoundName } from "@/lib/sound";

// One set of document-level listeners gives every link and button a soft
// click (and, with a mouse, a faint hover tick). An element can opt out or
// pick another sound with data-sound="off" | "toggle-on" | ... on itself or
// an ancestor.
const INTERACTIVE =
  'a[href], button, [role="button"], [role="menuitem"], [role="tab"], summary, label[for], input[type="checkbox"], input[type="radio"]';

function soundFor(target: EventTarget | null): {
  el: Element;
  sound: SoundName | "off" | null;
} | null {
  if (!(target instanceof Element)) return null;
  const el = target.closest(INTERACTIVE);
  if (!el) return null;
  if (el.matches(":disabled, [aria-disabled='true']")) return null;
  const override = el.closest("[data-sound]")?.getAttribute("data-sound");
  return { el, sound: (override as SoundName | "off" | null) ?? null };
}

export function SoundEffects() {
  useEffect(() => {
    let hovered: Element | null = null;
    const fineHover = window.matchMedia("(hover: hover) and (pointer: fine)");

    function onPointerDown() {
      unlockAudio();
    }

    function onClick(event: MouseEvent) {
      const hit = soundFor(event.target);
      // Any data-sound value means the element handles (or skips) its own
      // sound, e.g. the theme toggle plays a two-note chime instead.
      if (!hit || hit.sound !== null) return;
      playSound("click");
    }

    function onPointerOver(event: PointerEvent) {
      if (event.pointerType !== "mouse" || !fineHover.matches) return;
      const hit = soundFor(event.target);
      const el = hit?.el ?? null;
      if (el === hovered) return;
      hovered = el;
      if (!hit || hit.sound === "off") return;
      playSound("hover");
    }

    document.addEventListener("pointerdown", onPointerDown, { passive: true });
    document.addEventListener("keydown", onPointerDown, { passive: true });
    document.addEventListener("click", onClick, { passive: true });
    document.addEventListener("pointerover", onPointerOver, { passive: true });
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onPointerDown);
      document.removeEventListener("click", onClick);
      document.removeEventListener("pointerover", onPointerOver);
    };
  }, []);

  return null;
}
