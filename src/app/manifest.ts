import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Realization — Real estate, ventures and systems",
    short_name: "Realization",
    description: "Real estate in Portugal, and the ventures and AI systems around it.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#FDCC33",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
