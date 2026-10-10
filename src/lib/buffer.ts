/**
 * Latest published posts from Buffer (Asaf's Facebook page, LinkedIn and X), read on the
 * server with a personal Buffer API key (publish.buffer.com → Settings → API). Without
 * BUFFER_API_KEY this returns nothing and the site shows YouTube videos only.
 * Pages that use it regenerate hourly; posts appear without a deploy.
 */

export type SocialPost = {
  id: string;
  network: "facebook" | "linkedin" | "twitter" | string;
  text: string;
  /** ISO date. */
  published: string;
  url: string;
  thumbnail?: string;
};

/** Buffer organization "My Organization" (info@realization.co.il). Not a secret. */
const ORGANIZATION_ID = "69b35e93873101ae3b28fa17";

const QUERY = `query Latest($org: OrganizationId!, $first: Int!) {
  posts(first: $first, input: { organizationId: $org, filter: { status: [sent] }, sort: [{ field: dueAt, direction: desc }] }) {
    edges { node { id text sentAt channelService externalLink channel { externalLink } assets { thumbnail } } }
  }
}`;

type Node = {
  id: string;
  text: string;
  sentAt: string | null;
  channelService: string;
  externalLink: string | null;
  channel: { externalLink: string | null } | null;
  assets: Array<{ thumbnail: string }>;
};

export async function latestPosts(limit = 6): Promise<SocialPost[]> {
  const key = process.env.BUFFER_API_KEY;
  if (!key) return [];
  try {
    const response = await fetch(process.env.BUFFER_API_URL || "https://api.buffer.com", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}`, "User-Agent": "realization.world" },
      body: JSON.stringify({ query: QUERY, variables: { org: ORGANIZATION_ID, first: limit * 3 } }),
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(6000),
    });
    if (!response.ok) return [];
    const json = (await response.json()) as { data?: { posts?: { edges?: Array<{ node: Node }> } } };
    const posts: SocialPost[] = [];
    for (const { node } of json.data?.posts?.edges ?? []) {
      const url = node.externalLink || node.channel?.externalLink;
      if (!url || !node.sentAt || !node.text.trim()) continue;
      posts.push({ id: node.id, network: node.channelService, text: node.text.trim(), published: node.sentAt, url, thumbnail: node.assets[0]?.thumbnail });
    }
    return posts;
  } catch {
    return [];
  }
}
