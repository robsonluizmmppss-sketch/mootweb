"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

/**
 * Rede de segurança: alguns overlays (Radix) deixam `pointer-events: none` no
 * <body> se forem desmontados de forma abrupta (ex.: navegação com o overlay
 * aberto), travando a página inteira. Este guard limpa esse estado sempre que
 * a rota muda e periodicamente.
 */
export function PointerEventsGuard() {
  const pathname = usePathname();

  React.useEffect(() => {
    const clear = () => {
      if (document.body.style.pointerEvents === "none") {
        document.body.style.pointerEvents = "";
      }
    };
    clear();
    const id = window.setInterval(clear, 1500);
    return () => window.clearInterval(id);
  }, [pathname]);

  return null;
}
