import type { BlogArticle } from "../types";
import { bold, callout, checklist, h2, h3, link, list, p, table, text } from "../helpers";

export const parkedCarDent: BlogArticle = {
  slug: "what-to-do-after-someone-dents-your-parked-car",
  title: "What to Do After Someone Dents Your Parked Car",
  seoTitle: "What to Do When Someone Dents Your Parked Car",
  description: "Document a parked-car dent, preserve evidence, contact the right parties, and compare repair and insurance options step by step.",
  excerpt: "A calm sequence for photographing a parking-lot dent, preserving evidence, checking coverage, and deciding how to pursue repair.",
  category: { name: "After an Accident", slug: "after-an-accident" },
  published: "2026-07-11",
  modified: "2026-07-14",
  image: "/images/blog/parked-car-dent-documentation.webp",
  imageAlt: "Vehicle owner photographing a dent found on the door of a parked car",
  tags: ["parked car dent", "hit and run", "damage documentation", "insurance claim"],
  relatedSlugs: ["how-to-assess-car-damage-after-a-minor-accident", "how-to-negotiate-when-insurance-estimate-is-too-low", "how-to-read-an-auto-body-repair-estimate-line-by-line"],
  blocks: [
    p(text("Finding a fresh dent in a parked car is frustrating because the impact often happened out of view. Resist the urge to wipe the panel, move the vehicle immediately, or decide on the spot that the mark is too small for a claim. First preserve what you found. A clear, time-stamped record gives a repair facility, property manager, insurer, or police agency better facts to work with.")),
    p(text("Start with safety and context, then document the dent from several distances. When you are ready to understand the likely repair scope, a preliminary"), link("vehicle damage cost estimate", "/"), text("can help you compare the probable expense with your deductible. It cannot identify an unknown driver, determine liability, interpret your policy, or replace a body-shop inspection.")),
    h2("stay-and-observe", "Stay at the Location Long Enough to Observe"),
    p(text("Look around before entering or moving the car. Note the parking space number, nearby vehicles, building entrances, cameras, signs, lighting, debris, and any note left on the windshield. If another vehicle is still touching yours, do not separate them before taking overview photos unless safety or property staff require it. Avoid confronting anyone. Contact site security or local authorities if the situation feels unsafe.")),
    callout("Do not wait on video requests", text("Parking-lot and doorbell recordings may be overwritten quickly. Ask the property owner or manager to preserve footage for the relevant time window. They may release it only to police or an insurer, but an early written preservation request can still matter.")),
    h2("photograph", "Photograph the Scene Before Cleaning the Dent"),
    p(text("Take a wide photo showing the vehicle in the space and the surrounding lane. Then capture the entire damaged side, both adjacent panels, a straight-on view, and angled close-ups. Reflections can hide a shallow dent, so move your camera slightly while keeping a consistent distance. Photograph paint transfer, chips, scratches, broken trim, loose handles, and unusual panel gaps. Include the ground if fragments or foreign paint are present.")),
    p(text("Save the original files. Do not crop, filter, annotate, or send only screenshots. Originals retain useful time and image information for your private records. Make a working copy if you need to circle a feature for a repair facility. Avoid posting footage, a suspected vehicle, faces, or license plates publicly; a mistaken identification creates a different problem and does not advance the repair.")),
    table("Parked-car evidence to collect", ["Record", "Details", "Purpose"], [
      ["Scene photos", "Space, lane, signs, nearby vehicles", "Establishes location and context"],
      ["Damage photos", "Wide, straight-on, angled, close-up", "Shows shape, paint, and adjacent panels"],
      ["Written timeline", "Last known undamaged time and discovery time", "Narrows a possible video window"],
      ["Witness details", "Name and preferred contact method", "Preserves an independent observation"],
      ["Property contact", "Manager, security, report number", "Tracks footage and incident records"]
    ]),
    h2("note-or-witness", "Preserve a Note, Witness Account, or Vehicle Details"),
    p(text("Photograph both sides of any note before handling it, then store it in a clean envelope. Record exactly what a witness says rather than rewriting it into a conclusion. If a witness saw another vehicle, ask for its color, body type, distinguishing damage, direction of travel, and plate characters they actually remember. Do not fill gaps for them. A partial but honest account is more useful than a confident guess.")),
    p(text("If the other driver left contact and insurance information, keep communication factual. Confirm names, phone numbers, insurer, policy or claim details, vehicle description, and plate information. Do not agree that a particular cash amount will settle all damage before a professional checks the panel, paint, inner intrusion beam, window mechanism, or adjacent trim.")),
    h2("property-police", "Contact the Property and Decide Whether to Report"),
    p(text("Ask a store, garage, apartment, or workplace for its incident process. Record the representative's name and the internal report number. Request preservation of camera footage in writing with the date, location, and narrowest credible time range. The property may not be responsible for the damage, and it may have rules about releasing video, but its report can preserve a timeline.")),
    p(text("Police reporting requirements for unattended-vehicle damage and hit-and-run incidents vary by state and locality. A department may accept an online, non-emergency, or in-person report depending on injury, damage amount, location, and available suspect information. Use the agency's official channel and keep the report or confirmation number. Do not call an emergency line solely for a routine dent unless there is an immediate safety issue.")),
    h2("inspect-function", "Check More Than the Visible Dimple"),
    p(text("A door dent can involve paint cracking, a sharp body line, a handle, mirror, window track, intrusion beam, weather seal, or an adjacent panel. Open the door slowly and listen for rubbing. Test the handle, lock, window, and mirror from a safe parked position. Stop if the door binds or glass behaves abnormally. A quarter-panel dent may extend into an opening or fixed structural area that is more involved than a removable door skin.")),
    h3("repair-methods", "Possible repair paths"),
    list([
      [bold("Paintless dent repair:"), text(" may be considered when paint is intact, access is suitable, and the shape and metal allow controlled reshaping.")],
      [bold("Conventional body repair:"), text(" may be needed for stretched metal, sharp creases, cracked paint, body-line damage, or areas requiring filler and refinishing.")],
      [bold("Part replacement:"), text(" may enter the discussion when damage is extensive, access is limited, corrosion protection is compromised, or vehicle procedures restrict repair.")]
    ]),
    p(text("Only a qualified repairer with access to the specific vehicle can choose the method. A photo may suggest a likely path but cannot show backside access, metal stretch, prior repairs, corrosion, or internal hardware.")),
    h2("insurance-options", "Compare Repair Cost With Coverage and Deductible"),
    p(text("Review your declarations page and policy rather than assuming every parked-car dent is handled the same way. Depending on the facts and policy, collision, uninsured motorist property damage, or another coverage may be discussed. Deductibles, exclusions, rental coverage, claim deadlines, and reporting duties vary. The"), link("NAIC consumer auto insurance guide", "https://content.naic.org/consumer/auto-insurance.htm"), text("explains common coverage categories while emphasizing that the policy controls.")),
    p(text("Use Carspect's"), link("estimate tool", "/estimate"), text("and a local repair-facility estimate to understand the likely range. If the repair appears close to or below the deductible, you can ask the insurer how an inquiry or claim would be handled before authorizing work. Do not conceal facts or ask a shop to change the cause of loss. If another driver is identified, keep your insurer informed about any direct payment conversation.")),
    callout("Hypothetical deductible comparison", text("Carspect's "), link("2021 Honda Civic rear-bumper sample", "/sample-estimates/honda-civic-rear-bumper-dent"), text(" shows a $950 to $1,600 preliminary range for visible damage in Dallas, Texas, using pricing data US-2026.07-v3. If a policy hypothetically had a $500 deductible and the loss were covered, subtracting $500 from that demonstration range leaves $450 to $1,100 before any coverage limits, supplements, or insurer decisions. This is arithmetic for comparison, not a claim outcome; the sample is not a customer case, certified appraisal, or guaranteed shop price.")),
    h2("open-claim", "Build a Clean Claim File"),
    p(text("The"), link("National Association of Insurance Commissioners", "https://content.naic.org/article/what-you-should-know-about-filing-auto-claim"), text("recommends keeping scene information, notes, estimates, and records of conversations. Create one folder for original photos, property reports, police confirmation, witness contacts, insurer correspondence, estimates, invoices, and receipts. After calls, note the date, representative, claim number, and agreed next step. Ask for important decisions in writing.")),
    checklist("Information to have ready", [
      [text("Policy number, vehicle details, discovery date, and last known undamaged time.")],
      [text("Exact location, space number, property contact, and any incident report.")],
      [text("Original scene and damage photos plus witness information.")],
      [text("Police report number when a report was required or accepted.")],
      [text("Preliminary and body-shop estimates, including any differences in repair method.")]
    ]),
    h2("choose-shop", "Get a Repair-Facility Inspection Before Final Agreement"),
    p(text("Ask the repair facility to identify the damaged part, paint condition, repair method, refinishing area, blend needs, trim removal, corrosion-protection steps, scans, and any conditional operations. Compare the result with Carspect's"), link("sample estimate format", "/sample-estimates"), text("so you can separate parts, labor, paint, and additional procedures. If an insurer writes a different scope, ask the shop and adjuster to address line-by-line differences rather than arguing only about the totals.")),
    p(text("Do not sign a release for all property damage until you understand whether the amount is final, what hidden damage could change, and who pays a supplement. Repair authorization, payment direction, and release forms have different effects. Read them carefully and ask the issuer to explain anything unclear.")),
    h2("if-no-driver", "If the Driver Is Not Found"),
    p(text("Continue with the same organized record. Follow up once with the property and investigating agency using your report numbers. Ask your insurer which coverage, deductible, and documentation apply. Get an estimate before deciding whether to repair immediately, wait, or pay directly. Protect exposed metal from corrosion according to a professional's advice, but document it before temporary protection is applied.")),
    callout("Practical limit", text("This guide provides general documentation and repair-planning information. Coverage, reporting duties, evidence rules, and legal deadlines vary. Your policy, local agency, insurer, and state insurance regulator are the appropriate sources for your specific situation."))
  ],
  faqs: [
    { question: "Should I call police for a dent in a parked car?", answer: "Reporting rules vary by state and locality. Check the local law-enforcement agency's official non-emergency guidance, especially for suspected hit-and-run damage or when property information was not exchanged." },
    { question: "Will insurance cover a parked-car dent?", answer: "It depends on the facts, policy, available coverage, deductible, and state rules. Review your policy and ask your insurer which coverage might apply before assuming the outcome." },
    { question: "Can I ask a store for parking-lot camera footage?", answer: "Yes, ask promptly that relevant footage be preserved. The property may release it only to police or an insurer, but a time-specific written request can help prevent routine overwriting." },
    { question: "Should I clean paint transfer off the dent?", answer: "Photograph it first from multiple distances and angles. Cleaning can remove evidence or reveal deeper paint damage, so preserve original images before changing the surface." },
    { question: "Is paintless dent repair always the cheapest option?", answer: "No. Suitability depends on paint condition, dent shape, material, access, location, and prior repair. A technician must determine whether the method can restore the panel properly." }
  ]
};
