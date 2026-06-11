import { getStoreSettings } from "@/lib/settings";
import { SettingsForm } from "@/components/admin/settings-form";
import { DangerZone } from "@/components/admin/danger-zone";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getStoreSettings();

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-bold text-white">Settings</h1>
      <SettingsForm settings={settings} />
      <DangerZone />
    </div>
  );
}
