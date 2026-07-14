import { SampleCard } from "@/components/sample-card";
import { CONTENT_DATES } from "@/config/content-dates";
import { sampleEstimates } from "@/data/sample-estimates";
import { absoluteUrl, metadataFor, ORGANIZATION_ID, organizationJsonLd, safeJsonLd, WEBSITE_ID } from "@/lib/seo";

export const metadata = metadataFor("sampleEstimates");

export default function SampleEstimatesPage() {
  const pageUrl = absoluteUrl("/sample-estimates");
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    organizationJsonLd(),
    { "@type": "CollectionPage", "@id": `${pageUrl}#collection`, name: "Sample Car Damage Repair Estimates", description: metadata.description, url: pageUrl, dateModified: CONTENT_DATES.sampleEstimates, isPartOf: { "@id": WEBSITE_ID }, publisher: { "@id": ORGANIZATION_ID }, mainEntity: { "@type": "ItemList", itemListElement: sampleEstimates.map((sample, index) => ({ "@type": "ListItem", position: index + 1, name: `${sample.vehicle.year} ${sample.vehicle.make} ${sample.vehicle.model}: ${sample.title}`, url: absoluteUrl(`/sample-estimates/${sample.slug}`) })) } },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") }, { "@type": "ListItem", position: 2, name: "Sample Estimates", item: pageUrl }] }
  ] };
  return <div className="page-shell"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}/><section className="page-hero shell narrow"><span className="eyebrow">See what your report includes</span><h1>Sample Car Damage Repair Estimates</h1><p>These demonstration estimates show the detail Carspect provides, from visible-damage findings to labor, parts, paint, scans, and allowances. Ranges are preliminary and before tax, insurance deductible, and rental costs. Actual costs vary by vehicle, repair facility, ZIP code, parts availability, and physical inspection. Every example follows the same Carspect pricing methodology used by the live tool.</p></section><section className="section sample-library"><div className="shell sample-grid">{sampleEstimates.map((sample,index)=><SampleCard key={sample.slug} sample={sample} priority={index<2}/>)}</div></section></div>;
}
