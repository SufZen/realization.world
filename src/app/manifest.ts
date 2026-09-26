import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Realization — Real estate, ventures and systems",
    short_name: "Realization",
    description: "Realizing untapped potential in the physical world.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#FDCC33",
    icons: [{ src: "/brand/butterfly-square-yellow.png", sizes: "1917x1919", type: "image/png" }],
  };
}
