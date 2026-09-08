import { notFound } from "next/navigation";

import { getResource } from "@/lib/admin/resources";
import { getRecord, relationOptions } from "@/lib/admin/query";
import { requireRole } from "@/lib/session";
import { PageHeader, Breadcrumb } from "@/components/admin/page-header";
import { ResourceForm } from "@/components/admin/resource-form";

export default async function EditRecordPage({
  params,
}: {
  params: Promise<{ resource: string; id: string }>;
}) {
  const { resource: key, id } = await params;
  const resource = getResource(key);
  if (!resource) notFound();

  await requireRole("VIEWER");
  const [record, relations] = await Promise.all([
    getRecord(resource, id),
    relationOptions(resource),
  ]);
  if (!record) notFound();

  const title =
    record.title ?? record.name ?? record.question ?? record.authorName ?? record.key ?? id;

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: resource.labelPlural, href: `/admin/${resource.key}` },
          { label: String(title) },
        ]}
      />
      <PageHeader title={`Editar · ${resource.labelSingular}`} description={String(title)} />
      <ResourceForm resource={resource} record={record} relationOptions={relations} />
    </div>
  );
}
