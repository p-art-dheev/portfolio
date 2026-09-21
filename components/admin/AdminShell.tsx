"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
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
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: SquareKanban },
  { href: "/admin/blogs", label: "Blogs", icon: Newspaper },
  { href: "/admin/artworks", label: "Artworks", icon: ImageIcon },
  { href: "/admin/books", label: "Books", icon: BookOpen },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname.startsWith(href);
}

export function AdminShell({
  children,
  email,
}: {
  children: React.ReactNode;
  email: string;
}) {
  const pathname = usePathname();

  return (
    <div className="bg-background flex min-h-screen flex-col pb-20 md:flex-row md:pb-0">
      <aside className="border-border hidden w-56 shrink-0 border-r md:flex md:flex-col">
        <div className="px-4 py-5">
          <p className="text-sm font-medium tracking-tight">Admin</p>
          <p className="text-muted-foreground mt-1 truncate text-xs">{email}</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm",
                isActive(pathname, link.href)
                  ? "bg-muted font-medium"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              <link.icon className="size-4" />
              {link.label}
            </Link>
          ))}
        </nav>
        <form action={signOut} className="p-3">
          <Button type="submit" variant="ghost" className="w-full justify-start">
            <LogOut className="size-4" />
            Sign out
          </Button>
        </form>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-border bg-background/80 sticky top-0 z-30 flex items-center justify-between border-b px-4 py-3 backdrop-blur md:hidden">
          <p className="font-medium">Admin</p>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open admin menu">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>Admin</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {links.map((link) => (
                  <SheetClose key={link.href} asChild>
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm",
                        isActive(pathname, link.href)
                          ? "bg-muted font-medium"
                          : "text-muted-foreground",
                      )}
                    >
                      <link.icon className="size-4" />
                      {link.label}
                    </Link>
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
        </header>

        <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6">
          {children}
        </div>
      </div>

      <nav className="border-border bg-background/95 fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t md:hidden">
        {links.slice(0, 5).map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex flex-col items-center gap-1 py-2 text-[11px]",
              isActive(pathname, link.href)
                ? "text-foreground"
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
