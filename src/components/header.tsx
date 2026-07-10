import Link from "next/link";
import { Logo } from "./logo";

export function Header() {
  return <header className="site-header"><div className="shell header-inner"><Logo/><nav aria-label="Main navigation"><Link href="/#how-it-works">How It Works</Link><Link href="/#samples">Sample Estimates</Link><Link href="/#included">What You Receive</Link><Link href="/#faq">FAQ</Link><Link href="/blog">Blog</Link></nav><Link className="button button-small" href="/#estimator">Start Estimate</Link></div></header>;
}
