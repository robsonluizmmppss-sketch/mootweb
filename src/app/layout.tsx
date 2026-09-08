import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";

import "./globals.css";
import { Providers } from "@/providers";
import { getSiteSettings } from "@/lib/content";
import { absoluteUrl } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  const title = `${s.brandName} — ${s.tagline}`;
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: {
      default: title,
      template: `%s — ${s.brandName}`,
    },
    description: s.tagline,
    applicationName: s.brandName,
    keywords: [
      "agência digital",
      "desenvolvimento web",
      "Next.js",
      "design system",
      "SaaS",
      "product design",
      s.brandName,
    ],
    authors: [{ name: s.brandName }],
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: absoluteUrl("/"),
      siteName: s.brandName,
      title,
      description: s.tagline,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: s.tagline,
    },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#050816" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  colorScheme: "dark",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const s = await getSiteSettings();

  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="min-h-dvh bg-background text-foreground">
        <Providers>{children}</Providers>

        {/* Analytics — ids editáveis pelo painel (Fase 2) ou via .env */}
        {s.gaId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${s.gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${s.gaId}');`}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
