import { describe,expect,it } from "vitest";
import { reportSchema } from "./report-schema";
describe("report validation",()=>{it("rejects a report without itemized operations",()=>{const result=reportSchema.safeParse({id:"CSP-TEST",generatedAt:new Date().toISOString(),input:{},vision:{},estimate:{items:[]}});expect(result.success).toBe(false)})});
