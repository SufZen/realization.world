import type { NextConfig } from "next";
import { securityHeaders } from "./src/lib/security-headers";

// Internal URL of the self-hosted Umami container (docker network), set at build time.
// Its tracker and collection endpoint are served first-party under /stats.
const umamiTarget = process.env.UMAMI_PROXY_TARGET;

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["localhost", "127.0.0.1"],
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    deviceSizes: [640, 750, 1080, 1440, 1920],
  },
  poweredByHeader: false,
  // Static founder profile (public/asaf) served at /asaf; linked from every CV.
  async rewrites() {
    return [
      { source: "/asaf", destination: "/asaf/index.html" },
      // Plain-markdown twins of case studies and field notes, for LLMs and agents.
      { source: "/work/:slug.md", destination: "/md/work/:slug" },
      { source: "/insights/:slug.md", destination: "/md/insights/:slug" },
      ...(umamiTarget
        ? [
            { source: "/stats/script.js", destination: `${umamiTarget}/script.js` },
            { source: "/stats/api/send", destination: `${umamiTarget}/api/send` },
          ]
        : []),
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      { source: "/markets/spain", destination: "/markets", permanent: false },
      // The portfolio moved from /ventures to /work (Sep 2026).
      { source: "/ventures", destination: "/work", permanent: true },
      { source: "/ventures/:slug", destination: "/work/:slug", permanent: true },
      // Lifebook's second generation is Dreamward (Sep 2026).
      { source: "/work/lifebook", destination: "/work/dreamward", permanent: true },
      { source: "/work/lifebook.md", destination: "/work/dreamward.md", permanent: true },
    ];
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
