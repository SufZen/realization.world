import {
  BookOpen,
  Building2,
  Compass,
  Cpu,
  Handshake,
  KeyRound,
  Mic,
  PenTool,
} from "lucide-react";
import type { IconComponent } from "./site";

/**
 * The portfolio ("Work"). One record per project, venture, system or engagement.
 * Content governance (README): every number carries a source and a date,
 * and Built by / Operated by / Owned by are stated separately.
 * Copy uses " | " for authored line breaks (see components/lines.tsx).
 */

export type WorkKind = "development" | "architecture" | "venture" | "system" | "advisory";

export type WorkCategory = {
  id: string;
  label: string;
  intro: string;
  kinds: WorkKind[];
};

export const workCategories: WorkCategory[] = [
  { id: "real-estate", label: "Real estate", intro: "Development and architecture | in the Lisbon metropolitan area.", kinds: ["development", "architecture"] },
  { id: "ventures", label: "Ventures", intro: "Companies built around | a stuck physical-world market.", kinds: ["venture"] },
  { id: "systems", label: "Systems", intro: "AI and software we build, | run and use every day.", kinds: ["system"] },
  { id: "advisory", label: "Advisory", intro: "Engagements where we bring the method | into a client’s organisation.", kinds: ["advisory"] },
];

/** Form paths accepted by /bring-an-opportunity?path=… */
export type FormPath = "opportunity" | "operator" | "capital" | "corporate" | "advisory";

export type WorkFact = { value: string; label: string };
export type WorkImage = { src: string; alt: string; caption?: string };
export type WorkLink = { label: string; href: string };
export type WorkSection = { heading: string; paragraphs: string[] };

export type WorkItem = {
  slug: string;
  name: string;
  kind: WorkKind;
  eyebrow: string;
  status: "Ongoing" | "Live" | "In development" | "In daily use" | "Case study" | "Concluded";
  years?: string;
  location: string;
  role: string;
  /** Card and hero line. Authored breaks allowed. */
  descriptor: string;
  /** Answer-first summary: two plain sentences, quotable by people and machines. */
  summary: string;
  problem: string;
  approach: string;
  outcome: string;
  facts: WorkFact[];
  /** Optional numbered method or flow, shown on a dark band. */
  steps?: { title: string; intro: string; items: Array<[string, string]> };
  /** Optional list of individual projects (architecture portfolio). */
  projects?: Array<{ name: string; place: string; status: string }>;
  /** Optional long-form narrative (used by the advisory case study). */
  sections?: WorkSection[];
  partners?: string[];
  stack?: string[];
  links: WorkLink[];
  cover?: WorkImage;
  gallery?: WorkImage[];
  diagram?: "area-gap";
  disclosure?: string;
  source: string;
  related?: string[];
  cta: { path: FormPath; heading: string; label: string };
  schema: "CreativeWork" | "SoftwareApplication" | "Organization";
  icon: IconComponent;
  updated: string;
};

