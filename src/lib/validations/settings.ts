import { z } from "zod";

const opt = z.string().trim().optional().or(z.literal("")).transform((v) => v || null);
const optUrl = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .transform((v) => v || null)
  .refine((v) => !v || /^https?:\/\//.test(v) || v.startsWith("/"), "URL inválida");

export const siteSettingsSchema = z.object({
  brandName: z.string().min(1, "Obrigatório"),
  tagline: z.string().min(1, "Obrigatório"),
  logoLightUrl: optUrl,
  logoDarkUrl: optUrl,
  faviconUrl: optUrl,
  ogImageUrl: optUrl,

  email: opt,
  phone: opt,
  whatsapp: opt,
  addressLine: opt,
  city: opt,
  state: opt,
  country: opt,
  mapEmbedUrl: opt,

  instagramUrl: optUrl,
  linkedinUrl: optUrl,
  githubUrl: optUrl,
  twitterUrl: optUrl,
  youtubeUrl: optUrl,
  behanceUrl: optUrl,
  dribbbleUrl: optUrl,

  footerHeadline: opt,
  footerText: opt,
  footerCopyright: opt,

  themeMode: z.enum(["dark", "light", "system"]).default("dark"),
  accentColor: z.string().default("#2563EB"),
  radius: z.coerce.number().min(0).max(2).default(0.9),
  enableParallax: z.coerce.boolean().default(true),
  enableGridBg: z.coerce.boolean().default(true),

  gaId: opt,
  gtmId: opt,
  fbPixelId: opt,
  googleAdsId: opt,

  maintenanceMode: z.coerce.boolean().default(false),
  maintenanceText: opt,
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
