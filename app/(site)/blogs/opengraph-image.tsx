import { OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Notes & writing · Pardheev Vatturu";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return renderOgImage({
    section: "Blog",
    title: "Notes & writing",
    description: "Writing on full-stack development, AI, art and ideas.",
  });
}
