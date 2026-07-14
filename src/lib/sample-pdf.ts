import type { SampleEstimate } from "@/data/sample-estimates";
import { PdfWriter } from "./pdf-writer";

const money = (value: { low: number; high: number }) => `$${value.low.toLocaleString()} to $${value.high.toLocaleString()}`;

export async function createSamplePdf(sample: SampleEstimate, image: string) {
  const writer = await PdfWriter.create(`${sample.title} | Carspect sample estimate`);
  const rows = [
    ["Parts", sample.breakdown.parts],
    ["Body labor", sample.breakdown.bodyLabor],
    ["Paint labor", sample.breakdown.paintLabor],
    ["Paint and materials", sample.breakdown.paintMaterials],
    ["Scans", sample.breakdown.scans],
    ["Calibration", sample.breakdown.calibration],
    ["Shop supplies", sample.breakdown.shopSupplies],
    ["Estimated tax", sample.breakdown.tax],
    ["Potential hidden damage", sample.breakdown.hiddenDamage],
  ] as const;

  writer.brand();
  writer.text("Sample estimate for demonstration only", { size: 9 });
  writer.title(sample.title);
  writer.text(`${sample.vehicle.year} ${sample.vehicle.make} ${sample.vehicle.model} - ${sample.location}`);
  writer.total("ESTIMATED U.S. MARKET REPAIR RANGE BEFORE TAX", money(sample.total), `${sample.confidence} photo confidence - Pricing data US-2026.07-v3`);
  await writer.jpeg(image, 255);
  writer.heading("Visible damage summary");
  writer.text(sample.damage);
  writer.heading("Likely operation");
  writer.text(sample.operation);

  writer.addPage();
  writer.brand("Carspect cost breakdown");
  rows.forEach(([label, value]) => writer.row(label, money(value)));
  writer.row("Estimated total before tax", money(sample.total), true);
  writer.heading("Visible findings");
  sample.findings.forEach((item) => writer.text(`- ${item}`));
  writer.heading("Recommended next steps");
  sample.nextSteps.forEach((item, index) => writer.text(`${index + 1}. ${item}`));
  writer.notice("Important limitation", "This demonstration is informational and before tax, deductible, and rental costs. It is not an insurance appraisal, certified estimate, repair authorization, safety inspection, or guaranteed price. Hidden damage may be present. Final repair cost requires inspection by a qualified repair facility.");
  return writer.save("Carspect.pro - Informational estimate only");
}
