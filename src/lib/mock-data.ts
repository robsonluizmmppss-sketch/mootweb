import type {
  HomeContent,
  NavLink,
  SiteSettingsView,
} from "@/types/content";

/**
 * Conteúdo padrão da MootWeb.
 * Fonte de verdade para:
 *  - o seed do banco (prisma/seed.ts)
 *  - o fallback do site quando o banco está indisponível (Fase 1)
 * Na Fase 2 o painel admin passa a editar essas mesmas estruturas.
 */

export const defaultSiteSettings: SiteSettingsView = {
  brandName: "MootWeb",
  tagline: "Engenharia digital premium para marcas que querem liderar.",
  // Logo oficial enviada pelo cliente (lockup sobre fundo escuro).
  // Editável pelo painel (Configurações → Identidade).
  logoLightUrl: "/brand/mootweb-logo.png",
  logoDarkUrl: "/brand/mootweb-logo.png",
  email: "contato@mootweb.online",
  phone: "+55 (61) 99661-1397",
  whatsapp: "+55 61 99661-1397",
  addressLine: null,
  city: "Brasília",
  state: "DF",
  instagramUrl: "https://instagram.com/mootweb",
  linkedinUrl: null,
  githubUrl: null,
  twitterUrl: null,
  youtubeUrl: null,
  behanceUrl: null,
  dribbbleUrl: null,
  footerHeadline: "Pronto para construir algo memorável?",
  footerText:
    "MootWeb é o estúdio de engenharia e design que transforma produtos digitais em vantagem competitiva.",
  footerCopyright: "© {year} MootWeb. Todos os direitos reservados.",
  gaId: null,
  gtmId: null,
  fbPixelId: null,
  enableParallax: true,
  enableGridBg: true,
  maintenanceMode: false,
  maintenanceText: null,
};

export const defaultNav: NavLink[] = [
  { label: "Serviços", href: "/servicos" },
  { label: "Portfólio", href: "/portfolio" },
  { label: "Processo", href: "/#processo" },
  { label: "Blog", href: "/blog" },
  { label: "Sobre", href: "/sobre" },
  { label: "Contato", href: "/contato" },
];

