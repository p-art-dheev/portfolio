import { SettingsForm } from "@/components/admin/SettingsForm";
import { getSiteSettings } from "@/lib/queries";

export default async function AdminSettingsPage() {
  const site = await getSiteSettings();

  return (
    <div className="space-y-5 pb-8">
      <h1 className="text-2xl font-semibold tracking-tight">Site settings</h1>
      <SettingsForm site={site} />
    </div>
  );
}
