export type BlogCategorySlug =
  | "damage-assessment"
  | "after-an-accident"
  | "repair-estimates"
  | "insurance-claims"
  | "repair-or-replace";

export type RichText = Array<{ text: string; href?: string; strong?: boolean }>;

export type BlogBlock =
  | { type: "heading"; level: 2 | 3; id: string; text: string }
  | { type: "paragraph"; content: RichText }
  | { type: "list"; ordered?: boolean; items: RichText[] }
  | { type: "checklist"; title?: string; items: RichText[] }
  | { type: "callout"; title: string; content: RichText }
  | { type: "table"; caption?: string; headers: string[]; rows: string[][] };

export type BlogFaq = { question: string; answer: string };

export type BlogArticle = {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  excerpt: string;
  category: { name: string; slug: BlogCategorySlug };
  published: string;
  modified: string;
  image: string;
  imageAlt: string;
  tags: string[];
  relatedSlugs: string[];
  blocks: BlogBlock[];
  faqs: BlogFaq[];
};
