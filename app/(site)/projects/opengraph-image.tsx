import { OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Selected work · Pardheev Vatturu";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return renderOgImage({
    section: "Projects",
    title: "Selected work",
    description: "Full-stack apps, NLP and applied ML, from idea to interface.",
  });
}
