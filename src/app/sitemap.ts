import type { MetadataRoute } from "next";
import { CONTENT_DATES, SAMPLE_ESTIMATE_DATES } from "@/config/content-dates";
import { blogArticles, blogCategories } from "@/content/blog";
import { sampleEstimates } from "@/data/sample-estimates";
import { SITE_URL, STATIC_PAGE_SEO } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = (Object.keys(STATIC_PAGE_SEO) as Array<keyof typeof STATIC_PAGE_SEO>).map((key) => ({
    url: new URL(STATIC_PAGE_SEO[key].path, SITE_URL).toString(),
    lastModified: CONTENT_DATES[key]
  }));
  const sampleEntries: MetadataRoute.Sitemap = sampleEstimates.map((sample) => ({
    url: new URL(`/sample-estimates/${sample.slug}`, SITE_URL).toString(),
    lastModified: SAMPLE_ESTIMATE_DATES[sample.slug]
  }));
  const categoryEntries: MetadataRoute.Sitemap = blogCategories.map((category) => ({
    url: new URL(`/blog/${category.slug}`, SITE_URL).toString(),
    lastModified: CONTENT_DATES.blogCategories
  }));
  const articleEntries: MetadataRoute.Sitemap = blogArticles.map((article) => ({
    url: new URL(`/blog/${article.slug}`, SITE_URL).toString(),
    lastModified: article.modified
  }));
  return [...staticEntries, ...sampleEntries, ...categoryEntries, ...articleEntries];
}
