import type { NextConfig } from "next";

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
    return [{ source: "/asaf", destination: "/asaf/index.html" }];
  },
  async redirects() {
    return [
      { source: "/markets/spain", destination: "/markets", permanent: false },
      // The portfolio moved from /ventures to /work (Sep 2026).
      { source: "/ventures", destination: "/work", permanent: true },
      { source: "/ventures/:slug", destination: "/work/:slug", permanent: true },
    ];
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
