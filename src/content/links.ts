import { introCta, webinarEnds, type Cta } from "./services";
import { whatsappUrl } from "./site";
import { newsletterUrl, youtubeChannelUrl } from "./social";

export type BioLink = Cta & { until?: string; from?: string };

/**
 * /links: one link for every social bio (Instagram, TikTok, YouTube, X). Internal links
 * carry the visitor's ref, so a booking from a bio can be traced back to it.
 * The two Facebook groups go here once we have their links.
 */
export const bioLinks: BioLink[] = [
  { ...introCta("links"), label: "Book a free 20-min intro call" },
  { label: "Free webinar in Hebrew · 20.10", href: "/webinar", event: "join-webinar", data: { pillar: "links" }, carryRef: true, until: webinarEnds },
  { label: "Free deal check · Portugal", href: "/services/real-estate#deal-check", carryRef: true },
  { label: "Our services", href: "/services", carryRef: true },
  { label: "Watch on YouTube", href: youtubeChannelUrl, event: "social", data: { network: "youtube", place: "links" } },
  { label: "Get Realization updates by email", href: newsletterUrl, event: "join-newsletter", data: { place: "links" } },
  { label: "Field notes and videos", href: "/insights", carryRef: true },
  { label: "Message us on WhatsApp", href: whatsappUrl },
];
