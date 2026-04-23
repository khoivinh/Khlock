/** Thin wrapper around gtag.js. Silktide controls whether `analytics_storage`
 *  is granted; we always call `gtag()` and Google's consent mode handles the
 *  gate. We *also* gate on `import.meta.env.PROD` so dev sessions don't pollute
 *  GA, and on `navigator.doNotTrack` as a courtesy beyond what consent mode
 *  covers. */

type GtagFn = (
  command: "event" | "config" | "consent" | "js",
  action: string,
  params?: Record<string, unknown>
) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: unknown[];
  }
}

function shouldSend(): boolean {
  if (!import.meta.env.PROD) return false;
  if (typeof window === "undefined") return false;
  if (typeof window.gtag !== "function") return false;
  // Respect Do-Not-Track. Chrome-removed-DNT-in-2023 but Firefox/Safari still honor it.
  if (typeof navigator !== "undefined" && navigator.doNotTrack === "1") return false;
  return true;
}

/** Fire a custom event. No-op in dev, when gtag isn't loaded, or when DNT is on.
 *  Consent gating (`analytics_storage: 'denied'`) happens inside gtag itself. */
export function track(eventName: string, params?: Record<string, unknown>): void {
  if (!shouldSend()) return;
  window.gtag!("event", eventName, params);
}

/** Fire a page_view on SPA route change. Call this from a wouter useEffect
 *  keyed on location. */
export function trackPageView(path: string, title?: string): void {
  if (!shouldSend()) return;
  window.gtag!("event", "page_view", {
    page_path: path,
    page_location: window.location.origin + path,
    page_title: title ?? document.title,
  });
}
