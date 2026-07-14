import Image from "next/image";
import Link from "next/link";
import type { BlogArticle } from "@/content/blog";
import { articleReadingTime } from "@/content/blog";

export function BlogArticleCard({ article, compact = false }: { article: BlogArticle; compact?: boolean }) {
  return <article className={`blog-card${compact ? " blog-card-compact" : ""}`}>
    <Link className="blog-card-image" href={`/blog/${article.slug}`} aria-label={`Read ${article.title}`}>
      <Image src={article.image} alt={article.imageAlt} fill sizes={compact ? "(max-width: 700px) 100vw, 360px" : "(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 380px"}/>
    </Link>
    <div className="blog-card-body">
      <Link className="blog-card-category" href={`/blog/${article.category.slug}`}>{article.category.name}</Link>
      <h2><Link href={`/blog/${article.slug}`}>{article.title}</Link></h2>
      {!compact && <p>{article.excerpt}</p>}
      <div className="blog-card-meta"><time dateTime={article.published}>{new Date(article.published).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })}</time><span>{articleReadingTime(article)} min read</span></div>
    </div>
  </article>;
}
