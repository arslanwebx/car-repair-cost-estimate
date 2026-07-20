import type { Metadata } from "next";

export const SITE_NAME = "Carspect";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://carspect.pro";
export const DEFAULT_SOCIAL_IMAGE = "/opengraph-image";
export const DEFAULT_SOCIAL_IMAGE_ALT = "Carspect car body repair estimate calculator";
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const AUTHOR_NAME = "Roman E.";
export const AUTHOR_PATH = "/authors/roman-e";
export const AUTHOR_ID = `${SITE_URL}${AUTHOR_PATH}#person`;

export const STATIC_PAGE_SEO = {
  home: {
    title: "Free Car Body Repair Estimate Calculator",
    description: "Use our free car body repair estimate calculator to upload damage photos and get an itemized preliminary range for parts, labor, paint, and more.",
    path: "/"
  },
  estimate: {
    title: "Upload Car Damage Photos for a Repair Estimate",
    description: "Enter your vehicle details, select damaged areas, and upload clear photos to receive an itemized preliminary car repair cost range.",
    path: "/estimate"
  },
  sampleEstimates: {
    title: "Sample Car Body Repair Estimates and Reports",
    description: "Review Carspect sample damage reports with vehicle photos, visible findings, itemized repair ranges, assumptions, and downloadable PDFs.",
    path: "/sample-estimates"
  },
  aboutUs: {
    title: "About Carspect and Its Repair Estimate Method",
    description: "Learn why Carspect was created, how photo findings and pricing rules produce preliminary repair ranges, and where the tool is limited.",
    path: "/about-us"
  },
  contactUs: {
    title: "Contact Carspect Support",
    description: "Contact Carspect about estimate support, photo and data handling, report feedback, privacy requests, or general service questions.",
    path: "/contact-us"
  },
  privacyPolicy: {
    title: "Carspect Privacy Policy",
    description: "Read how Carspect processes estimator details, vehicle photos, contact requests, technical logs, cookies, service providers, and deletion requests.",
    path: "/privacy-policy"
  },
  termsOfService: {
    title: "Carspect Terms of Service",
    description: "Review the terms governing Carspect estimates, user submissions, vehicle-safety limitations, service availability, third parties, and liability.",
    path: "/terms-of-service"
  },
  disclaimer: {
    title: "AI Estimate and Automotive Disclaimer",
    description: "Understand the visible-damage, pricing, safety, insurance, and inspection limits that apply to every preliminary Carspect repair estimate.",
    path: "/disclaimer"
  },
  cookiePolicy: {
    title: "Carspect Cookie Policy",
    description: "Learn which essential, preference, analytics, and advertising storage categories Carspect may use and how optional tracking choices work.",
    path: "/cookie-policy"
  },
  photoDataPolicy: {
    title: "Carspect Photo and Data Handling Policy",
    description: "See how Carspect validates, sanitizes, processes, retains, and protects vehicle-damage photos and related estimator information.",
    path: "/photo-data-policy"
  },
  editorialPolicy: {
    title: "Carspect Editorial Policy",
    description: "Read how Carspect identifies authors, uses reliable sources, labels estimates and limitations, avoids unsupported claims, and corrects errors.",
    path: "/editorial-policy"
  },
  blog: {
    title: "Car Damage and Auto Body Repair Guides",
    description: "Read practical Carspect guides about documenting vehicle damage, understanding body shop estimates, insurance claims, and repair decisions.",
    path: "/blog"
  },
  romanE: {
    title: "Roman E., Carspect Author",
    description: "Meet Roman E., author of Carspect educational guides about documenting vehicle damage, reading repair estimates, and planning next steps.",
    path: AUTHOR_PATH
  }
} as const;

export type StaticPageSeoKey = keyof typeof STATIC_PAGE_SEO;

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export function brandedTitle(title: string) {
  return title.includes("Carspect") ? title : `${title} | ${SITE_NAME}`;
}

export function createPageMetadata({
  title,
  description,
  path,
  type = "website",
  image = DEFAULT_SOCIAL_IMAGE,
  imageAlt = DEFAULT_SOCIAL_IMAGE_ALT
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  image?: string;
  imageAlt?: string;
}): Metadata {
  const socialTitle = brandedTitle(title);
  return {
    title,
    description,
    // Indexing is explicit for all public, canonical pages. This prevents a
    // stale inherited directive from accidentally keeping new content out of
    // search results; the estimator is the sole exception in metadataFor.
    robots: { index: true, follow: true },
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      type,
      siteName: SITE_NAME,
      title: socialTitle,
      description,
      url: absoluteUrl(path),
      images: [{ url: absoluteUrl(image), width: 1200, height: image === DEFAULT_SOCIAL_IMAGE ? 630 : 675, alt: imageAlt }]
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [{ url: absoluteUrl(image), alt: imageAlt }]
    }
  };
}

export function metadataFor(key: StaticPageSeoKey) {
  const metadata = createPageMetadata(STATIC_PAGE_SEO[key]);
  if (key === "home") metadata.title = brandedTitle(STATIC_PAGE_SEO.home.title);
  // The interactive estimator is intentionally excluded from search. Keep
  // this exception here so every other public route remains indexable.
  if (key === "estimate") metadata.robots = { index: false, follow: true };
  return metadata;
}

export function organizationJsonLd() {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: { "@type": "ImageObject", "@id": `${SITE_URL}/#logo`, url: absoluteUrl("/icon.svg"), contentUrl: absoluteUrl("/icon.svg") },
    email: "support@carspect.pro",
    contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: "support@carspect.pro", url: absoluteUrl("/contact-us") }
  };
}

export function websiteJsonLd() {
  return { "@type": "WebSite", "@id": WEBSITE_ID, name: SITE_NAME, url: SITE_URL, publisher: { "@id": ORGANIZATION_ID } };
}

export function safeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
