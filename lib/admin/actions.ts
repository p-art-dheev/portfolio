"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { isAdminUser } from "@/lib/admin/auth";
import { excerptFromHtml, normalizeTags, readingTimeMinutes } from "@/lib/blog";
import { sanitizePostHtml } from "@/lib/sanitize";
import { slugify } from "@/lib/slug";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ProjectStatus, TechItem } from "@/lib/content-types";
import { techIconMap } from "@/lib/tech-stack-icons";
import type { TechIconKey } from "@/lib/tech-stack-icons";

async function requireAdmin() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isAdminUser(user)) {
    throw new Error("Unauthorized");
  }
  return supabase;
}

function revalidatePublic() {
  revalidatePath("/", "layout");
  revalidatePath("/projects");
  revalidatePath("/artworks");
  revalidatePath("/books");
  revalidatePath("/blogs");
}

function str(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function bool(formData: FormData, key: string) {
  const value = formData.get(key);
  return value === "on" || value === "true" || value === "1";
}

function num(formData: FormData, key: string, fallback: number) {
  const parsed = Number(str(formData, key));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function optionalUrl(value: string) {
  return value.length > 0 ? value : null;
}

export async function signOut() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

const UPLOAD_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "application/pdf": "pdf",
};

export async function uploadMediaFile(formData: FormData) {
  const supabase = await requireAdmin();
  const file = formData.get("file");
  const folder = slugify(str(formData, "folder")) || "uploads";

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a file to upload." };
  }
  if (file.size > 10 * 1024 * 1024) {
    return { error: "File is larger than 10 MB." };
  }
  const ext = UPLOAD_TYPES[file.type];
  if (!ext) {
    return { error: "Unsupported file type. Use JPG, PNG, WebP, GIF or AVIF." };
  }

  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type,
    upsert: false,
  });
  if (error) return { error: error.message };

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return { url: data.publicUrl };
}

export async function saveProject(formData: FormData) {
  const supabase = await requireAdmin();
  const id = str(formData, "id");
  const title = str(formData, "title");
  const slug = slugify(str(formData, "slug") || title);
  const statusValue = str(formData, "status") as ProjectStatus;
  const status: ProjectStatus =
    statusValue === "live" || statusValue === "Building" ? statusValue : "off";

  const payload = {
    title,
    slug,
    description: str(formData, "description"),
    banner: optionalUrl(str(formData, "banner")),
    tags: str(formData, "tags")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    href: optionalUrl(str(formData, "href")),
    status,
    featured: bool(formData, "featured"),
    published: bool(formData, "published"),
    sort_order: num(formData, "sort_order", 0),
  };

  if (!title || !slug) {
    return { error: "Title is required." };
  }

  const query = id
    ? supabase.from("projects").update(payload).eq("id", id)
    : supabase.from("projects").insert(payload);

  const { error } = await query;
  if (error) return { error: error.message };

  revalidatePublic();
  redirect("/admin/projects");
}

export async function deleteProject(formData: FormData) {
  const supabase = await requireAdmin();
  const id = str(formData, "id");
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePublic();
  redirect("/admin/projects");
}

export type PostActionResult = {
  error?: string;
  id?: string;
  slug?: string;
  published?: boolean;
  savedAt?: string;
};

function revalidatePostPages(...slugs: (string | undefined)[]) {
  revalidatePublic();
  for (const slug of new Set(slugs)) {
    if (slug) revalidatePath(`/blogs/${slug}`);
  }
}

function hasContent(html: string) {
  return html.replace(/<[^>]+>/g, "").trim().length > 0 || /<img/.test(html);
}

export async function savePost(formData: FormData): Promise<PostActionResult> {
  const supabase = await requireAdmin();
  const id = str(formData, "id");
  const title = str(formData, "title");
  const slug = slugify(str(formData, "slug") || title);
  // "draft"/"unpublish" force draft, "publish" forces live, otherwise keep as is.
  const intent = str(formData, "intent");

  if (!title) return { error: "Add a title before saving." };
  if (!slug) return { error: "The URL slug can't be empty." };

  const existing = id
    ? (
        await supabase
          .from("posts")
          .select("slug, published, published_at")
          .eq("id", id)
          .maybeSingle()
      ).data
    : null;
  if (id && !existing) return { error: "This post no longer exists." };

  const published =
    intent === "publish"
      ? true
      : intent === "draft" || intent === "unpublish"
        ? false
        : Boolean(existing?.published);

  const contentHtml = sanitizePostHtml(
    String(formData.get("content_html") ?? ""),
  );
  if (published && !hasContent(contentHtml)) {
    return { error: "Write something in the body before publishing." };
  }

  const payload = {
    title,
    slug,
    excerpt: str(formData, "excerpt") || excerptFromHtml(contentHtml),
    content_html: contentHtml,
    cover_url: optionalUrl(str(formData, "cover_url")),
    cover_alt: str(formData, "cover_alt"),
    published,
    // Keep the original publish date across unpublish/republish cycles.
    published_at:
      (existing?.published_at as string | null) ??
      (published ? new Date().toISOString() : null),
    tags: normalizeTags(str(formData, "tags")),
    category: str(formData, "category"),
    reading_minutes: readingTimeMinutes(contentHtml),
  };

  const write = (values: Record<string, unknown>) =>
    id
      ? supabase.from("posts").update(values).eq("id", id).select("id").single()
      : supabase.from("posts").insert(values).select("id").single();

  let { data, error } = await write(payload);
  // Until migrate-blog-v2.sql is applied the two new columns don't exist;
  // save without them rather than locking the author out.
  if (error?.message.match(/reading_minutes|cover_alt/)) {
    const { reading_minutes, cover_alt, ...legacy } = payload;
    void reading_minutes;
    void cover_alt;
    ({ data, error } = await write(legacy));
  }
  if (error || !data) {
    if (error?.code === "23505") {
      return { error: `The slug "${slug}" is already used by another post.` };
    }
    return { error: error?.message ?? "Could not save the post." };
  }

  revalidatePostPages(slug, existing?.slug as string | undefined);
  return {
    id: data.id as string,
    slug,
    published,
    savedAt: new Date().toISOString(),
  };
}

