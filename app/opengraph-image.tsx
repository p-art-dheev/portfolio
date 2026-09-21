import { ImageResponse } from "next/og";

import { site } from "@/lib/data";
import { SITE_NAME } from "@/lib/seo";

export const alt = `${SITE_NAME} | Full-Stack Developer Portfolio`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: "#0a0a0a",
        color: "#fafafa",
      }}
    >
      <div style={{ fontSize: 30, color: "#a3a3a3" }}>{site.domain}</div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: -2 }}>
          {SITE_NAME}
        </div>
        <div style={{ fontSize: 40, color: "#d4d4d4", marginTop: 16 }}>
          {`${site.role} · ${site.tagline}`}
        </div>
      </div>
      <div style={{ fontSize: 28, color: "#737373" }}>
        Projects · Blog · Artworks · Books
      </div>
    </div>,
    size,
  );
}
