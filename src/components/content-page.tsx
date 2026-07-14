import type { ReactNode } from "react";
import Link from "next/link";
export function ContentPage({ title, intro, children }: { title: string; intro: string; children: ReactNode }) { const displayTitle=title==="Terms of Use"?"Terms of Service":title;return <article className="content-page shell narrow"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span>{displayTitle}</span></nav><h1>{displayTitle}</h1><p className="content-intro">{intro}</p><div className="prose">{children}</div></article>; }
