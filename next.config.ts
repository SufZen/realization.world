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
    // YouTube thumbnails for the video cards (src/lib/youtube.ts).
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" }],
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
      // Advisory became the Systems pillar of /services (Oct 2026). 301, not Next's default 308.
      { source: "/advisory", destination: "/services/ai-systems", statusCode: 301 },
      // The Teams pillar was renamed from "Delivery and team setup" (Oct 2026).
      { source: "/services/delivery", destination: "/services/team-setup", statusCode: 301 },
    ];
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
