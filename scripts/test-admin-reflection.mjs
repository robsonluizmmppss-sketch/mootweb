/**
 * Testa o caminho Painel -> Banco -> Site público para cada tipo de conteúdo.
 * Muta um registro, busca a página pública, confere o reflexo, reverte.
 *   node scripts/test-admin-reflection.mjs
 */
import { PrismaClient } from "@prisma/client";

try {
  process.loadEnvFile?.(".env");
} catch {}

const prisma = new PrismaClient();
const BASE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const TAG = `RTEST_${Date.now().toString(36)}`;

let pass = 0;
let fail = 0;
const results = [];

async function fetchText(path) {
  const res = await fetch(`${BASE}${path}?_=${Date.now()}`, {
    headers: { "cache-control": "no-cache" },
  });
  return res.text();
}

async function check(name, page, mutate, revert, needle = TAG, scope) {
  try {
    await mutate();
    // pequena espera para revalidação em dev
    await new Promise((r) => setTimeout(r, 600));
    let html = await fetchText(page);
    if (scope) {
      const m = html.match(scope);
      html = m ? m[0] : "";
    }
    const ok = html.includes(needle);
    results.push(`${ok ? "✅" : "❌"}  ${name}  (${page})`);
    ok ? pass++ : fail++;
  } catch (err) {
    results.push(`💥  ${name}  — ${err.message}`);
    fail++;
  } finally {
    try {
      await revert();
    } catch (e) {
      results.push(`⚠   ${name}: revert falhou — ${e.message}`);
    }
  }
}