export const defaultFooterNav: { title: string; links: NavLink[] }[] = [
  {
    title: "Empresa",
    links: [
      { label: "Sobre", href: "/sobre" },
      { label: "Portfólio", href: "/portfolio" },
      { label: "Blog", href: "/blog" },
      { label: "Contato", href: "/contato" },
    ],
  },
  {
    title: "Serviços",
    links: [
      { label: "Product Design", href: "/servicos/product-design" },
      { label: "Engenharia Web", href: "/servicos/engenharia-web" },
      { label: "Plataformas SaaS", href: "/servicos/plataformas-saas" },
      { label: "Design System", href: "/servicos/design-system" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Termos de uso", href: "/termos" },
      { label: "Privacidade", href: "/privacidade" },
      { label: "Cookies", href: "/cookies" },
    ],
  },
];

export const defaultHome: HomeContent = {
  hero: {
    eyebrow: "Estúdio de engenharia & design",
    titleLines: ["Produtos digitais", "que parecem"],
    highlight: "do futuro.",
    description:
      "Projetamos e construímos plataformas web, SaaS e experiências de marca com padrão de startup bilionária — performance, design e escala desde o primeiro commit.",
    primaryCta: { label: "Iniciar um projeto", href: "/orcamento" },
    secondaryCta: { label: "Ver portfólio", href: "/portfolio" },
    stats: [
      { label: "Projetos entregues", value: "+140" },
      { label: "Score Lighthouse médio", value: "99" },
      { label: "Anos de estúdio", value: "8" },
      { label: "NPS de clientes", value: "92" },
    ],
    badges: ["Next.js", "TypeScript", "Design System", "SEO 100"],
  },
  features: [
    {
      icon: "Sparkles",
      title: "Design premium",
      description:
        "Interfaces minimalistas e sofisticadas, com motion sutil e identidade forte.",
    },
    {
      icon: "Gauge",
      title: "Performance obsessiva",
      description:
        "SSR, ISR e otimização de imagem para Lighthouse 100 e Core Web Vitals verdes.",
    },
    {
      icon: "Layers",
      title: "Arquitetura escalável",
      description:
        "Componentização máxima, tipagem forte e padrões enterprise que crescem com o produto.",
    },
    {
      icon: "Search",
      title: "SEO técnico",
      description:
        "Meta tags, Open Graph, sitemap, schema.org e conteúdo indexável de ponta a ponta.",
    },
  ],
  services: [
    {
      slug: "product-design",
      icon: "PenTool",
      title: "Product Design",
      summary:
        "Da pesquisa ao design system: fluxos, protótipos e interfaces prontas para desenvolvimento.",
      features: ["UX Research", "UI Design", "Design System", "Prototipagem"],
      priceLabel: "Sob orçamento",
    },
    {
      slug: "engenharia-web",
      icon: "Code2",
      title: "Engenharia Web",
      summary:
        "Sites e aplicações Next.js de alta performance, acessíveis e fáceis de manter.",
      features: ["Next.js 15", "TypeScript", "Headless CMS", "CI/CD"],
      priceLabel: "Sob orçamento",
    },
    {
      slug: "plataformas-saas",
      icon: "Boxes",
      title: "Plataformas SaaS",
      summary:
        "Produtos completos com autenticação, billing, painéis e infraestrutura escalável.",
      features: ["Auth & RBAC", "Dashboards", "APIs", "Observabilidade"],
      priceLabel: "Sob orçamento",
    },
    {
      slug: "growth-seo",
      icon: "TrendingUp",
      title: "Growth & SEO",
      summary:
        "Landing pages, otimização técnica e experimentos para transformar tráfego em receita.",
      features: ["Landing Pages", "SEO técnico", "A/B testing", "Analytics"],
      priceLabel: "Sob orçamento",
    },
  ],
  process: [
    {
      icon: "Compass",
      title: "Descoberta",
      description:
        "Imersão no negócio, metas e métricas. Alinhamos escopo, riscos e sucesso.",
    },
    {
      icon: "PenTool",
      title: "Design",
      description:
        "Arquitetura de informação, protótipos navegáveis e design system da marca.",
    },
    {
      icon: "Code2",
      title: "Engenharia",
      description:
        "Desenvolvimento incremental com revisões, testes e deploys contínuos.",
    },
    {
      icon: "Rocket",
      title: "Lançamento",
      description:
        "Go-live monitorado, otimização de performance e handoff completo.",
    },
    {
      icon: "LineChart",
      title: "Evolução",
      description:
        "Acompanhamento de métricas e roadmap de melhorias contínuas.",
    },
  ],
  projects: [
    {
      slug: "nebula-analytics",
      title: "Nebula Analytics",
      excerpt: "Plataforma de BI em tempo real para times de produto.",
      coverUrl: null,
      category: "SaaS",
      tags: ["dashboard", "dataviz"],
      technologies: ["Next.js", "PostgreSQL", "tRPC"],
      featured: true,
    },
    {
      slug: "orbit-commerce",
      title: "Orbit Commerce",
      excerpt: "E-commerce headless com checkout de 1 clique e CMS próprio.",
      coverUrl: null,
      category: "E-commerce",
      tags: ["headless", "performance"],
      technologies: ["Next.js", "Stripe", "Sanity"],
      featured: true,
    },
    {
      slug: "vault-bank",
      title: "Vault Bank",
      excerpt: "Onboarding digital e app de conta para fintech regulada.",
      coverUrl: null,
      category: "Fintech",
      tags: ["mobile", "kyc"],
      technologies: ["React Native", "Node.js", "AWS"],
      featured: false,
    },
    {
      slug: "atlas-design-system",
      title: "Atlas Design System",
      excerpt: "Design system multi-produto com 220+ componentes documentados.",
      coverUrl: null,
      category: "Design System",
      tags: ["tokens", "storybook"],
      technologies: ["React", "Style Dictionary", "Storybook"],
      featured: false,
    },
    {
      slug: "pulse-health",
      title: "Pulse Health",
      excerpt: "Portal de telemedicina com agendamento e prontuário digital.",
      coverUrl: null,
      category: "Health",
      tags: ["a11y", "hipaa"],
      technologies: ["Next.js", "Prisma", "Postgres"],
      featured: false,
    },
    {
      slug: "forge-landing",
      title: "Forge — Landing de lançamento",
      excerpt: "Landing page de produto com +38% de conversão em testes A/B.",
      coverUrl: null,
      category: "Growth",
      tags: ["cro", "motion"],
      technologies: ["Next.js", "Framer Motion", "GA4"],
      featured: false,
    },
  ],
  stats: [
    { label: "Projetos entregues", value: "140", suffix: "+" },
    { label: "Usuários impactados", value: "18", suffix: "mi" },
    { label: "Uptime médio das plataformas", value: "99,98", suffix: "%" },
    { label: "Tempo médio de entrega MVP", value: "9", suffix: "sem" },
  ],
  testimonials: [
    {
      authorName: "Marina Alves",
      role: "Head of Product",
      company: "Nebula",
      avatarUrl: null,
      quote:
        "A MootWeb entregou um produto que parece de uma empresa 10x maior. Performance e design impecáveis.",
      rating: 5,
    },
    {
      authorName: "Rafael Costa",
      role: "CEO",
      company: "Orbit",
      avatarUrl: null,
      quote:
        "Do primeiro protótipo ao go-live em 10 semanas. O time é sênior de verdade e joga junto.",
      rating: 5,
    },
    {
      authorName: "Bianca Ferreira",
      role: "CTO",
      company: "Vault",
      avatarUrl: null,
      quote:
        "Arquitetura limpa, documentação impecável e um design system que acelerou todo o nosso roadmap.",
      rating: 5,
    },
  ],
  clients: [
    { name: "Nebula", logoUrl: null },
    { name: "Orbit", logoUrl: null },
    { name: "Vault", logoUrl: null },
    { name: "Pulse", logoUrl: null },
    { name: "Atlas", logoUrl: null },
    { name: "Forge", logoUrl: null },
  ],
  partners: [
    { name: "Vercel", logoUrl: null, tier: "strategic" },
    { name: "Stripe", logoUrl: null, tier: "gold" },
    { name: "Supabase", logoUrl: null, tier: "gold" },
    { name: "Linear", logoUrl: null, tier: "standard" },
  ],
  faq: [
    {
      question: "Quanto custa um projeto com a MootWeb?",
      answer:
        "Cada projeto é orçado sob medida, conforme escopo, prazo e complexidade. Envie um briefing pelo formulário de orçamento e devolvemos uma proposta detalhada — sem compromisso.",
    },
    {
      question: "Qual o prazo médio de entrega?",
      answer:
        "Uma landing page premium leva de 2 a 4 semanas. Um MVP de SaaS costuma ficar pronto em 8 a 12 semanas, com entregas incrementais toda semana.",
    },
    {
      question: "Vocês trabalham com que tecnologias?",
      answer:
        "Next.js, React, TypeScript, TailwindCSS, Node.js, Prisma e PostgreSQL como base. Integramos com o ecossistema que fizer sentido para o produto (Stripe, AWS, headless CMS, etc.).",
    },
    {
      question: "Depois da entrega vocês dão suporte?",
      answer:
        "Sim. Oferecemos planos de evolução contínua com SLA, monitoramento e roadmap de melhorias, além de handoff completo de código e documentação.",
    },
    {
      question: "Como funciona a propriedade do código?",
      answer:
        "100% do código e dos ativos de design são seus ao final do projeto, versionados no repositório da sua organização.",
    },
  ],
  cta: {
    eyebrow: "Vamos conversar",
    title: "Sua próxima plataforma começa com uma conversa de 30 minutos.",
    subtitle:
      "Conte seu desafio. Devolvemos uma visão de produto, estimativa e próximos passos — sem compromisso.",
    primaryLabel: "Solicitar orçamento",
    primaryHref: "/orcamento",
    secondaryLabel: "Falar no WhatsApp",
    secondaryHref: "https://wa.me/5511900000000",
  },
};
