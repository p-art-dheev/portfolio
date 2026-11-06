import { encodeEmail } from "@/lib/email";
import {
  getPublishedPosts,
  getPublishedProjects,
  getSiteSettings,
} from "@/lib/queries";

// Data for the ⌘K quick-jump menu. Static and cached on the CDN; the menu
// only fetches it the first time someone opens it.
export const dynamic = "force-static";
export const revalidate = 3600;

export type SearchIndex = {
  projects: { slug: string; title: string; description: string }[];
  posts: { slug: string; title: string; excerpt: string; category: string }[];
  socials: { github: string; linkedin: string; email: string };
};

export async function GET() {
  const [site, projects, posts] = await Promise.all([
    getSiteSettings(),
    getPublishedProjects(),
    getPublishedPosts(),
  ]);

  const index: SearchIndex = {
    projects: projects.map(({ slug, title, description }) => ({
      slug,
      title,
      description,
    })),
    posts: posts.map(({ slug, title, excerpt, category }) => ({
      slug,
      title,
      excerpt,
      category,
    })),
    socials: {
      github: site.socials.github,
      linkedin: site.socials.linkedin,
      // Kept encoded like everywhere else on the site (light anti-scraping).
      email: encodeEmail(site.socials.email),
    },
  };

  return Response.json(index);
}
