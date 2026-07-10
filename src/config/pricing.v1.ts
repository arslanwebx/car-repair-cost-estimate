export const pricingConfig = {
  version: "US-2026.07-v1",
  labor: { body: [58, 105], paint: [55, 98], mechanical: [90, 165] },
  regional: { northeast: 1.18, west: 1.2, south: 0.94, midwest: 0.98, national: 1 },
  vehicleClass: { sedan: 1, coupe: 1.08, hatchback: 1, suv: 1.12, crossover: 1.08, pickup: 1.14, van: 1.08, minivan: 1.06, sports: 1.35, luxury: 1.42, other: 1.05 },
  parts: { economical: 0.82, aftermarket: 0.88, recycled_oem: 0.78, new_oem: 1.15, all: 1 },
  operations: {
    front_bumper: { repair: { hours: [2, 5], parts: [40, 220], paint: [260, 520] }, replace: { hours: [3, 6], parts: [330, 1150], paint: [300, 620] } },
    rear_bumper: { repair: { hours: [2, 5], parts: [35, 180], paint: [250, 500] }, replace: { hours: [3, 6], parts: [300, 1050], paint: [300, 600] } },
    hood: { repair: { hours: [3, 8], parts: [30, 120], paint: [380, 720] }, replace: { hours: [4, 8], parts: [450, 1600], paint: [420, 820] } },
    left_front_fender: { repair: { hours: [3, 7], parts: [25, 100], paint: [320, 650] }, replace: { hours: [3, 6], parts: [220, 900], paint: [340, 680] } },
    right_front_fender: { repair: { hours: [3, 7], parts: [25, 100], paint: [320, 650] }, replace: { hours: [3, 6], parts: [220, 900], paint: [340, 680] } },
    grille: { repair: { hours: [1, 2], parts: [20, 80], paint: [0, 120] }, replace: { hours: [1, 3], parts: [180, 900], paint: [0, 160] } }
  },
  fallback: { repair: { hours: [2, 7], parts: [30, 160], paint: [280, 650] }, replace: { hours: [3, 8], parts: [250, 1400], paint: [320, 760] } },
  severity: { minor: 0.75, moderate: 1, severe: 1.4 },
  scan: [120, 280], calibration: [250, 900], shopSuppliesRate: [0.04, 0.08], hiddenRisk: { low: [0, 120], moderate: [150, 500], high: [400, 1400] }
} as const;
