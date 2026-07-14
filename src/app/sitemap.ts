import type { MetadataRoute } from "next";
import { blogArticles, blogCategories } from "@/content/blog";
import { sampleEstimates } from "@/data/sample-estimates";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://carspect.pro";
  const staticPaths = ["", "/estimate", "/sample-estimates", ...sampleEstimates.map((sample) => `/sample-estimates/${sample.slug}`), "/about-us", "/contact-us", "/privacy-policy", "/terms-of-service", "/disclaimer", "/cookie-policy", "/photo-data-policy", "/editorial-policy"];
  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({ url: base + path, lastModified: new Date("2026-07-14"), changeFrequency: path === "" ? "weekly" : "monthly", priority: path === "" ? 1 : path === "/estimate" ? .9 : .6 }));
  const blogEntries: MetadataRoute.Sitemap = [
    { url: `${base}/blog`, lastModified: new Date("2026-07-14"), changeFrequency: "weekly", priority: .8 },
    ...blogCategories.map((category) => ({ url: `${base}/blog/category/${category.slug}`, lastModified: new Date("2026-07-14"), changeFrequency: "monthly" as const, priority: .65 })),
    ...blogArticles.map((article) => ({ url: `${base}/blog/${article.slug}`, lastModified: new Date(article.modified), changeFrequency: "monthly" as const, priority: .75 }))
  ];
  return [...staticEntries, ...blogEntries];
}
