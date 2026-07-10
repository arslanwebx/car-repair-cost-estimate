import { z } from "zod";
import { estimateInputSchema, visionAnalysisSchema } from "./estimate-schema";
const moneyRangeSchema=z.object({low:z.number().nonnegative(),high:z.number().nonnegative()}).refine(value=>value.high>=value.low);
export const pricedEstimateSchema=z.object({pricingVersion:z.string().min(1),items:z.array(z.object({area:z.string().min(1),operation:z.string().min(1),laborHours:moneyRangeSchema,parts:moneyRangeSchema,bodyLabor:moneyRangeSchema,paint:moneyRangeSchema})).min(1),scanCalibration:moneyRangeSchema,shopSupplies:moneyRangeSchema,hiddenDamage:moneyRangeSchema,subtotal:moneyRangeSchema,tax:moneyRangeSchema,total:moneyRangeSchema});
export const reportSchema=z.object({id:z.string().min(5).max(80),generatedAt:z.string().datetime(),input:estimateInputSchema,vision:visionAnalysisSchema,estimate:pricedEstimateSchema});
export type EstimateReport=z.infer<typeof reportSchema>;
