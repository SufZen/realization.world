import type { ComponentType } from "react";
import {
  Blocks,
  Building2,
  CircleDollarSign,
  Cpu,
  Factory,
  Globe2,
  Handshake,
  KeyRound,
  Landmark,
  Network,
  Orbit,
  Scale,
  Sparkles,
  UsersRound,
  Waves,
} from "lucide-react";

export type IconComponent = ComponentType<{ size?: number; strokeWidth?: number }>;

export const siteUrl = "https://realization.world";

export const primaryNavigation = [
  { label: "Thesis", href: "/thesis" },
  { label: "How we build", href: "/how-we-build" },
  { label: "Ventures", href: "/ventures" },
  { label: "Partners", href: "/partners" },
  { label: "Markets", href: "/markets" },
  { label: "Insights", href: "/insights" },
  { label: "About", href: "/about" },
] as const;

export const processSteps = [
  {
    number: "01",
    title: "Discover",
    text: "Find where meaningful value is stuck.",
  },
  {
    number: "02",
    title: "Architect",
    text: "Design the venture and its operating logic.",
  },
  {
    number: "03",
    title: "Build",
    text: "Make the system tangible.",
  },
  {
    number: "04",
    title: "Validate",
    text: "Test demand, economics and delivery in reality.",
  },
  {
    number: "05",
    title: "Transfer",
    text: "Place it with the right operator.",
  },
] as const;

export const framework = [
  {
    title: "Physical potential",
    text: "An asset, place or essential system with value locked inside it.",
    icon: Building2,
  },
  {
    title: "Digital systems",
    text: "Workflows and intelligence that make complexity operable.",
    icon: Network,
  },
  {
    title: "Realized value",
    text: "A functioning venture with ownership, evidence and an operator.",
    icon: Sparkles,
  },
] satisfies Array<{ title: string; text: string; icon: IconComponent }>;

export type Venture = {
  slug: string;
  name: string;
  eyebrow: string;
  descriptor: string;
  stage: "Active" | "Validation status to confirm" | "Exploring";
  problem: string;
  system: string;
  realizationRole: string;
  operator: string;
  evidence: string;
  ask: string;
  icon: IconComponent;
  image: string;
  imageAlt: string;
  externalHref?: string;
};

export const ventures: Venture[] = [
  {
    slug: "realization-portugal",
    name: "Realization Portugal",
    eyebrow: "PROPERTY RESOLUTION VENTURE · PORTUGAL",
    descriptor:
      "A coordinated system for resolving properties immobilized by inheritance, documentation and co-owner deadlock.",
    stage: "Validation status to confirm",
    problem:
      "Homes with real value can remain stuck because ownership, documentation and licensed professional processes are fragmented.",
    system:
      "A guided diagnosis, Resolution Blueprint, Clara and a coordinated path through the relevant licensed professionals.",
    realizationRole:
      "Research, venture architecture, product, technology, validation design and transfer planning.",
    operator:
      "The operating legal entity, licensed professional responsibilities and data-controller role must be stated before public launch.",
    evidence:
      "Only documented, permissioned and measurable cases should be published. Outcomes and operating status remain to be verified.",
    ask: "Bring a property case · Operate this venture · Partner with capital",
    icon: KeyRound,
    image: "/media/venture-portugal.png",
    imageAlt: "Architectural plans, a house model and a key inside a Portuguese property",
  },
  {
    slug: "realizeos",
    name: "RealizeOS",
    eyebrow: "AI OPERATIONS PLATFORM",
    descriptor:
      "AI operations infrastructure for physical-world businesses—and the operating layer used to build Realization ventures.",
    stage: "Active",
    problem:
      "Knowledge, context and action are fragmented across AI tools and disconnected workflows.",
    system:
      "FABRIC, a knowledge graph, agents, routines, venture identity and a local event log organized as an operating system.",
    realizationRole:
      "Thesis, architecture, product development and validation through real physical-world operations.",
    operator:
      "Designed for self-hosting, enterprise licensing and implementation by qualified partners—not a permanent founder-run service.",
    evidence:
      "Version history, deployments, verified workflows, time saved and confirmed customer use should form the evidence base.",
    ask: "Deploy · Explore the architecture · Become an implementation partner",
    icon: Cpu,
    image: "/media/venture-realizeos.png",
    imageAlt: "Operators connecting field equipment beside a tablet and process map",
    externalHref: "https://realizeos.ai",
  },
];

export const futureVenture = {
  name: "Future venture",
  eyebrow: "NEXT PHYSICAL-WORLD SYSTEM",
  descriptor:
    "A reserved space for opportunities that pass the studio’s problem, model, regulatory and operator validation gates.",
  stage: "Exploring" as const,
  icon: Orbit,
};

