import { howToAssessCarDamage } from "./articles/how-to-assess-car-damage-after-a-minor-accident";
import { parkedCarDent } from "./articles/what-to-do-after-someone-dents-your-parked-car";
import { readRepairEstimate } from "./articles/how-to-read-an-auto-body-repair-estimate-line-by-line";
import { insuranceEstimateTooLow } from "./articles/how-to-negotiate-when-insurance-estimate-is-too-low";
import { bumperRepairOrReplace } from "./articles/how-to-decide-whether-to-repair-or-replace-a-damaged-bumper";

export { blogCategories, getBlogCategory } from "./categories";
export { articleReadingTime, articleWordCount, collectLinks, safeJsonLd } from "./utils";
export type { BlogArticle, BlogBlock, BlogCategorySlug, BlogFaq, RichText } from "./types";

export const blogArticles = [
  bumperRepairOrReplace,
  insuranceEstimateTooLow,
  readRepairEstimate,
  parkedCarDent,
  howToAssessCarDamage
].sort((a, b) => b.published.localeCompare(a.published));

export function getBlogArticle(slug: string) {
  return blogArticles.find((article) => article.slug === slug);
}

export function getArticlesByCategory(categorySlug: string) {
  return blogArticles.filter((article) => article.category.slug === categorySlug);
}
