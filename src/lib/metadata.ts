import type { Metadata } from "next";
import { plain } from "@/components/lines";
import { siteUrl } from "@/content/site";

type PageMetadataOptions = {
  /** Open Graph type. Articles also get published/modified times. */
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  /** Path of a plain-markdown twin of this page (for AI agents and LLMs). */
  markdownPath?: string;
  /** Path of this page's share image; defaults to the site-wide card. */
  imagePath?: string;
};

export function pageMetadata(rawTitle: string, rawDescription: string, path: string, options: PageMetadataOptions = {}): Metadata {
  const title = plain(rawTitle);
  const description = plain(rawDescription);
  const url = `${siteUrl}${path}`;
  const { type = "website", publishedTime, modifiedTime, markdownPath, imagePath = "/opengraph-image" } = options;
  const images = [{ url: `${siteUrl}${imagePath}`, width: 1200, height: 630, alt: title }];
  return {
    title,
    description,
    alternates: {
      canonical: url,
      ...(markdownPath ? { types: { "text/markdown": `${siteUrl}${markdownPath}` } } : {}),
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Realization",
      locale: "en",
      images,
      ...(type === "article"
        ? { type: "article", publishedTime, modifiedTime: modifiedTime ?? publishedTime, authors: [`${siteUrl}/asaf`] }
        : { type: "website" }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
}
