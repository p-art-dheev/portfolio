import { cache } from "react";

import type { TechIconKey } from "@/lib/tech-stack-icons";
import { techIconMap } from "@/lib/tech-stack-icons";
import type {
  AdminArtwork,
  AdminBook,
  AdminPost,
  AdminProject,
  ArtworkItem,
  BookItem,
  PostDetail,
  PostListItem,
  Project,
  ProjectStatus,
  SiteContent,
  SiteSocials,
  TechItem,
} from "@/lib/content-types";
import { readingTimeMinutes } from "@/lib/blog";
import { artworks as fallbackArtworks } from "@/lib/artworks";
import { books as fallbackBooks } from "@/lib/books";
import { featuredProjects, site, techStack } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createAnonSupabaseClient } from "@/lib/supabase/anon";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export function fallbackSite(): SiteContent {
  return {
    name: site.name,
    domain: site.domain,
    role: site.role,
    tagline: site.tagline,
    bio: site.bio,
    college: site.college,
    branch: site.branch,
    year: site.year,
    location: site.location,
    resume: site.resume,
    avatars: [...site.avatars],
    socials: { ...site.socials },
    techStack,
  };
}

function isTechIconKey(value: string): value is TechIconKey {
  return value in techIconMap;
}

function parseSocials(value: unknown): SiteSocials {
  const fallback = fallbackSite().socials;
  if (!value || typeof value !== "object") return fallback;
  const record = value as Record<string, unknown>;
  return {
    linkedin:
      typeof record.linkedin === "string" ? record.linkedin : fallback.linkedin,
    github: typeof record.github === "string" ? record.github : fallback.github,
    email: typeof record.email === "string" ? record.email : fallback.email,
  };
}

function parseTechStack(value: unknown): TechItem[] {
  if (!Array.isArray(value)) return fallbackSite().techStack;
  const items: TechItem[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object") continue;
    const record = entry as Record<string, unknown>;
    if (typeof record.label !== "string" || typeof record.icon !== "string") {
      continue;
    }
    if (!isTechIconKey(record.icon)) continue;
    items.push({ label: record.label, icon: record.icon });
  }
  return items.length > 0 ? items : fallbackSite().techStack;
}

function parseAvatars(value: unknown): string[] {
  if (!Array.isArray(value)) return fallbackSite().avatars;
  const urls = value.filter((item): item is string => typeof item === "string");
  return urls.length > 0 ? urls : fallbackSite().avatars;
}

function asProjectStatus(value: string): ProjectStatus {
  if (value === "live" || value === "Building" || value === "off") return value;
  return "off";
}

type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  banner: string | null;
  tags: string[] | null;
  href: string | null;
  status: string;
  featured: boolean;
  published: boolean;
  sort_order: number;
};

function toProject(row: ProjectRow): Project {
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    banner: row.banner ?? undefined,
    tags: row.tags ?? [],
    href: row.href ?? undefined,
    status: asProjectStatus(row.status),
  };
}

function toAdminProject(row: ProjectRow): AdminProject {
  return {
    ...toProject(row),
    id: row.id,
    featured: row.featured,
    published: row.published,
    sortOrder: row.sort_order,
  };
}

export const getSiteSettings = cache(async (): Promise<SiteContent> => {
  if (!isSupabaseConfigured()) return fallbackSite();

  try {
    // Public read, no auth needed: keep this off the cookie-based client so
    // the page can be statically rendered instead of forced dynamic.
    const supabase = createAnonSupabaseClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (error || !data) return fallbackSite();

    return {
      name: data.name,
      domain: data.domain,
      role: data.role,
      tagline: data.tagline,
      bio: data.bio,
      college: data.college,
      branch: data.branch,
      year: data.year,
      location: data.location,
      resume: data.resume,
      avatars: parseAvatars(data.avatars),
      socials: parseSocials(data.socials),
      techStack: parseTechStack(data.tech_stack),
    };
  } catch {
    return fallbackSite();
  }
});

export async function getPublishedProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured()) return featuredProjects;

  try {
    const supabase = createAnonSupabaseClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error || !data) return featuredProjects;
    return data.map((row) => toProject(row as ProjectRow));
  } catch {
    return featuredProjects;
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured()) return featuredProjects;

  try {
    const supabase = createAnonSupabaseClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("published", true)
      .eq("featured", true)
      .order("sort_order", { ascending: true });

    if (error || !data) return featuredProjects;
    return data.map((row) => toProject(row as ProjectRow));
  } catch {
    return featuredProjects;
  }
}

