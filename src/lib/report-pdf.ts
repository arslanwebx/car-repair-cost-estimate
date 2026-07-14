import type { EstimateReport } from "./report-schema";
import { PdfWriter } from "./pdf-writer";

const money = (range: { low: number; high: number }) => `$${range.low.toLocaleString()} to $${range.high.toLocaleString()}`;
const words = (value: string) => value.replaceAll("_", " ");

export async function createReportPdf(report: EstimateReport, photo?: string) {
  const writer = await PdfWriter.create(`Carspect estimate ${report.id}`);
  const confidence = report.vision.confidence >= 0.8 ? "High" : report.vision.confidence >= 0.55 ? "Moderate" : "Limited";

  writer.brand();
  writer.text("AI-assisted visible-damage estimate", { size: 9 });
  writer.title(`${report.input.vehicle.year} ${report.input.vehicle.make} ${report.input.vehicle.model}`);
  writer.text(`${words(report.input.vehicle.bodyStyle)} - ZIP ${report.input.preferences.zipCode} - Generated ${new Date(report.generatedAt).toLocaleDateString("en-US")}`);
  writer.total("ESTIMATED U.S. MARKET REPAIR RANGE", money(report.estimate.total), `${confidence} photo confidence - Pricing data ${report.estimate.pricingVersion}`);
  if (photo) await writer.jpeg(photo);
  writer.heading("Visible damage summary");
  report.vision.observations.forEach((item) => writer.card([
    `${words(item.area)} - ${words(item.severity)}`,
    `${words(item.operation)} - ${item.paintDamage ? "Visible paint damage" : "No visible paint damage confirmed"} - ${Math.round(item.confidence * 100)}% observation confidence`,
  ]));
  writer.notice("Inspection warning", "Carspect cannot confirm hidden, structural, mechanical, electrical, sensor, suspension, or safety-system damage from photos. A qualified repair facility must inspect the vehicle before repairs are authorized.");

  writer.addPage();
  writer.brand("Carspect itemized range");
  writer.heading(report.estimate.selectedPartsCategory === "all" ? "Parts-price scenarios" : "Selected parts pricing");
  report.estimate.partsScenarios.forEach((scenario) => writer.card([
    `${scenario.label}: ${money(scenario.total)}`,
    `Parts: ${money(scenario.parts)}${scenario.oemFallbackItems ? ` - OEM fallback on ${scenario.oemFallbackItems} item(s)` : ""}`,
  ]));
  report.estimate.items.forEach((item) => {
    writer.heading(`${words(item.area)} - ${words(item.operation)}`);
    writer.row("Parts", money(item.parts));
    writer.row(`Body labor (${item.laborHours.low} to ${item.laborHours.high} hours)`, money(item.bodyLabor));
    writer.row("Paint labor and materials", money(item.paint));
    if (item.frameLabor.high > 0) writer.row("Frame / structural labor", money(item.frameLabor));
    if (item.mechanicalLabor.high > 0) writer.row("Mechanical / R&I labor", money(item.mechanicalLabor));
    writer.row("Consumables and procedures", money(item.consumables));
  });
  writer.heading("Additional costs and allowances");
  writer.row("Scans and calibration", money(report.estimate.scanCalibration));
  writer.row("Shop supplies", money(report.estimate.shopSupplies));
  writer.row("Estimated taxes", money(report.estimate.tax));
  writer.row("Potential hidden damage", money(report.estimate.hiddenDamage));
  writer.row("Estimated total", money(report.estimate.total), true);
  writer.heading("Next steps");
  writer.text("1. Obtain an in-person inspection and written estimate.");
  writer.text("2. Ask whether parts source, paint blending, scans, and calibration are included.");
  writer.text("3. Compare additional damage found after disassembly with this preliminary range.");
  writer.notice("Full limitation", "This report is an independent informational estimate, not an insurance appraisal, certified valuation, safety inspection, repair order, or guaranteed quote. Actual pricing varies by repair facility, procedures, parts availability, taxes, paint matching, and damage found later.");
  return writer.save(`Carspect.pro - ${report.id} - Informational estimate only`);
}
