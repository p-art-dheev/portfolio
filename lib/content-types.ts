import type { TechIconKey } from "@/lib/tech-stack-icons";

export type ProjectStatus = "off" | "live" | "Building";

export type Project = {
  slug: string;
  title: string;
  description: string;
  banner?: string;
  tags: string[];
  href?: string;
  status: ProjectStatus;
};

export type TechItem = {
  label: string;
  icon: TechIconKey;
};

export type SiteSocials = {
  linkedin: string;
  github: string;
  email: string;
};

export type SiteContent = {
  name: string;
  domain: string;
  role: string;
  tagline: string;
  bio: string;
  college: string;
  branch: string;
  year: string;
  location: string;
  resume: string;
  avatars: string[];
  socials: SiteSocials;
  techStack: TechItem[];
};

export type ArtworkItem = {
  id?: string;
  title: string;
  image: { src: string; alt: string; width: number; height: number };
  link?: string;
};

export type BookItem = {
  id?: string;
  title: string;
  subtitle: string;
  author: string;
  coverImage: { src: string; alt: string };
};

export type PostListItem = {
  slug: string;
  title: string;
  excerpt: string;
  coverUrl: string | null;
  publishedAt: string | null;
  tags: string[];
  category: string;
  viewsCount: number;
  likesCount: number;
};

export type PostDetail = PostListItem & {
  contentHtml: string;
};

export type AdminProject = Project & {
  id: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
};

export type AdminPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  coverUrl: string | null;
  published: boolean;
  publishedAt: string | null;
  tags: string[];
  category: string;
  viewsCount: number;
  likesCount: number;
};

export type AdminArtwork = {
  id: string;
  title: string;
  imageUrl: string;
  alt: string;
  width: number;
  height: number;
  link: string | null;
  published: boolean;
  sortOrder: number;
};

export type AdminBook = {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  coverUrl: string;
  coverAlt: string;
  published: boolean;
  sortOrder: number;
};
