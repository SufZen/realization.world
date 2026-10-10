/**
 * Posts the content engine has published (LinkedIn, Facebook, Instagram, TikTok, X), read
 * from a small JSON file the engine keeps on the public `content-media` branch. Until that
 * file exists this returns nothing. No keys, no paid API plan.
 *
 * Format agreed for the engine (newest first, up to ~50 entries):
 *   [{ "network": "linkedin" | "facebook" | "instagram" | "tiktok" | "x" | "youtube",
 *      "url": "https://…the published post…",
 *      "text": "the post's opening lines or the video title",
 *      "date": "2026-10-21T07:47:00Z",
 *      "thumbnail": "https://…" (optional),
 *      "pillar": "real-estate" | "ai-systems" | "delivery" (optional) }]
 */

export type EnginePost = { network: string; url: string; text: string; date: string; thumbnail?: string; pillar?: string };

const FEED_URL = "https://raw.githubusercontent.com/SufZen/realization.world/content-media/feed.json";

const isHttps = (value: unknown): value is string => typeof value === "string" && value.startsWith("https://");

export async function enginePosts(limit = 12): Promise<EnginePost[]> {
  try {
    const response = await fetch(FEED_URL, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(5000) });
    if (!response.ok) return [];
    const data: unknown = await response.json();
    if (!Array.isArray(data)) return [];
    return data
      .filter((item): item is EnginePost => Boolean(item) && typeof item.network === "string" && isHttps(item.url) && typeof item.text === "string" && !Number.isNaN(Date.parse(item.date)))
      .map((item) => ({ ...item, network: item.network === "x" ? "twitter" : item.network, thumbnail: isHttps(item.thumbnail) ? item.thumbnail : undefined }))
      .slice(0, limit);
  } catch {
    return [];
  }
}
