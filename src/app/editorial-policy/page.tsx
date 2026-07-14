import Link from "next/link";
import { ContentPage } from "@/components/content-page";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("editorialPolicy");

export default function Page() {
  return <ContentPage title="Editorial Policy" intro="Carspect content is written to help vehicle owners understand repair decisions without exaggerating certainty.">
    <h2>Practical value first</h2><p>Every guide must answer a real vehicle-owner question near the beginning and add original explanation, examples, comparisons, calculations, or visuals where they improve understanding.</p>
    <h2>Authors and sources</h2><p>Published articles identify their author and link to a public author page. Carspect currently identifies <Link href="/authors/roman-e">Roman E.</Link> as the author of its educational repair guides. Changing prices, safety information, repair procedures, insurance topics, and law require current reliable sources. Facts, estimates, and opinions must be labeled clearly.</p>
    <h2>Review and updates</h2><p>Published and updated dates are shown when applicable. Carspect does not claim professional review unless a real reviewer is identified. Material content changes receive a new updated date; routine deployments do not.</p>
    <h2>What we avoid</h2><ul><li>Unsupported accuracy, safety, insurance, or legal claims</li><li>Fake credentials, reviews, partnerships, or customer stories</li><li>Duplicated city, ZIP, make, or model pages created only for keywords</li><li>Generic introductions, filler, and unnecessary repetition</li></ul>
    <h2>Corrections</h2><p>Material errors are corrected promptly and modification dates are updated when guidance changes. Send feedback to support@carspect.pro.</p>
  </ContentPage>;
}
