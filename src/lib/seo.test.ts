import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { generateMetadata as generateBlogMetadata } from "@/app/blog/[slug]/page";
import { generateMetadata as generateSampleMetadata } from "@/app/sample-estimates/[slug]/page";
import sitemap from "@/app/sitemap";
import { CONTENT_DATES, SAMPLE_ESTIMATE_DATES } from "@/config/content-dates";
import { blogArticles, blogCategories } from "@/content/blog";
import { sampleEstimates } from "@/data/sample-estimates";
import { metadataFor, STATIC_PAGE_SEO } from "./seo";

type MetadataRecord = Record<string, unknown> & {
  title?: unknown;
  description?: unknown;
  alternates?: { canonical?: unknown };
  openGraph?: Record<string, unknown>;
  twitter?: Record<string, unknown>;
  robots?: unknown;
};

function expectCompleteMetadata(metadata: MetadataRecord, url: string) {
  expect(metadata.title).toBeTruthy();
  expect(metadata.description).toBeTruthy();
  expect(String(metadata.alternates?.canonical)).toBe(url);
  expect(metadata.openGraph?.title).toBeTruthy();
  expect(metadata.openGraph?.description).toBe(metadata.description);
  expect(String(metadata.openGraph?.url)).toBe(url);
  expect(metadata.openGraph?.type).toBeTruthy();
  expect(metadata.openGraph?.images).toBeTruthy();
  expect(metadata.twitter?.title).toBeTruthy();
  expect(metadata.twitter?.description).toBe(metadata.description);
  expect(metadata.twitter?.images).toBeTruthy();
}

describe("Carspect SEO metadata", () => {
  it("gives every canonical static route unique, complete metadata", () => {
    const titles = new Set<string>();
    const descriptions = new Set<string>();
    for (const key of Object.keys(STATIC_PAGE_SEO) as Array<keyof typeof STATIC_PAGE_SEO>) {
      const seo = STATIC_PAGE_SEO[key];
      const metadata = metadataFor(key) as MetadataRecord;
      expectCompleteMetadata(metadata, new URL(seo.path, "https://carspect.pro").toString());
      expect(seo.description.length).toBeGreaterThanOrEqual(100);
      expect(seo.description.length).toBeLessThanOrEqual(170);
      titles.add(seo.title);
      descriptions.add(seo.description);
    }
    expect(titles.size).toBe(Object.keys(STATIC_PAGE_SEO).length);
    expect(descriptions.size).toBe(Object.keys(STATIC_PAGE_SEO).length);
  });

  it("builds unique sample metadata from each vehicle and damage record", async () => {
    const descriptions = new Set<string>();
    for (const sample of sampleEstimates) {
      const url = `https://carspect.pro/sample-estimates/${sample.slug}`;
      const metadata = await generateSampleMetadata({ params: Promise.resolve({ slug: sample.slug }) }) as MetadataRecord;
      expectCompleteMetadata(metadata, url);
      expect(String(metadata.title)).toContain(`${sample.vehicle.year} ${sample.vehicle.make} ${sample.vehicle.model}`);
      expect(JSON.stringify(metadata.openGraph?.images)).toContain(sample.image);
      descriptions.add(String(metadata.description));
    }
    expect(descriptions.size).toBe(sampleEstimates.length);
  });

  it("builds complete article and category metadata at the clean blog URLs", async () => {
    for (const item of [...blogArticles, ...blogCategories]) {
      const metadata = await generateBlogMetadata({ params: Promise.resolve({ slug: item.slug }) }) as MetadataRecord;
      expectCompleteMetadata(metadata, `https://carspect.pro/blog/${item.slug}`);
    }
  });

  it("uses explicit, non-future sitemap dates and includes every useful route", () => {
    const entries = sitemap();
    const today = new Date().toISOString().slice(0, 10);
    const urls = new Set(entries.map((entry) => entry.url));
    expect(entries).toHaveLength(urls.size);
    expect(new Set(entries.map((entry) => String(entry.lastModified))).size).toBeGreaterThan(1);
    for (const entry of entries) {
      const date = String(entry.lastModified).slice(0, 10);
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(date <= today).toBe(true);
      expect(entry.changeFrequency).toBeUndefined();
      expect(entry.priority).toBeUndefined();
    }
    for (const seo of Object.values(STATIC_PAGE_SEO).filter((seo) => seo.path !== "/estimate")) {
      expect(urls.has(new URL(seo.path, "https://carspect.pro").toString())).toBe(true);
    }
    expect(urls.has("https://carspect.pro/estimate")).toBe(false);
    expect((metadataFor("estimate") as MetadataRecord).robots).toEqual({ index: false, follow: true });
  });

  it("keeps source dates centralized and sample schemas free of commercial-review types", () => {
    expect(Object.values(CONTENT_DATES).every(Boolean)).toBe(true);
    expect(Object.keys(SAMPLE_ESTIMATE_DATES).sort()).toEqual(sampleEstimates.map((sample) => sample.slug).sort());
    const source = fs.readFileSync(path.join(process.cwd(), "src/app/sample-estimates/[slug]/page.tsx"), "utf8");
    for (const forbidden of ['"Product"', '"Offer"', '"Review"', '"AggregateRating"']) expect(source).not.toContain(forbidden);
  });
});
