import { pricingConfig as c } from "@/config/pricing.v1";
import type { EstimateInput, VisionAnalysis } from "./estimate-schema";

export type MoneyRange = { low: number; high: number };
export type LineItem = { area: string; operation: string; laborHours: MoneyRange; parts: MoneyRange; bodyLabor: MoneyRange; paint: MoneyRange };
export type PricedEstimate = { pricingVersion: string; items: LineItem[]; scanCalibration: MoneyRange; shopSupplies: MoneyRange; hiddenDamage: MoneyRange; subtotal: MoneyRange; tax: MoneyRange; total: MoneyRange };
const round = (n: number) => Math.round(n / 5) * 5;

function regionForZip(zip: string): keyof typeof c.regional {
  const prefix = Number(zip.slice(0, 3));
  if ((prefix >= 10 && prefix <= 299) || (prefix >= 600 && prefix <= 699)) return "northeast";
  if (prefix >= 900) return "west";
  if ((prefix >= 300 && prefix <= 399) || (prefix >= 700 && prefix <= 799)) return "south";
  if (prefix >= 400 && prefix <= 599) return "midwest";
  return "national";
}

export function calculateEstimate(input: EstimateInput, vision: VisionAnalysis): PricedEstimate {
  const regional = c.regional[regionForZip(input.preferences.zipCode)];
  const vehicle = c.vehicleClass[input.vehicle.bodyStyle];
  const ev = input.vehicle.fuelType === "electric" ? 1.12 : 1;
  const partSource = c.parts[input.preferences.parts];
  const items = vision.observations.map((o) => {
    const configured = c.operations[o.area as keyof typeof c.operations];
    const template = configured?.[o.operation as "repair" | "replace"] ?? c.fallback[o.operation === "replace" ? "replace" : "repair"];
    const severity = c.severity[o.severity];
    const multiplier = regional * vehicle * ev * severity;
    return {
      area: o.area,
      operation: o.operation,
      laborHours: { low: template.hours[0], high: template.hours[1] },
      parts: { low: round(template.parts[0] * vehicle * partSource), high: round(template.parts[1] * vehicle * partSource) },
      bodyLabor: { low: round(template.hours[0] * c.labor.body[0] * multiplier), high: round(template.hours[1] * c.labor.body[1] * multiplier) },
      paint: { low: o.paintDamage ? round(template.paint[0] * multiplier) : 0, high: o.paintDamage ? round(template.paint[1] * multiplier) : 0 }
    };
  });
  const base = items.reduce((a, i) => ({ low: a.low + i.parts.low + i.bodyLabor.low + i.paint.low, high: a.high + i.parts.high + i.bodyLabor.high + i.paint.high }), { low: 0, high: 0 });
  const needsCalibration = vision.possibleAdasInvolvement;
  const scanCalibration = { low: c.scan[0] + (needsCalibration ? c.calibration[0] : 0), high: c.scan[1] + (needsCalibration ? c.calibration[1] : 0) };
  const shopSupplies = { low: round(base.low * c.shopSuppliesRate[0]), high: round(base.high * c.shopSuppliesRate[1]) };
  const risk = c.hiddenRisk[vision.hiddenDamageRisk];
  const hiddenDamage = { low: risk[0], high: risk[1] };
  const subtotal = { low: base.low + scanCalibration.low + shopSupplies.low + hiddenDamage.low, high: base.high + scanCalibration.high + shopSupplies.high + hiddenDamage.high };
  const tax = { low: round(items.reduce((s, i) => s + i.parts.low, 0) * 0.04), high: round(items.reduce((s, i) => s + i.parts.high, 0) * 0.09) };
  return { pricingVersion: c.version, items, scanCalibration, shopSupplies, hiddenDamage, subtotal, tax, total: { low: round(subtotal.low + tax.low), high: round(subtotal.high + tax.high) } };
}
