/** YouTube channel "Suf Zen - Realization". */
export const youtubeChannelId = "UC4iI6gWzbwtdd-z-O-Al_bQ";
export const youtubeChannelUrl = `https://www.youtube.com/channel/${youtubeChannelId}`;

/** Listmonk's hosted signup page for list 6 "Realization updates" (public, double opt-in). */
export const newsletterUrl = "https://lists.realization.world/subscription/form";

/** The Portugal business communities Asaf runs on Facebook (members as of 10.10.2026). */
export const communities = [
  { label: "Business, Investments and Work in Portugal", lang: "en", members: 2500, href: "https://www.facebook.com/groups/businessinvestmentsandworkinportugal" },
  { label: "עבודה, השקעות ועסקים בפורטוגל", lang: "he", members: 9300, href: "https://www.facebook.com/groups/workandbuisnessinportugal" },
] as const;

/** Asaf's public channels, in the order of the email footer ("Follow us"). */
export type SocialNetwork = "linkedin" | "instagram" | "facebook" | "youtube" | "tiktok" | "x";

export const socialLinks: Array<{ network: SocialNetwork; label: string; href: string }> = [
  { network: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/sufzen" },
  { network: "instagram", label: "Instagram", href: "https://www.instagram.com/suf.zen" },
  { network: "facebook", label: "Facebook", href: "https://www.facebook.com/SufZen.World" },
  { network: "youtube", label: "YouTube", href: youtubeChannelUrl },
  { network: "tiktok", label: "TikTok", href: "https://www.tiktok.com/@suf.zen" },
  { network: "x", label: "X", href: "https://x.com/Suf_Zen" },
];

const hrefOf = (network: SocialNetwork) => socialLinks.find((link) => link.network === network)!.href;

/**
 * "Follow the work": the main channels only (TikTok and X stay in the footer row), each
 * with what people get there and the action, as a channel card. Order = priority.
 */
export const mainChannels: Array<{ id: SocialNetwork | "groups" | "email"; name: string; what: string; action: string; href: string; stat?: string }> = [
  { id: "youtube", name: "YouTube", what: "Short videos from real projects, in Hebrew and English.", action: "Subscribe", href: `${youtubeChannelUrl}?sub_confirmation=1` },
  { id: "linkedin", name: "LinkedIn", what: "Field notes, project updates and ideas, in English.", action: "Follow", href: hrefOf("linkedin") },
  { id: "groups", name: "Portugal business groups", what: "Work, investment and business in Portugal: questions, deals, people.", action: "Join", href: communities[1].href, stat: `${(communities[0].members + communities[1].members).toLocaleString("en-US")}+ members` },
  { id: "facebook", name: "Facebook", what: "Posts, reels and webinar news, in Hebrew.", action: "Follow", href: hrefOf("facebook") },
  { id: "instagram", name: "Instagram", what: "Reels from the work and the places.", action: "Follow", href: hrefOf("instagram") },
  { id: "email", name: "Realization updates", what: "Occasional email: new tools, case studies and events.", action: "Subscribe", href: newsletterUrl },
];
