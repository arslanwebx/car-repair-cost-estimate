import Link from "next/link";
import { Logo } from "./logo";

const links = [["About", "/about"], ["Contact", "/contact"], ["Blog", "/blog"], ["Privacy Policy", "/privacy"], ["Terms of Use", "/terms"], ["AI Estimate Disclaimer", "/disclaimer"], ["Cookie Policy", "/cookies"], ["Photo & Data Handling", "/photo-data-policy"]];
export function Footer() { return <footer><div className="shell footer-grid"><div><Logo footer/><p>Carspect helps vehicle owners understand the likely cost of visible body damage before visiting a repair shop.</p><p className="fine">Estimates are informational and are not final repair orders.</p></div><nav aria-label="Footer navigation">{links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav><div><strong>Questions?</strong><a href="mailto:support@carspect.pro">support@carspect.pro</a><p className="fine">© {new Date().getFullYear()} Carspect. All rights reserved.</p></div></div></footer> }
