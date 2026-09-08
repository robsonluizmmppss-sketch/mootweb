import { format } from "date-fns";
import { FileText, Film, Trash2 } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { deleteMedia } from "@/server/actions/media";
import { PageHeader } from "@/components/admin/page-header";
import { MediaUploader } from "@/components/admin/media-uploader";
import { EmptyState } from "@/components/admin/empty-state";

export const metadata = { title: "Mídias & Arquivos" };

function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default async function MediaPage() {
  await requireRole("EDITOR");
  const assets = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" }, take: 200 });

  return (
    <div className="space-y-6">
      <PageHeader title="Mídias & Arquivos" description={`${assets.length} arquivos`} />

      <MediaUploader />

      {assets.length === 0 ? (
        <EmptyState title="Nenhuma mídia" description="Faça upload de imagens, vídeos ou PDFs." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {assets.map((a) => (
            <div key={a.id} className="card-premium group overflow-hidden rounded-xl">
              <div className="relative aspect-square bg-white/[0.03]">
                {a.type === "IMAGE" || a.type === "SVG" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.url} alt={a.name} className="size-full object-cover" />
                ) : (
                  <div className="grid size-full place-items-center text-muted-foreground">
                    {a.type === "VIDEO" ? <Film className="size-8" /> : <FileText className="size-8" />}
                  </div>
                )}
                <form
                  action={deleteMedia}
                  className="absolute right-1.5 top-1.5 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <input type="hidden" name="id" value={a.id} />
                  <button className="grid size-7 place-items-center rounded-lg border border-white/10 bg-moot-void/80 text-destructive backdrop-blur hover:bg-destructive/20">
                    <Trash2 className="size-3.5" />
                  </button>
                </form>
              </div>
              <div className="p-2.5">
                <p className="truncate text-xs font-medium" title={a.name}>
                  {a.name}
                </p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  {fmtSize(a.size)} · {format(a.createdAt, "dd/MM/yy")}
                </p>
                <input
                  readOnly
                  defaultValue={a.url}
                  className="mt-1.5 w-full rounded bg-white/5 px-1.5 py-1 text-[10px] text-muted-foreground"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
