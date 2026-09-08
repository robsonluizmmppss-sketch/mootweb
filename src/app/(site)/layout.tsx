import { GridBackground } from "@/components/shared/grid-background";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AnalyticsTracker } from "@/components/shared/analytics-tracker";
import { WhatsappFab } from "@/components/shared/whatsapp-fab";
import { LogoMark } from "@/components/shared/logo";
import { getFooterNav, getHeaderNav, getSiteSettings } from "@/lib/content";
import { getCurrentUser } from "@/lib/session";
import { hasRole } from "@/lib/rbac";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, nav, footerGroups] = await Promise.all([
    getSiteSettings(),
    getHeaderNav(),
    getFooterNav(),
  ]);

  // Modo manutenção — só então lemos a sessão (mantém as páginas estáticas
  // quando o site está no ar normalmente). Admins/editores continuam navegando.
  if (settings.maintenanceMode) {
    const user = await getCurrentUser();
    if (!hasRole(user?.role, "EDITOR")) {
      return (
        <div className="relative grid min-h-dvh place-items-center overflow-hidden bg-background px-6 text-center">
          <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-60" />
          <div className="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px]" />
          <div className="relative">
            <LogoMark className="mx-auto h-12 w-12" />
            <h1 className="mt-8 text-3xl font-semibold tracking-tight sm:text-4xl">
              Estamos em manutenção
            </h1>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              {settings.maintenanceText ??
                "Voltamos já. Estamos deixando tudo ainda melhor."}
            </p>
          </div>
        </div>
      );
    }
  }

  return (
    <>
      <GridBackground
        parallax={settings.enableParallax}
        grid={settings.enableGridBg}
      />
      <div className="relative z-10">
        <Navbar nav={nav} settings={settings} />
        <main>{children}</main>
        <Footer settings={settings} groups={footerGroups} />
      </div>
      <WhatsappFab phone={settings.whatsapp} />
      <AnalyticsTracker />
    </>
  );
}
