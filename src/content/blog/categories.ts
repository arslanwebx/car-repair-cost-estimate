import type { BlogCategorySlug } from "./types";

export type BlogCategory = {
  slug: BlogCategorySlug;
  name: string;
  description: string;
  intro: string;
};

export const blogCategories: BlogCategory[] = [
  {
    slug: "damage-assessment",
    name: "Damage Assessment",
    description: "Practical guides for documenting visible vehicle damage and deciding what needs professional inspection.",
    intro: "Damage assessment starts with safety, then moves to careful observation. These guides explain how to document visible body damage, check nearby components, and recognize the limits of a driveway inspection. Use them to organize useful photos and notes before requesting a preliminary estimate or visiting a qualified collision repair facility. They do not replace structural measurements, diagnostics, or a hands-on safety inspection."
  },
  {
    slug: "after-an-accident",
    name: "After an Accident",
    description: "Clear next steps for documenting damage, protecting records, and starting an auto claim after an incident.",
    intro: "The first hours after an incident can feel disorganized, even when the vehicle damage looks minor. This collection focuses on calm, practical steps: protect people first, photograph the scene and damage, record the facts, and keep a clean claim file. Requirements and deadlines vary by state and policy, so these guides also show where general information ends and insurer or legal guidance begins."
  },
  {
    slug: "repair-estimates",
    name: "Repair Estimates",
    description: "Learn how body shop estimates separate parts, labor, paint, procedures, fees, and possible supplements.",
    intro: "Auto body estimates are easier to compare when you understand how each operation contributes to the total. These guides translate common line items, labor categories, parts descriptions, paint calculations, scans, and calibration entries into plain language. They also explain why an initial estimate can change after teardown. The goal is not to challenge every charge, but to help you ask specific questions and compare scope consistently."
  },
  {
    slug: "insurance-claims",
    name: "Insurance Claims",
    description: "Prepare a documented response when an insurer and repair facility disagree about collision repair scope or cost.",
    intro: "Insurance claim estimates and repair-facility estimates may start from different information. This collection helps you identify the exact differences, gather supporting documentation, and communicate without turning the discussion into a vague price dispute. Coverage, appraisal rights, repair-choice rules, and complaint processes vary by policy and state. Treat these articles as preparation for a productive conversation, not legal advice or a promise of claim payment."
  },
  {
    slug: "repair-or-replace",
    name: "Repair or Replace",
    description: "Understand the factors technicians consider when choosing between repairing and replacing damaged body parts.",
    intro: "Repairing a damaged panel can preserve an original part and reduce waste, but replacement may be necessary when material, mounting points, sensors, or manufacturer procedures make repair unsuitable. These guides explain the decision factors without pretending that photos can settle every case. Final choices should follow vehicle-specific procedures and a qualified technician's inspection, especially when a bumper or panel supports safety-related equipment."
  }
];

export function getBlogCategory(slug: string) {
  return blogCategories.find((category) => category.slug === slug);
}