export async function getPublishedArtworks(): Promise<ArtworkItem[]> {
  if (!isSupabaseConfigured()) return fallbackArtworks;

  try {
    const supabase = createAnonSupabaseClient();
    const { data, error } = await supabase
      .from("artworks")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error || !data) return fallbackArtworks;
    return data.map((row) => ({
      id: row.id as string,
      title: row.title as string,
      image: {
        src: row.image_url as string,
        alt: row.alt as string,
        width: row.width as number,
        height: row.height as number,
      },
      link: (row.link as string | null) ?? undefined,
    }));
  } catch {
    return fallbackArtworks;
  }
}

export async function getPublishedBooks(): Promise<BookItem[]> {
  if (!isSupabaseConfigured()) return fallbackBooks;

  try {
    const supabase = createAnonSupabaseClient();
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error || !data) return fallbackBooks;
    return data.map((row) => ({
      id: row.id as string,
      title: row.title as string,
      subtitle: row.subtitle as string,
      author: row.author as string,
      coverImage: {
        src: row.cover_url as string,
        alt: row.cover_alt as string,
      },
    }));
  } catch {
    return fallbackBooks;
  }
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function mapPostList(row: Record<string, unknown>): PostListItem {
  const content =
    typeof row.content_html === "string" ? row.content_html : null;
  return {
    slug: String(row.slug ?? ""),
    title: String(row.title ?? ""),
    excerpt: String(row.excerpt ?? ""),
    coverUrl: (row.cover_url as string | null) ?? null,
    publishedAt: (row.published_at as string | null) ?? null,
    tags: asStringArray(row.tags),
    category: typeof row.category === "string" ? row.category : "",
    readsCount: Number(row.reads_count) || 0,
    likesCount: Number(row.likes_count) || 0,
    readingMinutes:
      Number(row.reading_minutes) > 0
        ? Number(row.reading_minutes)
        : content
          ? readingTimeMinutes(content)
          : 1,
  };
}

function mapPostDetail(row: Record<string, unknown>): PostDetail {
  return {
    ...mapPostList(row),
    contentHtml: String(row.content_html ?? ""),
    coverAlt: String(row.cover_alt ?? ""),
    updatedAt: (row.updated_at as string | null) ?? null,
  };
}

function mapAdminPost(row: Record<string, unknown>): AdminPost {
  return {
    ...mapPostDetail(row),
    id: String(row.id ?? ""),
    published: Boolean(row.published),
    createdAt: (row.created_at as string | null) ?? null,
  };
}

// List views never need the (large) body. The stored reading_minutes column
// comes from migrate-blog-v2.sql; before it is applied we fall back to `*`.
const POST_LIST_COLUMNS =
  "id, slug, title, excerpt, cover_url, published, published_at, tags, category, likes_count, reading_minutes, updated_at, created_at";

async function selectPosts(
  supabase: ReturnType<typeof createAnonSupabaseClient>,
  build: (columns: string) => PromiseLike<{
    data: unknown[] | null;
    error: unknown;
  }>,
) {
  const first = await build(POST_LIST_COLUMNS);
  if (!first.error && first.data)
    return first.data as Record<string, unknown>[];
  const fallback = await build("*");
  return (fallback.data ?? []) as Record<string, unknown>[];
}

async function readCounts(
  supabase: ReturnType<typeof createAnonSupabaseClient>,
) {
  const counts = new Map<string, number>();
  const { data } = await supabase.rpc("get_post_read_counts");
  if (Array.isArray(data)) {
    for (const row of data as { post_slug: string; reads: number }[]) {
      counts.set(row.post_slug, Number(row.reads) || 0);
    }
  }
  return counts;
}

export const getPublishedPosts = cache(async (): Promise<PostListItem[]> => {
  if (!isSupabaseConfigured()) return [];

  try {
    // Public read: the anon client has no cookies() dependency, so this page
    // can be prerendered by generateStaticParams instead of erroring at
    // request time ("Page changed from static to dynamic ... reason: cookies").
    const supabase = createAnonSupabaseClient();
    const [rows, reads] = await Promise.all([
      selectPosts(supabase, (columns) =>
        supabase
          .from("posts")
          .select(columns)
          .eq("published", true)
          .order("published_at", { ascending: false }),
      ),
      readCounts(supabase),
    ]);
    return rows.map((row) => ({
      ...mapPostList(row),
      readsCount: reads.get(String(row.slug)) ?? 0,
    }));
  } catch {
    return [];
  }
});

export const getPublishedPost = cache(
  async (slug: string): Promise<PostDetail | null> => {
    if (!isSupabaseConfigured()) return null;

    try {
      const supabase = createAnonSupabaseClient();
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

      if (error || !data) return null;
      const { data: reads } = await supabase.rpc("get_post_read_count", {
        post_slug: slug,
      });
      return {
        ...mapPostDetail(data as Record<string, unknown>),
        readsCount: Number(reads) || 0,
      };
    } catch {
      return null;
    }
  },
);

