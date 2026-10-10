import { Building2, Cpu, UsersRound } from "lucide-react";
import { bookingUrl, type IconComponent } from "./site";

/**
 * The Services section (Oct 2026): a hub and three pillar pages.
 * Framing: the manifesto's three dimensions (places, systems, teams) as the idea,
 * with plain page titles a buyer understands. Decision record:
 * docs/strategy/2026-10-services-decision.md.
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
  deliveryIntro: bookingUrl,
  realizeosSetup: `${tidycal}/realizeos-setup`,
};

/** Stripe Payment Link for the Audit Sprint. The buy button appears only once this is set. */
export const auditSprintCheckout: string | null = null;

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

/** Free first step on the Systems page: the webinar until it ends, then the field notes. */
const freeLearning: Offer[] = [
  {
    name: "Free webinar, in Hebrew",
    text: "Five real cases from real-estate projects, | and one audience problem worked on screen.",
    format: "Tue 20 Oct · 90 min · Google Meet",
    price: "Free",
    cta: { label: "Save a seat", href: "/webinar", event: "join-webinar", data: { pillar: "ai-systems" }, carryRef: true },
    until: webinarEnds,
  },
  {
    name: "Field notes",
    text: "Short notes from real projects: | what worked, what did not and what it cost.",
    format: "New notes every week",
    price: "Free",
    cta: { label: "Read the field notes", href: "/insights", event: "read-field-notes", data: { pillar: "ai-systems" } },
    from: webinarEnds,
  },
];

export const pillars: Pillar[] = [
  {
    slug: "real-estate",
    href: "/services/real-estate",
    dimension: "Places",
    title: "Real estate development",
    subtitle: "From empty or underused | to highest and best use.",
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
        text: "Paste a listing link, from Idealista or anywhere else. | We send back the real numbers: purchase costs, | tax, financing and the yield that is left.",
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
        text: "We take a limited number of projects | from site to sale, as we do at Arena, | our eleven-home building in Barreiro.",
        format: "Limited number of projects",
        price: "By proposal",
        cta: { label: "See Arena", href: "/work/arena-barreiro", event: "view-case", data: { pillar: "real-estate", case: "arena-barreiro" } },
      },
      {
        name: "Problematic properties",
        text: "Homes stuck in inheritance, co-owner deadlock | or paperwork go to realization.pt, | our licensed property-resolution venture.",
        format: "Portugal",
        cta: { label: "Go to realization.pt", href: "https://realization.pt" },
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
    offers: [
      ...freeLearning,
      {
        name: "AI Strategy Session",
        text: "An hour on your firm: where AI should start, | what you already pay for and what to measure. | The fee is credited toward the Audit Sprint.",
        format: "60 min · Google Meet",
        price: sessionPrice,
        amount: 150,
        cta: { label: "Book the session", href: bookingTypes.aiStrategySession, event: "book-session-ai-systems", data: { pillar: "ai-systems" }, carryRef: true },
      },
      {
        name: "Audit Sprint",
        text: "Stage 0, focused discovery, as a fixed-price sprint: | a decisions document, a tiered roadmap | and agreed success measures. Limited slots.",
        format: "Two to three sessions",
        price: "Fixed price, by proposal",
        cta: auditSprintCheckout
          ? { label: "Buy the Audit Sprint", href: auditSprintCheckout, event: "buy-audit", data: { pillar: "ai-systems" } }
          : { label: "Ask for a proposal", href: "/bring-an-opportunity?path=advisory", carryRef: true },
      },
      {
        name: "Guided pilot and tapering support",
        text: "A pilot on one work domain, | then support that tapers off | and ends at month twelve.",
        format: "3–5 weeks, then up to 12 months",
        price: "By proposal, after the sprint",
      },
      {
        name: "RealizeOS setup assistance",
        text: "An hour to install and adapt RealizeOS, | our self-hosted AI operations system.",
        format: "60 min · online",
        cta: { label: "Book a setup hour", href: bookingTypes.realizeosSetup, event: "book-session-ai-systems", data: { pillar: "ai-systems", offer: "realizeos-setup" }, carryRef: true },
      },
    ],
    work: ["ai-adoption-architecture-firm", "realizeos", "meetsum", "dreamward"],
    insights: { categories: ["AI in practice"] },
  },
  {
    // Internal slug "delivery" (events, testimonials); the page is "Team and process setup" at /services/team-setup.
    slug: "delivery",
    href: "/services/team-setup",
    dimension: "Teams",
    title: "Team and process setup",
    subtitle: "We build the machine, | train the team, and hand it over.",
    forWhom: "Firms and projects that need clear roles, | working processes and a trained team, | not another permanent manager.",
    icon: UsersRound,
    ref: "services-team-setup",
    session: {
      label: "Book a setup intro · 30 min",
      href: bookingTypes.deliveryIntro,
      event: "book-session-delivery",
      data: { pillar: "delivery" },
      carryRef: true,
    },
    offers: [
      {
        name: "Setup intro",
        text: "Thirty minutes and three questions (below). | If we are not the right fit, | you will know by the end of the call.",
        format: "30 min · Google Meet",
        price: "Free",
        cta: { label: "Book a setup intro", href: bookingTypes.deliveryIntro, event: "book-session-delivery", data: { pillar: "delivery" }, carryRef: true },
      },
      {
        name: "Team and process setup",
        text: "Roles, workflows, documentation and training, | with a handoff date written into the proposal.",
        format: "Fixed scope",
        price: "By proposal",
        cta: { label: "Ask for a proposal", href: "/bring-an-opportunity?path=advisory", carryRef: true },
      },
      {
        name: "Fractional operations or development management",
        text: "Asaf Eyzenkot takes a limited number of fractional roles, | contracted through Realization Unipessoal LDA.",
        format: "Limited availability",
        price: "By proposal",
        cta: { label: "See Asaf’s profile", href: "/asaf", event: "view-profile", data: { pillar: "delivery" } },
      },
    ],
    // No single project represents this pillar; the page describes the method instead.
    work: [],
    insights: { slugs: ["why-ai-adoption-fails-at-step-three", "five-hours-to-build-a-month-to-trust"] },
  },
];

