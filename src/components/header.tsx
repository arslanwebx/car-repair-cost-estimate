"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./logo";

const links = [{ label: "Home", href: "/" }, { label: "How It Works", href: "/#how-it-works" }, { label: "Sample Estimates", href: "/sample-estimates" }, { label: "About", href: "/about-us" }, { label: "Blog", href: "/blog" }, { label: "Contact", href: "/contact-us" }];
export function Header() {
  const [open, setOpen] = useState(false); const button = useRef<HTMLButtonElement>(null);
  useEffect(() => { const close = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); button.current?.focus(); } }; document.addEventListener("keydown", close); return () => document.removeEventListener("keydown", close); }, []);
  return <header className="site-header"><div className="shell header-inner"><Logo/><nav className={open ? "nav-open" : ""} aria-label="Main navigation" id="mobile-navigation">{links.map(link=><Link key={link.href} href={link.href} onClick={()=>setOpen(false)}>{link.label}</Link>)}</nav><button ref={button} type="button" className="menu-button" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close navigation" : "Open navigation"} onClick={()=>setOpen(value=>!value)}><span/><span/><span/></button><Link className="button button-small header-cta" href="/estimate">Get Free Estimate</Link></div></header>;
}
