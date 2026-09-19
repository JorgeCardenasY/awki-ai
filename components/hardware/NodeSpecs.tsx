const BOM = [
  { item: "MCU principal", component: "XIAO ESP32-S3", role: "Orquestación, cifrado y control" },
  { item: "NPU + cámara", component: "Grove Vision AI V2 + CMOS Starlight", role: "Inferencia ALPR (YOLOv8-Nano INT8)" },
  { item: "Radio", component: "Wio-E5 / LoRa-E5 (STM32WLE5)", role: "LoRaWAN AU915/US915" },
  { item: "Energía", component: "Panel 10–20 W + LiFePO4 + MPPT", role: "Alimentación autónoma" },
  { item: "Sensor térmico", component: "Termistor NTC 10 kΩ ±1%", role: "Cut-off de carga < 0 °C" },
  { item: "Carcasa", component: "PETG/ASA impresa 3D, IP65/67", role: "Protección y mimetización" },
  { item: "Iluminación", component: "LED IR 940 nm + lente estrecha", role: "Captura nocturna invisible" },
];

const SPECS = [
  { k: "Rango térmico", v: "-15 °C a +40 °C" },
  { k: "Protección", v: "IP65 / IP67" },
  { k: "Consumo medio", v: "< 1 W (TDP agregado)" },
  { k: "Inferencia", v: "> 20 FPS · INT8" },
  { k: "Radio", v: "915–928 MHz · ≤ 1 W" },
  { k: "Vida de batería", v: "2 000–5 000 ciclos (LiFePO4)" },
];

/** Especificaciones técnicas y BOM del Nodo Awki (contenido indexable). */
export default function NodeSpecs() {
  return (
    <section className="relative border-t border-surface-border">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:py-24">
        <h2 className="font-sans text-2xl font-bold tracking-tight text-ink sm:text-4xl">
          Lista de materiales y <span className="text-neon-cyan">especificaciones</span>.
        </h2>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* BOM */}
          <div className="panel clip-corner overflow-hidden">
            <div className="border-b border-surface-border bg-surface-deep px-4 py-2 font-mono text-[10px] text-ink-faint">
              BOM · Nodo Awki
            </div>
            <table className="w-full font-mono text-xs">
              <thead>
                <tr className="border-b border-surface-border text-left text-[10px] text-ink-faint">
                  <th className="px-4 py-2">Ítem</th>
                  <th className="px-4 py-2">Componente</th>
                  <th className="hidden px-4 py-2 sm:table-cell">Rol</th>
                </tr>
              </thead>
              <tbody>
                {BOM.map((b) => (
                  <tr key={b.item} className="border-b border-surface-border/50 last:border-0">
                    <td className="px-4 py-2 text-ink-dim">{b.item}</td>
                    <td className="px-4 py-2 text-neon-cyan">{b.component}</td>
                    <td className="hidden px-4 py-2 text-ink-faint sm:table-cell">{b.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Especificaciones */}
          <div className="panel clip-corner p-5">
            <div className="mb-4 font-mono text-[10px] text-ink-faint">
              SPEC SHEET
            </div>
            <dl className="space-y-3">
              {SPECS.map((s) => (
                <div key={s.k} className="flex items-center justify-between border-b border-surface-border/50 pb-3 last:border-0">
                  <dt className="font-mono text-xs text-ink-dim">{s.k}</dt>
                  <dd className="font-mono text-sm font-bold text-neon-cyan">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Compensación térmica */}
        <div className="panel clip-corner mt-6 p-6">
          <h3 className="font-sans text-lg font-semibold text-ink">
            Compensación térmica y <span className="text-neon-amber">lithium plating</span>
          </h3>
          <p className="mt-3 max-w-3xl font-mono text-sm leading-relaxed text-ink-dim">
            Por debajo de <span className="text-ink">0 °C</span>, cargar una celda de
            litio provoca <span className="text-neon-amber">lithium plating</span> — el
            depósito de litio metálico que destruye la batería de forma irreversible.
            El algoritmo de compensación del MPPT lee un{" "}
            <span className="text-ink">termistor NTC (10 kΩ ±1%)</span> y suspende la
            carga bajo cero, aplicando pre-acondicionamiento térmico antes de reanudar.
          </p>
        </div>
      </div>
    </section>
  );
}
