import type { Metadata } from "next";

import { NotFoundContent } from "@/components/NotFoundContent";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

// 404 for notFound() inside the site pages, so the navbar and footer from the
// (site) layout stay. Unmatched URLs fall through to app/not-found.tsx.
export default function SiteNotFound() {
  return <NotFoundContent />;
}
