import type { PillarSlug } from "./services";

type Image = { src: string; alt: string };

/**
 * Homepage "Selected work": documented work only, each with its strongest image (QA 9.11:
 * the team-setup offer was a service shown as evidence). Add a team case when one exists.
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
    dimension: "Property",
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
];