export const pillarBySlug = (slug: PillarSlug) => pillars.find((pillar) => pillar.slug === slug)!;

/* ---- Hub ---- */

export const hub = {
  ref: "services",
  sentence: "Realization realizes potential in three dimensions: | places, systems and teams.",
  why: {
    eyebrow: "WHY ONE COMPANY",
    title: "One project, | three dimensions.",
    intro: "A building needs a feasibility model, | systems for the paperwork | and a team to deliver it. | We work across all three, | then hand each one over.",
    items: [
      ["Places", "Land and buildings with value locked inside: | empty, underused or stuck."],
      ["Systems", "The work around them: | planning, tenders, contractors and reports, | with less of it done by hand."],
      ["Teams", "The people who carry it, | each working where they are strongest, | with a machine they own."],
    ],
  },
  principles: [
    ["Fixed scope, an exit after each stage", "Every engagement is a separate, priced unit. | You can stop after any of them."],
    ["Built to be handed over", "We build the machine, train the team | and leave on a date agreed at the start."],
    ["Proof before scale", "One deal, one pilot or one process first, | measured before anything grows."],
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
    ["Is the deal check really free?", "Yes. It is how we meet investors. If the numbers work and you want to go further, the 60-minute consultation is the next step, and its fee is credited toward a feasibility study."],
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
  /** What a setup leaves behind: shown next to the image. */
  outcomes: [
    ["A role map", "Who owns what, who decides, | and who signs off."],
    ["Working processes", "The workflows written down, | with the tools that carry them."],
    ["A trained team", "Practised on your own cases, | not on generic examples."],
    ["A handoff date", "Agreed at the start, | with a short handbook the team keeps."],
  ],
  steps: [
    ["Map the work", "Who does what today, | where decisions wait | and what only one person knows."],
    ["Design the machine", "Roles, workflows and the tools | that carry them, written down | before anyone is hired or bought."],
    ["Train the team", "On your own cases, | until the people who will run it | can run it without us."],
    ["Hand it over", "On a date agreed at the start. | After that, support only if you ask."],
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
    ["Is this construction management?", "No. We set up how the project or the firm works: roles, decisions, workflows and reporting. Building stays with your architects and contractors. If you need someone to coordinate them for you, that is the fractional development-management role."],
    ["Is this ongoing operations work?", "No. Setup ends on a handoff date written into the proposal. Ongoing fractional roles are possible, with limited availability."],
    ["How is it priced?", "Team and process setup is a fixed scope, priced in a proposal before it starts. Fractional roles are priced in a proposal too, and contracted through Realization Unipessoal LDA."],
    ["Where do you work, and in which languages?", "Remotely, and in person in the Lisbon area and Barcelona. We work in English and Hebrew, with basic Portuguese and Spanish."],
  ],
} as const;

/* ---- Systems: AI and operations systems (the former /advisory page, copy unchanged) ---- */

/** Labels and copy for the Systems page; English here, Hebrew in services-he.ts. */
export type SystemsCopy = {
  lang: "en" | "he";
  ref: string;
  hero: { eyebrow: string; title: string; intro: string };
  promise: { eyebrow: string; title: string; intro: string };
  fit: { eyebrow: string; title: string; intro: string; strongTitle: string; strong: string[]; notYetTitle: string; notYet: string[] };
  offers: { eyebrow: string; title: string; intro: string; items: Offer[] };
  engagement: { eyebrow: string; title: string; intro: string; youGet: string; stages: ReadonlyArray<readonly [string, string, string, string]> };
  principles: { eyebrow: string; title: string; intro: string; items: ReadonlyArray<readonly [string, string]> };
  proof: { eyebrow: string; title: string; intro: string; link: Cta };
  systems: { eyebrow: string; title: string; intro: string };
  alsoAvailable: { eyebrow: string; title: string; intro: string; links: Cta[] };
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
  hero: { eyebrow: "SERVICES · SYSTEMS", title: "AI and operations | systems.", intro: systemsPillar.subtitle },
  promise: {
    eyebrow: "THE APPROACH",
    title: "AI that pays back, | in the right order.",
    intro: "We help professional firms and operators decide where AI starts, | prove it on one measured problem, | and hand over a system the team owns.",
  },
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
  offers: {
    eyebrow: "WAYS TO START",
    title: "Start small. | Each step stands on its own.",
    intro: "Free to learn, a paid hour to decide, | a fixed-price sprint to prove it.",
    items: systemsPillar.offers,
  },
  engagement: {
    eyebrow: "THE ENGAGEMENT",
    title: "Separate stages. | A stop point after each.",
    intro: "There is no commitment to the sequence. | The retainer tapers on a schedule written into the proposal.",
    youGet: "You get:",
    stages: [
      ["Stage 0", "Focused discovery", "Two to three in-depth sessions. | We name the problem in your words, | take three management decisions | and check what you already pay for.", "A decisions document, a tiered roadmap | and agreed success measures — yours to keep."],
      ["Stage 1", "Guided pilot", "Three to five weeks, one work domain, | two people. We choose the tools and guide the build; | your team operates and tests it.", "A working process in production, | measured before and after on real cases."],
      ["Stage 2", "Tapering support", "Around ten to twelve advisory hours a month, | tapering from full to half to a quarter | and ending at month twelve.", "A team that runs and extends | the system without us."],
      ["Add-on", "Team workshops", "Sessions built on your own cases: | how to spot where AI fits | and match the right tool to it.", "People who find the next use case | themselves."],
    ],
  },
  principles: {
    eyebrow: "GROUND RULES",
    title: "Four principles, | agreed before any tool.",
    intro: "Tools change. | These are what keep a programme alive | in a busy organisation.",
    items: [
      ["Buy first, build for the gap", "We test what the market offers and what you already license | before anyone writes code."],
      ["Human in the loop, always", "The system prepares the work. | Professional judgement stays with your people."],
      ["The knowledge stays with you", "Everything is documented and handed over. | Our support is designed to end."],
      ["Start small, measure honestly", "One domain, a small group, a pass mark agreed in advance — | and a stop rule if it misses."],
    ],
  },
  proof: {
    eyebrow: "PROOF",
    title: "The method, in a real firm.",
    intro: "A 25-person architecture practice: | eight domains mapped, one pilot chosen, | break-even modelled at month seven.",
    link: { label: "Read the case study", href: "/work/ai-adoption-architecture-firm" },
  },
  systems: {
    eyebrow: "SYSTEMS WE BUILT AND RUN",
    title: "We use what we recommend.",
    intro: "Our own operations run on AI systems we designed. | They are options for you, never a requirement.",
  },
  alsoAvailable: {
    eyebrow: "ALSO AVAILABLE",
    title: "Fractional operations | and development management.",
    intro: "Asaf Eyzenkot takes a limited number of B2B roles: | operating models, project coordination | and real-estate development management.",
    links: [
      { label: "See Asaf’s profile", href: "/asaf", event: "view-profile", data: { pillar: "ai-systems" } },
      { label: "Team and process setup", href: "/services/team-setup" },
    ],
  },
  faq: {
    eyebrow: "QUESTIONS",
    title: "Before you ask.",
    items: [
      ["How quickly will we see a result?", "Discovery takes two to three sessions. A pilot runs three to five weeks, and most of that time is quality checks against real cases rather than building. In our modelled case, the programme breaks even in month seven."],
      ["How much of our team’s time does it take?", "Two kinds of time. One internal lead for four to six hours a week, and two to three hours a week from each pilot participant, mostly reviewing outputs. We ask for those hours in the proposal, because without them the work does not happen."],
      ["Do we have to use RealizeOS or your other systems?", "No. We start with what you already pay for and what the market offers. RealizeOS, MeetSum and our other systems are options when they fit the gap, not a requirement."],
      ["What does it cost?", "Each stage is priced as a separate, fixed unit before it starts, and you can stop after any stage. The Audit Sprint is deliberately a small first commitment. Ask for a proposal after a 20-minute intro call."],
      ["Where do you work, and in which languages?", "Remotely, and in person in the Lisbon area and Barcelona. We work in English and Hebrew, with basic Portuguese and Spanish."],
      ["Can you also run operations or a development project for us?", "Yes. Asaf Eyzenkot takes a limited number of fractional operations and development-management roles, contracted through Realization Unipessoal LDA."],
    ],
  },
  cta: {
    eyebrow: "START WITH DISCOVERY",
    title: "Where should AI | start in your firm?",
    text: "Twenty minutes is enough | to know whether discovery is worth it.",
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