export async function setPostPublished(
  formData: FormData,
): Promise<PostActionResult> {
  const supabase = await requireAdmin();
  const id = str(formData, "id");
  const published = bool(formData, "published");

  const { data: post } = await supabase
    .from("posts")
    .select("slug, published_at, content_html")
    .eq("id", id)
    .maybeSingle();
  if (!post) return { error: "This post no longer exists." };
  if (published && !hasContent(String(post.content_html ?? ""))) {
    return {
      error: "This post has no content yet. Open it and write something first.",
    };
  }

  const { error } = await supabase
    .from("posts")
    .update({
      published,
      published_at:
        (post.published_at as string | null) ??
        (published ? new Date().toISOString() : null),
    })
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePostPages(post.slug as string);
  return { id, slug: post.slug as string, published };
}

export async function deletePost(formData: FormData) {
  const supabase = await requireAdmin();
  const id = str(formData, "id");
  const { data: post } = await supabase
    .from("posts")
    .select("slug")
    .eq("id", id)
    .maybeSingle();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePostPages(post?.slug as string | undefined);
  redirect("/admin/blogs?deleted=1");
}

export async function saveArtwork(formData: FormData) {
  const supabase = await requireAdmin();
  const id = str(formData, "id");
  const title = str(formData, "title");
  const imageUrl = str(formData, "image_url");

  if (!title || !imageUrl) {
    return { error: "Title and image are required." };
  }

  const payload = {
    title,
    image_url: imageUrl,
    alt: str(formData, "alt") || title,
    width: num(formData, "width", 1200),
    height: num(formData, "height", 1600),
    link: optionalUrl(str(formData, "link")),
    published: bool(formData, "published"),
    sort_order: num(formData, "sort_order", 0),
  };

  const query = id
    ? supabase.from("artworks").update(payload).eq("id", id)
    : supabase.from("artworks").insert(payload);

  const { error } = await query;
  if (error) return { error: error.message };

  revalidatePublic();
  redirect("/admin/artworks");
}

export async function deleteArtwork(formData: FormData) {
  const supabase = await requireAdmin();
  const id = str(formData, "id");
  const { error } = await supabase.from("artworks").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePublic();
  redirect("/admin/artworks");
}

export async function saveBook(formData: FormData) {
  const supabase = await requireAdmin();
  const id = str(formData, "id");
  const title = str(formData, "title");
  const coverUrl = str(formData, "cover_url");

  if (!title || !coverUrl) {
    return { error: "Title and cover image are required." };
  }

  const payload = {
    title,
    subtitle: str(formData, "subtitle"),
    author: str(formData, "author"),
    cover_url: coverUrl,
    cover_alt: str(formData, "cover_alt") || `${title} cover`,
    published: bool(formData, "published"),
    sort_order: num(formData, "sort_order", 0),
  };

  const query = id
    ? supabase.from("books").update(payload).eq("id", id)
    : supabase.from("books").insert(payload);

  const { error } = await query;
  if (error) return { error: error.message };

  revalidatePublic();
  redirect("/admin/books");
}

export async function deleteBook(formData: FormData) {
  const supabase = await requireAdmin();
  const id = str(formData, "id");
  const { error } = await supabase.from("books").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePublic();
  redirect("/admin/books");
}

function isTechIconKey(value: string): value is TechIconKey {
  return value in techIconMap;
}

export async function saveSiteSettings(formData: FormData) {
  const supabase = await requireAdmin();
  const techStack: TechItem[] = str(formData, "tech_stack")
    .split("\n")
    .flatMap((line) => {
      const [labelRaw, iconRaw] = line.split("|");
      const label = labelRaw?.trim();
      const icon = iconRaw?.trim();
      if (!label || !icon || !isTechIconKey(icon)) return [];
      return [{ label, icon }];
    });

  const avatars = str(formData, "avatars")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const payload = {
    name: str(formData, "name"),
    domain: str(formData, "domain"),
    role: str(formData, "role"),
    tagline: str(formData, "tagline"),
    bio: str(formData, "bio"),
    college: str(formData, "college"),
    branch: str(formData, "branch"),
    year: str(formData, "year"),
    location: str(formData, "location"),
    resume: str(formData, "resume") || "/resume/resume.pdf",
    avatars,
    socials: {
      linkedin: str(formData, "linkedin"),
      github: str(formData, "github"),
      email: str(formData, "email"),
    },
    tech_stack: techStack,
  };

  const { error } = await supabase.from("site_settings").upsert({
    id: 1,
    ...payload,
  });

  if (error) return { error: error.message };
  revalidatePublic();
  redirect("/admin/settings");
}
