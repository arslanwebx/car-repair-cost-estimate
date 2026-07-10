# Pricing methodology

Carspect keeps vision classification and pricing separate. The vision provider returns schema-validated observations and no dollar amounts. `src/config/pricing.v1.ts` contains the published configuration version, baseline labor ranges, regional and vehicle-class factors, parts-source factors, operation templates, scan/calibration ranges, supplies, and hidden-damage allowances.

For each visible area, the engine selects a repair or replacement template. Low and high values use their respective labor hours, labor rates, parts ranges, and paint/material ranges. Vehicle, electric-vehicle, severity, and broad regional factors apply where relevant. Scan/calibration, supplies, potential hidden-damage allowance, and an explicit tax range are then added. The result is an estimated U.S. market repair range, not licensed shop-database pricing or a binding quote.

Before production use, a qualified estimator should review every configuration value, ZIP-to-market mapping should be replaced with a maintained postal dataset, and state/local tax rules should be configured from a maintained source.
