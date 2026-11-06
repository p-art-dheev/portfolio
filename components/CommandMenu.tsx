"use client";

import { useEffect, useState, type ComponentProps } from "react";
import dynamic from "next/dynamic";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";

// The palette's code downloads only when someone reaches for it (hover,
// focus or the shortcut), so it adds nothing to normal page loads.
const loadPalette = () =>
  import("@/components/CommandPalette").then((mod) => mod.CommandPalette);
const CommandPalette = dynamic(loadPalette, { ssr: false });

/** Fired by other buttons (the 404 page) to open the menu. */
export const OPEN_COMMAND_MENU = "open-command-menu";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  // Mount the palette after the first open and keep it, so closing animates.
  const [used, setUsed] = useState(false);
  const [isMac, setIsMac] = useState(true);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));

    const show = () => {
      setUsed(true);
      setOpen(true);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setUsed(true);
        setOpen((current) => !current);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_COMMAND_MENU, show);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_COMMAND_MENU, show);
    };
  }, []);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          setUsed(true);
          setOpen(true);
        }}
        onPointerEnter={() => void loadPalette()}
        onFocus={() => void loadPalette()}
        aria-label="Search and jump (Ctrl or Command + K)"
        aria-keyshortcuts="Control+K Meta+K"
        className="text-muted-foreground hover:text-foreground size-9 gap-2 px-0 sm:w-auto sm:px-2.5"
      >
        <Search className="size-4" />
        <kbd className="bg-muted hidden rounded px-1.5 py-px font-mono text-[0.65rem] tracking-wide sm:inline">
          {isMac ? "⌘K" : "Ctrl K"}
        </kbd>
      </Button>
      {used ? <CommandPalette open={open} onOpenChange={setOpen} /> : null}
    </>
  );
}

/** A button anywhere on the site that opens the ⌘K menu. */
export function OpenCommandMenuButton(props: ComponentProps<"button">) {
  return (
    <button
      type="button"
      {...props}
      onClick={(event) => {
        props.onClick?.(event);
        window.dispatchEvent(new Event(OPEN_COMMAND_MENU));
      }}
    />
  );
}
