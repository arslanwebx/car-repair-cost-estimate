import type { BlogArticle, BlogBlock, RichText } from "./types";

function richTextValue(content: RichText) {
  return content.map((part) => part.text).join(" ");
}

export function blockText(block: BlogBlock) {
  if (block.type === "heading") return block.text;
  if (block.type === "paragraph" || block.type === "callout") return richTextValue(block.content);
  if (block.type === "list" || block.type === "checklist") return block.items.map(richTextValue).join(" ");
  return [block.caption ?? "", ...block.headers, ...block.rows.flat()].join(" ");
}

export function articleWordCount(article: BlogArticle) {
  const text = [article.title, article.excerpt, ...article.blocks.map(blockText), ...article.faqs.flatMap((faq) => [faq.question, faq.answer])].join(" ");
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function articleReadingTime(article: BlogArticle) {
  return Math.max(1, Math.ceil(articleWordCount(article) / 225));
}

export function collectLinks(article: BlogArticle) {
  return article.blocks.flatMap((block) => {
    if (block.type === "paragraph" || block.type === "callout") return block.content.flatMap((part) => part.href ? [part.href] : []);
    if (block.type === "list" || block.type === "checklist") return block.items.flatMap((item) => item.flatMap((part) => part.href ? [part.href] : []));
    return [];
  });
}

export function safeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