async function main() {
  // ---- SiteSettings (rodapé) ----
  {
    const before = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
    await check(
      "Configurações · footerText",
      "/",
      () =>
        prisma.siteSettings.update({
          where: { id: "singleton" },
          data: { footerText: `${TAG} rodapé` },
        }),
      () =>
        prisma.siteSettings.update({
          where: { id: "singleton" },
          data: { footerText: before?.footerText ?? null },
        }),
    );
  }

  // ---- Testimonial (home Depoimentos) ----
  {
    const t = await prisma.testimonial.findFirst({ orderBy: { order: "asc" } });
    await check(
      "Depoimentos · quote",
      "/",
      () => prisma.testimonial.update({ where: { id: t.id }, data: { quote: `${TAG} depoimento` } }),
      () => prisma.testimonial.update({ where: { id: t.id }, data: { quote: t.quote } }),
    );
    // toggle enabled -> some da home
    await check(
      "Depoimentos · desativar remove da home",
      "/",
      () => prisma.testimonial.update({ where: { id: t.id }, data: { enabled: false, quote: `${TAG}X` } }),
      () => prisma.testimonial.update({ where: { id: t.id }, data: { enabled: true, quote: t.quote } }),
      // esperamos que o texto NÃO apareça
    ).then(() => {
      const last = results[results.length - 1];
      // inverte o resultado deste caso específico
      if (last.startsWith("✅")) {
        results[results.length - 1] = last.replace("✅", "❌") + "  (apareceu mesmo desativado)";
        pass--; fail++;
      } else if (last.startsWith("❌")) {
        results[results.length - 1] = last.replace("❌", "✅") + "  (ocultou corretamente)";
        fail--; pass++;
      }
    });
  }

  // ---- Service (home + /servicos) ----
  {
    const s = await prisma.service.findFirst({ orderBy: { order: "asc" } });
    await check(
      "Serviços · summary (home)",
      "/",
      () => prisma.service.update({ where: { id: s.id }, data: { summary: `${TAG} serviço` } }),
      () => prisma.service.update({ where: { id: s.id }, data: { summary: s.summary } }),
    );
    await check(
      "Serviços · summary (/servicos)",
      "/servicos",
      () => prisma.service.update({ where: { id: s.id }, data: { summary: `${TAG} serviço2` } }),
      () => prisma.service.update({ where: { id: s.id }, data: { summary: s.summary } }),
      `${TAG} serviço2`,
    );
  }

  // ---- ProcessStep (home Processo) ----
  {
    const step = await prisma.processStep.findFirst({ orderBy: { order: "asc" } });
    if (!step) {
      results.push("⚠   Processo · sem etapas cadastradas (pulado)");
    } else {
      await check(
        "Processo · title",
        "/",
        () => prisma.processStep.update({ where: { id: step.id }, data: { title: `${TAG} etapa` } }),
        () =>
          prisma.processStep.update({
            where: { id: step.id },
            data: { title: step.title, description: step.description },
          }),
      );
    }
  }

  // ---- FaqItem (home FAQ) ----
  {
    const f = await prisma.faqItem.findFirst({ orderBy: { order: "asc" } });
    await check(
      "FAQ · question",
      "/",
      () => prisma.faqItem.update({ where: { id: f.id }, data: { question: `${TAG} pergunta?` } }),
      () => prisma.faqItem.update({ where: { id: f.id }, data: { question: f.question } }),
    );
  }

  // ---- Client (home marquee) ----
  {
    const c = await prisma.client.findFirst({ orderBy: { order: "asc" } });
    await check(
      "Clientes · name",
      "/",
      () => prisma.client.update({ where: { id: c.id }, data: { name: `${TAG}Cliente` } }),
      () => prisma.client.update({ where: { id: c.id }, data: { name: c.name } }),
      `${TAG}Cliente`,
    );
  }

  // ---- Partner (home Parceiros) ----
  {
    const p = await prisma.partner.findFirst({ orderBy: { order: "asc" } });
    await check(
      "Parceiros · name",
      "/",
      () => prisma.partner.update({ where: { id: p.id }, data: { name: `${TAG}Parceiro` } }),
      () => prisma.partner.update({ where: { id: p.id }, data: { name: p.name } }),
      `${TAG}Parceiro`,
    );
  }

  // ---- Technology (home Tecnologias) ----
  {
    const t = await prisma.technology.findFirst({ orderBy: { order: "asc" } });
    await check(
      "Tecnologias · name",
      "/",
      () => prisma.technology.update({ where: { id: t.id }, data: { name: `${TAG}Tech` } }),
      () => prisma.technology.update({ where: { id: t.id }, data: { name: t.name } }),
      `${TAG}Tech`,
    );
  }

  // ---- Project (portfolio + home) ----
  {
    const pr = await prisma.project.findFirst({ where: { status: "PUBLISHED" }, orderBy: { order: "asc" } });
    await check(
      "Projetos · title (/portfolio)",
      "/portfolio",
      () => prisma.project.update({ where: { id: pr.id }, data: { title: `${TAG} Projeto` } }),
      () => prisma.project.update({ where: { id: pr.id }, data: { title: pr.title } }),
      `${TAG} Projeto`,
    );
    await check(
      "Projetos · excerpt (home)",
      "/",
      () => prisma.project.update({ where: { id: pr.id }, data: { excerpt: `${TAG} resumo` } }),
      () => prisma.project.update({ where: { id: pr.id }, data: { excerpt: pr.excerpt } }),
    );
    await check(
      "Projetos · DRAFT some do /portfolio",
      "/portfolio",
      () => prisma.project.update({ where: { id: pr.id }, data: { status: "DRAFT", title: `${TAG}HID` } }),
      () => prisma.project.update({ where: { id: pr.id }, data: { status: "PUBLISHED", title: pr.title } }),
      `${TAG}HID`,
    ).then(() => {
      const last = results[results.length - 1];
      if (last.startsWith("✅")) {
        results[results.length - 1] = last.replace("✅", "❌") + "  (rascunho apareceu)";
        pass--; fail++;
      } else if (last.startsWith("❌")) {
        results[results.length - 1] = last.replace("❌", "✅") + "  (rascunho oculto)";
        fail--; pass++;
      }
    });
  }

  // ---- TeamMember (/sobre) ----
  {
    let m = await prisma.teamMember.findFirst();
    let created = false;
    if (!m) {
      m = await prisma.teamMember.create({
        data: { name: "Membro", slug: `m-${TAG}`, role: "Dev", enabled: true, order: 0 },
      });
      created = true;
    }
    await check(
      "Equipe · name (/sobre)",
      "/sobre",
      () => prisma.teamMember.update({ where: { id: m.id }, data: { name: `${TAG}Pessoa`, enabled: true } }),
      () =>
        created
          ? prisma.teamMember.delete({ where: { id: m.id } })
          : prisma.teamMember.update({ where: { id: m.id }, data: { name: m.name } }),
      `${TAG}Pessoa`,
    );
  }

  // ---- Post (/blog) ----
  {
    const slug = `post-${TAG.toLowerCase()}`;
    let post;
    await check(
      "Blog · post publicado aparece em /blog",
      "/blog",
      async () => {
        post = await prisma.post.create({
          data: {
            title: `${TAG} Artigo`,
            slug,
            excerpt: "resumo de teste",
            content: "corpo",
            status: "PUBLISHED",
            publishedAt: new Date(),
          },
        });
      },
      () => prisma.post.deleteMany({ where: { slug } }),
      `${TAG} Artigo`,
    );
  }

  // ---- PageSection toggle (home) ----
  {
    const sec = await prisma.pageSection.findUnique({
      where: { page_key: { page: "home", key: "partners" } },
    });
    if (sec) {
      await check(
        "Páginas & Seções · ocultar 'partners' some da home",
        "/",
        () => prisma.pageSection.update({ where: { id: sec.id }, data: { enabled: false } }),
        () => prisma.pageSection.update({ where: { id: sec.id }, data: { enabled: true } }),
        "Ecossistema de tecnologia", // heading da seção Parceiros
      ).then(() => {
        const last = results[results.length - 1];
        if (last.startsWith("✅")) {
          results[results.length - 1] = last.replace("✅", "❌") + "  (seção apareceu desativada)";
          pass--; fail++;
        } else if (last.startsWith("❌")) {
          results[results.length - 1] = last.replace("❌", "✅") + "  (seção ocultou)";
          fail--; pass++;
        }
      });
    }
  }

  // ---- NavItem toggle (navbar) ----
  {
    const nav = await prisma.navItem.findFirst({ where: { location: "header", label: "Sobre" } });
    if (nav) {
      await check(
        "Menu · desativar 'Sobre' some da navbar",
        "/",
        () => prisma.navItem.update({ where: { id: nav.id }, data: { enabled: false } }),
        () => prisma.navItem.update({ where: { id: nav.id }, data: { enabled: true } }),
        'href="/sobre"',
        /<nav[\s\S]*?<\/nav>/,
      ).then(() => {
        const last = results[results.length - 1];
        if (last.startsWith("✅")) {
          results[results.length - 1] = last.replace("✅", "❌") + "  (link continuou)";
          pass--; fail++;
        } else if (last.startsWith("❌")) {
          results[results.length - 1] = last.replace("❌", "✅") + "  (link removido)";
          fail--; pass++;
        }
      });
    }
  }

  console.log("\n──────── RESULTADO ────────");
  results.forEach((r) => console.log(r));
  console.log(`\n${pass} ok · ${fail} falha(s)\n`);
  await prisma.$disconnect();
  process.exit(fail ? 1 : 0);
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
