import { latestPosts } from "@/lib/buffer";
import { latestVideos } from "@/lib/youtube";

/** One stream of everything published lately: YouTube videos and Buffer posts, newest first. */
export type FeedItem = {
  id: string;
  network: string;
  text: string;
  published: string;
  url: string;
  thumbnail?: string;
  /** YouTube Shorts and videos are shown with a play button. */
  video?: boolean;
};

/**
 * The same piece often goes out on several networks (a Short, a reel, a post): match on
 * the opening words, letters and digits only, and keep the first one in priority order.
 */
const signature = (text: string) => text.replace(/https?:\/\/\S+/g, "").replace(/[^\p{L}\p{N}]+/gu, "").slice(0, 24).toLowerCase();

export async function latestFeed(limit = 6): Promise<FeedItem[]> {
  const [videos, posts] = await Promise.all([latestVideos(limit), latestPosts(limit * 3)]);
  const items: FeedItem[] = [
    ...videos.map((video) => ({ id: `yt-${video.id}`, network: "youtube", text: video.title, published: video.published, url: video.url, thumbnail: video.thumbnail, video: true })),
    ...posts.map((post) => ({ id: `buffer-${post.id}`, network: post.network, text: post.text, published: post.published, url: post.url, thumbnail: post.thumbnail })),
  ];
  // Priority when the same piece is on several networks: YouTube (the video), then LinkedIn, Facebook, X.
  const rank: Record<string, number> = { youtube: 0, linkedin: 1, facebook: 2, twitter: 3 };
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
