"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeft, ExternalLink } from "lucide-react";
import type { Role } from "@prisma/client";

import { cn } from "@/lib/utils";
import { ADMIN_NAV } from "@/lib/admin/nav";
import { hasRole } from "@/lib/rbac";
import { AdminIcon } from "./admin-icon";
import { LogoMark } from "@/components/shared/logo";

const STORAGE_KEY = "moot.admin.sidebar";

export function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  React.useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(STORAGE_KEY) === "1");
    } catch {}
  }, []);

  function toggle() {
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {}
      return next;
    });
  }

  const groups = ADMIN_NAV.map((g) => ({
    ...g,
    items: g.items.filter((i) => !i.minRole || hasRole(role, i.minRole)),
  })).filter((g) => g.items.length > 0);

  return (
    <aside
      data-collapsed={collapsed || undefined}
      className={cn(
        "sticky top-0 z-30 hidden h-dvh shrink-0 flex-col border-r border-white/10 bg-moot-deep/60 backdrop-blur-xl transition-[width] duration-300 lg:flex",
        collapsed ? "w-[72px]" : "w-64",
      )}
    >
      <div className="flex h-16 items-center gap-2 border-b border-white/10 px-4">
        <LogoMark className="size-8 shrink-0" />
        {!collapsed && (
          <span className="text-sm font-semibold tracking-tight">
            Moot<span className="text-accent">Web</span>
            <span className="text-muted-foreground"> · Painel</span>
          </span>
        )}
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {groups.map((group) => (
          <div key={group.title}>
            {!collapsed && (
              <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
                {group.title}
              </p>
            )}
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
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary/15 text-foreground"
                          : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                        collapsed && "justify-center px-0",
                      )}
                    >
                      <AdminIcon
                        name={item.icon}
                        className={cn(active && "text-accent")}
                      />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <Link
          href="/"
          target="_blank"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground",
            collapsed && "justify-center px-0",
          )}
        >
          <ExternalLink className="size-4" />
          {!collapsed && "Ver site"}
        </Link>
        <button
          type="button"
          onClick={toggle}
          className={cn(
            "mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground",
            collapsed && "justify-center px-0",
          )}
        >
          {collapsed ? <PanelLeft className="size-4" /> : <PanelLeftClose className="size-4" />}
          {!collapsed && "Recolher"}
        </button>
      </div>
    </aside>
  );
}
