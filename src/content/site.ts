import type { ComponentType } from "react";
import {
  Building2,
  CircleDollarSign,
  Cpu,
  Factory,
  Globe2,
  Handshake,
  KeyRound,
  Landmark,
  Network,
  Scale,
  Sparkles,
  UsersRound,
  Waves,
} from "lucide-react";

export type IconComponent = ComponentType<{ size?: number; strokeWidth?: number }>;

export const siteUrl = "https://realization.world";

export const primaryNavigation = [
  { label: "Work", href: "/work" },
  { label: "Advisory", href: "/advisory" },
  { label: "Partners", href: "/partners" },
  { label: "Insights", href: "/insights" },
  { label: "About", href: "/about" },
] as const;

/** The model behind the work: secondary navigation (menu and footer). */
export const approachNavigation = [
  { label: "Thesis", href: "/thesis" },
  { label: "How we build", href: "/how-we-build" },
  { label: "Markets", href: "/markets" },
] as const;

/** Booking link for a 30-minute intro call (TidyCal). */
export const bookingUrl = "https://schedule.realization.co.il/30-minute-intro-meeting-asaf";
export const whatsappUrl = "https://wa.me/972528289437";
export const contactEmail = "hello@realization.world";

export const processSteps = [
  {
    number: "01",
    title: "Discover",
    text: "Find where meaningful value is stuck.",
  },
  {
    number: "02",
    title: "Architect",
    text: "Design the venture | and its operating logic.",
  },
  {
    number: "03",
    title: "Build",
    text: "Make the system tangible.",
  },
  {
    number: "04",
    title: "Validate",
    text: "Test demand, economics | and delivery in reality.",
  },
  {
    number: "05",
    title: "Transfer",
    text: "Place it | with the right operator.",
  },
] as const;

export const framework = [
  {
    title: "Physical potential",
    text: "An asset, place or essential system | with value locked inside it.",
    icon: Building2,
  },
  {
    title: "Digital systems",
    text: "Workflows and intelligence | that make complexity operable.",
    icon: Network,
  },
  {
    title: "Realized value",
    text: "A working venture | with ownership, evidence and an operator.",
    icon: Sparkles,
  },
] satisfies Array<{ title: string; text: string; icon: IconComponent }>;

export const partnerPaths = [
  {
    slug: "opportunity-owners",
    title: "Opportunity owners",
    headline: "Bring what others cannot unlock.",
    summary:
      "For owners of assets, places or systems | who see the potential, but need a venture to unlock it.",
    promise:
      "A clear fit assessment, | not an open-ended engagement.",
    cta: "Bring an opportunity",
    href: "/bring-an-opportunity",
    icon: Landmark,
    steps: [
      ["Recognize", "The asset has value, rights | and a visible blocker."],
      ["Evidence", "See what we build | and the maturity we look for."],
      ["Brief", "Share ownership, constraints, | timing and capital context."],
      ["Fit", "Get a route to discovery, | a referral or a clear no."],
    ],
  },
  {
    slug: "operators",
    title: "Operators",
    headline: "Take a proven system further.",
    summary:
      "For experienced operators | who want a validated system, not a raw idea.",
    promise:
      "Transparent status | and a structured transfer conversation.",
    cta: "Explore operator fit",
    href: "/bring-an-opportunity?path=operator",
    icon: Factory,
    steps: [
      ["Enter", "Find a venture that matches | your operating capability."],
      ["Inspect", "Review status, model, | needs and evidence."],
      ["Profile", "Share your history, team, | geography and capital."],
      ["Discuss", "Agree the transfer | or partnership structure."],
    ],
  },
  {
    slug: "capital",
    title: "Capital partners",
    headline: "Back evidence. Not theatre.",
    summary:
      "For angels, family offices, funds and corporates | aligned with the physical-world thesis.",
    promise:
      "Briefs and data rooms | only where mandate and stage align.",
    cta: "Share your mandate",
    href: "/bring-an-opportunity?path=capital",
    icon: CircleDollarSign,
    steps: [
      ["Thesis", "Start with our focus | and the value we create."],
      ["Evidence", "Review the problem, validation | and operator path."],
      ["Profile", "Share ticket, stage, | geography and instrument."],
      ["Match", "Move to a relevant brief | once approved."],
    ],
  },
  {
    slug: "corporate-public",
    title: "Corporate & public partners",
    headline: "Turn a challenge into a venture.",
    summary:
      "For organizations with authority and data | and a physical-world problem worth a pilot.",
    promise:
      "A venture pathway with defined outcomes, | not an open-ended consultancy.",
    cta: "Frame a strategic venture",
    href: "/bring-an-opportunity?path=corporate",
    icon: Handshake,
    steps: [
      ["Frame", "Name the problem, | its owner and the data."],
      ["Structure", "Define a venture model, | not a service project."],
      ["Validate", "Run a time-boxed pilot | with clear targets."],
      ["Scale", "Form a venture | or hand it to an operator."],
    ],
  },
] as const;

