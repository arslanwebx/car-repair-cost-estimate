import type { BlogArticle } from "../types";
import { bold, callout, checklist, h2, h3, link, list, p, table, text } from "../helpers";

export const howToAssessCarDamage: BlogArticle = {
  slug: "how-to-assess-car-damage-after-a-minor-accident",
  title: "How to Assess Car Damage After a Minor Accident",
  seoTitle: "Assess Car Damage After a Minor Accident",
  description: "Use a safety-first checklist to document visible car damage, take useful photos, and know when a minor impact needs inspection.",
  excerpt: "A practical, safety-first process for checking visible body damage, recording evidence, and recognizing when a minor impact needs expert inspection.",
  category: { name: "Damage Assessment", slug: "damage-assessment" },
  published: "2026-07-10T09:00:00-04:00",
  modified: "2026-07-14T09:00:00-04:00",
  image: "/images/blog/assess-car-damage-after-minor-accident.webp",
  imageAlt: "Driver inspecting bumper and body panel damage after a minor car accident",
  tags: ["car damage", "minor accident", "damage photos", "body repair"],
  relatedSlugs: ["what-to-do-after-someone-dents-your-parked-car", "how-to-read-an-auto-body-repair-estimate-line-by-line", "how-to-decide-whether-to-repair-or-replace-a-damaged-bumper"],
  blocks: [
    p(text("A minor collision can leave more than a scuff. A bumper cover may spring back while clips, brackets, lamps, or the reinforcement behind it remain damaged. Your first review should therefore be organized, cautious, and limited to what you can see without crawling under the vehicle or taking parts apart. The goal is to create a reliable record and decide whether the vehicle needs immediate professional attention. It is not to perform a structural inspection at the roadside.")),
    p(text("Once everyone is safe and the scene is handled, use this guide to document the vehicle before conditions change. You can then use the photos for a preliminary"), link("car body repair estimate", "/"), text("and bring the same record to a repair facility. A photo-based range is useful for planning, but it cannot confirm hidden damage, alignment, sensor operation, or roadworthiness.")),
    callout("Safety comes first", text("If anyone is injured, the vehicle is leaking fluid, a wheel looks displaced, airbags deployed, smoke is present, or the car is exposed to traffic, stop inspecting it. Contact emergency services or roadside assistance as appropriate. Follow local reporting and scene-safety requirements.")),
    h2("before-you-look", "Before You Look at the Damage"),
    p(text("Move only when it is safe and lawful to do so. If the vehicle is already in a protected location, turn it off, set the parking brake, and keep clear of moving traffic. The National Highway Traffic Safety Administration reminds drivers to slow down and move over around stopped emergency or disabled vehicles in its"), link("Move Over guidance", "https://www.nhtsa.gov/move-over-its-law"), text(". That principle matters for your own roadside behavior too: do not stand between vehicles or step into a travel lane for a better photo.")),
    p(text("Take a slow breath before touching anything. Fresh paint transfer, loose trim, and scattered pieces are evidence. Photograph them in place first. Do not push a bumper back into shape, wipe the contact area, discard a broken clip, or test a damaged lamp while documenting the initial condition. If another vehicle or property was involved, keep the scene and claim documentation separate from your mechanical assessment.")),
    checklist("Quick safety screen", [
      [text("Confirm that people and pets are safe before looking at the car.")],
      [text("Check for fuel, coolant, oil, or battery fluid without touching it.")],
      [text("Look for smoke, heat, exposed wiring, or a strong electrical smell.")],
      [text("Notice whether a tire is flat, cut, rubbing, or visibly out of position.")],
      [text("Do not drive if steering, braking, lighting, visibility, or wheel clearance seems compromised.")]
    ]),
    h2("photo-sequence", "Take Photos in a Repeatable Sequence"),
    p(text("Good documentation moves from context to detail. Start several steps back and photograph all four corners of the vehicle, even if only one corner was contacted. Add a straight-on image of the damaged side, then a three-quarter view that shows how the affected panel meets its neighbors. Finish with close-ups of dents, cracks, scrapes, broken mounts, gaps, and paint transfer. Keep the camera parallel to the panel when possible so distortion does not exaggerate the damage.")),
    p(text("Use daylight or even garage lighting. Avoid a flash reflected directly off glossy paint. Include a familiar object for scale only if it does not cover the damage, and never place private documents, faces, house numbers, or license information in the frame unnecessarily. Take one photo with the vehicle identification information for your private claim file, but do not upload that photo to public services.")),
    table("A useful damage photo set", ["View", "What it should show", "Why it helps"], [
      ["Whole vehicle", "Vehicle position and damaged side", "Preserves context and overall stance"],
      ["Corner view", "Affected area plus adjacent panels", "Shows panel gaps and transferred force"],
      ["Straight-on", "Full damaged panel", "Reduces perspective distortion"],
      ["Close-up", "Crack, dent, scrape, or broken edge", "Records surface and material condition"],
      ["Functional area", "Lamp, wheel, sensor area, or opening", "Supports a safety and procedure discussion"]
    ]),
    h2("walkaround", "Perform a Careful Exterior Walkaround"),
    h3("panel-gaps", "Compare panel gaps"),
    p(text("Look at the seams around the hood, trunk, hatch, doors, fenders, and bumper. Compare the damaged side with the undamaged side. A gap that suddenly narrows, widens, sits proud, or rubs can indicate a shifted panel, bent mounting point, or broken retainer. Do not force a hood, door, or trunk closed if it resists. A latch that does not engage consistently needs professional attention.")),
    h3("paint-material", "Separate surface marks from material damage"),
    p(text("Paint transfer may sit on top of the clear coat, while a scratch that catches a fingernail can reach deeper layers. A crease changes the metal or plastic shape; a crack separates the material. Photograph each condition before cleaning. Do not assume a flexible bumper is unharmed because it looks smooth again. Stress whitening, torn tabs, ripples near an edge, and a gap below a lamp can reveal deformation that a wide photo misses.")),
    h3("lamps-glass", "Check lamps, mirrors, and glass"),
    p(text("Inspect lenses for cracks, moisture, looseness, and missing pieces. Confirm only from a safe position that required lamps operate. Examine mirrors and nearby glass for chips or spreading cracks. A damaged lamp mounting bracket may allow the lamp to move even when the lens is intact. Avoid touching shattered safety glass with bare hands, and keep others away from fragments.")),
    h2("tires-wheels", "Look Closely at Tires and Wheel Clearance"),
    p(text("A low-speed impact near a wheel can affect the tire, rim, suspension, steering, or alignment. Look for cuts, bubbles, exposed cord, a bent rim edge, fresh rubbing, or a wheel that no longer appears centered in the opening. The NHTSA"), link("tire safety guidance", "https://www.nhtsa.gov/vehicle-safety/tires"), text("notes that underinflation may not be obvious by appearance alone and recommends routine pressure and tread checks. A dashboard tire-pressure warning after an impact deserves attention rather than a visual guess.")),
    p(text("Do not reach behind a wheel or lie under the vehicle. If a tire rubs, steering feels different, the car pulls, or a wheel vibrates, arrange a qualified inspection or tow. Driving a few miles to see whether the symptom clears can turn a manageable problem into a safety risk or additional damage.")),
    h2("inside-checks", "Check the Cabin and Dashboard"),
    p(text("From the driver's seat, record warning lights before restarting the vehicle. Note messages for airbags, braking, steering, parking sensors, cameras, lighting, or tire pressure. Check that seat belts retract and latch, doors open normally, and visibility is unobstructed. Do not erase codes or disconnect the battery simply to clear a message. Diagnostic information can help a technician understand what occurred.")),
    p(text("Modern bumpers, grilles, mirrors, and windshields may contain or sit near cameras, radar, ultrasonic sensors, or wiring. A system can look normal while a bracket is shifted. A warning-free dashboard also does not prove that aiming is correct. Vehicle-specific repair information determines whether scanning, measurement, calibration, or a road test is required.")),
    h2("document-facts", "Write Down Facts, Not Conclusions"),
    p(text("Create a short timeline: date, approximate time, location, weather, direction of travel, point of contact, and what you observed immediately afterward. Record sounds, warning lights, fluid spots, and changes in steering or braking. Use neutral phrases such as 'front bumper gap is wider below the right lamp' instead of 'frame is bent.' The first describes evidence; the second claims a diagnosis that photos cannot support.")),
    p(text("If you may file a claim, preserve contact, vehicle, witness, and insurer information. The"), link("National Association of Insurance Commissioners claim guide", "https://content.naic.org/article/what-you-should-know-about-filing-auto-claim"), text("recommends prioritizing safety, collecting scene information, keeping notes, and retaining records of claim conversations. Policy duties and reporting rules vary, so review your policy and state insurance regulator's guidance.")),
    h2("estimate-next-step", "Turn the Record Into a Useful Next Step"),
    p(text("Organize the clearest wide view and two or three close-ups. Use Carspect's"), link("free estimate flow", "/estimate"), text("to receive a preliminary itemized range based on visible damage, vehicle details, and broad regional factors. Compare the format with the"), link("sample estimates", "/sample-estimates"), text("before interpreting the result. The range is informational and may change after disassembly, measuring, diagnostics, parts research, or a repair-facility inspection.")),
    p(text("Bring your original photos, notes, and estimate to the shop. Ask which visible items are confirmed, which operations remain conditional, and what signs could trigger a supplement. A good conversation distinguishes cosmetic repair, part replacement, refinishing, scans, calibration, and hidden-damage investigation instead of collapsing everything into one total.")),
    h2("inspection-triggers", "When a Professional Inspection Should Not Wait"),
    list([
      [bold("Tow or urgent inspection:"), text(" fluid leakage, smoke, deployed airbags, damaged restraints, wheel displacement, steering or braking change, broken required lighting, exposed sharp parts, or a hood or door that will not latch.")],
      [bold("Prompt collision inspection:"), text(" uneven gaps, cracked bumper material, loose lamps, sensor warnings, impact near a wheel, trunk or hatch water leakage, or damage that crosses multiple panels.")],
      [bold("Routine estimate appointment:"), text(" apparently cosmetic scuffs or shallow dents with normal vehicle operation and no warning signs, while still recognizing that hidden damage is possible.")]
    ]),
    callout("Keep the limitation visible", text("Neither this checklist nor a photo estimate determines whether a vehicle is safe to drive. When symptoms, warnings, or impact location create doubt, choose an in-person inspection.")),
    h2("final-checklist", "Your Minor-Accident Documentation Checklist"),
    checklist("Before you finish", [
      [text("Save wide, corner, straight-on, and close-up photographs.")],
      [text("Record dashboard warnings and changes in vehicle behavior.")],
      [text("Preserve broken pieces and do not alter the contact area before photographing it.")],
      [text("Write a factual timeline and keep claim communication in one file.")],
      [text("Request a preliminary range, then arrange professional inspection when any safety or hidden-damage concern remains.")]
    ])
  ],
  faqs: [
    { question: "Can I assess minor car damage from photos alone?", answer: "Photos can document visible conditions and support a preliminary cost range, but they cannot confirm hidden structural, mechanical, mounting, wiring, or sensor damage." },
    { question: "How many damage photos should I take?", answer: "Take at least one whole-vehicle view, two corner views, one straight-on panel view, and several focused close-ups. Add dashboard warnings and affected lamps or wheels when safe." },
    { question: "Should I drive after a minor bumper impact?", answer: "Do not drive if you notice fluid leaks, displaced wheels, steering or braking changes, warning lights, rubbing, loose parts, impaired lighting, or an unreliable latch. Arrange professional help." },
    { question: "Can a bumper look normal but still be damaged?", answer: "Yes. Flexible bumper covers can rebound while clips, brackets, absorbers, reinforcements, wiring, or sensor mounts remain damaged or shifted." },
    { question: "Should I clean paint transfer before taking photos?", answer: "No. Photograph the initial condition first. Cleaning may remove useful evidence or reveal deeper marks, so preserve before-and-after images if you later clean the area." }
  ]
};
