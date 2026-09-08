import { notFound } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";

import { getResource } from "@/lib/admin/resources";
import { listRecords } from "@/lib/admin/query";
import { requireRole } from "@/lib/session";
import { hasRole } from "@/lib/rbac";
import { PageHeader } from "@/components/admin/page-header";
import { SearchInput } from "@/components/admin/search-input";
import { DataTable } from "@/components/admin/data-table";
import { Pagination } from "@/components/admin/pagination";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ResourceListPage({
  params,
  searchParams,
}: {
  params: Promise<{ resource: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { resource: key } = await params;
  const resource = getResource(key);
  if (!resource) notFound();

  const user = await requireRole("VIEWER");
  const canEdit = hasRole(user.role, resource.minRole);

  const { q, page } = await searchParams;
  const { rows, total, page: current, pageCount } = await listRecords(resource, {
    q,
    page: page ? Number(page) : 1,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title={resource.labelPlural}
        description={`${total} ${total === 1 ? "registro" : "registros"}`}
      >
        {canEdit && (
          <Link
            href={`/admin/${resource.key}/new`}
            className={cn(buttonVariants({ variant: "gradient", size: "sm" }))}
          >
            <Plus className="size-4" />
            Novo
          </Link>
        )}
      </PageHeader>

      {resource.searchable.length > 0 && (
        <SearchInput placeholder={`Buscar em ${resource.labelPlural.toLowerCase()}...`} />
      )}

      <DataTable resource={resource} rows={rows} />

      <Pagination page={current} pageCount={pageCount} baseQuery={{ q }} />
    </div>
  );
}
