const KPIS = [
  { label: "Nodos activos", value: "27 / 28", delta: "+2 hoy", color: "text-neon-cyan" },
  { label: "Lecturas hoy", value: "1,842", delta: "99.2% ok", color: "text-neon-green" },
  { label: "Alertas tempranas", value: "3", delta: "2 por confirmar", color: "text-neon-amber" },
  { label: "Batería mínima", value: "3,180 mV", delta: "nodo CH-11·N7", color: "text-neon-magenta" },
];

const ROWS = [
  { placa: "a3f9·c2b7", ts: "04:12:33", sf: "SF7", rssi: "-92", mv: "3280" },
  { placa: "8b12·4fe0", ts: "04:12:41", sf: "SF8", rssi: "-104", mv: "3195" },
  { placa: "c0de·77aa", ts: "04:13:02", sf: "SF7", rssi: "-88", mv: "3310" },
  { placa: "5e91·0d3c", ts: "04:13:15", sf: "SF9", rssi: "-111", mv: "3265" },
];

/**
 * Consumo B2B — maqueta estática de la PWA offline-first (IndexedDB).
 */
export default function PwaDashboard() {
  return (
    <section className="relative border-t border-surface-border bg-void/40">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:py-24">
        <p className="section-kicker">[ FASE 4 · CONSUMO B2B ]</p>
        <h3 className="mt-3 font-sans text-2xl font-bold tracking-tight text-ink sm:text-4xl">
          Una PWA que <span className="text-neon-green">funciona sin señal</span>.
        </h3>
        <p className="mt-5 max-w-2xl font-mono text-sm leading-relaxed text-ink-dim">
          El panel de flota es <span className="text-ink">offline-first</span>:
          los datos se cachean en <span className="text-ink">IndexedDB</span> y se
          sincronizan cuando reaparece el enlace. Ideal para operadores en terreno.
        </p>

        {/* Marco de navegador */}
        <div className="panel clip-corner mt-8 overflow-hidden border-surface-border">
          {/* Chrome */}
          <div className="flex items-center gap-2 border-b border-surface-border bg-surface-deep px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-neon-red" />
            <span className="h-2.5 w-2.5 rounded-full bg-neon-amber" />
            <span className="h-2.5 w-2.5 rounded-full bg-neon-green" />
            <div className="ml-3 flex-1 rounded-sm bg-void px-3 py-1 font-mono text-[10px] text-ink-dim">
              https://app.awki.cl/flota
            </div>
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-neon-green">
              <span className="h-1.5 w-1.5 rounded-full bg-neon-green animate-pulse" />
              OFFLINE · sync pendiente: 3
            </span>
          </div>

          {/* App */}
          <div className="grid gap-4 p-4 sm:p-6">
            {/* KPIs */}
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {KPIS.map((kpi) => (
                <div key={kpi.label} className="rounded-sm border border-surface-border bg-surface/50 p-3">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">
                    {kpi.label}
                  </div>
                  <div className={`mt-1 font-mono text-xl font-bold ${kpi.color}`}>
                    {kpi.value}
                  </div>
                  <div className="mt-0.5 font-mono text-[10px] text-ink-dim">{kpi.delta}</div>
                </div>
              ))}
            </div>

            {/* Tabla de lecturas */}
            <div className="overflow-hidden rounded-sm border border-surface-border">
              <div className="flex items-center justify-between border-b border-surface-border bg-surface-deep px-3 py-2 font-mono text-[10px] text-ink-faint">
                <span>lecturas recientes (cifradas)</span>
                <span>IndexedDB · local</span>
              </div>
              <table className="w-full font-mono text-xs">
                <thead>
                  <tr className="border-b border-surface-border text-left text-[10px] text-ink-faint">
                    <th className="px-3 py-2">placa</th>
                    <th className="px-3 py-2">ts</th>
                    <th className="px-3 py-2">sf</th>
                    <th className="hidden px-3 py-2 sm:table-cell">rssi</th>
                    <th className="px-3 py-2">bat (mV)</th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((r) => (
                    <tr key={r.ts} className="border-b border-surface-border/50 last:border-0">
                      <td className="px-3 py-2 text-neon-cyan">{r.placa}</td>
                      <td className="px-3 py-2 text-ink-dim">{r.ts}</td>
                      <td className="px-3 py-2 text-neon-violet">{r.sf}</td>
                      <td className="hidden px-3 py-2 text-ink-dim sm:table-cell">{r.rssi}</td>
                      <td className="px-3 py-2 text-neon-amber">{r.mv}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between font-mono text-[10px] text-ink-faint">
              <span>service worker: activo · precache 4.2 MB</span>
              <span className="text-neon-cyan">sync automático al reconectar</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
