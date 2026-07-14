import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleContent } from "@/components/blog/article-content";
import { BlogArticleCard } from "@/components/blog/article-card";
import { articleReadingTime, blogArticles, getBlogArticle, safeJsonLd } from "@/content/blog";

const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://carspect.pro";
export const dynamicParams = false;
export function generateStaticParams() { return blogArticles.map((article) => ({ slug: article.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const article = getBlogArticle((await params).slug);
  if (!article) return {};
  const url = `/blog/${article.slug}`;
  return {
    title: article.seoTitle,
    description: article.description,
    alternates: { canonical: url },
    openGraph: { type: "article", title: article.title, description: article.description, url, publishedTime: article.published, modifiedTime: article.modified, authors: ["Carspect Editorial Team"], section: article.category.name, tags: article.tags, images: [{ url: article.image, width: 1200, height: 675, alt: article.imageAlt }] },
    twitter: { card: "summary_large_image", title: article.title, description: article.description, images: [article.image] }
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const article = getBlogArticle((await params).slug);
  if (!article) notFound();
  const articleUrl = `${site}/blog/${article.slug}`;
  const categoryUrl = `${site}/blog/category/${article.category.slug}`;
  const related = article.relatedSlugs.map(getBlogArticle).filter((item): item is NonNullable<typeof item> => Boolean(item));
  const articleJsonLd = { "@context": "https://schema.org", "@type": "BlogPosting", headline: article.title, description: article.description, image: [`${site}${article.image}`], datePublished: article.published, dateModified: article.modified, mainEntityOfPage: articleUrl, author: { "@type": "Organization", name: "Carspect Editorial Team", url: `${site}/editorial-policy` }, publisher: { "@type": "Organization", name: "Carspect", url: site }, articleSection: article.category.name, keywords: article.tags.join(", ") };
  const breadcrumbJsonLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: site }, { "@type": "ListItem", position: 2, name: "Blog", item: `${site}/blog` }, { "@type": "ListItem", position: 3, name: article.category.name, item: categoryUrl }, { "@type": "ListItem", position: 4, name: article.title, item: articleUrl }] };
  const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: article.faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) };
  const date = new Date(article.published).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
  return <article className="article-page">
    {[articleJsonLd, breadcrumbJsonLd, faqJsonLd].map((value, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(value) }}/>) }
    <header className="article-header shell narrow"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/blog">Blog</Link><span>/</span><Link href={`/blog/category/${article.category.slug}`}>{article.category.name}</Link></nav><h1>{article.title}</h1><p className="article-deck">{article.excerpt}</p><div className="article-byline"><span>By <Link href="/editorial-policy">Carspect Editorial Team</Link></span><time dateTime={article.published}>{date}</time><span>{articleReadingTime(article)} min read</span></div></header>
    <div className="article-hero shell"><Image src={article.image} alt={article.imageAlt} width={1200} height={675} priority sizes="(max-width: 1200px) calc(100vw - 40px), 1160px"/></div>
    <div className="article-layout shell"><main><ArticleContent blocks={article.blocks}/><section className="article-faq" aria-labelledby="article-faq-title"><h2 id="article-faq-title">Frequently Asked Questions</h2>{article.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</section><aside className="editorial-note"><strong>Editorial note</strong><p>Carspect publishes independent educational information reviewed for clarity and source quality. This guide does not provide legal, insurance, safety, or repair authorization advice. Vehicle-specific procedures, an in-person inspection, your policy, and applicable state rules control your situation.</p><Link href="/editorial-policy">Read our editorial policy</Link></aside></main>
      <aside className="article-side"><nav aria-label="Article actions"><Link className="button" href="/estimate">Get a Free Estimate</Link><Link className="button-secondary" href="/sample-estimates">View Sample Estimates</Link><Link href={`/blog/category/${article.category.slug}`}>More {article.category.name} guides</Link></nav></aside>
    </div>
    <section className="section related-guides"><div className="shell"><h2>Related Guides</h2><div className="blog-grid">{related.map((item) => <BlogArticleCard key={item.slug} article={item} compact/>)}</div></div></section>
  </article>;
}
