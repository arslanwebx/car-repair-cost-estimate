import type { BlogCategorySlug } from "@/content/blog";

export function CategoryIcon({ category }: { category: BlogCategorySlug }) {
  const paths: Record<BlogCategorySlug, React.ReactNode> = {
    "damage-assessment": <><path d="M5 15h14l-1.5-5.5-3-2.5h-5l-3 2.5L5 15Z"/><path d="M8 15v2m8-2v2M9 11h6"/></>,
    "after-an-accident": <><path d="M12 3v4m0 10v4M3 12h4m10 0h4"/><circle cx="12" cy="12" r="4"/></>,
    "repair-estimates": <><path d="M7 3h10v18H7zM10 7h4m-4 4h4m-4 4h2"/></>,
    "insurance-claims": <><path d="M12 3 5 6v5c0 4.8 2.8 8 7 10 4.2-2 7-5.2 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-5"/></>,
    "repair-or-replace": <><path d="M5 7h8m-8 10h8M9 3l4 4-4 4m6 2-4 4 4 4"/></>
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[category]}</svg>;
}
