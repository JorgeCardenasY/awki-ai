import type { ReactNode } from "react";

/** Cabecera de página: kicker + H1 + descripción (un único H1 por página). */
export default function PageHeader({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: ReactNode;
  description?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-12 pt-16 sm:pt-20">
      <p className="section-kicker">{kicker}</p>
      <h1 className="mt-3 max-w-4xl font-sans text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
        {title}
      </h1>
      {description && (
        <p className="mt-5 max-w-2xl font-mono text-sm leading-relaxed text-ink-dim">
          {description}
        </p>
      )}
    </div>
  );
}
