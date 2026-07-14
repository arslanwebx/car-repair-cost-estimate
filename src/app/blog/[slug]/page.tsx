import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleContent } from "@/components/blog/article-content";
import { BlogArticleCard } from "@/components/blog/article-card";
import { CONTENT_DATES } from "@/config/content-dates";
import { articleReadingTime, blogArticles, blogCategories, getArticlesByCategory, getBlogArticle, getBlogCategory } from "@/content/blog";
import { absoluteUrl, AUTHOR_ID, AUTHOR_NAME, AUTHOR_PATH, createPageMetadata, ORGANIZATION_ID, organizationJsonLd, safeJsonLd, SITE_URL, WEBSITE_ID } from "@/lib/seo";

export function generateStaticParams() {
  return [...blogArticles.map((article) => ({ slug: article.slug })), ...blogCategories.map((category) => ({ slug: category.slug }))];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getBlogArticle(slug);
  if (article) {
    const url = `/blog/${article.slug}`;
    const base = createPageMetadata({ title: article.seoTitle, description: article.description, path: url, type: "article", image: article.image, imageAlt: article.imageAlt });
    return { ...base, openGraph: { ...base.openGraph, type: "article", publishedTime: article.published, modifiedTime: article.modified, authors: [AUTHOR_NAME], section: article.category.name, tags: article.tags } };
  }
  const category = getBlogCategory(slug);
  if (category) {
    const title = `${category.name} Guides`;
    const url = `/blog/${category.slug}`;
    return createPageMetadata({ title, description: category.description, path: url });
  }
  return {};
}

export default async function BlogSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getBlogCategory(slug);
  if (category) {
    const articles = getArticlesByCategory(category.slug);
    const categoryUrl = absoluteUrl(`/blog/${category.slug}`);
    const breadcrumbJsonLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog") }, { "@type": "ListItem", position: 3, name: category.name, item: categoryUrl }] };
    const collectionJsonLd = { "@context": "https://schema.org", "@type": "CollectionPage", "@id": `${categoryUrl}#collection`, name: `${category.name} Guides`, description: category.description, url: categoryUrl, dateModified: CONTENT_DATES.blogCategories, isPartOf: { "@id": WEBSITE_ID }, hasPart: articles.map((article) => ({ "@type": "BlogPosting", headline: article.title, url: absoluteUrl(`/blog/${article.slug}`) })) };
    return <div className="blog-page"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }}/><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(collectionJsonLd) }}/><header className="blog-archive-header"><div className="shell narrow"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/blog">Blog</Link><span>/</span><span aria-current="page">{category.name}</span></nav><h1>{category.name} Guides</h1><p>{category.intro}</p></div></header><section className="section blog-list-section"><div className="shell"><div className="blog-grid">{articles.map((article) => <BlogArticleCard key={article.slug} article={article}/>)}</div></div></section></div>;
  }

  const article = getBlogArticle(slug);
  if (!article) notFound();
  const articleUrl = absoluteUrl(`/blog/${article.slug}`);
  const categoryUrl = absoluteUrl(`/blog/${article.category.slug}`);
  const related = article.relatedSlugs.map(getBlogArticle).filter((item): item is NonNullable<typeof item> => Boolean(item));
  const articleJsonLd = { "@context": "https://schema.org", "@type": "BlogPosting", "@id": `${articleUrl}#article`, headline: article.title, description: article.description, image: [{ "@type": "ImageObject", url: absoluteUrl(article.image), caption: article.imageAlt }], datePublished: article.published, dateModified: article.modified, mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl }, author: { "@type": "Person", "@id": AUTHOR_ID, name: AUTHOR_NAME, url: absoluteUrl(AUTHOR_PATH) }, publisher: { "@id": ORGANIZATION_ID }, isPartOf: { "@id": WEBSITE_ID }, articleSection: article.category.name, keywords: article.tags.join(", ") };
  const organizationData = { "@context": "https://schema.org", ...organizationJsonLd() };
  const breadcrumbJsonLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog") }, { "@type": "ListItem", position: 3, name: article.category.name, item: categoryUrl }, { "@type": "ListItem", position: 4, name: article.title, item: articleUrl }] };
  const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: article.faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) };
  const publishedDate = new Date(article.published).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
  const modifiedDate = new Date(article.modified).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
  return <article className="article-page">
    {[articleJsonLd, organizationData, breadcrumbJsonLd, faqJsonLd].map((value, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(value) }}/>) }
    <header className="article-header shell narrow"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/blog">Blog</Link><span>/</span><Link href={`/blog/${article.category.slug}`}>{article.category.name}</Link></nav><h1>{article.title}</h1><p className="article-deck">{article.excerpt}</p><div className="article-byline"><span>By <Link href={AUTHOR_PATH}>{AUTHOR_NAME}</Link></span><span>Published <time dateTime={article.published}>{publishedDate}</time></span>{modifiedDate !== publishedDate && <span>Updated <time dateTime={article.modified}>{modifiedDate}</time></span>}<span>{articleReadingTime(article)} min read</span></div></header>
    <div className="article-hero shell"><Image src={article.image} alt={article.imageAlt} width={1200} height={675} priority sizes="(max-width: 1200px) calc(100vw - 40px), 1160px"/></div>
    <div className="article-layout shell"><main><ArticleContent blocks={article.blocks}/><section className="article-faq" aria-labelledby="article-faq-title"><h2 id="article-faq-title">Frequently Asked Questions</h2>{article.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</section><aside className="editorial-note"><strong>Editorial note</strong><p>Carspect publishes independent educational information reviewed for clarity and source quality. This guide does not provide legal, insurance, safety, or repair authorization advice. Vehicle-specific procedures, an in-person inspection, your policy, and applicable state rules control your situation.</p><Link href="/editorial-policy">Read our editorial policy</Link></aside></main>
      <aside className="article-side"><nav aria-label="Article actions"><Link className="button" href="/estimate">Get a Free Estimate</Link><Link className="button-secondary" href="/sample-estimates">View Sample Estimates</Link><Link href={`/blog/${article.category.slug}`}>More {article.category.name} guides</Link></nav></aside>
    </div>
    <section className="section related-guides"><div className="shell"><h2>Related Guides</h2><div className="blog-grid">{related.map((item) => <BlogArticleCard key={item.slug} article={item} compact/>)}</div></div></section>
  </article>;
}
