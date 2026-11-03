import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo";

const PRIVATE_PATHS = ["/admin", "/api/", "/md/"];

// AI crawlers are already allowed by "*"; naming them makes the intent
// explicit. /llms.txt and /blogs/<slug>.md are written for them.
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE_PATHS },
      { userAgent: AI_CRAWLERS, allow: "/", disallow: PRIVATE_PATHS },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
