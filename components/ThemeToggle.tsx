"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Moon, Sun } from "lucide-react";

import { playSound } from "@/lib/sound";
import { Button } from "@/components/ui/button";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // Storage blocked: the theme still applies for this visit.
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const busy = useRef(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
    setMounted(true);
  }, []);

  function toggleTheme() {
    if (busy.current) return;
    const next: Theme = theme === "dark" ? "light" : "dark";
    playSound(next === "dark" ? "toggle-off" : "toggle-on");

    const swap = () => {
      flushSync(() => setTheme(next));
      applyTheme(next);
    };

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!document.startViewTransition || reduceMotion || !buttonRef.current) {
      swap();
      return;
    }

    // Circular reveal: the new theme grows out of the toggle button until it
    // covers the farthest corner of the viewport.
    const rect = buttonRef.current.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const root = document.documentElement;
    busy.current = true;
    root.dataset.themeSwitching = "";
    const transition = document.startViewTransition(swap);

    transition.ready
      .then(
        () =>
          root.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${radius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 550,
              easing: "cubic-bezier(0.4, 0, 0.2, 1)",
              pseudoElement: "::view-transition-new(root)",
            },
          ).finished,
      )
      .catch(() => {})
      .finally(() => {
        busy.current = false;
        delete root.dataset.themeSwitching;
      });
  }

  return (
    <Button
      ref={buttonRef}
      type="button"
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      data-sound="toggle"
      aria-label={
        mounted
          ? `Switch to ${theme === "dark" ? "light" : "dark"} mode`
          : "Toggle color theme"
      }
    >
      {mounted && theme === "dark" ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </Button>
  );
}
