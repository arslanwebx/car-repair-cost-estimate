import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://carspect.pro";
export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: "Free AI Car Body Repair Estimate Calculator | Carspect", template: "%s | Carspect" },
  description: "Upload a photo of your car damage and get an instant body repair cost estimate with Carspect. Fast, free, and easy.",
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: "Carspect", title: "Free AI Car Body Repair Estimate Calculator | Carspect", description: "Upload clear vehicle-damage photos and receive an itemized estimated U.S. market repair range.", url: site },
  twitter: { card: "summary_large_image" }
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body className={inter.variable}><a className="skip" href="#main">Skip to content</a><Header/><main id="main">{children}</main><Footer/></body></html>; }
