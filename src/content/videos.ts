import type { PillarSlug } from "./services";

/**
 * Which pillar page shows which YouTube video (by video ID). Videos come from the
 * channel's feed (src/lib/youtube.ts); untagged ones still appear on Learn and the
 * homepage. Add a line here when a new video belongs on a pillar page.
 */
export const videoPillars: Record<string, PillarSlug> = {
  qPkljccmJ9g: "real-estate", // The yield in the listing is not your yield (Short, 9 Oct 2026)
  WWLFpApZfVk: "ai-systems", // Webinar 20.10 invite (Short, 8 Oct 2026)
};
