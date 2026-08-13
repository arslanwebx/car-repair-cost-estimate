import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { BlogArticleCard } from "@/components/blog/article-card";
import { ProcessIcon } from "@/components/process-icon";
import { SampleCard } from "@/components/sample-card";
import { VehicleStructureGraphic } from "@/components/vehicle-structure-graphic";
import { blogArticles } from "@/content/blog";
import { sampleEstimates } from "@/data/sample-estimates";
import { metadataFor, organizationJsonLd, safeJsonLd, SITE_URL, websiteJsonLd } from "@/lib/seo";

export const metadata = metadataFor("home");

const faqs = [
  ["How does the free car body repair estimate calculator work?", "You enter vehicle and location details, select damaged areas, and upload one or more photos. Carspect checks photo quality, classifies visible damage, and passes those findings to a separate pricing engine that calculates an itemized preliminary U.S. market range."],
  ["Is the calculator really free?", "Yes. You can receive, view, and download an estimate without creating an account or entering an email address."],
  ["Can a photo estimate find hidden damage?", "No. Photos cannot show damage behind a bumper, trim, or body panel. Carspect flags uncertainty and likely inspection needs, but only a repair facility can confirm hidden damage after measuring or disassembly."],
  ["Is this an insurance estimate?", "No. A Carspect report is an independent informational estimate. It is not an insurer appraisal, certified valuation, repair authorization, or guaranteed quote."],
  ["Why does ZIP code matter?", "Body and paint labor rates, taxes, and market costs vary across the United States. ZIP code helps apply a broad regional pricing factor."],
  ["What photos produce the best result?", "Start with a wide photo of the damaged side, then add a straight-on view and close-up. Keep the panel in focus, include neighboring panels, use bright natural light, and avoid heavy reflections."],
  ["What do OEM and aftermarket mean?", "OEM parts are supplied under the vehicle manufacturer's brand. Aftermarket parts come from other manufacturers. Availability, fit, repair standards, and price can differ, so Carspect can show parts-source scenarios."],
  ["What is ADAS calibration?", "ADAS means advanced driver-assistance systems, such as cameras and radar used for lane or collision features. Certain repairs may require scanning, aiming, or calibration under the manufacturer's procedures."],
  ["Can I use the estimate to compare body-shop quotes?", "Yes, as a planning reference. Compare the parts, labor, paint, scans, calibration, and assumptions line by line, but rely on a qualified repair facility's physical inspection and written estimate before authorizing work."],
  ["What damage requires an immediate professional inspection?", "Severe impacts, deployed airbags, fluid leaks, fire or flood exposure, wheel misalignment, warning lights, structural concerns, or any doubt about vehicle safety require prompt in-person inspection. Carspect cannot determine whether a vehicle is safe to drive."],
];

const processSteps = [
  ["01", "vehicle", "Add the vehicle", "Tell us the year, make, model, mileage range, and ZIP code so the range reflects the vehicle and regional market."],
  ["02", "damage", "Mark the damage", "Select each visible damaged area and briefly describe what happened."],
  ["03", "photos", "Upload clear photos", "Add one wide view and useful close-ups. Multiple angles improve photo confidence."],
  ["04", "report", "Read the itemized range", "Review likely parts, body labor, paint, materials, scans, calibration, supplies, and allowances."],
] as const;

const damageTypes = ["Bumper damage", "Dents and creases", "Scratches and paint", "Fender and door damage", "Hood and trunk damage", "Hail damage", "Lights and mirrors", "Minor collision damage", "Glass damage", "Multi-panel damage"];

const estimateIncludes = ["Visible damage findings", "Likely affected panels", "Repair-versus-replace guidance", "Parts-source ranges", "Body and paint labor", "Paint and materials", "Scans and calibration considerations", "Shop supplies and allowances", "Regional market adjustment", "Hidden-damage notes", "Photo confidence level"];

