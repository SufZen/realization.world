import { Building2, Cpu, UsersRound } from "lucide-react";
import type { IconComponent } from "./site";

/**
 * The Services section: a hub and three pillar pages. Since 10.11.2026 the group leads with
 * the field (unrealized real estate); systems and teams are the routes that serve it.
 * Home doors and the hub show one reader problem and one link per route; offers and
 * prices live only on the pillar pages. Decision record: docs/strategy/2026-10-services-decision.md.
 */

export type PillarSlug = "real-estate" | "ai-systems" | "delivery";

/** A call to action. Without `event`, the link gets the site-wide tracking (lib/tracking.ts). */
export type Cta = {
  label: string;
  href: string;
  /** Umami event name. */
  event?: string;
  /** Extra Umami event properties, sent as data-umami-event-<key>. */
  data?: Record<string, string>;
  /** Append ?ref= (the visitor's own ref, else the page's). Off for anchors and outside sites. */
  carryRef?: boolean;
};

export type Offer = {
  name: string;
  /** What it is and what you leave with. */
  text: string;
  /** Format and length. */
  format: string;
  price?: string;
  /** Price in euros, for schema.org. */
  amount?: number;
  cta?: Cta;
  /** Shown only before this ISO time, or only from it. Checked when the page renders. */
  until?: string;
  from?: string;
};

/** The items to show right now (offers, links). Pages that list timed items revalidate hourly. */
export const currentOffers = <T extends { until?: string; from?: string }>(items: T[], now = Date.now()) =>
  items.filter((item) => (!item.until || now < Date.parse(item.until)) && (!item.from || now >= Date.parse(item.from)));

const tidycal = "https://schedule.realization.co.il";

/**
 * TidyCal booking types. Until the TidyCal rebuild (realization-studio,
 * channels/website-services-brief.md), the new types point at today's closest type.
 * Change a URL here once its own type exists.
 */
export const bookingTypes = {
  intro: `${tidycal}/20-minute-intro-meeting-asaf`,
  /** Portugal Deal & Investment Consultation. For now: the 60-min consulting type. */
  dealConsultation: `${tidycal}/60-minute-consulting-meeting`,
  /** AI Strategy Session. For now: the 60-min consulting type. */
  aiStrategySession: `${tidycal}/60-minute-consulting-meeting`,
  /** Team and process setup intro. For now: the 30-min intro. */
  deliveryIntro: "https://schedule.realization.co.il/30-minute-intro-meeting-asaf",
  realizeosSetup: `${tidycal}/realizeos-setup`,
};

/** Stripe Payment Link for the Audit Sprint. The buy button appears only once this is set. */
export const auditSprintCheckout: string | null = "https://buy.stripe.com/9B68wQbLB3JW2LA7K96Ri0f";

/** End of the 20.10 webinar (src/lib/webinar.ts). Its signup offers disappear after it. */
export const webinarEnds = "2026-10-20T18:30:00Z";
export const isWebinarOpen = (now = Date.now()) => now < Date.parse(webinarEnds);

export const sessionPrice = "€150";

/** The free 20-min intro, offered on every Services page (and the homepage, Learn and /links). */
export const introCta = (pillar: PillarSlug | "hub" | "home" | "learn" | "links"): Cta => ({
  label: "Book a 20-min intro",
  href: bookingTypes.intro,
  event: "book-intro",
  data: { pillar },
  carryRef: true,
});

export type Pillar = {
  slug: PillarSlug;
  href: string;
  /** The manifesto's dimension. */
  dimension: string;
  /** Page title, in the buyer's words. */
  title: string;
  /** The reader's problem, in one line: the home door and the hub card. */
  problem: string;
  subtitle: string;
  forWhom: string;
  icon: IconComponent;
  /** Default ?ref= for links that start on this page. */
  ref: string;
  /** The first paid step, or the qualifying intro. */
  session: Cta;
  offers: Offer[];
  /** Case studies shown as proof (src/content/work.ts slugs). */
  work: string[];
  /** Field notes feed: by category, or a fixed list of slugs. */
  insights: { categories?: string[]; slugs?: string[] };
};

