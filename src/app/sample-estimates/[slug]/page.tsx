import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SampleReport } from "@/components/sample-report";
import { SAMPLE_ESTIMATE_DATES } from "@/config/content-dates";
import { getSampleEstimate, sampleEstimates } from "@/data/sample-estimates";
import { absoluteUrl, createPageMetadata, ORGANIZATION_ID, organizationJsonLd, safeJsonLd, WEBSITE_ID } from "@/lib/seo";

export function generateStaticParams() { return sampleEstimates.map((sample) => ({ slug: sample.slug })); }

function sampleDescription(sample: NonNullable<ReturnType<typeof getSampleEstimate>>) {
  return `Review the ${sample.vehicle.year} ${sample.vehicle.make} ${sample.vehicle.model} ${sample.damage.toLowerCase()} sample with an itemized ${sample.total.low.toLocaleString()} to ${sample.total.high.toLocaleString()} dollar preliminary range.`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const sample = getSampleEstimate(slug);
  if (!sample) return {};
  return createPageMetadata({ title: `${sample.vehicle.year} ${sample.vehicle.make} ${sample.vehicle.model} ${sample.title} Sample Estimate`, description: sampleDescription(sample), path: `/sample-estimates/${slug}`, image: sample.image, imageAlt: sample.imageAlt });
}

export default async function SamplePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sample = getSampleEstimate(slug);
  if (!sample) notFound();
  const pageUrl = absoluteUrl(`/sample-estimates/${slug}`);
  const imageUrl = absoluteUrl(sample.image);
  const imageId = `${pageUrl}#primaryimage`;
  const vehicleId = `${pageUrl}#vehicle`;
  const description = sampleDescription(sample);
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    organizationJsonLd(),
    { "@type": "WebPage", "@id": `${pageUrl}#webpage`, url: pageUrl, name: `${sample.vehicle.year} ${sample.vehicle.make} ${sample.vehicle.model} ${sample.title} Sample Estimate`, description, dateModified: SAMPLE_ESTIMATE_DATES[sample.slug], isPartOf: { "@type": "CollectionPage", "@id": `${absoluteUrl("/sample-estimates")}#collection`, name: "Sample Car Damage Repair Estimates", url: absoluteUrl("/sample-estimates"), isPartOf: { "@id": WEBSITE_ID } }, primaryImageOfPage: { "@id": imageId }, about: { "@id": vehicleId }, publisher: { "@id": ORGANIZATION_ID } },
    { "@type": "ImageObject", "@id": imageId, url: imageUrl, contentUrl: imageUrl, caption: sample.imageAlt, representativeOfPage: true },
    { "@type": "Vehicle", "@id": vehicleId, name: `${sample.vehicle.year} ${sample.vehicle.make} ${sample.vehicle.model}`, vehicleModelDate: String(sample.vehicle.year), manufacturer: { "@type": "Organization", name: sample.vehicle.make }, model: sample.vehicle.model, bodyType: sample.vehicle.bodyStyle, fuelType: sample.vehicle.fuelType },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") }, { "@type": "ListItem", position: 2, name: "Sample Estimates", item: absoluteUrl("/sample-estimates") }, { "@type": "ListItem", position: 3, name: `${sample.vehicle.year} ${sample.vehicle.make} ${sample.vehicle.model} ${sample.title}`, item: pageUrl }] }
  ] };
  return <main className="sample-report-shell shell"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}/><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/sample-estimates">Sample Estimates</Link><span>/</span><span>{sample.title}</span></nav><SampleReport sample={sample}/></main>;
}
