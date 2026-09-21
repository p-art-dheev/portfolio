import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { getSiteSettings } from "@/lib/queries";

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
