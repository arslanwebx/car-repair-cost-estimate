import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { articleWordCount, blogArticles, blogCategories, collectLinks, getBlogArticle } from "./index";

const expectedSlugs = [
  "how-to-assess-car-damage-after-a-minor-accident",
  "what-to-do-after-someone-dents-your-parked-car",
  "how-to-read-an-auto-body-repair-estimate-line-by-line",
  "how-to-negotiate-when-insurance-estimate-is-too-low",
  "how-to-decide-whether-to-repair-or-replace-a-damaged-bumper"
];

describe("Carspect blog content", () => {
  it("publishes the required unique article and category routes", () => {
    expect(blogArticles.map((article) => article.slug).sort()).toEqual(expectedSlugs.sort());
    expect(new Set(blogArticles.map((article) => article.slug)).size).toBe(blogArticles.length);
    expect(new Set(blogCategories.map((category) => category.slug)).size).toBe(blogCategories.length);
    const articleSlugs = new Set(blogArticles.map((article) => article.slug));
    for (const category of blogCategories) {
      const words = category.intro.trim().split(/\s+/).length;
      expect(words).toBeGreaterThanOrEqual(60);
      expect(words).toBeLessThanOrEqual(120);
      expect(blogArticles.some((article) => article.category.slug === category.slug)).toBe(true);
      expect(articleSlugs.has(category.slug)).toBe(false);
    }
  });

  it("keeps article metadata, length, FAQs, sources, and related guides complete", () => {
    for (const article of blogArticles) {
      expect(article.title).toBeTruthy();
      expect(article.seoTitle.length).toBeGreaterThanOrEqual(35);
      expect(article.seoTitle.length).toBeLessThanOrEqual(62);
      expect(article.description.length).toBeGreaterThanOrEqual(120);
      expect(article.description.length).toBeLessThanOrEqual(145);
      expect(article.imageAlt).toBeTruthy();
      expect(articleWordCount(article)).toBeGreaterThanOrEqual(1400);
      expect(articleWordCount(article)).toBeLessThanOrEqual(2300);
      expect(article.faqs.length).toBeGreaterThanOrEqual(4);
      expect(article.faqs.length).toBeLessThanOrEqual(6);
      expect(article.relatedSlugs.length).toBeGreaterThanOrEqual(2);
      expect(article.relatedSlugs.length).toBeLessThanOrEqual(3);
      expect(article.relatedSlugs).not.toContain(article.slug);
      article.relatedSlugs.forEach((slug) => expect(getBlogArticle(slug)).toBeTruthy());
      const links = collectLinks(article);
      const external = links.filter((href) => href.startsWith("https://"));
      expect(external.length).toBeGreaterThanOrEqual(2);
      expect(external.length).toBeLessThanOrEqual(3);
      expect(links).toContain("/");
      expect(links).toContain("/estimate");
      expect(links).toContain("/sample-estimates");
      expect(JSON.stringify(article)).not.toContain("—");
    }
  });

  it("uses distinct contextual homepage anchors near each introduction", () => {
    const anchors = blogArticles.map((article) => {
      const firstBlocks = JSON.stringify(article.blocks.slice(0, 3));
      const links = article.blocks.slice(0, 3).flatMap((block) => block.type === "paragraph" || block.type === "callout" ? block.content.filter((part) => part.href === "/") : []);
      expect(firstBlocks.split(/\s+/).length).toBeLessThan(350);
      expect(links).toHaveLength(1);
      return links[0].text;
    });
    expect(new Set(anchors).size).toBe(blogArticles.length);
  });

  it("ships optimized 1200 by 675 WebP article images", async () => {
    for (const article of blogArticles) {
      const file = path.join(process.cwd(), "public", article.image);
      const stat = fs.statSync(file);
      const metadata = await sharp(file).metadata();
      expect(metadata.format).toBe("webp");
      expect(metadata.width).toBe(1200);
      expect(metadata.height).toBe(675);
      expect(stat.size).toBeLessThanOrEqual(220 * 1024);
      expect(stat.size).toBeGreaterThanOrEqual(75 * 1024);
    }
  });

  it("includes every archive, category, and article in the sitemap", () => {
    const urls = new Set(sitemap().map((entry) => entry.url));
    expect(urls.has("https://carspect.pro/blog")).toBe(true);
    blogCategories.forEach((category) => {
      expect(urls.has(`https://carspect.pro/blog/${category.slug}`)).toBe(true);
      expect(urls.has(`https://carspect.pro/blog/category/${category.slug}`)).toBe(false);
    });
    blogArticles.forEach((article) => expect(urls.has(`https://carspect.pro/blog/${article.slug}`)).toBe(true));
  });
});
