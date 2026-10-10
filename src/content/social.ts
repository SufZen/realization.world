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
