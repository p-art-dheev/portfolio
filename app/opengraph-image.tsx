import { OG_SIZE, renderOgImage } from "@/lib/og";
import { getSiteSettings } from "@/lib/queries";
import { SITE_NAME } from "@/lib/seo";

export const alt = `${SITE_NAME} | Full-Stack Developer Portfolio`;
export const size = OG_SIZE;
export const contentType = "image/png";

// Home page (and any page without its own preview).
export default async function OpenGraphImage() {
  const site = await getSiteSettings();
  return renderOgImage({
    title: SITE_NAME,
    description: site.tagline ? `${site.role}. ${site.tagline}` : site.role,
    tags: ["Projects", "Blog", "Artworks"],
    portrait: true,
  });
}
