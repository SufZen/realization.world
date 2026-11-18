import { englishSubtitled } from "@/content/videos";
import { latestPosts } from "@/lib/buffer";
import { enginePosts } from "@/lib/engine-feed";
import { latestVideos } from "@/lib/youtube";

/**
 * One stream of everything published lately, newest first: YouTube videos (RSS), posts the
 * content engine lists in its feed file, and Buffer posts (only when BUFFER_API_KEY is set).
 */
export type FeedItem = {
  id: string;
  network: string;
  text: string;
  published: string;
  url: string;
  thumbnail?: string;
  /** YouTube Shorts and videos are shown with a play button. */
  video?: boolean;
  /** A Hebrew video with English subtitles, shown on an English page with a label. */
  subtitled?: boolean;
};

/** The language a page is written in; the feed and video blocks only show items in it. */
export type PageLang = "en" | "he";

const HEBREW = /\p{Script=Hebrew}/u;
export const isHebrew = (text: string) => HEBREW.test(text);

/**
 * Whether an item fits a page in `lang`. Hebrew pages show Hebrew items. English pages show
 * non-Hebrew items, plus Hebrew videos listed as English-subtitled (src/content/videos.ts).
 */
export function fitsLanguage(text: string, lang: PageLang, videoId?: string) {
  if (lang === "he") return isHebrew(text);
  return !isHebrew(text) || (videoId !== undefined && englishSubtitled.has(videoId));
}

/**
 * The same piece often goes out on several networks (a Short, a reel, a post): match on
 * the opening words, letters and digits only, and keep the first one in priority order.
 */
const signature = (text: string) => text.replace(/https?:\/\/\S+/g, "").replace(/[^\p{L}\p{N}]+/gu, "").slice(0, 24).toLowerCase();

export async function latestFeed(limit = 6, lang: PageLang = "en"): Promise<FeedItem[]> {
  // The whole RSS feed (15 videos): filtering by language can drop many of them.
  const [videos, engine, posts] = await Promise.all([latestVideos(15), enginePosts(limit * 3), latestPosts(limit * 3)]);
  const items: FeedItem[] = [
    ...videos
      .filter((video) => fitsLanguage(video.title, lang, video.id))
      .map((video) => ({ id: `yt-${video.id}`, network: "youtube", text: video.title, published: video.published, url: video.url, thumbnail: video.thumbnail, video: true, subtitled: lang === "en" && isHebrew(video.title) })),
    ...engine.filter((post) => fitsLanguage(post.text, lang)).map((post) => ({ id: `engine-${post.url}`, network: post.network, text: post.text, published: post.date, url: post.url, thumbnail: post.thumbnail, video: post.network === "youtube" })),
    ...posts.filter((post) => fitsLanguage(post.text, lang)).map((post) => ({ id: `buffer-${post.id}`, network: post.network, text: post.text, published: post.published, url: post.url, thumbnail: post.thumbnail })),
  ];
  // Priority when the same piece is on several networks: YouTube (the video), then LinkedIn, Instagram, Facebook, TikTok, X.
  const rank: Record<string, number> = { youtube: 0, linkedin: 1, instagram: 2, facebook: 3, tiktok: 4, twitter: 5 };
  const seen = new Set<string>();
  const unique = [...items]
    .sort((a, b) => (rank[a.network] ?? 9) - (rank[b.network] ?? 9))
    .filter((item) => {
      const key = signature(item.text);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  return unique.sort((a, b) => b.published.localeCompare(a.published)).slice(0, limit);
}