export const markets = [
  {
    slug: "israel",
    name: "Israel",
    label: "ISRAEL–EUROPE BRIDGE",
    headline: "Israeli capability. | European opportunity.",
    summary:
      "The relationship side of the bridge: | capital, technology, operators and networks.",
    role: "Capital, technology & partnerships",
    language: "Hebrew-first on realization.co.il",
    status: "Active bridge",
    icon: UsersRound,
  },
  {
    slug: "portugal",
    name: "Portugal",
    label: "OUR BASE",
    headline: "Opportunity grounded in place.",
    summary:
      "Where we source opportunities, | build partnerships and develop projects.",
    role: "European opportunity market",
    language: "Portuguese-first; English counterpart",
    status: "Active market",
    icon: Waves,
  },
] as const;

export type Insight = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  published: string;
  /** ISO date for metadata, schema.org and the sitemap. */
  date: string;
  icon: IconComponent;
  sections: Array<{ heading: string; paragraphs: string[] }>;
};

export const insights: Insight[] = [
  {
    slug: "when-the-registry-and-the-building-disagree",
    category: "Property resolution",
    title: "When paper | and building disagree",
    excerpt:
      "A property can look ready to sell | and still be legally stuck.",
    readTime: "2 min read",
    published: "Field note 01 · Sep 2026",
    date: "2026-09-27",
    icon: KeyRound,
    sections: [
      {
        heading: "The paper building",
        paragraphs: [
          "In Portugal it is common to find a building whose registered area is a fraction of what actually stands. Extensions were added decades ago. Floors were closed in. Nobody updated the registry.",
          "On a site visit the property looks ready. On paper, much of it does not exist. The gap stays invisible until someone tries to sell, finance or license it.",
        ],
      },
      {
        heading: "Why it blocks everything",
        paragraphs: [
          "A bank lends on the registered reality. A municipality licenses the registered reality. A buyer's lawyer checks the registered reality.",
          "Until paper and building match, the asset cannot move, however good the location. This is one of the main reasons so many valuable homes sit empty.",
        ],
      },
      {
        heading: "Two roads, both slow",
        paragraphs: [
          "There are usually two options. Correct the registry, which means historical research, surveys, legal work and patience. Or design within the registered area, and give up part of the potential.",
          "Neither is quick. The real mistake is starting design or works before choosing the road. Works started on an unresolved registration can be stopped.",
        ],
      },
      {
        heading: "What we do first",
        paragraphs: [
          "Before any design, we pull the historical records, commission a topographic survey and compare three numbers: the registered area, the licensed area and the built area.",
          "Then we split the work into a legal track and an architectural track, each with a clear owner, so both move in parallel.",
          "When other owners share the building, we bring them in early. Regularization often needs their consent, and it is easier to ask before plans are drawn.",
        ],
      },
      {
        heading: "The pattern behind it",
        paragraphs: [
          "Inheritance, co-ownership and old paperwork have created a large stock of homes that are valuable but not transactable. Fixing that is a system problem: legal, technical and human at once.",
          "It is the problem Realization Portugal is being built around.",
        ],
      },
    ],
  },
  {
    slug: "design-first-then-ask-for-a-price",
    category: "Development",
    title: "Design first. | Then ask for a price.",
    excerpt:
      "A contractor can only price | what has actually been designed.",
    readTime: "2 min read",
    published: "Field note 02 · Sep 2026",
    date: "2026-09-27",
    icon: Building2,
    sections: [
      {
        heading: "The temptation",
        paragraphs: [
          "In small residential projects there is pressure to get a construction price early. Investors want a number. Banks want a signed quote.",
          "So the architecture goes out to contractors before the engineering is finished.",
        ],
      },
      {
        heading: "What comes back",
        paragraphs: [
          "Without the specialty designs, a contractor prices assumptions: structure, electrical, plumbing, drainage, heating and cooling, fire safety.",
          "The quote is either padded to cover the risk, or low and full of exclusions. Both return later as change orders.",
        ],
      },
      {
        heading: "Decide what moves the budget",
        paragraphs: [
          "Before tendering, we fix the choices that move the price: window and door systems, facade materials, heating and hot water, the lift, the energy target.",
          "Aluminium alone can be a noticeable share of a small building's budget. Deciding it late is expensive.",
        ],
      },
      {
        heading: "Energy class is a design decision",
        paragraphs: [
          "A top energy rating is not a finishing touch. It shapes roof space, equipment and where the exterior units go.",
          "Simulate it early with the engineer, choose once, and keep maintenance access in the drawings.",
        ],
      },
      {
        heading: "Constraints are inputs",
        paragraphs: [
          "Infill plots bring narrow facades, level changes and accessibility rules. A ramp that cannot meet the slope limit is not a solution.",
          "Sometimes the right answer is a platform lift and a few steps kept on purpose. Decide it on paper, not on site.",
        ],
      },
      {
        heading: "The sequence",
        paragraphs: [
          "Architecture, then specialties, then a clear specification, then contractor bids. Where the rules allow, run licensing and execution drawings in parallel.",
          "It feels slower at the start. It is faster by the end, and the price you sign is a price you can keep.",
        ],
      },
    ],
  },
  {
    slug: "turnkey-or-value-add",
    category: "Investing",
    title: "Turnkey | or value-add?",
    excerpt:
      "Two properties, one budget. | The right choice depends on the investor, not the listing.",
    readTime: "2 min read",
    published: "Field note 03 · Sep 2026",
    date: "2026-09-27",
    icon: Scale,
    sections: [
      {
        heading: "Two kinds of opportunity",
        paragraphs: [
          "Investors looking at Portugal often end up comparing two very different things at a similar price.",
          "A furnished apartment ready to rent tomorrow. And an older property that needs a redesign to reach its potential.",
        ],
      },
      {
        heading: "Turnkey buys time",
        paragraphs: [
          "A ready property starts earning quickly. It suits investors who want income now and little involvement.",
          "The trade-off: most of the upside is already in the price, and short-term rental income is seasonal. Strong months carry the weak ones.",
        ],
      },
      {
        heading: "Value-add buys upside",
        paragraphs: [
          "A renovation can create value that did not exist before: an extra bedroom, a better layout, a licensing problem solved.",
          "It needs most of a year of work, a longer horizon and a tolerance for surprises.",
        ],
      },
      {
        heading: "Questions that decide it",
        paragraphs: [
          "How soon do you need income? How much uncertainty can you carry? Will you ever live there? Do you need parking, or long-term tenants?",
          "Answer these before falling for a property. The listing cannot answer them for you.",
        ],
      },
      {
        heading: "Let the bank value it",
        paragraphs: [
          "An independent bank valuation costs little and does two jobs. It shows what the bank will finance, and it gives both sides a neutral number to negotiate around.",
          "When the valuation and the asking price disagree, you have learned something before committing.",
        ],
      },
      {
        heading: "Plan the year, not the month",
        paragraphs: [
          "Seasonal rentals rarely produce smooth monthly income. Start with reserves, model financing at several loan-to-value levels, and consider mid-term tenants for the quiet season.",
          "A deal that only works in August does not work.",
        ],
      },
    ],
  },
  {
    slug: "ai-in-the-office-start-with-knowledge",
    category: "AI in practice",
    title: "AI in the office: | start with knowledge",
    excerpt:
      "Most teams use AI for small tasks. | The value starts when the office's knowledge is in order.",
    readTime: "2 min read",
    published: "Field note 04 · Sep 2026",
    date: "2026-09-27",
    icon: Cpu,
    sections: [
      {
        heading: "The note-taking button",
        paragraphs: [
          "In most offices I visit, AI means someone pressing a summary button after a meeting. Useful, but small.",
          "The real gains come when AI changes how the work flows, not when it decorates the old flow.",
        ],
      },
      {
        heading: "Order before intelligence",
        paragraphs: [
          "An agent is only as good as what it can find. Inconsistent folder names and files scattered across personal drives will defeat any model.",
          "So the first project is usually unglamorous: a standard folder structure, clear permissions and a reliable backup that does not depend on a single vendor's cloud.",
        ],
      },
      {
        heading: "Then a knowledge layer",
        paragraphs: [
          "Once the archive is orderly, a knowledge graph can connect projects, documents and decisions, so people find what they need even when they misspell it.",
          "That is where search stops being a chore.",
        ],
      },
      {
        heading: "Pick one heavy workflow",
        paragraphs: [
          "Choose a task that is repetitive and expensive, such as reading tender documents. Build an agent for it, keep a person checking its output, and measure the time it saves.",
          "One workflow done well teaches an office more than ten tools installed.",
        ],
      },
      {
        heading: "Pilot small, own the result",
        paragraphs: [
          "Start with eight to ten people, not the whole office. Give the project an owner and protected hours.",
          "Whatever you build stays the office's own asset, with permissions and security designed in from the start. Look for quick, low-cost wins first; they buy the patience for the rest.",
        ],
      },
      {
        heading: "How we use it ourselves",
        paragraphs: [
          "At Realization, AI is how a small team stays fast: research, documentation, coordination and follow-up.",
          "It is an internal edge, not the product. The same discipline works in any professional practice.",
        ],
      },
    ],
  },
  {
    slug: "trust-the-street-over-the-forecast",
    category: "Market evidence",
    title: "Trust the street | over the forecast",
    excerpt:
      "AI can estimate a rent in seconds. | The market decides it over months.",
    readTime: "2 min read",
    published: "Field note 05 · Sep 2026",
    date: "2026-09-27",
    icon: Globe2,
    sections: [
      {
        heading: "Fast answers",
        paragraphs: [
          "Ask an AI model what an apartment will rent for, and you get a confident number instantly.",
          "It is a good starting point, and a dangerous finishing point.",
        ],
      },
      {
        heading: "Where the gap comes from",
        paragraphs: [
          "Models learn from listings, not signed contracts. Listings are asking prices: often optimistic, often old.",
          "In smaller or shifting markets, the gap between what is advertised and what is actually agreed can be wide, especially for larger units, which take longer to let or sell.",
        ],
      },
      {
        heading: "What we check instead",
        paragraphs: [
          "Recent closed deals from local agents. Time on market. How long similar units stood empty. Seasonality. Who the buyer or tenant actually is.",
          "Then we compare that with the model's number and ask why they differ.",
        ],
      },
      {
        heading: "Design follows the buyer",
        paragraphs: [
          "The same evidence shapes the product. If local demand is for three-bedroom family homes, a layout full of large one-bedrooms is a risk, however good the renders look.",
          "Define the buyer before the floor plan.",
        ],
      },
      {
        heading: "Use AI as a researcher, not a judge",
        paragraphs: [
          "AI is excellent at gathering, structuring and comparing. Let it prepare the question for someone who knows the street.",
          "Used that way, it makes local judgment faster, not unnecessary.",
        ],
      },
    ],
  },
];

export const thesisDomains = [
  { title: "Places & property", text: "Ownership, use, regeneration | and spatial value.", icon: Building2 },
  { title: "Infrastructure", text: "Systems that connect | essential physical activity.", icon: Network },
  { title: "Water & energy", text: "Resource systems where efficiency | and resilience compound.", icon: Waves },
  { title: "Construction", text: "Methods, data and coordination | that make building work better.", icon: Factory },
  { title: "Public systems", text: "Shared challenges | with clear authority and evidence.", icon: Landmark },
  { title: "Operating intelligence", text: "Digital infrastructure | that helps physical-world teams act.", icon: Cpu },
] satisfies Array<{ title: string; text: string; icon: IconComponent }>;
