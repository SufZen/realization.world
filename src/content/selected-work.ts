import type { PillarSlug } from "./services";

/**
 * Homepage "Selected work": one project per pillar, each with its strongest image.
 * The full portfolio stays on /work. Swap an entry here when a stronger project arrives.
 */
export const selectedWork: Array<{ slug: string; pillar: PillarSlug; dimension: string; image: { src: string; alt: string } }> = [
  {
    slug: "arena-barreiro",
    pillar: "real-estate",
    dimension: "Places",
    image: {
      src: "/work/arena-barreiro/facade.webp",
      alt: "Architectural render of the Arena building: a five-storey facade with timber slats and planted balconies between two older houses in Barreiro",
    },
  },
  {
    slug: "realizeos",
    pillar: "ai-systems",
    dimension: "Systems",
    image: { src: "/media/venture-realizeos.webp", alt: "Operators connecting field equipment beside a tablet and process map" },
  },
  {
    slug: "ai-adoption-architecture-firm",
    pillar: "delivery",
    dimension: "Teams",
    image: { src: "/media/venture-portugal.webp", alt: "Architectural plans and a house model on a drafting table" },
  },
];
