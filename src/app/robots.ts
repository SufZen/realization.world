import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/site";

/**
 * AI search and assistant crawlers are welcomed explicitly: the goal of this site
 * is to be found, quoted and linked. /api/ and /thank-you stay out of indexes.
 */
const aiAgents = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
];

export default function robots(): MetadataRoute.Robots {
  const disallow = ["/api/", "/thank-you"];
  return {
    rules: [
      { userAgent: aiAgents, allow: ["/", "/llms.txt", "/llms-full.txt", "/api/public/", "/openapi.json"], disallow },
      { userAgent: "*", allow: "/", disallow },
    ],
    sitemap: [`${siteUrl}/sitemap.xml`, `${siteUrl}/livelab/sitemap.xml`],
    host: siteUrl,
  };
}
