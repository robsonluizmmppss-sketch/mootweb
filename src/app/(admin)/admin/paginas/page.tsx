import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { PageHeader } from "@/components/admin/page-header";
import { SectionEditor } from "@/components/admin/section-editor";
import { EmptyState } from "@/components/admin/empty-state";

export const metadata = { title: "Páginas & Seções" };

export default async function PagesAdmin() {
  await requireRole("EDITOR");
  const sections = await prisma.pageSection.findMany({
    orderBy: [{ page: "asc" }, { order: "asc" }],
  });

  const pages = Array.from(new Set(sections.map((s) => s.page)));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Páginas & Seções"
        description="Conteúdo de cada bloco das páginas. Edite o payload JSON e a visibilidade."
      >
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
        >
          Ver home <ExternalLink className="size-3.5" />
        </Link>
      </PageHeader>

      {sections.length === 0 ? (
        <EmptyState
          title="Nenhuma seção"
          description="Rode o seed (npm run db:seed) para popular as seções da home."
        />
      ) : (
        pages.map((page) => (
          <section key={page} className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {page}
            </h2>
            <div className="space-y-3">
              {sections
                .filter((s) => s.page === page)
                .map((s) => (
                  <SectionEditor key={s.id} section={s} />
                ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
