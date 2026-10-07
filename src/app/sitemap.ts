import type { MetadataRoute } from "next";
import { insights, markets, partnerPaths, siteUrl } from "@/content/site";
import { work } from "@/content/work";

/** Date of the last site-wide content revision; bump when static pages change. */
const siteUpdated = "2026-09-28";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/work",
    "/advisory",
    "/partners",
    "/insights",
    "/about",
    "/thesis",
    "/how-we-build",
    "/markets",
    "/bring-an-opportunity",
    "/webinar",
    "/asaf",
    "/privacy",
    "/legal",
  ];
  const entries: Array<[string, string]> = [
    ...staticRoutes.map((route): [string, string] => [route, siteUpdated]),
    ...work.map((item): [string, string] => [`/work/${item.slug}`, item.updated]),
    ...partnerPaths.map((path): [string, string] => [`/partners/${path.slug}`, siteUpdated]),
    ...markets.map((market): [string, string] => [`/markets/${market.slug}`, siteUpdated]),
    ...insights.map((insight): [string, string] => [`/insights/${insight.slug}`, insight.date]),
  ];
  return entries.map(([route, lastModified]) => ({
    url: `${siteUrl}${route}`,
    lastModified,
    changeFrequency: route.startsWith("/insights/") ? "monthly" : "weekly",
    priority: route === "" ? 1 : ["/work", "/advisory"].includes(route) || route.startsWith("/work/") ? 0.9 : route.split("/").length === 2 ? 0.7 : 0.6,
  }));
}
