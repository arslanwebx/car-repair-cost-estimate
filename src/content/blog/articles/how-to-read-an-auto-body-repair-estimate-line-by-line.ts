import type { BlogArticle } from "../types";
import { bold, callout, checklist, h2, h3, link, list, p, table, text } from "../helpers";

export const readRepairEstimate: BlogArticle = {
  slug: "how-to-read-an-auto-body-repair-estimate-line-by-line",
  title: "How to Read an Auto Body Repair Estimate Line by Line",
  seoTitle: "How to Read an Auto Body Repair Estimate",
  description: "Decode body shop estimate lines for parts, labor, paint, scans, calibration, fees, and supplements before authorizing repairs.",
  excerpt: "Learn what common collision-estimate abbreviations and line items mean, then compare repair scope without relying on the total alone.",
  category: { name: "Repair Estimates", slug: "repair-estimates" },
  published: "2026-07-12T09:00:00-04:00",
  modified: "2026-07-14T09:00:00-04:00",
  image: "/images/blog/auto-body-repair-estimate-breakdown.webp",
  imageAlt: "Itemized auto body repair estimate showing parts labor paint and calibration lines",
  tags: ["body shop estimate", "labor hours", "parts", "paint", "calibration"],
  relatedSlugs: ["how-to-negotiate-when-insurance-estimate-is-too-low", "how-to-decide-whether-to-repair-or-replace-a-damaged-bumper", "how-to-assess-car-damage-after-a-minor-accident"],
  blocks: [
    p(text("An auto body estimate is a repair plan expressed as operations, quantities, labor times, rates, parts, materials, and notes. The final number matters, but it is the least useful place to begin. Two estimates can have similar totals while proposing different parts or procedures. They can also have very different totals because one includes work the other has not yet documented.")),
    p(text("Before reviewing a shop document, use Carspect's"), link("itemized car repair estimate", "/"), text("to become familiar with the broad categories: parts, body labor, paint labor, materials, scans, calibration, fees, and uncertainty. Then compare each professional estimate by scope. A preliminary online range is not a repair authorization and cannot replace vehicle-specific procedures or teardown findings.")),
    h2("header", "Start With the Estimate Header"),
    p(text("Confirm the owner, vehicle identification number, year, make, model, trim, mileage, production options, claim number, loss date, estimator, shop, and estimate version. A wrong trim or option can select the wrong lamp, bumper, sensor, wheel, or molding. Look for the estimate date and whether it is marked preliminary, supplement, revision, or final. Save every version instead of overwriting the earlier one.")),
    p(text("Read the stated labor and material rates. Body, refinish, frame or structural, mechanical, electrical, glass, aluminum, and detail labor may use different rates. The"), link("FTC's Auto Repair Basics", "https://consumer.ftc.gov/articles/0211-auto-repair-basics"), text("explains that shops may calculate labor using actual technician time or a published flat-rate time. A listed labor hour is therefore a billing unit for an operation, not necessarily a clock-hour prediction of how long your car will remain at the facility.")),
    h2("columns", "Understand the Main Columns"),
    table("Typical estimate columns", ["Column", "Meaning", "Question to ask"], [
      ["Line or operation", "Sequence and repair action", "What physical work does this line authorize?"],
      ["Part or description", "Component and source", "Is it OEM, aftermarket, recycled, or reconditioned?"],
      ["Quantity or price", "Part count and listed cost", "Are shipping, markup, or price changes separate?"],
      ["Labor type", "Body, refinish, frame, mechanical, or other", "Which rate applies?"],
      ["Hours or units", "Database or judgment time", "Is the time included with another operation?"],
      ["Notes or symbols", "Condition, footnote, or manual entry", "What assumption or procedure does the note identify?"]
    ]),
    p(text("Estimating systems use abbreviations that vary. Common actions include remove and install, remove and replace, repair, overhaul, align, refinish, blend, and sublet. Ask for the shop's legend rather than guessing. A symbol may indicate a manual line, included operation, recycled part, price quote, or database note. Manual does not automatically mean improper; it often means the estimator added a procedure or time not supplied by the database. It should still have a clear basis.")),
    h2("parts", "Read Every Parts Line for Source and Scope"),
    p(text("A part description should identify what is being replaced and, ideally, the source. OEM generally means supplied under the vehicle manufacturer's brand. Aftermarket means produced outside that brand's parts channel. Recycled OEM is a used original part, while remanufactured or reconditioned parts have been restored through a defined process. The FTC describes these broad classifications and recommends understanding whether replacement parts are new, remanufactured, rebuilt, or salvage.")),
    p(text("Check whether the estimate includes fasteners, clips, brackets, absorbers, reinforcements, emblems, moldings, lamps, sensor holders, adhesives, seam sealers, and one-time-use hardware. A bumper line may refer only to the painted outer cover. It does not automatically include the energy absorber or metal reinforcement behind it. Look for freight, core charges, hazardous-material charges, tax, and price adjustments, then ask which amounts are verified quotes versus allowances.")),
    h3("repair-replace", "Repair and replace are different scopes"),
    p(text("A repair line retains the existing component and adds labor to restore it. A replacement line adds the part plus labor to transfer equipment, fit, prepare, and install it. Refinishing may be separate. When two estimates disagree, compare not only price but also the assumed condition, repairability, parts availability, vehicle procedure, and included transfer work.")),
    h2("labor", "Separate Body, Structural, Mechanical, and Diagnostic Labor"),
    list([
      [bold("Body labor"), text("covers many remove, install, replace, align, and sheet-metal repair operations.")],
      [bold("Frame or structural labor"), text("may cover measuring, setup, pulling, or structural-component procedures at a distinct rate.")],
      [bold("Mechanical labor"), text("may apply to cooling, suspension, steering, air conditioning, or other mechanical work connected to the collision repair.")],
      [bold("Electrical or diagnostic labor"), text("may cover troubleshooting, scans, programming, aiming, or wiring operations when not listed as a fixed sublet charge.")]
    ]),
    p(text("Look for overlap. Estimating databases may include some adjacent work with a main operation and exclude other steps. For example, replacing a panel may include a basic installation time but not damaged fastener extraction, corrosion protection, destructive test welds, extensive cleanup, or access to a hidden component. Ask the estimator to show the database note or manufacturer procedure when a line is unclear.")),
    h2("paint", "Follow the Refinish Calculation"),
    p(text("Refinish labor prepares and paints repaired or replaced surfaces. It may include basecoat and clearcoat application but exclude masking, color tinting, finish sanding, denib and polish, corrosion protection, seam sealer, or special multi-stage formulas unless separately listed. Paint materials are often calculated from refinish hours using a shop rate, a materials system, or an invoice-based method. Confirm which approach the estimate uses.")),
    p(text("Blending extends color into an undamaged adjacent panel to create a visually consistent transition. That line can add remove-and-install work for handles, lamps, moldings, belt trim, or mirrors on the blend panel. Ask why blending is proposed, which panels are included, and whether the paint formula or vehicle procedure affects the decision. Do not assume that a paint charge means the entire vehicle or even the entire adjacent panel is being repainted.")),
    h2("measure-scan-calibrate", "Find Measuring, Scanning, and Calibration Lines"),
    p(text("Modern collision repair can require pre-repair scans, post-repair scans, measurements, wheel alignment checks, programming, initialization, static calibration, dynamic calibration, or test drives. These are different operations. The"), link("NHTSA driver-assistance overview", "https://www.nhtsa.gov/vehicle-safety/driver-assistance-technologies"), text("shows how cameras, radar, and other technologies support features such as automatic emergency braking and lane assistance. The vehicle manufacturer's current repair information determines which procedures apply after a particular repair.")),
    p(text("A line labeled calibration should identify the system or component, the procedure basis, and whether the amount is shop labor or a sublet allowance. Dynamic calibration may require a controlled drive under specified conditions; static calibration may need targets, level flooring, measurements, and setup space. A wheel alignment does not automatically replace sensor calibration, and a diagnostic scan does not prove physical aiming.")),
    h2("included-not-included", "Watch for Included, Not-Included, and Conditional Operations"),
    p(text("Estimate footnotes often matter more than their small type suggests. An operation marked included should not be charged twice unless the additional line is for a different procedure or circumstance. A not-included item may require a separate line when needed. Conditional entries may say 'if required,' 'after measure,' 'price pending,' or 'inspect after teardown.' Ask when that condition will be resolved and who must approve added work.")),
    callout("A supplement is not automatically a mistake", text("An initial estimate is based on accessible information. After parts are removed, a repair facility may document hidden damage, changed part prices, additional procedures, or unavailable parts in a supplemental estimate. The supplement should explain the new scope and connect it to evidence.")),
    h2("totals", "Reconcile the Totals in Order"),
    checklist("Check the math trail", [
      [text("Parts subtotal, part discounts or markup, freight, and core charges.")],
      [text("Labor hours multiplied by the correct category rates.")],
      [text("Paint materials and any separate body or shop materials.")],
      [text("Sublet operations such as glass, alignment, towing, calibration, or specialty repair.")],
      [text("Fees, tax treatment, deductible, betterment, prior damage, and customer-pay items.")],
      [text("Gross total, insurer or other payments, and the remaining customer responsibility.")]
    ]),
    p(text("A deductible is generally the policyholder's share of a covered loss, not a discount from the repair scope. Betterment or depreciation may apply in limited situations depending on policy and state rules. Prior unrelated damage should be separated from the loss under review. Ask for written explanations of any amount assigned to you.")),
    h2("compare", "Compare Two Estimates Line by Line"),
    p(text("Print or open both documents side by side. Match each damaged component and mark differences in repair versus replace, part source, quantity, labor operation, hours, paint scope, blends, scans, calibration, materials, fees, and tax. Then compare assumptions: Did one estimator inspect the vehicle in person? Was teardown performed? Are parts prices confirmed? Does one document include hidden-damage allowances or operations the other defers?")),
    p(text("Use the"), link("Carspect estimate flow", "/estimate"), text("and"), link("sample reports", "/sample-estimates"), text("to see a simplified itemized layout, then read our guide to"), link("responding to a low insurance estimate", "/blog/how-to-negotiate-when-insurance-estimate-is-too-low"), text("if the repair facility and insurer disagree. Focus the conversation on documented scope, not accusations. Ask each party to explain the exact lines it would add, remove, or change.")),
    h2("authorize", "Questions to Ask Before You Authorize Repairs"),
    list([
      [text("Which items are confirmed and which are allowances or pending inspection?")],
      [text("Which repair procedures and parts sources are being used?")],
      [text("What could trigger a supplement, and who will contact me before added work?")],
      [text("Which scans, measurements, alignments, calibrations, and quality checks are included?")],
      [text("What warranties apply to parts, paint, and workmanship, and who provides each one?")],
      [text("What amount may remain my responsibility beyond the deductible?")]
    ]),
    p(text("A readable estimate makes the repair conversation specific. Keep every version, signed authorization, parts invoice, calibration report, alignment result, scan record, and final bill together. At delivery, compare the final invoice with the authorized scope and ask for an explanation of changes before you leave."))
  ],
  faqs: [
    { question: "What does R&I mean on a body shop estimate?", answer: "R&I usually means remove and install. The existing part is taken off to provide access or complete another operation, then installed again rather than replaced." },
    { question: "Why are body and paint labor listed separately?", answer: "They cover different work and may use different rates. Body labor handles repair and component operations, while refinish labor covers preparation and paint-related procedures." },
    { question: "What is a supplement on an auto body estimate?", answer: "A supplement is a documented revision for additional damage, procedures, price changes, or parts discovered after the initial estimate, often during teardown or repair planning." },
    { question: "Does a pre-scan include ADAS calibration?", answer: "No. A scan reads system information. Calibration physically or electronically aims or initializes a system according to vehicle-specific requirements and is a separate procedure." },
    { question: "Why do two repair estimates have different totals?", answer: "They may use different repair methods, parts sources, labor rates, paint scope, procedures, inspection depth, or assumptions. Compare each line and note rather than only the totals." },
    { question: "Is the lowest auto body estimate the best choice?", answer: "Not necessarily. Confirm that the estimate covers the same damage, parts, procedures, refinishing, diagnostics, calibration, and warranty before comparing price." }
  ]
};