export const partnerPaths = [
  {
    slug: "opportunity-owners",
    title: "Opportunity owners",
    headline: "Bring what others cannot unlock.",
    summary:
      "For owners of assets, places or operating systems who can see the potential—but need a venture architecture to unlock it.",
    promise:
      "A clear fit assessment, not an open-ended engagement. Strong opportunities may advance to a focused discovery and validation path.",
    cta: "Bring an opportunity",
    href: "/bring-an-opportunity",
    icon: Landmark,
    steps: [
      ["Recognize", "An asset or system has meaningful value, rights and a visible blocker."],
      ["Evidence", "Review what Realization builds and the maturity we need to see."],
      ["Brief", "Share ownership, constraint, beneficiaries, timing and capital context."],
      ["Fit", "Receive a route to discovery, a partner referral or a clear decline."],
    ],
  },
  {
    slug: "operators",
    title: "Operators",
    headline: "Take a proven system further.",
    summary:
      "For experienced operators who want a validated system—not a raw idea—and can bring team, market access and execution discipline.",
    promise:
      "Transparent status, capabilities required and a structured transfer conversation covering governance and economics.",
    cta: "Explore operator fit",
    href: "/bring-an-opportunity?path=operator",
    icon: Factory,
    steps: [
      ["Enter", "Find a venture whose market and operating problem match your capability."],
      ["Inspect", "Review status, model, needs, licensing and evidence available."],
      ["Profile", "Share operating history, team, geography, capital and constraints."],
      ["Discuss", "Evaluate transfer, licensing or operating-partner structures."],
    ],
  },
  {
    slug: "capital",
    title: "Capital partners",
    headline: "Back evidence. Not theatre.",
    summary:
      "For angels, family offices, funds, corporates and project-capital partners aligned with the physical-world thesis.",
    promise:
      "Opportunity-specific briefs and data rooms only where mandate, stage, geography and instrument align.",
    cta: "Share your mandate",
    href: "/bring-an-opportunity?path=capital",
    icon: CircleDollarSign,
    steps: [
      ["Thesis", "Start with the studio’s focus and the type of value it is designed to create."],
      ["Evidence", "Review problem, validation, operator path and current venture status."],
      ["Profile", "Share ticket, stage, geography, instrument and involvement."],
      ["Match", "Move to a relevant brief and controlled data room when approved."],
    ],
  },
  {
    slug: "corporate-public",
    title: "Corporate & public partners",
    headline: "Turn a challenge into a venture.",
    summary:
      "For organizations with authority, data and a consequential physical-world problem that can support a time-boxed validation.",
    promise:
      "A venture pathway with defined outcomes, governance and handoff—not an indefinite consultancy programme.",
    cta: "Frame a strategic venture",
    href: "/bring-an-opportunity?path=corporate",
    icon: Handshake,
    steps: [
      ["Frame", "Name the system-level problem, decision owner, data and affected users."],
      ["Structure", "Define a venture model instead of an open-ended service project."],
      ["Validate", "Run a time-boxed pilot with explicit targets and governance."],
      ["Scale", "Form a strategic venture or transfer to the right operator."],
    ],
  },
] as const;

export const markets = [
  {
    slug: "israel",
    name: "Israel",
    label: "ISRAEL–EUROPE BRIDGE",
    headline: "Israeli capability. European opportunity.",
    summary:
      "Israel is the relationship side of the bridge—connecting capital, technology, operators and entrepreneurial networks with focused opportunities in Europe.",
    role: "Capital, technology & partnerships",
    language: "Hebrew-first on realization.co.il",
    status: "Active bridge",
    icon: UsersRound,
  },
  {
    slug: "portugal",
    name: "Portugal",
    label: "CORE EUROPEAN MARKET",
    headline: "Opportunity grounded in place.",
    summary:
      "Portugal is a main European market for Realization: a place to source physical-world opportunities, build local partnerships and develop ventures in real operating conditions.",
    role: "European opportunity market",
    language: "Portuguese-first; English counterpart",
    status: "Active market",
    icon: Waves,
  },
  {
    slug: "spain",
    name: "Spain",
    label: "FUTURE MARKET · RESEARCH",
    headline: "Evidence before expansion.",
    summary:
      "Spain is reserved for research into physical-world and property-resolution opportunities. A dedicated venture identity follows only after the problem, model, regulation and operator are validated.",
    role: "Future opportunity research",
    language: "Spanish at launch; English research page",
    status: "Reserved · not operating",
    icon: Building2,
  },
] as const;

export type Insight = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  published: string;
  icon: IconComponent;
  sections: Array<{ heading: string; paragraphs: string[] }>;
};

