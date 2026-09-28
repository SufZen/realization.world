import Script from "next/script";

/**
 * Cookieless analytics (Umami). Loads only when both variables are set, so
 * development and previews stay untracked and no consent banner is needed.
 * Events: elements with data-umami-event="…" are counted automatically; the
 * /thank-you page view is the brief-submitted goal.
 */
export function Analytics() {
  const src = process.env.NEXT_PUBLIC_UMAMI_SRC;
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  if (!src || !websiteId) return null;
  return <Script src={src} data-website-id={websiteId} data-do-not-track="true" strategy="afterInteractive" />;
}
