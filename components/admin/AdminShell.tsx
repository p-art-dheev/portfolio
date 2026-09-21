"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ExternalLink,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  Newspaper,
  Settings,
  SquareKanban,
} from "lucide-react";

import { signOut } from "@/lib/admin/actions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  { href: "/admin", label: "Home", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: SquareKanban },
  { href: "/admin/blogs", label: "Blogs", icon: Newspaper },
  { href: "/admin/artworks", label: "Art", icon: ImageIcon },
  { href: "/admin/books", label: "Books", icon: BookOpen },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname.startsWith(href);
}

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  className,
}: {
  href: string;
  label: string;
  icon: (typeof links)[number]["icon"];
  active: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
        active
          ? "bg-muted text-foreground font-medium"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
        className,
      )}
    >
      <Icon className="size-4 shrink-0" />
      {label}
    </Link>
  );
}

export function AdminShell({
  children,
  email,
}: {
  children: React.ReactNode;
  email: string;
}) {
  const pathname = usePathname();
  const current = links.find((link) => isActive(pathname, link.href));

  return (
    <div className="bg-background flex min-h-screen flex-col pb-[4.5rem] md:flex-row md:pb-0">
      <aside className="border-border hidden w-60 shrink-0 border-r md:flex md:flex-col">
        <div className="px-4 py-5">
          <p className="text-sm font-semibold tracking-tight">Studio</p>
          <p className="text-muted-foreground mt-1 truncate text-xs">{email}</p>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 px-2">
          {links.map((link) => (
            <NavLink
              key={link.href}
              {...link}
              active={isActive(pathname, link.href)}
            />
          ))}
        </nav>
        <div className="space-y-1 p-3">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/" target="_blank">
              <ExternalLink className="size-4" />
              View site
            </Link>
          </Button>
          <form action={signOut}>
            <Button type="submit" variant="ghost" className="w-full justify-start">
              <LogOut className="size-4" />
              Sign out
            </Button>
          </form>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-border bg-background/80 sticky top-0 z-30 flex items-center justify-between gap-3 border-b px-4 py-3 backdrop-blur md:hidden">
          <div>
            <p className="text-xs font-medium tracking-wide uppercase">Studio</p>
            <p className="text-sm font-medium">{current?.label ?? "Admin"}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/" aria-label="View site">
                <ExternalLink className="size-4" />
              </Link>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Open admin menu">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetHeader>
                  <SheetTitle>Studio</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 px-4">
                  {links.map((link) => (
                    <SheetClose key={link.href} asChild>
                      <NavLink
                        {...link}
                        active={isActive(pathname, link.href)}
                      />
                    </SheetClose>
                  ))}
                  <form action={signOut} className="mt-4">
                    <Button type="submit" variant="outline" className="w-full">
                      Sign out
                    </Button>
                  </form>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </div>
      </div>

      <nav className="border-border bg-background/95 safe-area-bottom fixed inset-x-0 bottom-0 z-30 grid grid-cols-6 border-t md:hidden">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex flex-col items-center gap-0.5 py-2 text-[10px] leading-none",
              isActive(pathname, link.href)
                ? "text-foreground font-medium"
                : "text-muted-foreground",
            )}
          >
            <link.icon className="size-4" />
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
