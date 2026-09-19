import { FAQ } from "@/lib/faq";

/**
 * Sección de preguntas frecuentes con JSON-LD FAQPage (rich results).
 */
export default function FaqSection() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <section className="relative border-t border-surface-border">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-4xl px-4 py-20 sm:py-24">
        <p className="section-kicker">[ PREGUNTAS FRECUENTES ]</p>
        <h2 className="mt-3 font-sans text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Lo que suelen <span className="text-neon-cyan">preguntarnos</span>.
        </h2>

        <div className="mt-8 space-y-3">
          {FAQ.map((f) => (
            <details
              key={f.question}
              className="panel clip-corner group p-5"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-sans text-base font-semibold text-ink">
                {f.question}
                <span className="shrink-0 font-mono text-neon-cyan transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 font-mono text-sm leading-relaxed text-ink-dim">
                {f.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
