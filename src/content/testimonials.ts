import type { PillarSlug } from "./services";

/**
 * What clients and partners say. Real quotes only, each approved by Asaf and by the
 * person quoted (name, role and company as they agreed to show them). Sources: LinkedIn
 * recommendations, client messages, partner quotes, webinar feedback.
 * Testimonial sections render only when there is at least one entry for them.
 */
export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company?: string;
  /** Shown on this pillar's page too; untagged quotes appear on the homepage and the Services hub. */
  pillar?: PillarSlug;
  /** Where the quote comes from, e.g. "LinkedIn recommendation". */
  source: string;
  sourceUrl?: string;
  lang?: "en" | "he";
};

export const testimonials: Testimonial[] = [];
