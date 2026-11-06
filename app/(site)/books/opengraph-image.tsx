import { OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "A few books that stuck with me · Pardheev Vatturu";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return renderOgImage({
    section: "Books",
    title: "A few books that stuck with me",
    description: "Philosophy, psychology, self-help and productivity.",
  });
}
