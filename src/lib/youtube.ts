import { youtubeChannelId } from "@/content/social";

/**
 * Latest videos from the YouTube channel, read from its public RSS feed (no API key).
 * The feed lists the 15 newest uploads. Pages that show videos regenerate every few
 * hours, so new uploads appear without a deploy. Any failure returns an empty list and
 * the video sections simply don't render.
 */

export type Video = {
  id: string;
  title: string;
  /** ISO date. */
  published: string;
  short: boolean;
  url: string;
  thumbnail: string;
};

const FEED = `https://www.youtube.com/feeds/videos.xml?channel_id=${youtubeChannelId}`;

const entities: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };
const decode = (text: string) =>
  text.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (match, code: string) => {
    if (code[0] === "#") return String.fromCodePoint(code[1] === "x" || code[1] === "X" ? parseInt(code.slice(2), 16) : Number(code.slice(1)));
    return entities[code] ?? match;
  });

const field = (entry: string, pattern: RegExp) => entry.match(pattern)?.[1] ?? "";

export function parseFeed(xml: string): Video[] {
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)]
    .map(([, entry]) => {
      const id = field(entry, /<yt:videoId>([\w-]+)<\/yt:videoId>/);
      const short = /\/shorts\//.test(field(entry, /<link rel="alternate" href="([^"]+)"/));
      return {
        id,
        title: decode(field(entry, /<title>([\s\S]*?)<\/title>/)).trim(),
        published: field(entry, /<published>([^<]+)<\/published>/),
        short,
        url: short ? `https://www.youtube.com/shorts/${id}` : `https://www.youtube.com/watch?v=${id}`,
        thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      };
    })
    .filter((video) => video.id && video.title);
}

export async function latestVideos(limit = 6): Promise<Video[]> {
  try {
    const response = await fetch(FEED, { next: { revalidate: 21600 }, signal: AbortSignal.timeout(6000) });
    if (!response.ok) return [];
    return parseFeed(await response.text()).slice(0, limit);
  } catch {
    return [];
  }
}
