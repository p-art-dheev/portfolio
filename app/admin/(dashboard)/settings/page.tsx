import { SettingsForm } from "@/components/admin/SettingsForm";
import { getSiteSettings } from "@/lib/queries";

export default async function AdminSettingsPage() {
  const site = await getSiteSettings();

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Site settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Homepage copy, socials, avatars, and tech stack.
        </p>
      </div>
      <SettingsForm site={site} />
    </div>
  );
}
