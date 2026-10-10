/** Asaf's public channels, in the order of the email footer ("Follow us"). */
export type SocialNetwork = "linkedin" | "instagram" | "facebook" | "youtube" | "tiktok" | "x";

export const socialLinks: Array<{ network: SocialNetwork; label: string; href: string }> = [
  { network: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/sufzen" },
  { network: "instagram", label: "Instagram", href: "https://www.instagram.com/suf.zen" },
  { network: "facebook", label: "Facebook", href: "https://www.facebook.com/SufZen.World" },
  { network: "youtube", label: "YouTube", href: "https://www.youtube.com/channel/UC4iI6gWzbwtdd-z-O-Al_bQ" },
  { network: "tiktok", label: "TikTok", href: "https://www.tiktok.com/@suf.zen" },
  { network: "x", label: "X", href: "https://x.com/Suf_Zen" },
];
