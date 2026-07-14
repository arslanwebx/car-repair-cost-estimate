import { permanentRedirect } from "next/navigation";
import { blogCategories } from "@/content/blog";

export function generateStaticParams() {
  return blogCategories.map((category) => ({ categorySlug: category.slug }));
}

export default async function LegacyCategoryPage({ params }: { params: Promise<{ categorySlug: string }> }) {
  const { categorySlug } = await params;
  permanentRedirect(`/blog/${categorySlug}`);
}
