"use client";

import * as React from "react";

/** Botão flutuante de WhatsApp (canto inferior direito). */
export function WhatsappFab({
  phone,
  message = "Olá! Vim pelo site da MootWeb e gostaria de conversar sobre um projeto.",
}: {
  phone: string | null;
  message?: string;
}) {
  const digits = (phone ?? "").replace(/\D/g, "");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => setMounted(true), 400);
    return () => clearTimeout(t);
  }, []);

  if (!digits) return null;

  const href = `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className={`group fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#25D366] py-3 pl-3 pr-4 text-sm font-semibold text-[#07361f] shadow-[0_10px_40px_-8px_rgba(37,211,102,0.6)] transition-all duration-500 hover:brightness-105 sm:bottom-7 sm:right-7 ${
        mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <span className="pointer-events-none absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366] opacity-40 [animation-duration:2.5s]" />
      <svg viewBox="0 0 24 24" className="size-6 fill-current" aria-hidden>
        <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.77.46 3.45 1.28 4.93L2 22l5.25-1.38c1.42.78 3.02 1.2 4.79 1.2 5.52 0 10-4.48 10-10s-4.48-10-10-10zm5.86 14.24c-.25.7-1.44 1.34-1.99 1.42-.53.08-1.19.11-1.92-.12-.44-.14-1.01-.33-1.74-.65-3.06-1.32-5.06-4.4-5.21-4.6-.15-.2-1.25-1.66-1.25-3.17s.79-2.25 1.07-2.56c.28-.31.61-.38.81-.38.2 0 .4.002.58.01.19.008.44-.07.68.52.25.6.85 2.08.93 2.23.07.15.12.33.02.53-.1.2-.15.32-.3.5-.15.17-.31.39-.44.52-.15.15-.3.31-.13.6.17.29.76 1.25 1.63 2.03 1.12 1 2.07 1.31 2.36 1.46.29.15.46.12.63-.07.17-.2.72-.84.91-1.13.19-.29.39-.24.65-.15.26.1 1.65.78 1.94.92.29.15.48.22.55.34.08.13.08.72-.17 1.42z" />
      </svg>
      <span className="hidden sm:block">WhatsApp</span>
    </a>
  );
}
