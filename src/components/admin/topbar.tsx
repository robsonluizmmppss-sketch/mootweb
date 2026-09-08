"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Menu, X, LogOut, KeyRound, User as UserIcon, ChevronDown } from "lucide-react";
import type { Role } from "@prisma/client";

import { cn } from "@/lib/utils";
import { ADMIN_NAV } from "@/lib/admin/nav";
import { hasRole, ROLE_LABEL } from "@/lib/rbac";
import { AdminIcon } from "./admin-icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopbarUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: Role;
}

function titleFromPath(pathname: string) {
  for (const group of ADMIN_NAV) {
    for (const item of group.items) {
      if (item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)) {
        return item.label;
      }
    }
  }
  return "Painel";
}

export function Topbar({ user }: { user: TopbarUser }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const title = titleFromPath(pathname);
  const initials = (user.name ?? user.email ?? "U").slice(0, 2).toUpperCase();

  const groups = ADMIN_NAV.map((g) => ({
    ...g,
    items: g.items.filter((i) => !i.minRole || hasRole(user.role, i.minRole)),
  })).filter((g) => g.items.length > 0);

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-white/10 bg-moot-void/70 px-4 backdrop-blur-xl sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="grid size-9 place-items-center rounded-lg border border-white/10 bg-white/5 lg:hidden"
            aria-label="Abrir menu"
          >
            <Menu className="size-4" />
          </button>
          <h1 className="text-base font-semibold tracking-tight">{title}</h1>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pl-1 pr-2.5 text-sm outline-none transition-colors hover:bg-white/10">
            <Avatar className="size-7">
              {user.image && <AvatarImage src={user.image} alt="" />}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span className="hidden max-w-[10rem] truncate sm:block">
              {user.name ?? user.email}
            </span>
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="truncate font-medium text-foreground">{user.name ?? "—"}</div>
              <div className="truncate text-xs">{user.email}</div>
              <div className="mt-1 text-[11px] text-accent">{ROLE_LABEL[user.role]}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/perfil">
                <UserIcon /> Meu perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/perfil#senha">
                <KeyRound /> Trocar senha
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-destructive focus:text-destructive"
            >
              <LogOut /> Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Drawer mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-moot-void/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 overflow-y-auto border-r border-white/10 bg-moot-deep p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">MootWeb · Painel</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="grid size-8 place-items-center rounded-lg border border-white/10"
              >
                <X className="size-4" />
              </button>
            </div>
            <nav className="mt-6 space-y-6">
              {groups.map((group) => (
                <div key={group.title}>
                  <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
                    {group.title}
                  </p>
                  <ul className="space-y-0.5">
                    {group.items.map((item) => {
                      const active =
                        item.href === "/admin"
                          ? pathname === "/admin"
                          : pathname.startsWith(item.href);
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                              active
                                ? "bg-primary/15 text-foreground"
                                : "text-muted-foreground hover:bg-white/5",
                            )}
                          >
                            <AdminIcon name={item.icon} />
                            {item.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
