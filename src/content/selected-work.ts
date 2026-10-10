import type { PillarSlug } from "./services";

type Image = { src: string; alt: string };

/**
 * Homepage "Selected work": one example per pillar, each with its strongest image. A
 * project from /work, or (for a pillar shown best by its method) a card for the service.
 * The full portfolio stays on /work. Swap an entry here when a stronger project arrives.
 */
export type SelectedItem =
  | { kind: "work"; slug: string; pillar: PillarSlug; dimension: string; image: Image }
  | { kind: "service"; title: string; text: string; status: string; href: string; pillar: PillarSlug; dimension: string; image: Image };

export const selectedWork: SelectedItem[] = [
  {
    kind: "work",
    slug: "arena-barreiro",
    pillar: "real-estate",
    dimension: "Places",
    image: {
      src: "/work/arena-barreiro/facade.webp",
      alt: "Architectural render of the Arena building: a five-storey facade with timber slats and planted balconies between two older houses in Barreiro",
    },
  },
  {
    kind: "work",
    slug: "realizeos",
    pillar: "ai-systems",
    dimension: "Systems",
    image: { src: "/media/venture-realizeos.webp", alt: "Operators connecting field equipment beside a tablet and process map" },
  },
  {
    kind: "service",
    title: "Team and process setup",
    text: "Clear roles, working processes | and a trained team, handed over | on a date agreed at the start.",
    status: "How we work",
    href: "/services/team-setup",
    pillar: "delivery",
    dimension: "Teams",
    image: {
      src: "/media/team-setup.webp",
      alt: "Hands arranging role cards for a project lead, architect, site coordinator, finance and sales around a workflow and a project timeline that ends in a handoff",
    },
  },
];
