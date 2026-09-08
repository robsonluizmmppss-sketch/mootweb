"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

const SID_KEY = "moot.sid";

function sessionId() {
  try {
    let id = sessionStorage.getItem(SID_KEY);
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem(SID_KEY, id);
    }
    return id;
  } catch {
    return undefined;
  }
}

/** Envia um pageview por rota (silencioso, best-effort). */
export function AnalyticsTracker() {
  const pathname = usePathname();

  React.useEffect(() => {
    const payload = JSON.stringify({
      name: "pageview",
      path: pathname,
      referrer: document.referrer || undefined,
      sessionId: sessionId(),
    });
    try {
      const blob = new Blob([payload], { type: "application/json" });
      if (!navigator.sendBeacon?.("/api/track", blob)) {
        fetch("/api/track", { method: "POST", body: payload, keepalive: true });
      }
    } catch {
      /* ignora */
    }
  }, [pathname]);

  return null;
}