export const pillars: Pillar[] = [
  {
    slug: "real-estate",
    href: "/services/real-estate",
    dimension: "Places",
    title: "Real estate development",
    problem: "A site can work on paper | and still be the wrong project.",
    subtitle: "We check the paperwork, buildable scope | and costs before you commit.",
    forWhom: "Investors and developers in Portugal, | and owners of stuck or problematic properties.",
    icon: Building2,
    ref: "services-real-estate",
    session: {
      label: `Book a deal consultation · ${sessionPrice}`,
      href: bookingTypes.dealConsultation,
      event: "book-session-real-estate",
      data: { pillar: "real-estate" },
      carryRef: true,
    },
    offers: [
      {
        name: "Free deal check",
        text: "Paste a listing link, from Idealista or anywhere else. | We send back the assumptions and the checks still missing: | purchase costs, tax and financing.",
        format: "Online form · reply within two working days",
        price: "Free",
        cta: { label: "Check a deal", href: "#deal-check" },
      },
      {
        name: "Portugal Deal & Investment Consultation",
        text: "An hour on one deal or one plan: price, costs, | financing, tax and the risks to check first. | The fee is credited toward a feasibility study.",
        format: "60 min · Google Meet",
        price: sessionPrice,
        amount: 150,
        cta: { label: "Book the consultation", href: bookingTypes.dealConsultation, event: "book-session-real-estate", data: { pillar: "real-estate" }, carryRef: true },
      },
      {
        name: "Feasibility study and financial model",
        text: "A fixed-scope study of one site: what can be built, | what it costs, what it sells for | and when the cash runs short.",
        format: "Fixed scope",
        price: "By proposal",
        cta: { label: "Ask for a proposal", href: "/bring-an-opportunity?path=opportunity", carryRef: true },
      },
      {
        name: "Development management",
        text: "At Arena in Barreiro we are the managing partner | and development manager. | Licensing is next.",
        format: "Site to sale",
        price: "By proposal",
        cta: { label: "See Arena", href: "/work/arena-barreiro", event: "view-case", data: { pillar: "real-estate", case: "arena-barreiro" } },
      },
      {
        name: "Problematic properties",
        text: "Homes stuck in inheritance, co-owner deadlock | or paperwork go to FLUII, | our licensed stuck-property venture.",
        format: "Portugal",
        cta: { label: "Go to fluii.pt", href: "https://fluii.pt" },
      },
    ],
    work: ["arena-barreiro", "realization-portugal"],
    insights: { categories: ["Development", "Development finance", "Investing", "Market evidence", "Property resolution"] },
  },
  {
    slug: "ai-systems",
    href: "/services/ai-systems",
    dimension: "Systems",
    title: "AI and operations systems",
    problem: "The team has the tools. | Nobody has decided where they start.",
    subtitle: "Less manual work in planning, | building, selling and reporting.",
    forWhom: "Developers, construction firms, | architecture offices and agencies.",
    icon: Cpu,
    ref: "services-ai-systems",
    session: {
      label: `Book a strategy session · ${sessionPrice}`,
      href: bookingTypes.aiStrategySession,
      event: "book-session-ai-systems",
      data: { pillar: "ai-systems" },
      carryRef: true,
    },
    // Offers and fees for this pillar are its stages (systemsEn.stages), the single account of the work.
    offers: [],
    work: ["ai-adoption-architecture-firm", "realizeos", "meetsum"],
    insights: { categories: ["AI in practice"] },
  },
  {
    // Internal slug "delivery" (events, testimonials); the page is "Team and process setup" at /services/team-setup.
    slug: "delivery",
    href: "/services/team-setup",
    dimension: "Teams",
    title: "Team and process setup",
    problem: "Every decision on the project | still waits for one person.",
    subtitle: "We set up the roles and the routines, | train the team, and hand it over.",
    forWhom: "Firms and projects that need clear roles, | working processes and a trained team, | not another permanent manager.",
    icon: UsersRound,
    ref: "services-team-setup",
    session: {
      label: "Book a setup call · 30 min",
      href: bookingTypes.deliveryIntro,
      event: "book-session-delivery",
      data: { pillar: "delivery" },
      carryRef: true,
    },
    // The deliverables (delivery.outcomes) are the page's one list; the setup call is its CTA.
    offers: [],
    // No single project represents this pillar; the page describes the method instead.
    work: [],
    insights: { slugs: ["why-ai-adoption-fails-at-step-three", "five-hours-to-build-a-month-to-trust"] },
  },
];

export const pillarBySlug = (slug: PillarSlug) => pillars.find((pillar) => pillar.slug === slug)!;

/* ---- Hub ---- */

export const hub = {
  ref: "services",
  sentence: "We work on the property, the paperwork | and the team needed to move it.",
  principles: [
    ["Scope, fee and stopping point", "In writing, | for every engagement."],
    ["One first", "One deal, one pilot or one process, | measured before anything grows."],
  ],
} as const;

/* ---- Places: real estate development ---- */