const repairFactors = [
  ["Vehicle and construction", "Luxury, electric, aluminum, and specialty vehicles may need different parts, tools, or procedures."],
  ["Parts source", "New OEM, aftermarket, and recycled OEM parts have different prices and availability."],
  ["Paint matching", "Metallic, pearl, and three-stage finishes may require blending into neighboring panels."],
  ["Local labor market", "Body and paint rates vary by ZIP code and repair-facility standards."],
  ["Sensors and calibration", "Bumper, grille, mirror, windshield, and alignment work may affect cameras or radar."],
  ["Hidden damage", "Broken mounts, reinforcements, wiring, and inner panels may appear only after disassembly."],
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    organizationJsonLd(),
    websiteJsonLd(),
    {
      "@type": "WebApplication",
      "@id": `${SITE_URL}/estimate#application`,
      name: "Free Car Body Repair Estimate Calculator",
      description: "A free browser-based tool that uses vehicle details, location, and user-provided damage photos to prepare an itemized preliminary U.S. repair-cost range.",
      applicationCategory: "AutomotiveApplication",
      operatingSystem: "Any operating system with a web browser",
      url: `${SITE_URL}/estimate`,
      isAccessibleForFree: true,
      provider: { "@id": `${SITE_URL}/#organization` },
      featureList: ["Visible vehicle-damage observations", "Itemized parts, body labor, paint labor, paint materials, and allowance ranges", "Regional U.S. market adjustment", "Photo confidence and hidden-damage notes", "Downloadable preliminary estimate report"],
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })),
    },
  ],
};

