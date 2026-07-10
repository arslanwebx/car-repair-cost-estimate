import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SampleReport } from "@/components/sample-report";
import { getSampleEstimate, sampleEstimates } from "@/data/sample-estimates";
export function generateStaticParams(){return sampleEstimates.map(sample=>({slug:sample.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const sample=getSampleEstimate(slug);if(!sample)return {};return {title:`${sample.title} Sample Estimate`,description:`View the itemized Carspect sample estimate for ${sample.vehicle.year} ${sample.vehicle.make} ${sample.vehicle.model} ${sample.damage.toLowerCase()}.`,alternates:{canonical:`/sample-estimates/${slug}`}}}
export default async function SamplePage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const sample=getSampleEstimate(slug);if(!sample)notFound();return <main className="sample-report-shell shell"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/sample-estimates">Sample Estimates</Link><span>/</span><span>{sample.title}</span></nav><SampleReport sample={sample}/></main>}
