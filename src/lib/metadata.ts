import type { Metadata } from "next";
import { plain } from "@/components/lines";
import { siteUrl } from "@/content/site";

export function pageMetadata(rawTitle: string, rawDescription: string, path: string): Metadata {
  const title = plain(rawTitle);
  const description = plain(rawDescription);
  const url = `${siteUrl}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Realization",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
