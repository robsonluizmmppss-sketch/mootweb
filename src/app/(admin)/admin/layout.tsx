import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { Sidebar } from "@/components/admin/sidebar";
import { Topbar } from "@/components/admin/topbar";
import { PointerEventsGuard } from "@/components/admin/pointer-events-guard";

export const metadata: Metadata = {
  title: { default: "Painel", template: "%s · Painel MootWeb" },
  robots: { index: false, follow: false },
};

// O painel é sempre dinâmico (depende de sessão/cookies).
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?callbackUrl=/admin");

  return (
    <div className="flex min-h-dvh bg-moot-void text-foreground">
      <PointerEventsGuard />
      <Sidebar role={user.role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          user={{
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
          }}
        />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1400px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
