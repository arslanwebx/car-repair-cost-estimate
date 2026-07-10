import type { ReactNode } from "react";
import Link from "next/link";
export function ContentPage({ title, intro, children }: { title: string; intro: string; children: ReactNode }) { return <article className="content-page shell narrow"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span>{title}</span></nav><h1>{title}</h1><p className="content-intro">{intro}</p><div className="prose">{children}</div></article>; }
