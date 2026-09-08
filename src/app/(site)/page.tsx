import { getHomeContent, getHomeHidden, getSectionData } from "@/lib/content";

import { Hero } from "@/components/sections/hero";
import { LogoMarquee } from "@/components/sections/logo-marquee";
import { Features } from "@/components/sections/features";
import { Services } from "@/components/sections/services";
import { Technologies } from "@/components/sections/technologies";
import { Process } from "@/components/sections/process";
import { PortfolioPreview } from "@/components/sections/portfolio-preview";
import { StatsBand } from "@/components/sections/stats-band";
import { Testimonials } from "@/components/sections/testimonials";
import { Partners } from "@/components/sections/partners";
import { Faq } from "@/components/sections/faq";
import { CtaSection } from "@/components/sections/cta";

// ISR: revalida a Home a cada 5 min; o painel revalida sob demanda ao salvar.
export const revalidate = 300;

export default async function HomePage() {
  const [home, hidden, techSection] = await Promise.all([
    getHomeContent(),
    getHomeHidden(),
    getSectionData("home", "technologies"),
  ]);

  const show = (key: string) => !hidden.has(key);

  return (
    <>
      {show("hero") && <Hero content={home.hero} />}
      {show("clients") && <LogoMarquee clients={home.clients} />}
      {show("features") && <Features items={home.features} />}
      {show("services") && <Services items={home.services} />}
      {show("technologies") && <Technologies content={techSection ?? undefined} />}
      {show("process") && <Process steps={home.process} />}
      {show("projects") && <PortfolioPreview projects={home.projects} />}
      {show("stats") && <StatsBand stats={home.stats} />}
      {show("testimonials") && <Testimonials items={home.testimonials} />}
      {show("partners") && <Partners items={home.partners} />}
      {show("faq") && <Faq items={home.faq} />}
      {show("cta") && <CtaSection content={home.cta} />}
    </>
  );
}
