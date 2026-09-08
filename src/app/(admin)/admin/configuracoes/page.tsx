import { requireRole } from "@/lib/session";
import { getSettingsRow } from "@/server/actions/settings";
import { PageHeader } from "@/components/admin/page-header";
import { SettingsForm } from "@/components/admin/settings-form";

export const metadata = { title: "Configurações" };

export default async function SettingsPage() {
  await requireRole("ADMIN");
  const settings = await getSettingsRow();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurações"
        description="Identidade, contato, redes, aparência e rastreamento — tudo editável, nada fixo no código."
      />
      <SettingsForm settings={settings} />
    </div>
  );
}
