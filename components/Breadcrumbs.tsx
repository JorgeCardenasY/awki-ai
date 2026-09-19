import Link from "next/link";
import { SITE_URL } from "@/lib/site";

export interface Crumb {
  label: string;
  href: string;
}

/**
 * Migas de pan: enlazado interno + BreadcrumbList JSON-LD (rich results).
 */
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const crumbs = [{ label: "Inicio", href: "/" }, ...items];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: `${SITE_URL}${c.href}`,
    })),
  };

  return (
    <nav aria-label="breadcrumb" className="mx-auto max-w-7xl px-4 pt-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ol className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-ink-faint">
        {crumbs.map((c, i) => (
          <li key={c.href} className="flex items-center gap-2">
            {i > 0 && <span className="text-neon-cyan/60">/</span>}
            {i === crumbs.length - 1 ? (
              <span aria-current="page" className="text-neon-cyan">
                {c.label}
              </span>
            ) : (
              <Link href={c.href} className="transition-colors hover:text-neon-cyan">
                {c.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