export const realEstate = {
  fit: {
    strong: [
      "Israeli and international investors buying or building in Portugal",
      "Developers weighing an infill site in the Lisbon area",
      "Owners and heirs of a property that is stuck",
    ],
    notYet: [
      "Buyers looking for a single home to live in",
      "Deals that must close this week",
      "Anyone looking for a guaranteed return",
    ],
  },
  faqs: [
    ["Is the deal check really free?", "Yes. It is how we meet investors. If the numbers work and you want to go further, the 60-minute consultation is the next step."],
    ["Is this investment advice?", "No. We share numbers, assumptions and the risks we see. Decisions, and legal and tax advice, stay with you and your own advisers."],
    ["Can I invest in Arena?", "Arena’s financial terms are shared only with qualified capital partners, on request. Start on the capital partners page or with a 20-minute intro."],
    ["Where do you work, and in which languages?", "In Portugal, mostly the Lisbon area, and remotely with investors in Israel and elsewhere. We work in English and Hebrew, with basic Portuguese and Spanish."],
  ],
} as const;

/* ---- Teams: team and process setup ---- */

export const delivery = {
  image: {
    src: "/media/team-setup.webp",
    alt: "Hands arranging role cards for a project lead, architect, site coordinator, finance and sales around a workflow and a project timeline that ends in a handoff",
  },
  /** The one list of what a setup delivers, shown next to the image. */
  outcomes: [
    ["A role map", "Who owns what, who decides | and who signs off, | written down before anyone is hired."],
    ["Working processes", "The workflows and the tools that carry them, | tested on your own cases."],
    ["A trained team", "The people who will run it, | practised until they can run it without us."],
    ["A handoff date", "Written into the proposal, | with a short handbook the team keeps."],
  ],
  questions: [
    "What are you delivering, | and by when?",
    "Who does the work today, | and where does it get stuck?",
    "What should your team run | without us in six months?",
  ],
  fit: {
    strong: [
      "Developers between acquisition and construction",
      "Professional firms growing past founder-run delivery",
      "Owners in Israel running a project in Portugal from a distance",
    ],
    notYet: [
      "Open-ended outsourcing with no handoff date",
      "Teams looking for a recruiter or an HR provider",
      "Projects with no one inside to hand over to",
    ],
  },
  faqs: [
    ["Is this construction management?", "No. We set up how the project or the firm works: roles, decisions, workflows and reporting. Building stays with your architects and contractors. If you need someone to coordinate them for you, that is a separate engagement from the setup: Asaf Eyzenkot takes fractional development-management roles, contracted through Realization Unipessoal LDA."],
    ["How is it priced?", "As a fixed scope, in a proposal, before it starts."],
    ["Where do you work?", "Remotely, and in person in the Lisbon area and Barcelona."],
  ],
} as const;

/* ---- Systems: AI and operations systems (the former /advisory page, copy unchanged) ---- */

/**
 * One stage of the Systems engagement. The stages are the page's single account of
 * scope, output, duration and fee (QA 10.11: no parallel offer list).
 */
export type Stage = {
  index: string;
  title: string;
  scope: string;
  output?: string;
  duration?: string;
  fee?: string;
  /** Fee in euros, for schema.org. */
  amount?: number;
  cta?: Cta;
};

/** Labels and copy for the Systems page; English here, Hebrew in services-he.ts. */
export type SystemsCopy = {
  lang: "en" | "he";
  ref: string;
  hero: { eyebrow: string; title: string; intro: string };
  promise: { eyebrow: string; title: string };
  fit: { eyebrow: string; title: string; intro: string; strongTitle: string; strong: string[]; notYetTitle: string; notYet: string[] };
  stages: {
    eyebrow: string;
    title: string;
    intro: string;
    labels: { output: string; duration: string; fee: string };
    items: Stage[];
    /** One plain line of what we don't sell. */
    refuse: string;
  };
  proof: { eyebrow: string; title: string; intro?: string; link: Cta };
  systems: { eyebrow: string; title: string; intro: string; setup: Cta };
  /** The one related service, as a single link. */
  related: { text: string; link: Cta };
  faq: { eyebrow: string; title: string; items: ReadonlyArray<readonly [string, string]> };
  cta: { eyebrow: string; title: string; text: string };
  session: Cta;
  intro: Cta;
  /** The other language's version of this page. */
  alternate: { label: string; href: string; lang: "en" | "he" };
};

const systemsPillar = pillarBySlug("ai-systems");

