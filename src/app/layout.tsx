import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { GoogleAnalytics } from "@/components/google-analytics";
import { DEFAULT_SOCIAL_IMAGE, DEFAULT_SOCIAL_IMAGE_ALT, SITE_URL } from "@/lib/seo";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap"
});
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Free AI Car Body Repair Estimate Calculator | Carspect", template: "%s | Carspect" },
  description: "Estimate visible car body repair costs online with vehicle details, damage photos, and an itemized preliminary U.S. market range.",
  openGraph: { type: "website", siteName: "Carspect", title: "Free AI Car Body Repair Estimate Calculator | Carspect", description: "Estimate visible car body repair costs online from vehicle details and clear damage photos.", url: SITE_URL, images: [{ url: DEFAULT_SOCIAL_IMAGE, width: 1200, height: 630, alt: DEFAULT_SOCIAL_IMAGE_ALT }] },
  twitter: { card: "summary_large_image", images: [DEFAULT_SOCIAL_IMAGE] }
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body className={poppins.variable}><a className="skip" href="#main">Skip to content</a><Header/><main id="main">{children}</main><Footer/><GoogleAnalytics/></body></html>; }
