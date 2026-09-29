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
  // Where the tracker posts events; defaults to the script's own origin.
  const hostUrl = process.env.NEXT_PUBLIC_UMAMI_HOST_URL;
  if (!src || !websiteId) return null;
  return (
    <Script
      src={src}
      data-website-id={websiteId}
      data-do-not-track="true"
      data-exclude-search="true"
      {...(hostUrl ? { "data-host-url": hostUrl } : {})}
      strategy="afterInteractive"
    />
  );
}
