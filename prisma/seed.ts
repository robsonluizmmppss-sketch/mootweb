/* eslint-disable no-console */
import { PrismaClient, Role, PublishStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  defaultHome,
  defaultNav,
  defaultFooterNav,
  defaultSiteSettings,
} from "../src/lib/mock-data";

// Carrega .env (o `tsx` não faz isso automaticamente como o Prisma CLI).
try {
  process.loadEnvFile?.(".env");
} catch {
  /* .env ausente — segue com as variáveis do ambiente */
}

const prisma = new PrismaClient();

async function main() {
  console.log("🌱  Seed MootWeb — iniciando...");

  // ----------------------------------------------------------------
  // 1. Configurações globais do site (singleton)
  // ----------------------------------------------------------------
  const s = defaultSiteSettings;
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      brandName: s.brandName,
      tagline: s.tagline,
      logoLightUrl: s.logoLightUrl,
      logoDarkUrl: s.logoDarkUrl,
      email: s.email,
      phone: s.phone,
      whatsapp: s.whatsapp,
      addressLine: s.addressLine,
      city: s.city,
      state: s.state,
      instagramUrl: s.instagramUrl,
      linkedinUrl: s.linkedinUrl,
      githubUrl: s.githubUrl,
      twitterUrl: s.twitterUrl,
      behanceUrl: s.behanceUrl,
      dribbbleUrl: s.dribbbleUrl,
      footerHeadline: s.footerHeadline,
      footerText: s.footerText,
      footerCopyright: s.footerCopyright,
    },
  });
  console.log("✔  SiteSettings");

  // ----------------------------------------------------------------
  // 2. Menu (header + footer)
  // ----------------------------------------------------------------
  await prisma.navItem.deleteMany();
  await prisma.navItem.createMany({
    data: defaultNav.map((item, i) => ({
      location: "header",
      label: item.label,
      href: item.href,
      order: i,
    })),
  });
  for (const group of defaultFooterNav) {
    await prisma.navItem.createMany({
      data: group.links.map((link, i) => ({
        location: `footer:${group.title.toLowerCase()}`,
        label: link.label,
        href: link.href,
        order: i,
      })),
    });
  }
  console.log("✔  NavItem");

  // ----------------------------------------------------------------
  // 3. Seções da Home (PageSection) — payloads = defaultHome
  // ----------------------------------------------------------------
  const homeSections: { key: string; name: string; data: unknown }[] = [
    { key: "hero", name: "Hero", data: defaultHome.hero },
    { key: "features", name: "Diferenciais", data: defaultHome.features },
    { key: "services", name: "Serviços", data: defaultHome.services },
    {
      key: "technologies",
      name: "Tecnologias",
      data: {
        title: "Tecnologias que",
        highlight: "dominamos.",
        description:
          "Ferramentas modernas, escolhidas por performance e manutenibilidade — não por moda.",
      },
    },
    { key: "process", name: "Processo", data: defaultHome.process },
    { key: "projects", name: "Portfólio (destaques)", data: defaultHome.projects },
    { key: "stats", name: "Números", data: defaultHome.stats },
    { key: "testimonials", name: "Depoimentos", data: defaultHome.testimonials },
    { key: "clients", name: "Clientes", data: defaultHome.clients },
    { key: "partners", name: "Parceiros", data: defaultHome.partners },
    { key: "faq", name: "FAQ", data: defaultHome.faq },
    { key: "cta", name: "CTA final", data: defaultHome.cta },
  ];
  for (const [i, sec] of homeSections.entries()) {
    await prisma.pageSection.upsert({
      where: { page_key: { page: "home", key: sec.key } },
      update: { data: sec.data as object, name: sec.name, order: i },
      create: {
        page: "home",
        key: sec.key,
        name: sec.name,
        order: i,
        data: sec.data as object,
      },
    });
  }
  console.log(`✔  PageSection (${homeSections.length})`);

  // ----------------------------------------------------------------
  // 4. Usuários (papéis)
  // ----------------------------------------------------------------
  const passwordHash = await bcrypt.hash("mootweb123", 10);
  await prisma.user.upsert({
    where: { email: "admin@mootweb.online" },
    update: {},
    create: {
      name: "Admin MootWeb",
      email: "admin@mootweb.online",
      role: Role.ADMIN,
      passwordHash,
      emailVerified: new Date(),
    },
  });
  await prisma.user.upsert({
    where: { email: "editor@mootweb.online" },
    update: {},
    create: {
      name: "Editor MootWeb",
      email: "editor@mootweb.online",
      role: Role.EDITOR,
      passwordHash,
      emailVerified: new Date(),
    },
  });
  console.log("✔  User (admin@mootweb.online / editor@mootweb.online — senha: mootweb123)");

  // ----------------------------------------------------------------
  // 5. Catálogo: categorias, tecnologias, serviços, FAQ, parceiros, clientes
  // ----------------------------------------------------------------
  const categories = ["SaaS", "E-commerce", "Fintech", "Design System", "Health", "Growth"];
  for (const [i, name] of categories.entries()) {
    await prisma.category.upsert({
      where: { slug: name.toLowerCase().replace(/\s+/g, "-") },
      update: {},
      create: { name, slug: name.toLowerCase().replace(/\s+/g, "-"), order: i },
    });
  }

  const iconColor = "cbd5e1";
  // Valor = slug do Simple Icons (CDN) ou caminho local (começa com "/").
  const techIcon: Record<string, string> = {
    Python: "python", Java: "openjdk", PHP: "php", JavaScript: "javascript",
    TypeScript: "typescript", React: "react", "Next.js": "nextdotjs",
    "Node.js": "nodedotjs", HTML: "html5", CSS: "css", Tailwind: "tailwindcss",
    MySQL: "mysql", PostgreSQL: "postgresql", Docker: "docker", Git: "git",
    Linux: "linux", "Windows Server": "/brand/tech/windows-server.svg",
    Firebase: "firebase", Cloud: "icloud", Laravel: "laravel",
  };
  const techs = Object.keys(techIcon);
  for (const [i, name] of techs.entries()) {
    const slug = name.toLowerCase().replace(/[.\s]+/g, "-");
    const v = techIcon[name];
    const iconUrl = v.startsWith("/")
      ? v
      : `https://cdn.simpleicons.org/${v}/${iconColor}`;
    await prisma.technology.upsert({
      where: { slug },
      update: { name, order: i, iconUrl },
      create: { name, slug, order: i, iconUrl },
    });
  }

  for (const [i, svc] of defaultHome.services.entries()) {
    await prisma.service.upsert({
      where: { slug: svc.slug },
      update: {},
      create: {
        title: svc.title,
        slug: svc.slug,
        summary: svc.summary,
        icon: svc.icon,
        priceLabel: svc.priceLabel,
        features: svc.features,
        order: i,
        featured: i < 2,
      },
    });
  }

  for (const [i, f] of defaultHome.faq.entries()) {
    await prisma.faqItem.create({
      data: { question: f.question, answer: f.answer, order: i },
    });
  }

  for (const [i, p] of defaultHome.partners.entries()) {
    await prisma.partner.create({
      data: { name: p.name, tier: p.tier, order: i },
    });
  }

  for (const [i, c] of defaultHome.clients.entries()) {
    await prisma.client.upsert({
      where: { slug: c.name.toLowerCase() },
      update: {},
      create: { name: c.name, slug: c.name.toLowerCase(), order: i, featured: true },
    });
  }

  for (const [i, t] of defaultHome.testimonials.entries()) {
    await prisma.testimonial.create({
      data: {
        authorName: t.authorName,
        role: t.role,
        company: t.company,
        quote: t.quote,
        rating: t.rating,
        featured: true,
        order: i,
      },
    });
  }
  console.log("✔  Catálogo (categorias, techs, serviços, faq, parceiros, clientes, depoimentos)");

  // ----------------------------------------------------------------
  // 6. Projetos de portfólio
  // ----------------------------------------------------------------
  for (const [i, p] of defaultHome.projects.entries()) {
    const category = await prisma.category.findFirst({ where: { name: p.category ?? "" } });
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        description: p.excerpt,
        tags: p.tags,
        categoryId: category?.id ?? null,
        clientName: p.category,
        status: PublishStatus.PUBLISHED,
        featured: p.featured,
        recommended: i < 2,
        order: i,
        publishedAt: new Date(),
      },
    });
  }
  console.log(`✔  Project (${defaultHome.projects.length})`);

  // ----------------------------------------------------------------
  // 7. SEO base
  // ----------------------------------------------------------------
  await prisma.seoMeta.upsert({
    where: { path: "/" },
    update: {},
    create: {
      path: "/",
      title: `${s.brandName} — ${s.tagline}`,
      description: s.tagline,
      keywords: ["agência digital", "Next.js", "SaaS", "product design"],
      robots: "index,follow",
    },
  });
  console.log("✔  SeoMeta");

  console.log("✅  Seed concluído.");
}

main()
  .catch((e) => {
    console.error("❌  Seed falhou:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
