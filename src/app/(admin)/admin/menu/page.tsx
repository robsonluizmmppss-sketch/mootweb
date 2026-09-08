import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { saveNavItem, deleteNavItem, setNavItemEnabled } from "@/server/actions/menu";
import { PageHeader } from "@/components/admin/page-header";
import { MiniToggle } from "@/components/admin/mini-toggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";

export const metadata = { title: "Menu" };
export const dynamic = "force-dynamic";

const LOCATIONS = [
  { key: "header", label: "Cabeçalho" },
  { key: "footer:empresa", label: "Rodapé · Empresa" },
  { key: "footer:serviços", label: "Rodapé · Serviços" },
  { key: "footer:legal", label: "Rodapé · Legal" },
];

export default async function MenuPage() {
  await requireRole("EDITOR");
  const items = await prisma.navItem.findMany({
    orderBy: [{ location: "asc" }, { order: "asc" }],
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Menu"
        description="Links do cabeçalho e do rodapé. O toggle salva na hora; os campos salvam no botão."
      />

      {LOCATIONS.map((loc) => {
        const list = items.filter((i) => i.location === loc.key);
        return (
          <section key={loc.key} className="card-premium rounded-2xl p-6">
            <h2 className="text-sm font-semibold">{loc.label}</h2>

            <div className="mt-4 space-y-2">
              {list.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] p-2"
                >
                  <MiniToggle
                    id={item.id}
                    checked={item.enabled}
                    action={setNavItemEnabled}
                  />
                  <form
                    action={saveNavItem}
                    className="flex flex-1 flex-wrap items-center gap-2"
                  >
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="location" value={loc.key} />
                    <Input
                      name="label"
                      defaultValue={item.label}
                      className="h-9 w-40"
                      placeholder="Rótulo"
                    />
                    <Input
                      name="href"
                      defaultValue={item.href}
                      className="h-9 min-w-[180px] flex-1"
                      placeholder="/rota"
                    />
                    <Input
                      name="order"
                      type="number"
                      defaultValue={item.order}
                      className="h-9 w-16"
                    />
                    <Button type="submit" size="sm" variant="secondary">
                      Salvar
                    </Button>
                  </form>
                  <form action={deleteNavItem}>
                    <input type="hidden" name="id" value={item.id} />
                    <button
                      type="submit"
                      className="grid size-9 place-items-center rounded-lg border border-white/10 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </form>
                </div>
              ))}
              {list.length === 0 && (
                <p className="text-xs text-muted-foreground/60">Nenhum link.</p>
              )}
            </div>

            <form
              action={saveNavItem}
              className="mt-3 flex flex-wrap items-center gap-2"
            >
              <input type="hidden" name="location" value={loc.key} />
              <input type="hidden" name="enabled" value="true" />
              <Input name="label" placeholder="Novo rótulo" className="h-9 w-40" required />
              <Input
                name="href"
                placeholder="/rota"
                className="h-9 min-w-[180px] flex-1"
                required
              />
              <Input
                name="order"
                type="number"
                defaultValue={list.length}
                className="h-9 w-16"
              />
              <Button type="submit" size="sm" variant="gradient">
                <Plus className="size-4" /> Adicionar
              </Button>
            </form>
          </section>
        );
      })}
    </div>
  );
}
