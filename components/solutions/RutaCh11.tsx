const STEPS = [
  {
    n: "01",
    title: "Ver con inteligencia",
    desc: "Un nodo de borde reconoce patentes (ALPR) en milisegundos, de noche y sin luz visible, mediante óptica CMOS Starlight e iluminación IR de 940 nm.",
  },
  {
    n: "02",
    title: "Transmitir sin celular",
    desc: "La información viaja por LoRaWAN (Chirp Spread Spectrum), resistente a interferencias e inhibidores, con alcance de 10–15 km en terreno accidentado.",
  },
  {
    n: "03",
    title: "Consumir con privacidad",
    desc: "Solo metadatos cifrados llegan a la nube. La imagen se destruye en el borde y los datos se publican en una PWA offline-first y APIs seguras.",
  },
];

/**
 * Caso de uso B2B — trazabilidad en la Ruta CH-11 y la Macrozona Norte.
 */
export default function RutaCh11() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="panel clip-corner p-6">
          <div className="flex items-center gap-2">
            <span className="tag-amber">CASO DE USO</span>
            <span className="font-mono text-[10px] text-ink-faint">RUTA CH-11 · ALTO ANDINO</span>
          </div>
          <h2 className="mt-4 font-sans text-2xl font-bold tracking-tight text-ink sm:text-4xl">
            Trazabilidad donde no llega la señal.
          </h2>
          <p className="mt-4 max-w-3xl font-mono text-sm leading-relaxed text-ink-dim">
            La <span className="text-ink">Ruta CH-11</span> conecta Arica con el
            altiplano a más de 4 600 m.s.n.m., en un entorno sin cobertura 3G/4G y con
            temperaturas de <span className="text-ink">-15 °C a +40 °C</span>. Awki
            despliega nodos autónomos que operan{" "}
            <span className="text-ink">sin obras civiles</span>, evitando el SEIA y los
            permisos viales mayores, para dar trazabilidad logística de extremo a extremo.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-sm border border-surface-border bg-surface/50 p-5">
                <span className="font-mono text-xs font-bold text-neon-cyan">{s.n}</span>
                <h3 className="mt-2 font-sans text-base font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 font-mono text-xs leading-relaxed text-ink-dim">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
