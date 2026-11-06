import "server-only";

import { readFile } from "node:fs/promises";
import https from "node:https";
import path from "node:path";

import { SITE_URL } from "@/lib/seo";

/**
 * Tiny blurred previews for next/image's placeholder="blur": a 16px WebP
 * (~150 bytes as base64) that shows while the real image loads, then
 * cross-fades into it.
 *
 * Generated on the server when a page is built or revalidated, never in
 * the browser. Any failure (missing file, slow host) just means no
 * placeholder: images still load normally.
 */

const cache = new Map<string, Promise<string | undefined>>();
const MAX_BYTES = 20 * 1024 * 1024;
const TIMEOUT_MS = 6000;

/**
 * Downloads with node:https rather than fetch: Next.js caches every fetch
 * in its data cache (which rejects large images with warnings), and these
 * bytes are only needed once to make the preview.
 */
function download(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const request = https.get(url, { timeout: TIMEOUT_MS }, (response) => {
      if (response.statusCode !== 200) {
        response.resume();
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      const chunks: Buffer[] = [];
      let size = 0;
      response.on("data", (chunk: Buffer) => {
        size += chunk.length;
        if (size > MAX_BYTES) request.destroy(new Error("too large"));
        else chunks.push(chunk);
      });
      response.on("end", () => resolve(Buffer.concat(chunks)));
      response.on("error", reject);
    });
    request.on("timeout", () => request.destroy(new Error("timeout")));
    request.on("error", reject);
  });
}

/** Raw bytes of a site image (public/ path) or an https URL. */
export async function loadImageSource(src: string): Promise<Buffer> {
  if (src.startsWith("/") && !src.startsWith("//")) {
    // Site files: read from public/ during the build. Serverless functions
    // that revalidate later don't ship public/, so fall back to the CDN copy.
    const file = path.join(process.cwd(), "public", decodeURI(src));
    try {
      return await readFile(file);
    } catch {
      return download(new URL(src, SITE_URL).toString());
    }
  }
  if (!src.startsWith("https://")) throw new Error("unsupported source");
  return download(src);
}

async function render(src: string): Promise<string | undefined> {
  try {
    const { default: sharp } = await import("sharp");
    const input = await loadImageSource(src);
    const preview = await sharp(input, { failOn: "none" })
      .resize(16, 16, { fit: "inside" })
      .webp({ quality: 50 })
      .toBuffer();
    return `data:image/webp;base64,${preview.toString("base64")}`;
  } catch {
    return undefined;
  }
}

/** Blurred preview for an image URL, or undefined if it can't be made. */
export function blurDataURL(src: string | null | undefined) {
  if (!src) return Promise.resolve(undefined);
  let pending = cache.get(src);
  if (!pending) {
    pending = render(src);
    cache.set(src, pending);
  }
  return pending;
}

/** Adds a preview to each item, computed in parallel. */
export function withBlur<T>(
  items: T[],
  getSrc: (item: T) => string | null | undefined,
  attach: (item: T, blur: string | undefined) => T,
): Promise<T[]> {
  return Promise.all(
    items.map(async (item) => attach(item, await blurDataURL(getSrc(item)))),
  );
}
