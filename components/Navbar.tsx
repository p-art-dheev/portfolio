"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Menu } from "lucide-react";

import { moreLinks, navLinks } from "@/lib/data";
import { cn } from "@/lib/utils";
import { CommandMenu } from "@/components/CommandMenu";
import { Logo } from "@/components/Logo";
import { Container } from "@/components/Container";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function navLinkClass(isActive: boolean) {
  return cn(
    "rounded-md px-2.5 py-1.5 text-sm transition-colors hover:bg-muted hover:text-foreground",
    isActive ? "font-medium text-foreground" : "text-muted-foreground",
  );
}

export function Navbar({ domain }: { domain: string }) {
  const [open, setOpen] = useState(false);
  // Radix generates ids that differ between server and client render here, so
  // the dropdown is only mounted after hydration (a look-alike button holds its place).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const pathname = usePathname();
  const router = useRouter();

  // Warm every top-level page once the browser is idle, so the first click
  // on any of them is instant. Links only prefetch while visible, and the
  // "More" menu items are not even mounted until the menu opens.
  useEffect(() => {
    const warm = () => {
      for (const link of [...navLinks, ...moreLinks])
        router.prefetch(link.href);
    };
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(warm, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(warm, 1200);
    return () => clearTimeout(id);
  }, [router]);
  const moreActive = moreLinks.some((link) => pathname.startsWith(link.href));

  // An ink underline that slides to the active item. It is measured from
  // the DOM (the item marked data-active) and only animates after its first
  // placement, so it never sweeps in from the left on page load.
  const navRef = useRef<HTMLElement>(null);
  const [indicator, setIndicator] = useState<{
    left: number;
    width: number;
    animate: boolean;
  } | null>(null);
  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const place = () => {
      const active = nav.querySelector<HTMLElement>("[data-active]");
      if (!active) {
        setIndicator(null);
        return;
      }
      // Underline the label, not the item's padding.
      const inset = 10;
      setIndicator((current) => ({
        left: active.offsetLeft + inset,
        width: active.offsetWidth - inset * 2,
        animate: current !== null,
      }));
    };
    place();
    const resizes = new ResizeObserver(place);
    resizes.observe(nav);
    return () => resizes.disconnect();
  }, [pathname, mounted]);

  return (
    <header className="metal-hairline bg-background/80 sticky top-0 z-40 border-b backdrop-blur-md">
      <Container className="flex h-14 items-center justify-between gap-4">
        <Link
          href="/"
          aria-label={`${domain}, home`}
          className="group/logo -my-1 rounded-md py-1"
        >
          <Logo domain={domain} />
        </Link>

        <nav
          ref={navRef}
          className="relative hidden items-center gap-1 sm:flex"
          aria-label="Primary"
        >
          {indicator ? (
            <span
              aria-hidden
              className={cn(
                "bg-metal-bar pointer-events-none absolute -bottom-3 h-0.5 rounded-full",
                indicator.animate &&
                  "transition-[left,width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
              )}
              style={{ left: indicator.left, width: indicator.width }}
            />
          ) : null}
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={navLinkClass(isActive)}
                data-active={isActive || undefined}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}

          {mounted ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  data-active={moreActive || undefined}
                  className={cn(
                    "text-muted-foreground cursor-pointer",
                    moreActive && "text-foreground font-medium",
                  )}
                >
                  More
                  <ChevronDown className="size-3.5 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-40">
                {moreLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link href={link.href}>{link.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              data-active={moreActive || undefined}
              className={cn(
                "text-muted-foreground cursor-pointer",
                moreActive && "text-foreground font-medium",
              )}
            >
              More
              <ChevronDown className="size-3.5 opacity-70" />
            </Button>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <CommandMenu />
          <ThemeToggle />

          {mounted ? (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="sm:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 px-4" aria-label="Mobile">
                  {[...navLinks, ...moreLinks].map((link) => {
                    const isActive =
                      link.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(link.href);

                    return (
                      <SheetClose key={link.href} asChild>
                        <Link
                          href={link.href}
                          className={navLinkClass(isActive)}
                        >
                          {link.label}
                        </Link>
                      </SheetClose>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="sm:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-4" />
            </Button>
          )}
        </div>
      </Container>
    </header>
  );
}
