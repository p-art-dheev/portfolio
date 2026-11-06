import { OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Realism drawings & digital art · Pardheev Vatturu";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return renderOgImage({
    section: "Artworks",
    title: "Realism drawings & digital art",
    description: "A gallery of pieces drawn by hand and on screen.",
  });
}