export const insights: Insight[] = [
  {
    slug: "the-transferable-venture",
    category: "Venture architecture",
    title: "Design beyond founder dependence",
    excerpt:
      "A physical-world venture becomes durable when its operating logic, rights and evidence can travel to the right operator.",
    readTime: "6 min read",
    published: "Field note 01",
    icon: Blocks,
    sections: [
      {
        heading: "A venture is not a permanent founder role",
        paragraphs: [
          "Founder insight is often irreplaceable at the beginning. It is where the problem is recognized, the system is imagined and the first difficult connections are made. But continuity depends on translating that insight into an operating architecture others can use.",
          "The goal is not to remove the founder early. It is to keep founder attention at the point of highest leverage: vision, architecture and validation.",
        ],
      },
      {
        heading: "Build the transfer into the build",
        paragraphs: [
          "A transfer-ready venture names its assets, rights, decision rules, regulatory responsibilities, evidence and open risks from the outset. The operator profile becomes a design input—not an afterthought.",
          "That clarity changes what gets built. Workflows become teachable, data ownership becomes explicit and operational knowledge stops living only in conversations.",
        ],
      },
      {
        heading: "Continuity is a design outcome",
        paragraphs: [
          "A successful handoff may be an operating partnership, licence, joint venture or portfolio-company structure. The right form varies; the principle does not: ownership, operation and regulatory responsibility must stay visible.",
        ],
      },
    ],
  },
  {
    slug: "from-physical-friction-to-digital-system",
    category: "Physical-world systems",
    title: "Turn physical friction into a system",
    excerpt:
      "Software creates leverage when it organizes a real-world process—not when it merely adds another interface.",
    readTime: "5 min read",
    published: "Field note 02",
    icon: Cpu,
    sections: [
      {
        heading: "Start with the stalled reality",
        paragraphs: [
          "The useful question is not where to add AI. It is why a valuable physical outcome fails to happen: missing context, fragmented professional work, unclear decisions, poor handoffs or incentives that do not align.",
          "A digital system earns its place when it reduces that friction and makes the next physical action clearer.",
        ],
      },
      {
        heading: "Model context before automating action",
        paragraphs: [
          "Physical-world work has history, rights, people, documents and consequences. A durable system represents that context before asking agents or workflows to act on it.",
          "This is why knowledge graphs, event logs and explicit venture identity matter: they create traceability around what happened, why and under whose authority.",
        ],
      },
      {
        heading: "Validation happens outside the screen",
        paragraphs: [
          "A workflow is only validated when it improves a real process for the people responsible for delivery. Product metrics matter, but they do not replace evidence from the physical outcome.",
        ],
      },
    ],
  },
  {
    slug: "evidence-before-expansion",
    category: "Markets",
    title: "Evidence before expansion",
    excerpt:
      "A country domain is not a strategy. A market earns an identity when the problem, model, regulation and operator all align.",
    readTime: "4 min read",
    published: "Field note 03",
    icon: Globe2,
    sections: [
      {
        heading: "Geography is a constraint set",
        paragraphs: [
          "Physical-world ventures cross planning rules, licensing, professional networks, ownership conventions and local trust. Entering a country means validating that entire system—not translating a landing page.",
        ],
      },
      {
        heading: "Separate the studio from the market",
        paragraphs: [
          "The parent studio can hold the global thesis while a local venture owns its specific audience, language and operating claims. This preserves clarity for users and search engines alike.",
        ],
      },
      {
        heading: "Keep future options honest",
        paragraphs: [
          "Research pages can document a hypothesis without implying an active operation. A dedicated identity should follow evidence: a validated problem, economic model, regulatory route and capable operator.",
        ],
      },
    ],
  },
  {
    slug: "governance-is-product-design",
    category: "Studio practice",
    title: "Governance is part of the product",
    excerpt:
      "Ownership, licensing and accountability are not legal footnotes. They shape whether a venture can be trusted and transferred.",
    readTime: "5 min read",
    published: "Field note 04",
    icon: Scale,
    sections: [
      {
        heading: "Clarity creates operating speed",
        paragraphs: [
          "Teams move faster when they know who owns the IP, who controls the data, who may make a decision and who carries the regulated responsibility. Ambiguity does not preserve flexibility; it exports risk into every handoff.",
        ],
      },
      {
        heading: "Use one status language",
        paragraphs: [
          "Exploring, validating, building, partnering, operating, transferred and archived are different realities. Publishing a consistent status protects both the audience and the venture from implied claims.",
        ],
      },
      {
        heading: "Evidence has an owner",
        paragraphs: [
          "A public claim should have a source, date, definition, methodology and permission to publish. That discipline belongs inside the venture system, not in a last-minute marketing review.",
        ],
      },
    ],
  },
];

export const thesisDomains = [
  { title: "Places & property", text: "Ownership, use, regeneration and spatial value.", icon: Building2 },
  { title: "Infrastructure", text: "Systems that connect essential physical activity.", icon: Network },
  { title: "Water & energy", text: "Resource systems where efficiency and resilience compound.", icon: Waves },
  { title: "Construction", text: "Methods, data and coordination that make building work better.", icon: Factory },
  { title: "Public systems", text: "Shared challenges with clear authority, beneficiaries and evidence.", icon: Landmark },
  { title: "Operating intelligence", text: "Digital infrastructure that helps physical-world teams act.", icon: Cpu },
] satisfies Array<{ title: string; text: string; icon: IconComponent }>;
