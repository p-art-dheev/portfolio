import { HomePage } from "@/components/HomePage";
import { JsonLd } from "@/components/JsonLd";
import { getSiteSettings } from "@/lib/queries";
import { homeJsonLd } from "@/lib/structured-data";

export default async function Home() {
  const site = await getSiteSettings();

  return (
    <>
      <JsonLd data={homeJsonLd(site)} />
      <HomePage />
    </>
  );
}
