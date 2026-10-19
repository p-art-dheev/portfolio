import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { getSiteSettings } from "@/lib/queries";

// Public pages are static. Admin saves revalidate them on demand; this is a
// backstop for edits made straight in Supabase and for read counts.
export const revalidate = 3600;

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site = await getSiteSettings();

  return (
    <>
      <Navbar domain={site.domain} />
      <main className="flex-1">{children}</main>
      <Footer site={site} />
    </>
  );
}
