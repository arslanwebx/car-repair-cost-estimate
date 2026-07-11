# Pricing model calibration

Carspect deliberately separates visual classification from price calculation:

1. The vision model classifies visible panel, damage type, severity, likely repair/replace strategy, paint damage, alignment concern, and photo confidence.
2. `src/lib/pricing.ts` maps that classification to a versioned operation from `src/config/workbook-pricing.v1.json`.
3. The calculator applies workbook labor hours, state labor rates, parts source, vehicle class, powertrain, construction material, age, paint materials, scans, calibrations, supplies, and hidden-damage reserve.

The vision model is forbidden from returning prices. This prevents an ungrounded language-model number from overriding the estimating data.

## What “training for accuracy” requires

A defensible trained calibration model needs licensed, de-identified outcomes that pair the original submission with a qualified shop estimate or final repair invoice. Each record should include:

- Carspect pricing-data version and predicted operation codes
- vehicle year, make, model, trim, body style, powertrain, construction, and ZIP/state
- submitted images or stable derived visual features, with explicit training consent
- shop-confirmed operations, labor hours and rates, parts source and prices, paint/material charges, calibrations, fees, and final total
- supplements and the hidden damage found after teardown
- estimate date, shop market, and whether the value is an initial quote or final invoice

Train/validation/test splits must be separated by vehicle and repair event, not by image, so multiple photos of the same damage cannot leak between sets. Report error by operation, state, vehicle class, severity, and confidence rather than publishing one overall accuracy percentage.

Until that outcome dataset exists, improvements should be described as workbook calibration and classification-prompt refinement—not model training. Never use customer photos for training without clear consent and an updated privacy policy.
