import { bookingUrl, whatsappUrl } from "@/content/site";

/** Analytics event attributes for a link (see components/analytics.tsx). */
export function trackingFor(href: string): Record<string, string> {
  if (href === bookingUrl) return { "data-umami-event": "book-intro" };
  if (href === whatsappUrl) return { "data-umami-event": "whatsapp" };
  if (href.startsWith("/bring-an-opportunity")) {
    const path = new URLSearchParams(href.split("?")[1] ?? "").get("path") ?? "general";
    return { "data-umami-event": "open-brief", "data-umami-event-path": path };
  }
  if (href.startsWith("http")) return { "data-umami-event": "outbound", "data-umami-event-url": href };
  return {};
}
