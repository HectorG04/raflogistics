import type { MetadataRoute } from "next";
import { posts } from "@/lib/site-content";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://raffreightlogistics.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/about",
    "/auto-transport",
    "/freight",
    "/carriers",
    "/contact",
    "/blog",
  ].map((route) => ({
    url: `${BASE}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const blogRoutes = (await posts()).map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: p.published_at ? new Date(p.published_at) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes];
}
