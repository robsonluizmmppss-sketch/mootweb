import { ImageResponse } from "next/og";
import { getSiteSettings } from "@/lib/content";

export const runtime = "nodejs";
export const alt = "MootWeb — Engenharia digital premium";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const s = await getSiteSettings();

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background:
            "linear-gradient(135deg, #050816 0%, #081120 50%, #0F172A 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "linear-gradient(135deg,#60A5FA,#2563EB)",
            }}
          />
          <span style={{ fontSize: 32, fontWeight: 600 }}>{s.brandName}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1, maxWidth: 900 }}>
            Produtos digitais que parecem do futuro.
          </span>
          <span style={{ fontSize: 28, color: "#94A3B8", marginTop: 24, maxWidth: 800 }}>
            {s.tagline}
          </span>
        </div>

        <div style={{ display: "flex", gap: 12, fontSize: 22, color: "#60A5FA" }}>
          <span>Next.js</span>
          <span>·</span>
          <span>Design System</span>
          <span>·</span>
          <span>SEO 100</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
