import type { MetadataRoute } from "next";
import { insights, markets, partnerPaths, siteUrl, ventures } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/thesis",
    "/how-we-build",
    "/ventures",
    "/partners",
    "/markets",
    "/insights",
    "/about",
    "/bring-an-opportunity",
    "/asaf",
  ];
  const routes = [
    ...staticRoutes,
    ...ventures.map((venture) => `/ventures/${venture.slug}`),
    ...partnerPaths.map((path) => `/partners/${path.slug}`),
    ...markets.map((market) => `/markets/${market.slug}`),
    ...insights.map((insight) => `/insights/${insight.slug}`),
  ];
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: route.startsWith("/insights/") ? "monthly" : "weekly",
    priority: route === "" ? 1 : route.split("/").length === 2 ? 0.8 : 0.7,
  }));
}