export async function listAdminProjects(): Promise<AdminProject[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error || !data) return [];
  return data.map((row) => toAdminProject(row as ProjectRow));
}

export async function getAdminProject(
  id: string,
): Promise<AdminProject | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return toAdminProject(data as ProjectRow);
}

export async function listAdminPosts(): Promise<AdminPost[]> {
  const supabase = await createServerSupabaseClient();
  const [rows, reads] = await Promise.all([
    selectPosts(supabase, (columns) =>
      supabase
        .from("posts")
        .select(columns)
        .order("updated_at", { ascending: false }),
    ),
    readCounts(supabase),
  ]);
  return rows.map((row) => ({
    ...mapAdminPost(row),
    readsCount: reads.get(String(row.slug)) ?? 0,
  }));
}

export async function getAdminPost(id: string): Promise<AdminPost | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return mapAdminPost(data as Record<string, unknown>);
}

export async function listAdminArtworks(): Promise<AdminArtwork[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("artworks")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error || !data) return [];
  return data.map((row) => ({
    id: row.id as string,
    title: row.title as string,
    imageUrl: row.image_url as string,
    alt: row.alt as string,
    width: row.width as number,
    height: row.height as number,
    link: (row.link as string | null) ?? null,
    published: row.published as boolean,
    sortOrder: row.sort_order as number,
  }));
}

export async function getAdminArtwork(
  id: string,
): Promise<AdminArtwork | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("artworks")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return {
    id: data.id as string,
    title: data.title as string,
    imageUrl: data.image_url as string,
    alt: data.alt as string,
    width: data.width as number,
    height: data.height as number,
    link: (data.link as string | null) ?? null,
    published: data.published as boolean,
    sortOrder: data.sort_order as number,
  };
}

export async function listAdminBooks(): Promise<AdminBook[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error || !data) return [];
  return data.map((row) => ({
    id: row.id as string,
    title: row.title as string,
    subtitle: row.subtitle as string,
    author: row.author as string,
    coverUrl: row.cover_url as string,
    coverAlt: row.cover_alt as string,
    published: row.published as boolean,
    sortOrder: row.sort_order as number,
  }));
}

export async function getAdminBook(id: string): Promise<AdminBook | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return {
    id: data.id as string,
    title: data.title as string,
    subtitle: data.subtitle as string,
    author: data.author as string,
    coverUrl: data.cover_url as string,
    coverAlt: data.cover_alt as string,
    published: data.published as boolean,
    sortOrder: data.sort_order as number,
  };
}

export async function getAdminCounts() {
  const supabase = await createServerSupabaseClient();
  const [projects, posts, artworks, books] = await Promise.all([
    supabase.from("projects").select("id, published"),
    supabase.from("posts").select("id, published"),
    supabase.from("artworks").select("id, published"),
    supabase.from("books").select("id, published"),
  ]);

  const tally = (
    rows: { id: string; published: boolean }[] | null,
  ): { total: number; published: number } => {
    const list = rows ?? [];
    return {
      total: list.length,
      published: list.filter((row) => row.published).length,
    };
  };

  return {
    projects: tally(
      projects.data as { id: string; published: boolean }[] | null,
    ),
    posts: tally(posts.data as { id: string; published: boolean }[] | null),
    artworks: tally(
      artworks.data as { id: string; published: boolean }[] | null,
    ),
    books: tally(books.data as { id: string; published: boolean }[] | null),
  };
}

export async function getSiteVisitorCount() {
  if (!isSupabaseConfigured()) return 0;
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.rpc("get_site_visitor_count");
    if (error) return 0;
    return Number(data) || 0;
  } catch {
    return 0;
  }
}

export type PostFeedItem = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  coverUrl: string | null;
  publishedAt: string | null;
  updatedAt: string | null;
};

/** Cookie-free read of published posts for sitemap and RSS (cacheable). */
export async function getPostFeed(): Promise<PostFeedItem[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await createAnonSupabaseClient()
      .from("posts")
      .select(
        "slug, title, excerpt, category, tags, cover_url, published_at, updated_at",
      )
      .eq("published", true)
      .order("published_at", { ascending: false });
    if (error || !data) return [];
    return data.map((row) => ({
      slug: String(row.slug),
      title: String(row.title ?? ""),
      excerpt: String(row.excerpt ?? ""),
      category: typeof row.category === "string" ? row.category : "",
      tags: asStringArray(row.tags),
      coverUrl: (row.cover_url as string | null) ?? null,
      publishedAt: (row.published_at as string | null) ?? null,
      updatedAt: (row.updated_at as string | null) ?? null,
    }));
  } catch {
    return [];
  }
}
