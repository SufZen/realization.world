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

const linkedin = { source: "LinkedIn recommendation", sourceUrl: "https://www.linkedin.com/in/sufzen/details/recommendations/" };

/** Verbatim excerpts from LinkedIn recommendations (read 10.10.2026). */
export const testimonials: Testimonial[] = [
  {
    quote: "Asaf is an exceptional entrepreneur and business architect with a deep understanding of sustainable real estate investments and end-to-end project development, particularly across Portugal, Spain, and Southern Europe. What stands out about Asaf is his ability to see the bigger picture while still mastering the details that turn complex projects into successful realities.",
    name: "Meirav Gonen",
    role: "Investment advisor and strategic deal maker, real estate",
    pillar: "real-estate",
    ...linkedin,
  },
  {
    quote: "He ensures he has the right data, the right tools and the right people to provide you with the best results to your investments and he keeps tracking, calculating, reporting out to completion ensuring you have the full potential fulfilled.",
    name: "Yaniv Keren",
    role: "Head of IT & Information Systems",
    company: "Ondas",
    pillar: "real-estate",
    ...linkedin,
  },
  {
    // Spelling of Asaf's name corrected at his request (the original says "Assaf").
    quote: "Asaf is a leader. In every business process, in every process that requires execution, Asaf leads it while paying attention to details, thinking about the customer, and paying attention to quality.",
    name: "Amos Romano",
    role: "Co-founder & CEO",
    company: "Viki Sense",
    pillar: "delivery",
    ...linkedin,
  },
  {
    quote: "Asaf has developed strong expertise in helping design and build AI-driven systems that support smarter decision-making, efficiency, and scalable business structures.",
    name: "Meirav Gonen",
    role: "Investment advisor and strategic deal maker, real estate",
    pillar: "ai-systems",
    ...linkedin,
  },
];