export default function Home() {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />

    <section className="hero landing-hero">
      <div className="hero-orbit" aria-hidden="true" />
      <div className="shell hero-grid">
        <div className="hero-copy">
          <p className="hero-kicker"><span>Photo-based</span> preliminary repair pricing</p>
          <h1>A free car body repair estimate <em>before the shop visit.</em></h1>
          <p className="lede">Upload clear photos and get a free, itemized car body repair estimate built around your vehicle, visible damage, and local U.S. market.</p>
          <div className="hero-actions">
            <Link className="button hero-primary" href="/estimate">Estimate my repair <span aria-hidden="true">↗</span></Link>
            <Link className="hero-secondary" href="/sample-estimates">See a finished report <span aria-hidden="true">→</span></Link>
          </div>
          <div className="hero-proof" aria-label="Carspect estimate benefits">
            <div><strong>$0</strong><span>No sign-up or email</span></div>
            <div><strong>5 min</strong><span>Typical guided upload</span></div>
            <div><strong>PDF</strong><span>Itemized report included</span></div>
          </div>
        </div>

        <div className="hero-visual" aria-label="Sample Carspect repair estimate preview">
          <div className="hero-photo">
            <Image src="/images/toyota-camry-front.webp" alt="Damaged front bumper and grille on a silver Toyota Camry" fill priority sizes="(max-width: 900px) calc(100vw - 40px), 58vw" />
            <div className="damage-focus" aria-hidden="true"><i /><i /><i /><i /></div>
            <div className="photo-index"><span>01</span><b>Front impact</b></div>
          </div>
          <div className="floating-estimate">
            <div className="floating-estimate-head"><span>Preliminary range</span><b>Moderate confidence</b></div>
            <strong>$3,000 <i>—</i> $5,400</strong>
            <div className="cost-split"><span style={{ "--cost": "72%" } as CSSProperties}>Parts</span><span style={{ "--cost": "46%" } as CSSProperties}>Labor</span><span style={{ "--cost": "35%" } as CSSProperties}>Paint</span></div>
            <small>2020 Toyota Camry · Los Angeles, CA</small>
          </div>
          <p className="hero-caption"><span>AI observes visible damage.</span> A separate pricing engine calculates the range.</p>
        </div>
      </div>
    </section>

    <section className="trust-strip" aria-label="Why vehicle owners use Carspect">
      <div className="shell">
        {[['Transparent ranges', 'See a low and high range, not a mystery number.'], ['Independent guidance', 'No required shop selection or lead capture.'], ['Privacy-minded', 'Photos are sanitized before AI processing.'], ['Honest limits', 'Unclear or complex damage is flagged for inspection.']].map(([title, copy], index) => <div key={title}><span>{String(index + 1).padStart(2, '0')}</span><strong>{title}</strong><p>{copy}</p></div>)}
      </div>
    </section>

    <section id="how-it-works" className="section process-section">
      <div className="shell">
        <div className="home-section-heading split-heading"><div><p className="section-number">01 / How it works</p><h2>Four steps from damage photos to a useful range.</h2></div><p>A short guided path designed for a driveway, parking lot, or anywhere you can safely photograph the vehicle.</p></div>
        <div className="process-grid">
          {processSteps.map(([number, icon, title, copy]) => <article key={number}><div className="process-card-top"><span>{number}</span><ProcessIcon kind={icon} /></div><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
        <div className="center-action"><Link className="button" href="/estimate">Start a free estimate <span aria-hidden="true">↗</span></Link></div>
      </div>
    </section>

    <section className="section report-story">
      <div className="shell preview-section">
        <div className="report-story-copy">
          <p className="section-number">02 / The report</p>
          <h2>A repair estimate that reads like a decision tool.</h2>
          <p>Carspect separates visible findings from the pricing calculation, shows its assumptions, and explains where physical inspection still matters.</p>
          <ul className="check-list dark"><li>Vehicle and regional market</li><li>Repair-versus-replace guidance</li><li>Parts and labor ranges</li><li>Paint and material costs</li><li>Scan and calibration allowances</li><li>Confidence and hidden-damage notes</li></ul>
          <Link className="text-link" href="/sample-estimates/toyota-camry-front-bumper-grille">Open the full sample report <span aria-hidden="true">→</span></Link>
        </div>
        <div className="document-stage">
          <div className="document-preview">
            <div className="document-head"><b>Carspect / estimate</b><span>US-2026.07-v3</span></div>
            <p>Front bumper and grille damage</p>
            <strong>$3,000 to $5,400</strong>
            <div className="breakdown-bars"><span style={{ "--bar": "73%" } as CSSProperties}>Parts</span><span style={{ "--bar": "43%" } as CSSProperties}>Labor</span><span style={{ "--bar": "36%" } as CSSProperties}>Paint</span><span style={{ "--bar": "22%" } as CSSProperties}>Scans & calibration</span></div>
            <div className="document-note">Moderate photo confidence · Before tax, deductible, and rental costs</div>
          </div>
          <span className="document-page-count">01 / 06</span>
        </div>
      </div>
    </section>

    <section className="section samples-section">
      <div className="shell">
        <div className="section-heading-row"><div><p className="section-number">03 / Real examples</p><h2>Different damage. Different variables.</h2></div><Link className="text-link" href="/sample-estimates">Browse all sample reports <span aria-hidden="true">→</span></Link></div>
        <div className="sample-grid home-samples">{sampleEstimates.map(sample => <SampleCard key={sample.slug} sample={sample} />)}</div>
      </div>
    </section>

    <section className="section navy coverage-section">
      <div className="shell coverage-layout">
        <div className="coverage-intro"><p className="section-number">{"04 / What's included"}</p><h2>A range you can inspect, not just accept.</h2><p>AI identifies visible conditions. Explicit pricing rules calculate the cost range, with the important assumptions kept visible.</p><Link className="button light" href="/estimate">Build my estimate <span aria-hidden="true">↗</span></Link></div>
        <ol className="coverage-list">{estimateIncludes.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, '0')}</span>{item}</li>)}</ol>
      </div>
      <div className="shell damage-marquee" aria-label="Damage types Carspect can help estimate">{damageTypes.map((damage, index) => <span key={damage}>{damage}{index < damageTypes.length - 1 && <i>•</i>}</span>)}</div>
      <div className="shell"><p className="safety-callout">Severe crashes, deployed airbags, fluid leaks, fire or flood damage, wheel misalignment, and vehicles that may be unsafe require immediate professional inspection.</p></div>
    </section>

    <section className="section cost-ranges">
      <div className="shell">
        <div className="home-section-heading split-heading"><div><p className="section-number">05 / Broad U.S. illustrations</p><h2>Body repair costs can move fast.</h2></div><p>Vehicle construction, paint, labor market, parts availability, and hidden damage can all change the final repair order.</p></div>
        <div className="range-grid">{[['Surface scuff or scratch', '$300–$1,100'], ['Repairable bumper dent', '$850–$1,800'], ['Door or fender damage', '$1,500–$4,200'], ['Multi-part front damage', '$2,800–$7,000+']].map(([label, range], index) => <article key={label}><span>{String(index + 1).padStart(2, '0')}</span><h3>{label}</h3><strong>{range}</strong><p>Preliminary range before tax, deductible, rental costs, or physical teardown.</p></article>)}</div>
      </div>
    </section>

    <section className="section repair-factors">
      <div className="shell">
        <div className="home-section-heading split-heading"><div><p className="section-number">06 / Pricing variables</p><h2>From damaged panel to final price.</h2></div><p>Each affected component is treated as its own repair operation, then adjusted for the vehicle, location, materials, and procedures.</p></div>
        <div className="factor-layout">
          <div className="vehicle-diagram"><VehicleStructureGraphic /><p>Select every visible damaged area. Carspect evaluates panels separately and prevents duplicate operations from inflating the total.</p></div>
          <div className="factor-list">{repairFactors.map(([title, copy], index) => <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div>
        </div>
      </div>
    </section>

    <section className="section accuracy">
      <div className="shell accuracy-grid">
        <div className="accuracy-copy"><p className="section-number">07 / Clear limits</p><h2>Useful from photos. Honest about what photos cannot show.</h2><p>Clear images can help identify likely panels, finish damage, severity, and repair operations. They cannot confirm hidden structure, mechanical condition, or whether a vehicle is safe to drive.</p><Link className="text-link" href="/disclaimer">Read the full estimate disclaimer <span aria-hidden="true">→</span></Link></div>
        <div className="confidence-scale"><div><span>01</span><strong>High confidence</strong><p>Damage and context are clearly visible from useful angles.</p></div><div><span>02</span><strong>Moderate confidence</strong><p>Core damage is visible, but an angle or detail is missing.</p></div><div><span>03</span><strong>Limited confidence</strong><p>Blur, glare, distance, or obstruction prevents reliable classification.</p></div></div>
      </div>
    </section>

    <section className="section trust-section">
      <div className="shell trust-layout">
        <div><p className="section-number">{"08 / Why it's free"}</p><h2>No lead form hiding behind the result.</h2><p>View a preliminary estimate without an account, email address, required body-shop selection, repair authorization, or payment.</p></div>
        <div className="trust-principles">{[['No required sign-up', 'See the result without giving Carspect your email address.'], ['Transparent method', 'Ranges show parts, labor, paint, fees, allowances, and the pricing-data version.'], ['Privacy by design', 'Uploaded images are re-encoded to remove EXIF metadata and excluded from analytics.'], ['No fabricated fallback', 'If analysis fails or photos are unclear, Carspect asks you to retry instead of inventing a price.']].map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </div>
    </section>

    <section className="section latest-blog">
      <div className="shell"><div className="section-heading-row"><div><p className="section-number">09 / Repair guides</p><h2>Know what to ask next.</h2><p>Practical guidance for documenting damage, reading estimates, and preparing for the next conversation.</p></div><Link className="text-link" href="/blog">View all repair guides <span aria-hidden="true">→</span></Link></div><div className="blog-grid">{blogArticles.slice(0, 3).map(article => <BlogArticleCard key={article.slug} article={article} compact />)}</div></div>
    </section>

    <section id="faq" className="section faq-section">
      <div className="shell faq-layout"><div className="faq-intro"><p className="section-number">10 / Common questions</p><h2>Before you upload.</h2><p>Carspect is a preliminary planning tool, not a certified appraisal or repair authorization.</p><Link className="text-link" href="/contact-us">Ask a different question <span aria-hidden="true">→</span></Link></div><div>{faqs.map(([question, answer], index) => <details className="faq" key={question} open={index === 0}><summary><span>{String(index + 1).padStart(2, '0')}</span>{question}</summary><p>{answer}</p></details>)}</div></div>
    </section>

    <section className="final-cta"><div className="shell"><p>Ready when the photos are.</p><h2>Turn visible damage into a clearer next step.</h2><Link className="button light" href="/estimate">Get my free preliminary estimate <span aria-hidden="true">↗</span></Link><span>No account. No email. No payment.</span></div></section>
  </>;
}