export const systemsEn: SystemsCopy = {
  lang: "en",
  ref: systemsPillar.ref,
  hero: { eyebrow: "SERVICES · AI AND OPERATIONS SYSTEMS", title: "Choose where AI starts. | Then prove it there.", intro: systemsPillar.subtitle },
  promise: { eyebrow: "WHERE IT STARTS", title: "One problem first, | measured before anything grows." },
  fit: {
    eyebrow: "WHO IT’S FOR",
    title: "Busy teams with the tools, | but not the time.",
    intro: "The gap is rarely access or understanding. | It is deciding what to do first, who owns it | and protecting the hours to do it.",
    strongTitle: "A strong fit",
    strong: [
      "Professional firms of 10–100 people: architecture, engineering, legal, real estate",
      "Developers and operators with repetitive document work",
      "Founders who want an AI operation that belongs to the business",
    ],
    notYetTitle: "Not yet a fit",
    notYet: [
      "Teams looking for a tool demo, not a change in how work gets done",
      "Programmes with no one who can give four hours a week",
      "Projects that must start with the most sensitive data",
    ],
  },
  stages: {
    eyebrow: "THE ENGAGEMENT",
    title: "Separate stages. | A stop point after each.",
    intro: "Each stage is priced | before it starts.",
    labels: { output: "You get", duration: "Time", fee: "Fee" },
    items: [
      {
        index: "Start",
        title: "AI Strategy Session",
        scope: "An hour on your firm: where AI should start, | what you already pay for and what to measure.",
        duration: "60 min · Google Meet",
        fee: `${sessionPrice}, credited toward the Audit Sprint`,
        amount: 150,
        cta: { label: "Book the session", href: bookingTypes.aiStrategySession, event: "book-session-ai-systems", data: { pillar: "ai-systems" }, carryRef: true },
      },
      {
        index: "Stage 0",
        title: "Audit Sprint",
        scope: "A 90-minute kickoff, then a joint, in-depth audit: | how the work gets done today, where it gets stuck | and what you already pay for. | An optional RealizeOS setup session is included.",
        output: "A written report: what to fix first, | in order of priority. Yours to keep.",
        duration: "Report within 48 hours of the audit",
        fee: "€495 + VAT, credited toward implementation",
        amount: 495,
        cta: auditSprintCheckout
          ? { label: "Buy the Audit Sprint", href: auditSprintCheckout, event: "buy-audit", data: { pillar: "ai-systems" } }
          : { label: "Ask for a proposal", href: "/bring-an-opportunity?path=advisory", carryRef: true },
      },
      {
        index: "Stage 1",
        title: "Guided pilot",
        scope: "One work domain, two people. | We choose the tools and guide the build; | your team operates and tests it. | Most of the time goes to checks against real cases.",
        output: "A working process in production, | measured before and after on real cases.",
        duration: "3–5 weeks",
        fee: "By proposal, after the sprint",
      },
      {
        index: "Stage 2",
        title: "Tapering support",
        scope: "Around ten to twelve advisory hours a month, | tapering from full to half to a quarter.",
        output: "A team that runs and extends | the system without us.",
        duration: "Ends at month twelve",
        fee: "By proposal, after the sprint",
      },
      {
        index: "Add-on",
        title: "Team workshops",
        scope: "Sessions built on your own cases: | how to spot where AI fits | and match the right tool to it.",
      },
    ],
    refuse: "What we won’t sell you: a course, a licence, | or a system only we can run.",
  },
  proof: {
    eyebrow: "PROOF",
    title: "The method, in a real firm.",
    link: { label: "Read the case study", href: "/work/ai-adoption-architecture-firm" },
  },
  systems: {
    eyebrow: "SYSTEMS WE BUILT AND RUN",
    title: "We use what we recommend.",
    intro: "Our own operations run on AI systems we designed. | Each one shows the method at work.",
    setup: { label: "Book a RealizeOS setup hour", href: bookingTypes.realizeosSetup, event: "book-session-ai-systems", data: { pillar: "ai-systems", offer: "realizeos-setup" }, carryRef: true },
  },
  related: {
    text: "Need the roles and processes around it, too?",
    link: { label: "Team and process setup", href: "/services/team-setup" },
  },
  faq: {
    eyebrow: "QUESTIONS",
    title: "Before you ask.",
    items: [
      ["How much of our team’s time does it take?", "Two kinds of time. One internal lead for four to six hours a week, and two to three hours a week from each pilot participant, mostly reviewing outputs. We ask for those hours in the proposal, because without them the work does not happen."],
      ["Do we have to use RealizeOS or your other systems?", "No. We start with what you already pay for and what the market offers. RealizeOS, MeetSum and our other systems are options when they fit the gap, not a requirement."],
      ["Where do you work?", "Remotely, and in person in the Lisbon area and Barcelona."],
    ],
  },
  cta: {
    eyebrow: "START WITH 20 MINUTES",
    title: "Where should AI | start in your firm?",
    text: "Twenty minutes is enough | to know whether the audit is worth it.",
  },
  session: systemsPillar.session,
  intro: introCta("ai-systems"),
  alternate: { label: "בעברית", href: "/he/services/ai-systems", lang: "he" },
};

/** Field notes for a pillar, newest first. */
export function pillarInsights<T extends { slug: string; category: string; date: string }>(pillar: Pillar, all: T[], limit = 4): T[] {
  const { categories, slugs } = pillar.insights;
  const picked = all.filter((insight) => categories?.includes(insight.category) || slugs?.includes(insight.slug));
  return [...picked].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
}
