const origin = process.env.SEO_VALIDATE_ORIGIN ?? "http://127.0.0.1:3015";
const productionOrigin = "https://carspect.pro";

const decode = (value = "") => value
  .replaceAll("&amp;", "&")
  .replaceAll("&quot;", '"')
  .replaceAll("&#x27;", "'")
  .replaceAll("&#39;", "'")
  .replaceAll("&lt;", "<")
  .replaceAll("&gt;", ">");

function attrs(tag) {
  return Object.fromEntries([...tag.matchAll(/([^\s=]+)=["']([^"']*)["']/g)].map((match) => [match[1], decode(match[2])]));
}

function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))].map((match) => attrs(match[0]));
}

function meta(html, key, value) {
  return tags(html, "meta").find((item) => item[key] === value)?.content;
}

function fail(message) {
  throw new Error(message);
}

const normalizedUrl = (value) => new URL(value).toString().replace(/\/$/, "");

const sitemapResponse = await fetch(`${origin}/sitemap.xml`);
if (!sitemapResponse.ok) fail(`Sitemap returned ${sitemapResponse.status}`);
const sitemapXml = await sitemapResponse.text();
const sitemapEntries = [...sitemapXml.matchAll(/<url>\s*<loc>(.*?)<\/loc>\s*<lastmod>(.*?)<\/lastmod>\s*<\/url>/g)].map((match) => ({ url: decode(match[1]), lastmod: match[2] }));
if (!sitemapEntries.length) fail("Sitemap contains no URLs");

const titles = new Map();
const descriptions = new Map();
const internalPaths = new Set();
const today = new Date().toISOString().slice(0, 10);

for (const entry of sitemapEntries) {
  if (entry.lastmod > today) fail(`${entry.url} has future lastmod ${entry.lastmod}`);
  const productionUrl = new URL(entry.url);
  const localUrl = `${origin}${productionUrl.pathname}`;
  const response = await fetch(localUrl);
  if (!response.ok) fail(`${entry.url} returned ${response.status}`);
  const html = await response.text();
  const title = decode(html.match(/<title>(.*?)<\/title>/i)?.[1]);
  const description = meta(html, "name", "description");
  const canonical = tags(html, "link").find((item) => item.rel === "canonical")?.href;
  const ogTitle = meta(html, "property", "og:title");
  const ogDescription = meta(html, "property", "og:description");
  const ogUrl = meta(html, "property", "og:url");
  const ogType = meta(html, "property", "og:type");
  const ogImage = meta(html, "property", "og:image");
  const twitterTitle = meta(html, "name", "twitter:title");
  const twitterDescription = meta(html, "name", "twitter:description");
  const twitterImage = meta(html, "name", "twitter:image");
  const robots = meta(html, "name", "robots") ?? "";
  const h1Count = (html.match(/<h1\b/gi) ?? []).length;

  for (const [name, value] of Object.entries({ title, description, canonical, ogTitle, ogDescription, ogUrl, ogType, ogImage, twitterTitle, twitterDescription, twitterImage })) {
    if (!value) fail(`${entry.url} is missing ${name}`);
  }
  if (normalizedUrl(canonical) !== normalizedUrl(entry.url)) fail(`${entry.url} canonical is ${canonical}`);
  if (normalizedUrl(ogUrl) !== normalizedUrl(entry.url)) fail(`${entry.url} og:url is ${ogUrl}`);
  if (description !== ogDescription || description !== twitterDescription) fail(`${entry.url} has inconsistent descriptions`);
  if (/noindex/i.test(robots)) fail(`${entry.url} contains noindex`);
  if (h1Count !== 1) fail(`${entry.url} contains ${h1Count} H1 elements`);
  if (titles.has(title)) fail(`${entry.url} duplicates title from ${titles.get(title)}`);
  if (descriptions.has(description)) fail(`${entry.url} duplicates description from ${descriptions.get(description)}`);
  titles.set(title, entry.url);
  descriptions.set(description, entry.url);

  const jsonLdScripts = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const parsedJsonLd = [];
  for (const match of jsonLdScripts) {
    try { parsedJsonLd.push(JSON.parse(match[1])); } catch (error) { fail(`${entry.url} contains invalid JSON-LD: ${error.message}`); }
  }
  const schemaNodes = parsedJsonLd.flatMap((value) => value?.["@graph"] ?? [value]);
  for (const faqPage of schemaNodes.filter((value) => value?.["@type"] === "FAQPage")) {
    const visibleHtml = decode(html);
    for (const faq of faqPage.mainEntity ?? []) {
      if (!visibleHtml.includes(faq.name) || !visibleHtml.includes(faq.acceptedAnswer?.text)) fail(`${entry.url} FAQ schema does not match visible content`);
    }
  }
  if (productionUrl.pathname.startsWith("/sample-estimates/")) {
    const schema = jsonLdScripts.map((match) => match[1]).join(" ");
    for (const forbidden of ['"Product"', '"Offer"', '"Review"', '"AggregateRating"']) {
      if (schema.includes(forbidden)) fail(`${entry.url} contains forbidden sample schema ${forbidden}`);
    }
  }
  if (productionUrl.pathname.startsWith("/blog/") && jsonLdScripts.some((match) => match[1].includes('"@type":"BlogPosting","@id"'))) {
    const schema = jsonLdScripts.map((match) => match[1]).join(" ");
    if (!schema.includes('"name":"Roman E."') || !schema.includes(`${productionOrigin}/authors/roman-e`)) fail(`${entry.url} has inconsistent author schema`);
    if (!html.includes('href="/authors/roman-e"') || !html.includes("By ")) fail(`${entry.url} is missing the linked Roman E. byline`);
    const posting = schemaNodes.find((value) => value?.["@type"] === "BlogPosting");
    const hasVisibleDate = html.includes(`datetime="${entry.lastmod}"`) || html.includes(`dateTime="${entry.lastmod}"`);
    if (posting?.dateModified !== entry.lastmod || !hasVisibleDate) fail(`${entry.url} article dates disagree with the sitemap or visible date`);
  }
  for (const anchor of tags(html, "a")) {
    if (anchor.href?.startsWith("/") && !anchor.href.startsWith("/api/") && !anchor.href.startsWith("/_next/")) internalPaths.add(anchor.href.split("#")[0]);
  }
}

for (const path of internalPaths) {
  const response = await fetch(`${origin}${path}`, { redirect: "manual" });
  if (response.status >= 400) fail(`Internal link ${path} returned ${response.status}`);
}

console.log(`SEO validation passed: ${sitemapEntries.length} indexable URLs, ${internalPaths.size} internal destinations, unique titles and descriptions.`);
