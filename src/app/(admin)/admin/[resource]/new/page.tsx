import { notFound } from "next/navigation";

import { getResource } from "@/lib/admin/resources";
import { relationOptions } from "@/lib/admin/query";
import { requireRole } from "@/lib/session";
import { PageHeader, Breadcrumb } from "@/components/admin/page-header";
import { ResourceForm } from "@/components/admin/resource-form";

export default async function NewRecordPage({
  params,
}: {
  params: Promise<{ resource: string }>;
}) {
  const { resource: key } = await params;
  const resource = getResource(key);
  if (!resource) notFound();

  await requireRole(resource.minRole);
  const relations = await relationOptions(resource);

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: resource.labelPlural, href: `/admin/${resource.key}` },
          { label: "Novo" },
        ]}
      />
      <PageHeader title={`Novo · ${resource.labelSingular}`} />
      <ResourceForm resource={resource} record={null} relationOptions={relations} />
    </div>
  );
}
