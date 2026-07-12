import Image from "next/image";
import Link from "next/link";
import type { SampleEstimate } from "@/data/sample-estimates";

export function SampleCard({ sample, priority = false }: { sample: SampleEstimate; priority?: boolean }) {
  return <article className="sample-card sample-card-v2">
    <Image src={sample.image} alt={sample.imageAlt} width={1536} height={1024} priority={priority} sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 1100px) calc(50vw - 32px), 550px" />
    <div><span className="sample-label">Sample estimate for demonstration only</span><h3>{sample.title}</h3><p className="sample-vehicle">{sample.vehicle.year} {sample.vehicle.make} {sample.vehicle.model}</p><p>{sample.damage}</p><dl className="sample-meta"><div><dt>Market</dt><dd>{sample.location}</dd></div><div><dt>Photo confidence</dt><dd>{sample.confidence}</dd></div></dl><strong className="range">${sample.total.low.toLocaleString()} to ${sample.total.high.toLocaleString()}</strong><div className="card-actions"><Link className="button" href={`/sample-estimates/${sample.slug}`}>View Detailed Report</Link><a className="button-secondary" href={`/api/sample-estimates/${sample.slug}/pdf`}>Download Sample PDF</a></div></div>
  </article>;
}
