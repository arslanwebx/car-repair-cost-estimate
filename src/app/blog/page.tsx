import Link from "next/link";
import { BlogArticleCard } from "@/components/blog/article-card";
import { CategoryIcon } from "@/components/blog/category-icon";
import { blogArticles, blogCategories } from "@/content/blog";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("blog");

export default function BlogPage() {
  return <div className="blog-page"><header className="blog-archive-header"><div className="shell narrow"><h1>Car Damage and Auto Body Repair Guides</h1><p>Clear, carefully sourced guidance for documenting vehicle damage, understanding body shop estimates, and preparing for repair or an insurance conversation.</p></div></header>
    <nav className="category-nav shell" aria-label="Blog categories">{blogCategories.map((category) => <Link key={category.slug} href={`/blog/${category.slug}`}><CategoryIcon category={category.slug}/><span>{category.name}</span></Link>)}</nav>
    <section className="section blog-list-section"><div className="shell"><div className="blog-grid">{blogArticles.map((article) => <BlogArticleCard key={article.slug} article={article}/>)}</div></div></section>
  </div>;
}
