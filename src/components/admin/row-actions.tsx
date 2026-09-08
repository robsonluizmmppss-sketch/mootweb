"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { MoreHorizontal, Pencil, Copy, Trash2, Loader2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteRecord, duplicateRecord } from "@/server/actions/crud";

export function RowActions({
  resource,
  id,
  editHref,
  duplicable,
  label,
}: {
  resource: string;
  id: string;
  editHref: string;
  duplicable?: boolean;
  label: string;
}) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [pending, startTransition] = React.useTransition();

  function fd() {
    const f = new FormData();
    f.set("__resource", resource);
    f.set("__id", id);
    return f;
  }

  function handleDuplicate() {
    setMenuOpen(false); // fecha o overlay ANTES de qualquer navegação
    startTransition(async () => {
      const res = await duplicateRecord(fd());
      if (res.ok && res.id) {
        toast.success(res.message);
        router.push(`/admin/${resource}/${res.id}`);
      } else {
        toast.error(res.message);
      }
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const res = await deleteRecord(fd());
      setConfirmOpen(false);
      if (res.ok) {
        toast.success(res.message);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    });
  }

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger className="grid size-8 place-items-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground outline-none hover:bg-white/10 hover:text-foreground">
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={editHref}>
              <Pencil /> Editar
            </Link>
          </DropdownMenuItem>
          {duplicable && (
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                handleDuplicate();
              }}
            >
              <Copy /> Duplicar
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setMenuOpen(false);
              setConfirmOpen(true);
            }}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 /> Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={confirmOpen} onOpenChange={(o) => !pending && setConfirmOpen(o)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir registro</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir <strong>{label}</strong>? Esta ação não pode ser
              desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setConfirmOpen(false)}
              disabled={pending}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={pending}>
              {pending && <Loader2 className="size-4 animate-spin" />}
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