export const work: WorkItem[] = [
  {
    slug: "arena-barreiro",
    name: "Arena",
    kind: "development",
    eyebrow: "RESIDENTIAL DEVELOPMENT · BARREIRO, LISBON",
    status: "Ongoing",
    years: "2026–2028",
    location: "Barreiro, Lisbon metropolitan area, Portugal",
    role: "GP, development manager and shareholder",
    descriptor: "Eleven compact homes | on Lisbon’s south bank, twenty minutes from the city by ferry.",
    summary:
      "Arena is an eleven-home residential building in Barreiro, across the Tagus from Lisbon, developed by Realization as GP and development manager. The site is acquired and cleared, the licensing request is filed, and construction is planned for 2026–27.",
    problem:
      "Greater Lisbon is short of good homes | below the luxury segment. Young professionals | are priced out of the centre, | while Barreiro’s stock is old and inefficient.",
    approach:
      "We shifted the mix away from slow T2/T3 flats | toward the most liquid typologies: one T0, | nine T1 and a T2 penthouse, | each designed to qualify for Portugal’s | under-35 first-home tax exemption.",
    outcome:
      "Site acquired and demolished (Q1 2026). | Information request (PIP) filed (June 2026). | Funding and construction are the next milestones.",
    facts: [
      { value: "11", label: "homes · 1×T0, 9×T1, 1×T2" },
      { value: "596 m²", label: "net sellable area over 5 floors" },
      { value: "20 min", label: "ferry to Terreiro do Paço" },
      { value: "~24 months", label: "planned path from acquisition to exit" },
    ],
    steps: {
      title: "Site → licence → | build → sell.",
      intro: "A single dedicated company (SPV) | with Realization running day-to-day execution.",
      items: [
        ["Acquire", "Site secured and demolished | in Q1 2026."],
        ["License", "PIP information request | filed in June 2026."],
        ["Fund & build", "Equity and bank facility; | a 12–15 month build."],
        ["Sell", "Units sized for young buyers | and yield investors."],
      ],
    },
    partners: ["SFRG Architects — design and licensing", "FocoFIN — financial modelling and structuring", "Partner contractor — in discussion"],
    links: [],
    cover: {
      src: "/work/arena-barreiro/facade.webp",
      alt: "Architectural render of the Arena building: a five-storey facade with timber slats and planted balconies between two older houses in Barreiro",
      caption: "Street elevation · render",
    },
    gallery: [
      { src: "/work/arena-barreiro/street.webp", alt: "Street-level render of the Arena building in Barreiro with a light facade and rooftop planting", caption: "Street view · render" },
      { src: "/work/arena-barreiro/ground-floor.webp", alt: "Ground-floor plan of the Arena building showing entrance, stairs and ground-floor homes", caption: "Ground floor · plan by SFRG" },
    ],
    disclosure: "Renders are design-stage images and may change. Financial terms are shared only with qualified capital partners, on request. Nothing here is an offer of securities.",
    source: "Arena project memorandum, 2026. Figures as of September 2026.",
    related: ["design-first-then-ask-for-a-price", "turnkey-or-value-add"],
    cta: { path: "capital", heading: "Capital partner? | Request the memorandum.", label: "Request the memorandum" },
    schema: "CreativeWork",
    icon: Building2,
    updated: "2026-09-28",
  },
  {
    slug: "realization-portugal",
    name: "Realization Portugal",
    kind: "venture",
    eyebrow: "PROPERTY RESOLUTION VENTURE · PORTUGAL",
    status: "In development",
    years: "2026",
    location: "Portugal · Setúbal, Lisbon, Porto, Braga first",
    role: "Founder and product lead; a development lead owns software delivery",
    descriptor: "A licensed platform that turns | legally or family-blocked homes | into a plan, a mandate and a buyer.",
    summary:
      "Realization Portugal (realization.pt) resolves homes stuck in inheritance, co-owner deadlock or mismatched paperwork, then sells them to vetted investors. AI assistant Clara does the intake and drafting; licensed people make every decision about money and law.",
    problem:
      "About 723,000 Portuguese homes stand empty | while prices hit records. | Most are stuck by people and paperwork — | unsplit inheritances, absent co-owners, | registries that disagree — not by the building.",
    approach:
      "Owners describe the case to Clara | in Portuguese or English. | The case is scored, checked and turned into | a roadmap our team approves. | Investors see anonymised matches | and pay a small fee to unlock one deal room.",
    outcome:
      "Pre-launch is live with a waiting list | and the first owners invited. | A 10-case pilot decides pricing | before a wider launch.",
    facts: [
      { value: "723k", label: "empty homes in Portugal (INE Census 2021)" },
      { value: "AMI 25459", label: "licensed real-estate mediation" },
      { value: "164", label: "row-level security policies in Postgres" },
      { value: "683", label: "automated tests, plus 9 nightly browser journeys" },
    ],
    steps: {
      title: "Deadlock → | resolution.",
      intro: "AI does the busy work. | People make the decisions.",
      items: [
        ["Diagnose", "Clara runs the intake and reads | the documents; the case is scored."],
        ["Plan", "A resolution roadmap, published | only after human and legal review."],
        ["Mandate", "An exclusive mediation mandate, | signed electronically."],
        ["Resolve & sell", "A task force of lawyers and architects executes; | investors see the address only at negotiation."],
      ],
    },
    stack: ["Next.js 16", "React 19", "Supabase Postgres (43 tables)", "Google Gemini via Vercel AI SDK", "Stripe", "DocuSeal", "Cal.com", "Resend", "Sentry"],
    links: [{ label: "Visit realization.pt", href: "https://realization.pt" }],
    cover: {
      src: "/media/venture-portugal.webp",
      alt: "Architectural plans, a house model and a key inside a Portuguese property",
    },
    gallery: [
      { src: "/work/realization-portugal/owner-landing.webp", alt: "realization.pt owner landing page with a chat panel where Clara asks what is stopping the sale", caption: "Owner landing page · demo data" },
      { src: "/work/realization-portugal/clara-intake.webp", alt: "Owner portal showing Clara summarising an inherited T3 apartment case in Portuguese", caption: "Intake with Clara, in Portuguese · demo data" },
    ],
    diagram: "area-gap",
    disclosure: "Screens show demo data. Case studies are published only once documented and cleared by the owners.",
    source: "Realization project overview, September 2026 (repository counts as of 28 Sep 2026; market data INE 2021 and 2025).",
    related: ["when-the-registry-and-the-building-disagree"],
    cta: { path: "opportunity", heading: "Own a stuck property, | or want to operate this?", label: "Bring a property case" },
    schema: "Organization",
    icon: KeyRound,
    updated: "2026-09-28",
  },
  {
    slug: "realizeos",
    name: "RealizeOS",
    kind: "system",
    eyebrow: "AI OPERATING SYSTEM · OPEN CORE",
    status: "Live",
    location: "Self-hosted · runs anywhere",
    role: "Designed and built by Realization; runs our own operations",
    descriptor: "A self-hosted team of AI agents | that knows the business, remembers | and works under human approval.",
    summary:
      "RealizeOS is a self-hosted AI operations system: coordinated agents that share one knowledge base about the business, remember past work and act only within approval gates. Realization built it to run its own operations and publishes the core under a source-available licence.",
    problem:
      "Most teams adopted chatbots, | not an AI operation. | Every chat starts from zero, | work isn’t followed through, | and the knowledge lives with the model vendor.",
    approach:
      "Keep the durable asset — knowledge, | history and identity — in files the business owns. | Everything else is a swappable adapter: | models, agent runtimes, channels and interfaces.",
    outcome:
      "Version 5.6 runs Realization’s research, | documentation and coordination daily. | The core is free to self-host; | setup and adaptation are available through Advisory.",
    facts: [
      { value: "54.5k", label: "lines of Python, plus 11.5k of TSX" },
      { value: "2,032", label: "automated tests across 99 files" },
      { value: "24", label: "MCP tools exposed to other agents" },
      { value: "4", label: "LLM providers, routed by task and cost" },
    ],
    steps: {
      title: "Context → | coordinated action.",
      intro: "Six hard problems, | solved as one stack.",
      items: [
        ["Knowledge", "FABRIC: plain markdown the team can edit, | round-tripped into typed entities."],
        ["Memory", "Synapse: a four-tier index | that recalls the cheapest context first."],
        ["Missions", "An eight-state engine that plans, routes | and tracks the cost of every step."],
        ["Governance", "Six roles, injection guards, audit logs | and human approval on consequential actions."],
      ],
    },
    stack: ["Python 3.11", "FastAPI", "SQLite FTS5", "React 19", "Anthropic Claude", "Google Gemini", "OpenAI via LiteLLM", "Ollama (local)", "MCP server"],
    links: [
      { label: "realizeos.ai", href: "https://realizeos.ai" },
      { label: "View on GitHub", href: "https://github.com/SufZen/RealizeOS-5" },
    ],
    cover: {
      src: "/media/venture-realizeos.webp",
      alt: "Operators connecting field equipment beside a tablet and process map",
    },
    disclosure: "Source-available under BSL 1.1. Counts are measured from the repository.",
    source: "RealizeOS project overview v5.6.0, September 2026.",
    related: ["ai-in-the-office-start-with-knowledge"],
    cta: { path: "advisory", heading: "Want an AI operation | that belongs to you?", label: "Talk about a setup" },
    schema: "SoftwareApplication",
    icon: Cpu,
    updated: "2026-09-28",
  },
  {
    slug: "ai-adoption-architecture-firm",
    name: "AI adoption roadmap",
    kind: "advisory",
    eyebrow: "ADVISORY CASE STUDY · PROFESSIONAL SERVICES",
    status: "Case study",
    years: "2026",
    location: "Israel · a leading architecture practice (anonymised)",
    role: "Discovery, roadmap and pilot design",
    descriptor: "How one engagement moved a 25-person firm | from scattered experiments | to one measured programme.",
    summary:
      "For a leading Israeli architecture practice of about 25 people, Realization mapped eight work domains, chose one visible pilot and modelled the programme over 24 months. The model breaks even in month seven and reaches 3.9 times value to investment by month 24, counting the firm’s own hours as a cost.",
    problem:
      "The firm had the tools and the understanding. | What it lacked was a decision: | what to do first, who owns it, | and whether anyone had hours for it.",
    approach:
      "Listen before mapping. | Score every work domain on visible impact | against setup effort. | Prove the method on one problem, | then scale in waves — and plan our own exit.",
    outcome:
      "A decisions document the firm owns, | a pilot of three to five weeks | with an agreed pass mark, | and four stop points before the budget opens.",
    facts: [
      { value: "Month 7", label: "modelled break-even" },
      { value: "3.9×", label: "value to investment at 24 months" },
      { value: ">90%", label: "pilot accuracy pass mark" },
      { value: "~18%", label: "of the 24-month budget at risk before proof" },
    ],
    steps: {
      title: "Five steps, | each ending in a decision.",
      intro: "Nothing is built | before the problem is named and measured.",
      items: [
        ["Listen", "In-depth sessions with partners and staff. | Output: the firm’s own problem statements."],
        ["Map", "Every work domain, including those that already work. | Output: a scored domain map."],
        ["Sequence", "Start with the most visible win, not the biggest. | Output: a prioritisation matrix."],
        ["Prove, then scale", "One domain, two people, weeks not months — | then waves, as support tapers to zero."],
      ],
    },
    sections: [
      {
        heading: "What the sessions surfaced",
        paragraphs: [
          "Three phrases recurred: “there is no need to reinvent the wheel”, “everyone works alone, there is no shared brain”, and “there is no time”. Individual use of AI was already sophisticated. What was missing was the shared layer that turns personal habits into a firm asset — and protected hours to build it.",
        ],
      },
      {
        heading: "Four ground rules, agreed before any tool",
        paragraphs: [
          "Buy first and build only for the gap. Keep a human in the loop, always. Keep the knowledge in the firm, with support designed to taper and end. Start small and measure against the firm’s own work, never a vendor demo.",
        ],
      },
      {
        heading: "Eight domains, scored and sequenced",
        paragraphs: [
          "Administration and bids became the first pilot: repetitive work, hard-to-recruit skills and zero AI use, so every gain is visible. The project archive is the foundation for later phases. Visualisation was already about ten times faster and was left alone. Financial insight was excluded at the client’s request — recorded, not argued.",
          "Two of the three items in the “start here” quadrant were not software at all: programme ownership and three management decisions (one archive or two, what is already paid for, who may access what).",
        ],
      },
      {
        heading: "A pilot that can be judged",
        paragraphs: [
          "One domain, two people, three to five weeks. The output already exists today, so “better” is measurable. The system learns from past inputs and outputs rather than asking busy experts to explain their judgement. Five measures are agreed in advance: cycle time (40% faster or better), accuracy (above 90%), unprompted weekly use, load displacement and new capability. If it misses, the tool changes — not the scope.",
        ],
      },
      {
        heading: "Economics the approver can trust",
        paragraphs: [
          "The 24-month model counts every cost, including the internal lead’s own hours, and prices only time saved. Break-even lands in month seven; value reaches about 3.9 times the investment by month 24. The number that converts a cautious approver is the exposure before proof: about 18% of the total, reached at week eight.",
        ],
      },
    ],
    links: [],
    disclosure: "Client anonymised. Figures come from the engagement’s planning model, not from measured results.",
    source: "AI Adoption Roadmap — Method and case study, Realization, 2026.",
    related: ["ai-in-the-office-start-with-knowledge"],
    cta: { path: "advisory", heading: "Deciding where AI | should start in your firm?", label: "Start with discovery" },
    schema: "CreativeWork",
    icon: Compass,
    updated: "2026-09-28",
  },
  {
    slug: "meetsum",
    name: "MeetSum",
    kind: "system",
    eyebrow: "MEETING INTELLIGENCE · HEBREW-FIRST",
    status: "Live",
    years: "2026–",
    location: "Self-hosted · meetsum.realization.co.il",
    role: "Designed, built and operated by Realization",
    descriptor: "Every meeting becomes searchable memory, | tasks and automation — | in Hebrew and English.",
    summary:
      "MeetSum is a self-hosted meeting-intelligence platform that turns Google Meet, Drive, desktop and uploaded recordings into transcripts, decisions and tasks. It handles Hebrew and mixed Hebrew–English speech properly and pushes results into Google Workspace, n8n, RealizeOS and AI agents.",
    problem:
      "AI note-takers are English-first, | hosted on someone else’s servers | and stop at an email summary. | Hebrew speech degrades, | and nothing reaches the systems where work happens.",
    approach:
      "One retry-safe job pipeline for every source. | Speech is routed by language and length: | a Hebrew-tuned local model for short meetings, | a cloud model for long or mixed ones, | with every stage’s model and confidence recorded.",
    outcome:
      "Live in production with import, processing, | review, sharing, export and automation working end to end. | Cost scales with usage, not seats.",
    facts: [
      { value: "36k", label: "lines of TypeScript, SQL and scripts" },
      { value: "74", label: "REST API route handlers" },
      { value: "5", label: "interface languages, including RTL Hebrew" },
      { value: "~63%", label: "illustrative saving vs per-seat SaaS at 50 users" },
    ],
    sections: [
      {
        heading: "Case in point: making local Hebrew speech recognition safe",
        paragraphs: [
          "A 52-minute mixed Hebrew–English recording crashed the local speech container in production. The pipeline fell back to the cloud model automatically, the meeting still completed, and users saw a quality warning rather than a silent failure. The fix was a routing policy: local recognition for Hebrew under fifteen minutes, cloud for longer or mixed audio — plus chunking and memory caps for the next release.",
        ],
      },
    ],
    stack: ["Next.js 16", "BullMQ + Redis", "PostgreSQL", "MinIO", "faster-whisper (ivrit-ai)", "Gemini", "Electron capture app", "MCP server", "Docker Compose + Traefik"],
    links: [{ label: "meetsum.realization.co.il", href: "https://meetsum.realization.co.il" }],
    disclosure: "The cost comparison is illustrative (SaaS at $19 per seat per month vs a $100 VPS plus usage) and excludes engineering time.",
    source: "MeetSum project overview v0.6.0, September 2026.",
    cta: { path: "advisory", heading: "Meetings that should | feed your systems?", label: "Talk about MeetSum" },
    schema: "SoftwareApplication",
    icon: Mic,
    updated: "2026-09-28",
  },
  {
    slug: "lifebook",
    name: "Lifebook",
    kind: "system",
    eyebrow: "PERSONAL OPERATING SYSTEM · PRIVATE BY DESIGN",
    status: "In daily use",
    years: "2026–",
    location: "Self-hosted · invited circle",
    role: "Designed and built by Realization",
    descriptor: "A private system that turns | a life vision into daily action, | with an AI companion that proposes, never imposes.",
    summary:
      "Lifebook turns a once-a-year life-vision document into a living system of goals, actions and journal entries across twelve life areas. Its AI companion, Lify, plans the day and flags drifting goals, but every change waits for the user’s approval.",
    problem:
      "A life plan that lives in a slide deck | stops living. | Editing is slow, nothing links the vision | to this week, and the content is | too personal for a SaaS notes app.",
    approach:
      "Edit like a document, see like a board, | act like a plan. | One database per user, | bring-your-own AI model, | and open access for external agents over MCP.",
    outcome:
      "Six releases in 26 days, | in daily use by an invited circle. | Next: a coach mode that shares progress | without breaking per-user isolation.",
    facts: [
      { value: "26 days", label: "from first release to v0.3.1" },
      { value: "16.3k", label: "lines of TypeScript" },
      { value: "27", label: "MCP tools for external agents" },
      { value: "100%", label: "of personal content on user-controlled servers" },
    ],
    stack: ["React 19", "Fastify 5", "SQLite per user", "Drizzle ORM", "TipTap", "Konva", "OpenRouter / Ollama", "MCP server", "Docker Compose"],
    links: [],
    source: "Lifebook project overview v0.3.1, 2026.",
    cta: { path: "advisory", heading: "Need a private, | agent-ready product built fast?", label: "Start a conversation" },
    schema: "SoftwareApplication",
    icon: BookOpen,
    updated: "2026-09-28",
  },
  {
    slug: "boa-architecture",
    name: "BOA Architecture",
    kind: "architecture",
    eyebrow: "ARCHITECTURE PRACTICE · SETÚBAL",
    status: "Ongoing",
    years: "2023–",
    location: "Setúbal and Montijo, Portugal",
    role: "Co-founder and partner (with Arc. Bar Moyal)",
    descriptor: "An investment-minded architecture practice | reviving homes in Setúbal’s historic centre.",
    summary:
      "BOA Architecture is a Portuguese practice co-founded by Asaf Eyzenkot and Bar Moyal, both Tel Aviv University architecture graduates. It has designed nine residential and interior projects in Setúbal and Montijo, seven finished and two in progress.",
    problem:
      "Investors buying older homes in Portugal | need design that works for the numbers, | the licence and the street — | not only for the drawing.",
    approach:
      "Combine architecture with | real-estate and investment judgement: | plan, license and manage the renovation | as one decision.",
    outcome:
      "Nine projects across Setúbal’s Baixa, | Bairro do Liceu, Troino and Montijo. | Seven finished, two under way.",
    facts: [
      { value: "9", label: "residential and interior projects" },
      { value: "7", label: "finished" },
      { value: "2", label: "in progress" },
      { value: "2", label: "towns: Setúbal and Montijo" },
    ],
    projects: [
      { name: "Santa Maria", place: "Travessa Santa Maria, Setúbal", status: "In progress" },
      { name: "Maria Eusébio #2", place: "Troino, Baixa de Setúbal", status: "In progress" },
      { name: "Serpa Pinto", place: "Praça 5 de Outubro, Montijo", status: "Finished" },
      { name: "Maria Eusébio", place: "Baixa de Setúbal", status: "Finished" },
      { name: "Vila das Fontaínhas", place: "Setúbal", status: "Finished" },
      { name: "Sousa Alvão", place: "Montalvão, Setúbal", status: "Finished" },
      { name: "Bairro do Liceu", place: "Setúbal", status: "Finished" },
      { name: "Amaral A", place: "Baixa de Setúbal", status: "Finished" },
      { name: "Amaral B", place: "Bairro do Liceu, Setúbal", status: "Finished" },
    ],
    links: [{ label: "boaarc.com", href: "https://www.boaarc.com" }],
    source: "boaarc.com project gallery, September 2026.",
    related: ["design-first-then-ask-for-a-price"],
    cta: { path: "opportunity", heading: "A building in Setúbal | or Lisbon to rethink?", label: "Bring the property" },
    schema: "Organization",
    icon: PenTool,
    updated: "2026-09-28",
  },
  {
    slug: "burtucala",
    name: "Burtucala",
    kind: "venture",
    eyebrow: "INVESTOR PLATFORM · PORTUGAL",
    status: "Concluded",
    years: "From 2019",
    location: "Portugal · Israel",
    role: "Co-founder and partner",
    descriptor: "A portal connecting international entrepreneurs | and investors with local partners | and opportunities in Portugal.",
    summary:
      "Burtucala was a venture Asaf Eyzenkot co-founded to connect international entrepreneurs and investors with vetted local partners and asset-based opportunities in Portugal. It has concluded; its lessons shaped how Realization plans property, business logic, numbers and operations as one system.",
    problem:
      "Foreign investors met Portugal | through fragmented advice: | property, licensing, design, tax | and operations decided separately.",
    approach:
      "A curated opportunity feed, | a knowledge hub and a partner network | covering legal, tax, real estate | and capital raising.",
    outcome:
      "Concluded. The central lesson became | Realization’s method: | space-based ventures succeed when | they are planned as one system.",
    facts: [
      { value: "2019", label: "co-founded" },
      { value: "PT ↔ IL", label: "investor and partner bridge" },
      { value: "4", label: "partner service lines: legal, tax, property, capital" },
    ],
    links: [{ label: "burtucala.com", href: "https://www.burtucala.com" }],
    source: "burtucala.com and founder profile, September 2026.",
    related: ["turnkey-or-value-add"],
    cta: { path: "capital", heading: "Investing in Portugal | from abroad?", label: "Start the right conversation" },
    schema: "Organization",
    icon: Handshake,
    updated: "2026-09-28",
  },
];

export const workBySlug = (slug: string) => work.find((item) => item.slug === slug);

export const workInCategory = (category: WorkCategory) => work.filter((item) => category.kinds.includes(item.kind));

/** Items shown on the home page, in order. */
export const featuredWork = ["arena-barreiro", "realization-portugal", "ai-adoption-architecture-firm", "realizeos", "meetsum", "boa-architecture"]
  .map((slug) => workBySlug(slug))
  .filter((item): item is WorkItem => Boolean(item));

export const categoryOf = (item: WorkItem) => workCategories.find((category) => category.kinds.includes(item.kind))!;

/** Plain-text list of CTA paths with labels, shared by the form and llms.txt. */
export const formPaths: Array<[FormPath, string]> = [
  ["opportunity", "I own an opportunity"],
  ["capital", "I represent capital"],
  ["advisory", "I want advisory support"],
  ["operator", "I can operate a venture"],
  ["corporate", "I represent an organization"],
];
