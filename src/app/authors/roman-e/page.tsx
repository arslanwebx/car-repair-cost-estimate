import Link from "next/link";
import { BlogArticleCard } from "@/components/blog/article-card";
import { CONTENT_DATES } from "@/config/content-dates";
import { blogArticles } from "@/content/blog";
import { absoluteUrl, AUTHOR_ID, AUTHOR_NAME, metadataFor, safeJsonLd, WEBSITE_ID } from "@/lib/seo";

export const metadata = metadataFor("romanE");

export default function RomanEAuthorPage() {
  const pageUrl = absoluteUrl("/authors/roman-e");
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "ProfilePage", "@id": `${pageUrl}#profilepage`, url: pageUrl, name: "Roman E., Carspect Author", dateModified: CONTENT_DATES.romanE, isPartOf: { "@id": WEBSITE_ID }, mainEntity: { "@id": AUTHOR_ID } },
    { "@type": "Person", "@id": AUTHOR_ID, name: AUTHOR_NAME, url: pageUrl, description: "Author of Carspect educational vehicle-damage and repair-estimate guides.", mainEntityOfPage: { "@id": `${pageUrl}#profilepage` } },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") }, { "@type": "ListItem", position: 2, name: "Authors", item: pageUrl }, { "@type": "ListItem", position: 3, name: AUTHOR_NAME, item: pageUrl }] }
  ] };
  return <div className="blog-page"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}/><header className="blog-archive-header"><div className="shell narrow"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Authors</span><span>/</span><span aria-current="page">Roman E.</span></nav><h1>Roman E.</h1><p>Roman E. writes Carspect educational content that helps vehicle owners document visible damage, understand repair-estimate terms, compare repair decisions, and prepare useful questions for repair facilities or insurers.</p><p className="author-policy-link">Carspect does not present Roman E. as a licensed repair or insurance professional. Read the <Link href="/editorial-policy">Editorial Policy</Link> for sourcing and correction standards.</p></div></header><section className="section blog-list-section"><div className="shell"><h2>Articles by Roman E.</h2><div className="blog-grid">{blogArticles.map((article) => <BlogArticleCard key={article.slug} article={article} compact/>)}</div></div></section></div>;
}
