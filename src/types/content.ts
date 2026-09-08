/**
 * Tipos de conteúdo consumidos pelas seções públicas.
 * Espelham os payloads JSON de `PageSection.data` e as entidades do Prisma
 * projetadas para o front (sem campos internos).
 */

export interface SiteSettingsView {
  brandName: string;
  tagline: string;
  logoLightUrl: string | null;
  logoDarkUrl: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  addressLine: string | null;
  city: string | null;
  state: string | null;
  instagramUrl: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  twitterUrl: string | null;
  youtubeUrl: string | null;
  behanceUrl: string | null;
  dribbbleUrl: string | null;
  footerHeadline: string | null;
  footerText: string | null;
  footerCopyright: string;
  gaId: string | null;
  gtmId: string | null;
  fbPixelId: string | null;
  enableParallax: boolean;
  enableGridBg: boolean;
  maintenanceMode: boolean;
  maintenanceText: string | null;
}

export interface NavLink {
  label: string;
  href: string;
  children?: NavLink[];
}

export interface HeroContent {
  eyebrow: string;
  titleLines: string[];
  highlight: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  stats: { label: string; value: string }[];
  badges: string[];
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface ServiceItem {
  slug: string;
  icon: string;
  title: string;
  summary: string;
  features: string[];
  priceLabel: string | null;
}

export interface ProcessStepItem {
  icon: string;
  title: string;
  description: string;
}

export interface ProjectCardItem {
  slug: string;
  title: string;
  excerpt: string;
  coverUrl: string | null;
  category: string | null;
  tags: string[];
  technologies: string[];
  featured: boolean;
}

export interface TestimonialItem {
  authorName: string;
  role: string | null;
  company: string | null;
  avatarUrl: string | null;
  quote: string;
  rating: number;
}

export interface ClientItem {
  name: string;
  logoUrl: string | null;
}

export interface PartnerItem {
  name: string;
  logoUrl: string | null;
  tier: string;
}

export interface FaqEntry {
  question: string;
  answer: string;
}

export interface CtaContent {
  eyebrow: string | null;
  title: string;
  subtitle: string | null;
  primaryLabel: string | null;
  primaryHref: string | null;
  secondaryLabel: string | null;
  secondaryHref: string | null;
}

export interface StatItem {
  label: string;
  value: string;
  suffix?: string;
}

export interface HomeContent {
  hero: HeroContent;
  features: FeatureItem[];
  services: ServiceItem[];
  process: ProcessStepItem[];
  projects: ProjectCardItem[];
  stats: StatItem[];
  testimonials: TestimonialItem[];
  clients: ClientItem[];
  partners: PartnerItem[];
  faq: FaqEntry[];
  cta: CtaContent;
}
