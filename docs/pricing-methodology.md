# Carspect pricing methodology

Carspect keeps photo classification and pricing separate. The vision provider returns schema-validated observations without dollar amounts. The deterministic engine in `src/lib/pricing.ts` calculates all costs from the versioned workbook data in `src/config/workbook-pricing.v1.json`.

## Workbook coverage

The imported model contains 51 U.S. state/DC rate rows, 73 damage operations, vehicle-class, powertrain, body-material, paint, parts-source, and vehicle-age adjustments, plus 54 global-market rows. `scripts/generate_workbook_pricing.py` regenerates the JSON configuration from the source workbook. The configuration records every worksheet in `worksheetAudit` so an incomplete import fails review.

## Calculation order

1. Infer the U.S. state from the five-digit ZIP code and load its body, paint, frame, mechanical, material, scan, calibration, supplies, hazmat, parts, and hidden-reserve values.
2. Map each validated damage observation to the closest workbook operation code.
3. Calculate new OEM, certified aftermarket, recycled OEM, and economical parts scenarios independently. Each operation has source-eligibility rules; unsuitable alternatives fall back to OEM and are disclosed in the report.
4. Calculate body, paint, frame, and mechanical labor; paint materials; parts; and consumables.
5. De-duplicate scans and calibration across multiple observations.
6. Add capped shop supplies and one environmental fee.
7. Calculate a central estimate, then apply a photo-confidence band: approximately ±12% for high confidence, ±16–18% for moderate confidence, and ±20–25% for limited/user-input fallback confidence, bounded by the workbook operation factors.
8. Show the workbook hidden-damage reserve separately as a potential supplement. It does not silently inflate the main likely range.

Taxes remain zero unless a maintained jurisdiction-specific rule can determine which repair components are taxable. Inventing a broad tax percentage would make the estimate less accurate.

The `all` selection returns the envelope of all four feasible scenarios and exposes each scenario separately. A specific selection returns only that category's run. Labor, paint, scans, and procedures do not receive an artificial parts discount.

## Accuracy limitation

The workbook and application both describe the output as a preliminary visible-damage range. No photo-only model can guarantee the final repair cost because teardown, diagnostic results, OEM procedures, exact part numbers, current availability, shop rates, and hidden damage can change the invoice. Production accuracy should be measured against actual shop estimates and final invoices, then used to recalibrate versioned rules.
