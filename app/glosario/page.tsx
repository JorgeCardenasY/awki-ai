import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHeader from "@/components/PageHeader";
import { GLOSSARY } from "@/lib/glossary";

export const metadata: Metadata = {
  title: "Glosario técnico — LoRaWAN, Edge AI y Normativa",
  description:
    "Glosario de términos técnicos de Awki: LoRaWAN, ALPR, Edge AI, CSS, ADR, MPPT, LiFePO4, Ley 21.719 y más. Definiciones claras para logística y IoT.",
  alternates: { canonical: "/glosario" },
};

const CATEGORIES = ["Red", "Edge AI", "Energía", "Datos", "Normativa"];

export default function GlosarioPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Glosario técnico de Awki AI Tech",
    description:
      "Términos técnicos de trazabilidad logística, Edge AI, LoRaWAN y normativa chilena.",
    hasDefinedTerm: GLOSSARY.map((t) => ({
      "@type": "DefinedTerm",
      name: t.term,
      description: t.definition,
      inDefinedTermSet: "https://awki.cl/glosario",
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs items={[{ label: "Glosario", href: "/glosario" }]} />
      <PageHeader
        kicker="[ GLOSARIO TÉCNICO ]"
        title={
          <>
            El vocabulario de <span className="text-neon-cyan">Awki</span>.
          </>
        }
        description="Definiciones claras de los términos de Edge AI, LoRaWAN, energía y normativa que sustentan la plataforma de trazabilidad logística."
      />

      <div className="mx-auto max-w-7xl px-4 pb-20">
        {CATEGORIES.map((cat) => (
          <div key={cat} className="mb-8">
            <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-neon-cyan">
              {cat}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {GLOSSARY.filter((t) => t.category === cat).map((t) => (
                <div key={t.term} className="panel clip-corner p-4">
                  <dt className="font-mono text-sm font-bold text-ink">{t.term}</dt>
                  <dd className="mt-1.5 font-mono text-xs leading-relaxed text-ink-dim">
                    {t.definition}
                  </dd>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
