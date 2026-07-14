import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogArticleCard } from "@/components/blog/article-card";
import { blogCategories, getArticlesByCategory, getBlogCategory } from "@/content/blog";

export const dynamicParams = false;
export function generateStaticParams() { return blogCategories.map((category) => ({ categorySlug: category.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ categorySlug: string }> }): Promise<Metadata> {
  const category = getBlogCategory((await params).categorySlug);
  if (!category) return {};
  const title = `${category.name} Guides`;
  const url = `/blog/category/${category.slug}`;
  return { title, description: category.description, alternates: { canonical: url }, openGraph: { title, description: category.description, url, type: "website" }, twitter: { card: "summary_large_image", title, description: category.description } };
}

export default async function CategoryPage({ params }: { params: Promise<{ categorySlug: string }> }) {
  const category = getBlogCategory((await params).categorySlug);
  if (!category) notFound();
  const articles = getArticlesByCategory(category.slug);
  return <div className="blog-page"><header className="blog-archive-header"><div className="shell narrow"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/blog">Blog</Link><span>/</span><span aria-current="page">{category.name}</span></nav><h1>{category.name} Guides</h1><p>{category.intro}</p></div></header><section className="section blog-list-section"><div className="shell"><div className="blog-grid">{articles.map((article) => <BlogArticleCard key={article.slug} article={article}/>)}</div></div></section></div>;
}
