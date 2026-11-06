"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type KeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "radix-ui";
import {
  ArrowUpRight,
  BookOpen,
  Check,
  Copy,
  CornerDownLeft,
  FileText,
  FolderGit2,
  Home,
  Image as ImageIcon,
  Library,
  Mail,
  PenLine,
  Search,
  SunMoon,
} from "lucide-react";

import type { SearchIndex } from "@/app/search-index.json/route";
import { Github, Linkedin } from "@/components/icons";
import { playSound } from "@/lib/sound";
import { cn } from "@/lib/utils";

type Group = "Pages" | "Projects" | "Posts" | "Actions" | "Elsewhere";
const GROUP_ORDER: Group[] = [
  "Pages",
  "Projects",
  "Posts",
  "Actions",
  "Elsewhere",
];

type Item = {
  id: string;
  group: Group;
  label: string;
  hint?: string;
  keywords?: string;
  icon: ComponentType<{ className?: string }>;
  /** Return false to keep the menu open (for in-place feedback). */
  run: () => void | false;
};

// Fetched once per visit, the first time the menu opens.
let indexPromise: Promise<SearchIndex | null> | null = null;
function loadIndex() {
  indexPromise ??= fetch("/search-index.json")
    .then((response) => (response.ok ? response.json() : null))
    .catch(() => null);
  return indexPromise;
}

