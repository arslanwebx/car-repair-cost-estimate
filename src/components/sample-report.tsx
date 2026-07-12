import Image from "next/image";
import Link from "next/link";
import { Logo } from "./logo";
import type { SampleEstimate } from "@/data/sample-estimates";

const money = (range: { low: number; high: number }) => `$${range.low.toLocaleString()} to $${range.high.toLocaleString()}`;

export function SampleReport({ sample }: { sample: SampleEstimate }) {
  const items = [
    ["Parts", sample.breakdown.parts], ["Body labor", sample.breakdown.bodyLabor], ["Paint labor", sample.breakdown.paintLabor],
    ["Paint and materials", sample.breakdown.paintMaterials], ["Pre- and post-repair scans", sample.breakdown.scans],
    ["Calibration allowance", sample.breakdown.calibration], ["Shop supplies", sample.breakdown.shopSupplies],
    ["Estimated tax", sample.breakdown.tax], ["Potential hidden damage", sample.breakdown.hiddenDamage]
  ] as const;

  return <article className="report-page">
    <div className="report-banner"><Logo/><span>Sample estimate for demonstration only</span></div>
    <div className="report-title-grid">
      <div><p className="eyebrow">Estimated U.S. market repair range</p><h1>{sample.title}</h1><p>{sample.vehicle.year} {sample.vehicle.make} {sample.vehicle.model} · {sample.location}</p></div>
      <div className="report-total"><small>Estimated range before tax</small><strong>{money(sample.total)}</strong><span>{sample.confidence} photo confidence</span></div>
    </div>
    <Image className="report-photo" src={sample.image} alt={sample.imageAlt} width={1536} height={1024} priority sizes="(max-width: 900px) 100vw, 55vw"/>
    <section className="report-summary">
      <div><h2>Damage overview</h2><p>{sample.damage}</p><dl><div><dt>Severity</dt><dd>{sample.severity}</dd></div><div><dt>Likely operation</dt><dd>{sample.operation}</dd></div><div><dt>Labor hours</dt><dd>{sample.laborHours.low} to {sample.laborHours.high}</dd></div><div><dt>Pricing data</dt><dd>US-2026.07-v3</dd></div></dl></div>
      <div className="confidence-panel"><strong>{sample.confidence} confidence</strong><p>{sample.confidenceExplanation}</p><p>Confidence describes photo clarity, not pricing certainty or vehicle safety.</p></div>
    </section>
    <section><h2>Visible-damage findings</h2><ul className="report-list">{sample.findings.map(item=><li key={item}>{item}</li>)}</ul></section>
    <section><h2>Itemized cost range</h2><div className="cost-table" role="table" aria-label="Sample estimate cost breakdown">{items.map(([label,value])=><div role="row" key={label}><span role="cell">{label}</span><strong role="cell">{money(value)}</strong></div>)}<div role="row" className="cost-total"><span role="cell">Estimated total before tax</span><strong role="cell">{money(sample.total)}</strong></div></div></section>
    <div className="report-columns"><section><h2>What may increase cost</h2><ul>{sample.increaseFactors.map(item=><li key={item}>{item}</li>)}</ul></section><section><h2>What may reduce cost</h2><ul>{sample.reductionFactors.map(item=><li key={item}>{item}</li>)}</ul></section></div>
    <section><h2>Recommended next steps</h2><ol>{sample.nextSteps.map(item=><li key={item}>{item}</li>)}</ol></section>
    <div className="report-disclaimer"><strong>Important limitation</strong><p>This demonstration is an informational estimate before tax, insurance deductible, and rental costs. It is based on visible damage and stated assumptions, not an insurance appraisal, certified estimate, repair authorization, safety inspection, or guaranteed price. Hidden damage may be present. A qualified repair facility must inspect the vehicle before repairs are authorized.</p></div>
    <div className="report-actions"><a className="button-secondary" href={`/api/sample-estimates/${sample.slug}/pdf`}>Download Sample PDF</a><Link className="button" href="/estimate">Start Your Estimate</Link></div>
  </article>;
}
