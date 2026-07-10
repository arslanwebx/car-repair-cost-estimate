import Link from "next/link";

export function Logo({ footer = false }: { footer?: boolean }) {
  return <Link href="/" className={`logo ${footer ? "logo-footer" : ""}`} aria-label="Carspect home">
    <svg aria-hidden="true" viewBox="0 0 48 48" width="38" height="38"><path d="M9 14V9h5M34 9h5v5M39 34v5h-5M14 39H9v-5"/><path d="M11 28h3l3-8h14l4 8h2v7h-4v-3H15v3h-4z"/><circle cx="18" cy="28" r="2"/><circle cx="31" cy="28" r="2"/><path d="M15 18h18" className="scan"/></svg>
    <span>Carspect</span>
  </Link>;
}