function normalize(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/** 0 = no match. Prefix > word start > substring > in-order letters. */
function score(item: Item, query: string) {
  const label = normalize(item.label);
  if (label.startsWith(query)) return 4;
  if (label.split(/\s+/).some((word) => word.startsWith(query))) return 3;
  if (label.includes(query)) return 2;
  const extra = normalize(`${item.hint ?? ""} ${item.keywords ?? ""}`);
  if (extra.includes(query)) return 1;
  let at = 0;
  for (const char of label) if (char === query[at]) at++;
  return at === query.length ? 0.5 : 0;
}

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [index, setIndex] = useState<SearchIndex | null>(null);
  const [copied, setCopied] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    let alive = true;
    void loadIndex().then((data) => {
      if (alive && data) setIndex(data);
    });
    return () => {
      alive = false;
    };
  }, [open]);

  // Fresh state every time it opens.
  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      setCopied(false);
    }
  }, [open]);

  const items = useMemo<Item[]>(() => {
    const go = (href: string) => () => router.push(href);
    const external = (href: string) => () => {
      window.open(href, "_blank", "noopener,noreferrer");
    };
    const email = (() => {
      try {
        return index ? atob(index.socials.email) : "";
      } catch {
        return "";
      }
    })();

    const list: Item[] = [
      { id: "home", group: "Pages", label: "Home", icon: Home, run: go("/") },
      {
        id: "projects",
        group: "Pages",
        label: "Projects",
        keywords: "work portfolio",
        icon: FolderGit2,
        run: go("/projects"),
      },
      {
        id: "artworks",
        group: "Pages",
        label: "Artworks",
        keywords: "art drawings gallery",
        icon: ImageIcon,
        run: go("/artworks"),
      },
      {
        id: "blog",
        group: "Pages",
        label: "Blog",
        keywords: "posts writing articles",
        icon: PenLine,
        run: go("/blogs"),
      },
      {
        id: "books",
        group: "Pages",
        label: "Books",
        keywords: "reading library",
        icon: Library,
        run: go("/books"),
      },
      ...(index?.projects ?? []).map<Item>((project) => ({
        id: `project-${project.slug}`,
        group: "Projects",
        label: project.title,
        hint: project.description,
        icon: FileText,
        run: go(`/projects/${project.slug}`),
      })),
      ...(index?.posts ?? []).map<Item>((post) => ({
        id: `post-${post.slug}`,
        group: "Posts",
        label: post.title,
        hint: post.category || post.excerpt,
        keywords: post.excerpt,
        icon: BookOpen,
        run: go(`/blogs/${post.slug}`),
      })),
      {
        id: "theme",
        group: "Actions",
        label: "Toggle light / dark theme",
        keywords: "mode appearance",
        icon: SunMoon,
        // The real toggle, so the reveal animation and sound match.
        run: () => {
          window.setTimeout(() => {
            document
              .querySelector<HTMLButtonElement>("[data-theme-toggle]")
              ?.click();
          }, 120);
        },
      },
    ];

    if (email) {
      list.push({
        id: "copy-email",
        group: "Actions",
        label: copied ? "Copied to clipboard" : "Copy email address",
        hint: email,
        icon: copied ? Check : Copy,
        run: () => {
          void navigator.clipboard?.writeText(email).then(() => {
            setCopied(true);
            window.setTimeout(() => onOpenChange(false), 700);
          });
          return false;
        },
      });
    }
    if (index?.socials.github) {
      list.push({
        id: "github",
        group: "Elsewhere",
        label: "GitHub",
        icon: Github,
        run: external(index.socials.github),
      });
    }
    if (index?.socials.linkedin) {
      list.push({
        id: "linkedin",
        group: "Elsewhere",
        label: "LinkedIn",
        icon: Linkedin,
        run: external(index.socials.linkedin),
      });
    }
    if (email) {
      list.push({
        id: "email",
        group: "Elsewhere",
        label: "Send an email",
        icon: Mail,
        run: () => {
          window.location.href = `mailto:${email}`;
        },
      });
    }
    return list;
  }, [index, router, copied, onOpenChange]);

  // Filtered, grouped, best matches first within each group.
  const results = useMemo(() => {
    const q = normalize(query.trim());
    const scored = items
      .map((item) => ({ item, score: q ? score(item, q) : 1 }))
      .filter((entry) => entry.score > 0);
    return GROUP_ORDER.flatMap((group) =>
      scored
        .filter((entry) => entry.item.group === group)
        .sort((a, b) => b.score - a.score)
        .map((entry) => entry.item),
    );
  }, [items, query]);

  const current = Math.min(active, Math.max(results.length - 1, 0));

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${current}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [current]);

  function choose(item: Item | undefined, viaKeyboard: boolean) {
    if (!item) return;
    // Mouse clicks already make the site's click sound.
    if (viaKeyboard) playSound("click");
    if (item.run() === false) return;
    onOpenChange(false);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const count = results.length;
    if (!count) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((current + 1) % count);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((current - 1 + count) % count);
    } else if (event.key === "Home") {
      event.preventDefault();
      setActive(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActive(count - 1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      choose(results[current], true);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/25 backdrop-blur-[2px] dark:bg-black/45" />
        <Dialog.Content
          aria-describedby={undefined}
          className="command-palette data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-[0.98] data-[state=open]:zoom-in-[0.98] data-[state=open]:slide-in-from-top-2 bg-popover text-popover-foreground fixed top-[12vh] left-1/2 z-50 w-[min(640px,calc(100vw-24px))] -translate-x-1/2 overflow-hidden rounded-2xl border shadow-2xl shadow-black/20 duration-200"
        >
          <Dialog.Title className="sr-only">Quick jump</Dialog.Title>
          <div className="flex items-center gap-3 border-b px-4">
            <Search
              className="text-muted-foreground size-4 shrink-0"
              aria-hidden
            />
            <input
              autoFocus
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActive(0);
              }}
              onKeyDown={onKeyDown}
              placeholder="Jump to a page, project or post…"
              className="placeholder:text-muted-foreground h-14 w-full bg-transparent text-base outline-none"
              role="combobox"
              aria-expanded
              aria-controls="command-results"
              aria-activedescendant={
                results[current] ? `command-${results[current].id}` : undefined
              }
              aria-autocomplete="list"
              spellCheck={false}
            />
            <kbd className="text-muted-foreground bg-muted hidden rounded-md px-1.5 py-0.5 font-mono text-[0.65rem] sm:inline">
              esc
            </kbd>
          </div>

          <div
            ref={listRef}
            id="command-results"
            role="listbox"
            aria-label="Results"
            className="max-h-[min(60vh,420px)] overflow-y-auto overscroll-contain p-2"
          >
            {results.length === 0 ? (
              <p className="text-muted-foreground px-3 py-10 text-center text-sm">
                Nothing matches &ldquo;{query}&rdquo;.
              </p>
            ) : (
              results.map((item, i) => {
                const showGroup =
                  i === 0 || results[i - 1].group !== item.group;
                const Icon = item.icon;
                const selected = i === current;
                return (
                  <div key={item.id}>
                    {showGroup ? (
                      <p className="text-muted-foreground px-3 pt-3 pb-1.5 font-mono text-[0.65rem] tracking-[0.18em] uppercase">
                        {item.group}
                      </p>
                    ) : null}
                    <div
                      id={`command-${item.id}`}
                      role="option"
                      aria-selected={selected}
                      data-index={i}
                      onMouseMove={() => {
                        if (!selected) setActive(i);
                      }}
                      onClick={() => choose(item, false)}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                        selected
                          ? "bg-muted text-foreground"
                          : "text-foreground/85",
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-4 shrink-0 transition-colors",
                          selected ? "text-link" : "text-muted-foreground",
                        )}
                      />
                      <span className="min-w-0 flex-1 truncate">
                        {item.label}
                        {item.hint ? (
                          <span className="text-muted-foreground ml-2 text-xs">
                            {item.hint}
                          </span>
                        ) : null}
                      </span>
                      {item.group === "Elsewhere" ? (
                        <ArrowUpRight className="text-muted-foreground size-3.5 shrink-0" />
                      ) : selected ? (
                        <CornerDownLeft className="text-muted-foreground size-3.5 shrink-0" />
                      ) : null}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="text-muted-foreground hidden items-center gap-4 border-t px-4 py-2.5 text-xs sm:flex">
            <span>
              <kbd className="font-mono">↑</kbd>{" "}
              <kbd className="font-mono">↓</kbd> to move
            </span>
            <span>
              <kbd className="font-mono">↵</kbd> to open
            </span>
            <span className="ml-auto">
              <kbd className="font-mono">esc</kbd> to close
            </span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
