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
  {
    slug: "how-to-run-an-ai-pilot-you-can-judge",
    category: "AI in practice",
    title: "How to run an AI pilot | a firm can actually judge",
    excerpt:
      "One domain, two people, three to five weeks, | and a pass mark agreed before anything is built.",
    readTime: "5 min read",
    published: "Field note 06 · Sep 2026",
    date: "2026-09-29",
    icon: Scale,
    sections: [
      {
        heading: "The short answer",
        paragraphs: [
          "A pilot a firm can judge has five properties: it covers one work domain, involves two people, runs three to five weeks, targets a deliverable the firm already produces by hand, and is measured against a pass mark agreed before anything is built. Everything else is a demonstration, and demonstrations do not change how a firm works.",
        ],
      },
      {
        heading: "Why most pilots cannot be judged",
        paragraphs: [
          "Most AI pilots in professional firms fail quietly rather than loudly. A partner sees a tool, a few people try it, and three months later nobody can say whether it worked. The problem is rarely the model. It is that nobody wrote down what \"worked\" would mean.",
          "Broad pilots make this worse. A pilot that touches bids, archive search and project tracking at once produces three half-results and no clear decision. The organisation loses patience before anything ships.",
        ],
      },
      {
        heading: "Five design constraints",
        paragraphs: [
          "One domain, not a cross-cutting process. Broad workflows are hard to implement and harder still to assess afterwards.",
          "Two people, weeks not months. Enough to be real, small enough to change course cheaply.",
          "The output already exists. Pick a deliverable the firm already produces manually, so \"better\" is measured against something real, not against a vendor benchmark.",
          "Start where use is zero. Where nobody uses AI yet, every improvement is visible immediately, and visibility buys permission for the harder work.",
          "Learn from artefacts, not interviews. Busy experts struggle to explain their tacit knowledge. Past inputs and the outputs they produced teach a system far more, and the experts only have to approve the structure it proposes.",
        ],
      },
      {
        heading: "Five measures, agreed in advance",
        paragraphs: [
          "Cycle time: hours recorded before the pilot, then measured again on two real cases. A reasonable target is a 40% reduction.",
          "Output accuracy: tested on material the firm has already processed, so the right answer is known. Above 90% of material items identified is a fair bar.",
          "Actual use: how many participants open the tool in a given week without being prompted. Above 70% means it has become part of the work.",
          "Load displacement: how much repetitive work the team can now absorb without adding headcount.",
          "New capability: how many actions that were not possible before were actually performed, counted against a list fixed during discovery. This is the only measure that is not about efficiency, and it is often the one that matters most commercially.",
        ],
      },
      {
        heading: "The stop rule",
        paragraphs: [
          "If the pilot misses its targets, the answer is to change the tool or the approach, not to expand. Writing that rule down before the pilot starts is what makes the measures real rather than decorative. It is also the whole reason to start small: a mistake costs weeks, not quarters.",
        ],
      },
      {
        heading: "What it costs the firm",
        paragraphs: [
          "Separate two kinds of time. One internal lead needs four to six hours a week, treated as a project in its own right. Each pilot participant needs two to three hours a week, mostly reviewing outputs, and only for the pilot period.",
          "Clients usually quote a single number for \"what this will cost us\". Splitting it makes the ask smaller and far easier to approve, because only one person is asked for a standing commitment.",
        ],
      },
      {
        heading: "In practice",
        paragraphs: [
          "We used exactly this design with a 25-person architecture practice. The first pilot was administration and bids: repetitive, hard to recruit for, and with zero AI use at the start. The full method, from discovery to the 24-month economics, is in the case study.",
        ],
      },
    ],
  },
  {
    slug: "why-ai-adoption-fails-at-step-three",
    category: "AI in practice",
    title: "Why AI adoption | fails at step three",
    excerpt:
      "Firms start with the most valuable problem. | They should start with the most visible one.",
    readTime: "4 min read",
    published: "Field note 07 · Sep 2026",
    date: "2026-09-29",
    icon: Network,
    sections: [
      {
        heading: "The short answer",
        paragraphs: [
          "Most AI adoption programmes stall at the moment they choose what to do first. They pick the most valuable domain, which is usually also the hardest, and lose the organisation's patience before anything ships. Start instead with the domain whose effect will be visible fastest. Visibility buys permission for the heavier work behind it.",
        ],
      },
      {
        heading: "The five steps",
        paragraphs: [
          "A workable programme has five steps, each ending in a decision the client can act on or stop at: listen before mapping, map every work domain, sequence by visibility, prove it on one problem, then scale and withdraw.",
          "Steps one and two are rarely the problem. Firms are good at describing their pain, and a scored map of domains is straightforward to build. Step three is where the programme is won or lost.",
        ],
      },
      {
        heading: "Score two things, not one",
        paragraphs: [
          "Score every domain on visible impact and on setup effort. Plot them. The quadrant with high impact and low effort is where the programme opens, whether or not it holds the biggest prize.",
          "In one engagement, two of the three items in that quadrant were not software problems at all. One was programme ownership: nobody had hours allocated to AI, so nothing moved. The other was three management decisions: one archive or two, what the firm already paid for and did not use, and who may access what. Both were cheap, and both gated everything else.",
        ],
      },
      {
        heading: "List what already works",
        paragraphs: [
          "A credible map includes the domains that need nothing. In that same firm, visualisation was already about ten times faster thanks to AI. We left it alone and used it as internal proof that the technology worked.",
          "We also recorded the domain the client ruled out, financial insight, on information-security grounds, instead of arguing about it. Saying \"you are fine here, do not pay for it\" is what makes the rest of the map believable.",
        ],
      },
      {
        heading: "Visibility first is not a compromise",
        paragraphs: [
          "Sequencing by visibility can look like avoiding the hard problem. It is the opposite. The valuable, difficult domain, in that case making design knowledge itself searchable, still sits on the roadmap for months six to twelve. It simply arrives after the firm has seen a measured result in its own work and trusts the method enough to invest in it.",
        ],
      },
      {
        heading: "Write your own exit",
        paragraphs: [
          "The last step, withdrawal, belongs in the first proposal. External support should taper on a published schedule, full for six months, then half, then a quarter, and end at month twelve. It removes the client's most reasonable objection: that a consultant has no incentive to become unnecessary.",
        ],
      },
    ],
  },
  {
    slug: "portugals-empty-homes-why-they-are-stuck",
    category: "Property resolution",
    title: "Portugal's empty homes: | why they are stuck",
    excerpt:
      "Prices are at a record, yet one home in eight stands empty. | The blocker is people and paperwork, not the building.",
    readTime: "5 min read",
    published: "Field note 08 · Sep 2026",
    date: "2026-09-29",
    icon: KeyRound,
    sections: [
      {
        heading: "The short answer",
        paragraphs: [
          "Portugal had 723,214 empty homes at the 2021 census, about 12% of its 5.97 million dwellings, while house prices rose 17.6% in 2025, the largest jump the national statistics institute has recorded. Most of those homes are not stuck because of the building. They are stuck because of inheritance, co-owners who disagree or cannot be found, registries that do not match, debts and missing licences. Solve the people and the paperwork, and much of the stock can come back to market.",
        ],
      },
      {
        heading: "The Portuguese paradox",
        paragraphs: [
          "Two facts sit side by side. Demand is high enough to push prices to records. At the same time, roughly one home in eight is empty, and about 350,000 of the empty homes need work before anyone can live in them.",
          "Building more is part of the answer. But a large share of good homes already exists. They are simply locked.",
        ],
      },
      {
        heading: "Eight reasons a home gets stuck",
        paragraphs: [
          "Inheritance: the family never divided the estate, a situation known in Portugal as herança indivisa.",
          "Co-owners who do not agree, or who cannot be found, often because they live abroad.",
          "Paperwork: the land registry and the tax records describe different properties.",
          "Court cases, debts and seizures attached to the home.",
          "Unpaid property tax.",
          "Occupation by someone without the right to be there.",
          "No licence to live in it.",
          "Decay, made more expensive every year as the tax on vacant and derelict property rises.",
          "Most cases combine two or three of these at once. That is why they last years: estate agents turn them down, and lawyers solve one piece at a time.",
        ],
      },
      {
        heading: "One real-shaped case",
        paragraphs: [
          "Picture a three-bedroom flat in Braga, worth around €280,000 and empty for six years. There are three heirs: one in Porto, one in Lyon, and one who refuses to sell. Around them sit a lawyer, an architect, the land registry, the tax office and the town hall. Eight parties, and nobody in charge.",
          "Nothing about this is exotic. It is the typical case.",
        ],
      },
      {
        heading: "What unblocks it",
        paragraphs: [
          "The missing piece is coordination under one mandate. First, a diagnosis: what is blocking the home, what it is worth, and which documents exist. Then a roadmap reviewed by a lawyer before anyone sees it. Then an exclusive mandate, and a task force of lawyers, architects and surveyors that executes the plan in order.",
          "On the other side, investors need to see a deal with no surprises. They need the audit and the plan, without learning the address until negotiation, so the owner is protected and the process is not bypassed.",
        ],
      },
      {
        heading: "Where AI helps, and where it must not",
        paragraphs: [
          "AI is good at the busy work: an intake conversation in Portuguese or English, reading the property registry extract and the tax record, and scoring what is solvable. It must not make decisions about money or law. Scores, roadmaps and dossiers stay drafts until a person approves them. A low AI score is never turned into a \"no\" for the owner.",
          "That is the model behind Realization Portugal. The case study explains the owner and investor flows and the disclosure rules.",
        ],
      },
    ],
  },
  {
    slug: "making-hebrew-speech-recognition-production-safe",
    category: "AI in practice",
    title: "Making Hebrew speech recognition | production-safe",
    excerpt:
      "A 52-minute mixed-language meeting crashed our local model. | The fix was a routing policy, not a bigger server.",
    readTime: "4 min read",
    published: "Field note 09 · Sep 2026",
    date: "2026-09-29",
    icon: Cpu,
    sections: [
      {
        heading: "The short answer",
        paragraphs: [
          "Local, Hebrew-tuned speech recognition is accurate and private, but a CPU-only container cannot safely transcribe long recordings. The production-safe design routes each recording by language and length: short Hebrew meetings go to the local model, and long or mixed-language ones go to a cloud model. An automatic fallback surfaces a quality warning instead of failing silently.",
        ],
      },
      {
        heading: "Why run it locally at all",
        paragraphs: [
          "Most AI note-takers are English-first. Hebrew, and especially Hebrew mixed with English in the same sentence, degrades their transcripts. Names come out wrong, and right-to-left text is mangled.",
          "MeetSum, our meeting-intelligence platform, uses a Hebrew-tuned Whisper model (ivrit-ai) that runs on our own server. The recordings of client calls never leave infrastructure we control.",
        ],
      },
      {
        heading: "The incident",
        paragraphs: [
          "On 17 May 2026, a 52-minute Hebrew and English recording went through the local model. The model loaded in 13.7 seconds, then ran about ten minutes of CPU inference. The weights had been converted from float16 to float32 on a machine without a GPU, memory grew, and the process crashed inside the container.",
          "The meeting still completed, because the pipeline fell back to the cloud model automatically. More importantly, users saw that it had fallen back.",
        ],
      },
      {
        heading: "Why the fallback mattered more than the crash",
        paragraphs: [
          "Every stage of the pipeline records the provider, model, latency and confidence behind it. So the fallback was not a silent swap. It showed up as a quality warning on that meeting, and an operator could see exactly which engine produced the transcript.",
          "In an AI system, the dangerous failure is not the crash. It is the result that looks fine and was produced by something other than you think.",
        ],
      },
      {
        heading: "The fix: route by risk",
        paragraphs: [
          "Recordings under 15 minutes that are mostly Hebrew go to the local model. Anything longer, or clearly mixed-language, goes to the cloud model. Any failure falls back automatically, with a warning.",
          "The next step is chunking long recordings before local transcription, capping memory and shortening timeouts, so the fallback is fast rather than slow. A built-in word-error-rate harness compares engines on private Hebrew samples, so routing decisions rest on measurement rather than preference.",
        ],
      },
      {
        heading: "The general lesson",
        paragraphs: [
          "Multi-model systems need a written policy: which engine handles which job, what happens when it fails, and how that failure becomes visible. The MeetSum case study describes the full pipeline and its integrations.",
        ],
      },
    ],
  },
  {
    slug: "own-the-heart-local-first-ai-operations",
    category: "AI in practice",
    title: "Own the heart: | local-first AI operations",
    excerpt:
      "Models, runtimes and tools will keep changing. | Your business knowledge should not change hands with them.",
    readTime: "5 min read",
    published: "Field note 10 · Sep 2026",
    date: "2026-09-29",
    icon: Sparkles,
    sections: [
      {
        heading: "The short answer",
        paragraphs: [
          "An AI operation has one durable asset: the business's own knowledge, history and identity. Everything else changes fast, including the models, agent runtimes, channels and even the interface. So keep the durable part in plain files the business owns, and treat everything else as a swappable adapter. We call the durable part the heart.",
        ],
      },
      {
        heading: "Chatbots are not an operation",
        paragraphs: [
          "Most small and mid-size businesses adopted AI as a clever text box. Every chat starts from zero, so voice, clients and past decisions must be re-explained each time. The answers are one-shot, so nothing is followed through. And the knowledge ends up living inside a vendor, with no audit trail, no approval gates and no ownership.",
        ],
      },
      {
        heading: "Six problems stacked on each other",
        paragraphs: [
          "An \"AI employee\" is six hard problems, each depending on the one below: business knowledge that is structured and portable; memory that decides what to recall, when and how cheaply; model economics across several providers; orchestration of multi-step missions with handoffs and retries; security against prompt injection and leaked secrets; and governance over who may do what, with approval and audit.",
          "Get knowledge wrong and memory is noise. Get memory wrong and orchestration drifts. Skip governance and nobody can trust the output.",
        ],
      },
      {
        heading: "What the heart contains",
        paragraphs: [
          "In RealizeOS, the heart is three things. A knowledge base written in plain markdown that people can edit, organised into six layers: foundations, agents, domain knowledge, routines, insights and creations. An append-only event log of what acted, when and why. And identity files that give each agent a stable role and voice.",
          "Because it is plain text, the business can move it to a different model, runtime or vendor without losing anything.",
        ],
      },
      {
        heading: "Route by task, not by habit",
        paragraphs: [
          "Once knowledge is portable, model choice becomes an economic decision. Classify each task, then send it to the cheapest model that does it well: a fast model for lookups and formatting, a strong writing model for content, the most capable model for strategy, and a local model for sensitive data that must not leave the server.",
          "Cost is tracked per step, so the routing policy can be checked against real invoices.",
        ],
      },
      {
        heading: "Approval before anything consequential",
        paragraphs: [
          "Agents should act freely on bounded, reversible work and stop for approval on anything that moves money, sends email or changes records. Even the system's own background learning cycles propose updates into an inbox, and a person approves them before they become \"truth\".",
        ],
      },
      {
        heading: "Where to start",
        paragraphs: [
          "Start with the knowledge, not the agents. An orderly, owned knowledge base makes every later model better, and it survives every change of vendor. The RealizeOS case study shows the architecture we run our own operations on.",
        ],
      },
    ],
  },
  {
    slug: "five-hours-to-build-a-month-to-trust",
    category: "AI in practice",
    title: "Five hours to build. | A month to trust.",
    excerpt:
      "A tender agent is quick to build. | Earning the office's trust takes longer.",
    readTime: "2 min read",
    published: "Field note 12 · Oct 2026",
    date: "2026-10-02",
    icon: Cpu,
    sections: [
      {
        heading: "Why tenders first",
        paragraphs: [
          "Where should AI start in an architecture office? When we worked through that question with a practice, tender preparation came out on top.",
          "Public tenders are long and dense, yet they repeat the same structure every time: how price and quality are weighted, which site visits are mandatory, when the window for questions closes. Missing one of those details can cost the bid.",
          "Long text, a fixed structure and expensive mistakes are where a language model earns its place. On reading speed alone, no one in the office can compete with it.",
        ],
      },
      {
        heading: "What the build involves",
        paragraphs: [
          "The technical part is small. The PDFs are converted to text automatically, and the agent learns from the firm's past tenders and from the summary sheets the team already produced, in the format the team already uses.",
          "It is also allowed to ask. When a clause is ambiguous, it questions the reviewer rather than guessing.",
          "Our estimate for a working first version is around five hours. That is the easy part.",
        ],
      },
      {
        heading: "The trust phase",
        paragraphs: [
          "What does a demo leave out? The testing that comes after the build.",
          "The agent is tested on tenders it has never seen, and its output is compared with what an experienced person extracted from the same documents. Every miss becomes a correction.",
          "We set a threshold of above nine in ten right in testing before anyone relies on it, and we expect this phase to take weeks, under a month.",
          "If it holds, our estimate is that preparation drops to around a quarter of today's time. Until it is measured in the office, that stays an estimate.",
        ],
      },
      {
        heading: "Nothing is 100%",
        paragraphs: [
          "No agent will be right every time. When we said so to a practice's partners, one answered: that is true for us too.",
          "The fair comparison, then, is not a perfect machine. It is a person reading a long document against a deadline.",
          "So the reviewer's job changes rather than disappears: one experienced person checks and corrects the output, in a fraction of the time it took to produce it by hand.",
        ],
      },
      {
        heading: "What stays human",
        paragraphs: [
          "The go/no-go call stays with the person who has made it for years. The agent puts the facts in front of them faster, and the judgement is still theirs.",
          "So is the responsibility. A missed clause is still the office's missed clause, which is why the reviewer is not optional.",
        ],
      },
      {
        heading: "Build, don't buy",
        paragraphs: [
          "For this job we would not buy a product. It is too easy to build today, and too specific to each firm's documents and formats.",
          "Once it works, the same pattern extends to other long rulebooks, such as the requirements of a design-build project, as an assistant the team can question.",
          "To cut it short: five hours of building + under a month of testing + one experienced reviewer = an agent the office can rely on.",
          "One workflow, measured honestly, before the next.",
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
