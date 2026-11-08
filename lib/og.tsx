import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

import { loadImageSource } from "@/lib/blur";
import { getSiteSettings } from "@/lib/queries";
import { SITE_NAME } from "@/lib/seo";

/**
 * Link previews (Open Graph / Twitter cards) in the site's own style: a
 * platinum Titanium page, Instrument Serif titles, an ink-blue accent, and project or post
 * images mounted on a paper mat like the cards on the site.
 */

export const OG_SIZE = { width: 1200, height: 630 };

const INK = "#17191c";
const MUTED = "#5b616a";
const LINK = "#2e5488";
const BORDER = "#d7dbe0";
const MAT = "#eceef1";

// The same fixed photo the site shows.
const AVATAR = "/avatars/avatar.jpg";

const FONT_DIR = path.join(process.cwd(), "assets", "og");

type Font = {
  name: string;
  data: Buffer;
  weight: 400 | 500;
  style: "normal";
};

let fontsPromise: Promise<Font[]> | null = null;
function loadFonts() {
  fontsPromise ??= Promise.all([
    readFile(path.join(FONT_DIR, "instrument-serif-latin-400-normal.woff")),
    readFile(path.join(FONT_DIR, "geist-sans-latin-400-normal.woff")),
    readFile(path.join(FONT_DIR, "geist-sans-latin-500-normal.woff")),
    readFile(path.join(FONT_DIR, "geist-mono-latin-500-normal.woff")),
  ]).then(([serif, sans, sansMedium, mono]) => [
    { name: "Serif", data: serif, weight: 400, style: "normal" },
    { name: "Sans", data: sans, weight: 400, style: "normal" },
    { name: "Sans", data: sansMedium, weight: 500, style: "normal" },
    { name: "Mono", data: mono, weight: 500, style: "normal" },
  ]);
  return fontsPromise;
}

/** A site or remote image as a JPEG data URI, cropped to the given box. */
async function imageDataUri(
  src: string | null | undefined,
  width: number,
  height: number,
) {
  if (!src) return undefined;
  try {
    const { default: sharp } = await import("sharp");
    const input = await loadImageSource(src);
    const output = await sharp(input, { failOn: "none" })
      .resize(width * 2, height * 2, { fit: "cover", position: "top" })
      .jpeg({ quality: 84 })
      .toBuffer();
    return `data:image/jpeg;base64,${output.toString("base64")}`;
  } catch {
    return undefined;
  }
}

function clip(text: string, max: number) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).replace(/\s+\S*$/, "")}…`;
}

function titleSize(title: string, hasImage: boolean) {
  const n = title.length;
  if (hasImage) return n <= 18 ? 84 : n <= 36 ? 68 : 56;
  return n <= 20 ? 112 : n <= 40 ? 88 : n <= 70 ? 70 : 58;
}

export type OgOptions = {
  /** Small label after the domain, e.g. "Project" or "Blog · Notes". */
  section?: string;
  title: string;
  description?: string;
  /** Banner or cover, shown mounted on a mat on the right. */
  image?: string | null;
  /** Shown as pills in the footer (first three). */
  tags?: string[];
  /** Right side of the footer, e.g. "4 min read". */
  meta?: string;
  /** Show the avatar large on the right instead of an image (home page). */
  portrait?: boolean;
};

export async function renderOgImage({
  section,
  title,
  description,
  image,
  tags = [],
  meta,
  portrait = false,
}: OgOptions) {
  const [site, fonts, picture, avatar] = await Promise.all([
    getSiteSettings(),
    loadFonts(),
    portrait ? undefined : imageDataUri(image, 456, 256),
    imageDataUri(AVATAR, portrait ? 300 : 64, portrait ? 300 : 64),
  ]);
  const hasImage = Boolean(picture) || portrait;
  const eyebrow = [site.domain, section].filter(Boolean).join("  ·  ");

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f3f4f6",
        backgroundImage:
          "radial-gradient(circle at 0% 0%, #ffffff 0%, #f3f4f6 55%)",
        color: INK,
        fontFamily: "Sans",
      }}
    >
      {/* The accent rule, like the reading-progress bar on the site. */}
      <div
        style={{
          display: "flex",
          height: 8,
          width: "100%",
          backgroundColor: LINK,
        }}
      />

      <div
        style={{
          display: "flex",
          flex: 1,
          padding: "56px 72px 52px",
          gap: 56,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontFamily: "Mono",
                fontWeight: 500,
                fontSize: 21,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: LINK,
              }}
            >
              {eyebrow}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 28,
                fontFamily: "Serif",
                fontSize: titleSize(title, hasImage),
                lineHeight: 1.02,
                letterSpacing: -1,
              }}
            >
              {clip(title, 90)}
            </div>
            {description ? (
              <div
                style={{
                  display: "flex",
                  marginTop: 24,
                  fontSize: 28,
                  lineHeight: 1.42,
                  color: MUTED,
                }}
              >
                {clip(description, hasImage ? 110 : 150)}
              </div>
            ) : null}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 24,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {avatar && !portrait ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatar}
                  width={56}
                  height={56}
                  alt=""
                  style={{ borderRadius: 999, border: `2px solid ${BORDER}` }}
                />
              ) : null}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", fontSize: 24, fontWeight: 500 }}>
                  {SITE_NAME}
                </div>
                <div style={{ display: "flex", fontSize: 20, color: MUTED }}>
                  {site.role}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {tags.slice(0, hasImage ? 2 : 3).map((tag) => (
                <div
                  key={tag}
                  style={{
                    display: "flex",
                    padding: "7px 16px",
                    borderRadius: 999,
                    border: `1.5px solid ${BORDER}`,
                    fontSize: 19,
                    fontWeight: 500,
                    color: MUTED,
                  }}
                >
                  {tag}
                </div>
              ))}
              {meta ? (
                <div style={{ display: "flex", fontSize: 20, color: MUTED }}>
                  {meta}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {portrait && avatar ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              padding: 16,
              borderRadius: 999,
              backgroundColor: MAT,
              border: `1.5px solid ${BORDER}`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatar}
              width={300}
              height={300}
              alt=""
              style={{ borderRadius: 999 }}
            />
          </div>
        ) : picture ? (
          // The image mounted on a paper mat, as on the project cards.
          <div
            style={{
              display: "flex",
              alignSelf: "center",
              padding: 18,
              borderRadius: 30,
              backgroundColor: MAT,
              border: `1.5px solid ${BORDER}`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={picture}
              width={456}
              height={256}
              alt=""
              style={{
                borderRadius: 14,
                boxShadow: "0 18px 36px -18px rgba(0,0,0,0.45)",
              }}
            />
          </div>
        ) : null}
      </div>
    </div>,
    { ...OG_SIZE, fonts },
  );
}
