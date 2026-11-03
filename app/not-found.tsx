import type { Metadata } from "next";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { NotFoundContent } from "@/components/NotFoundContent";
import { getSiteSettings } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

// Root 404 for unmatched URLs. It renders outside the (site) layout, so it
// brings its own navbar and footer to keep visitors on the site.
export default async function NotFound() {
  const site = await getSiteSettings();

  return (
    <>
      <Navbar domain={site.domain} />
      <main className="flex-1">
        <NotFoundContent />
      </main>
      <Footer site={site} />
    </>
  );
}
