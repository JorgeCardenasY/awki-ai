const STEPS = [
  {
    n: "01",
    title: "Blueprint.io",
    tag: "ESQUEMÁTICO",
    color: "text-neon-cyan",
    border: "border-neon-cyan/40",
    desc: "Diseño del esquemático del Nodo Awki: buses I2C/UART entre ESP32-S3, NPU y Wio-E5, con fuentes de alimentación y sensores.",
  },
  {
    n: "02",
    title: "Velxio.dev",
    tag: "EMULACIÓN",
    color: "text-neon-violet",
    border: "border-neon-violet/40",
    desc: "Emulación de picos de consumo energético (TX LoRa, inferencia NPU) antes de tocar silicio real.",
  },
  {
    n: "03",
    title: "Deep Sleep",
    tag: "VALIDACIÓN",
    color: "text-neon-amber",
    border: "border-neon-amber/40",
    desc: "Rutinas de ahorro: wake-up por RTC, watchdog y brown-out. Consumo medio validado por debajo de 1 W.",
  },
  {
    n: "04",
    title: "Flasheo real",
    tag: "PRODUCCIÓN",
    color: "text-neon-magenta",
    border: "border-neon-magenta/40",
    desc: "Firmware + modelo YOLO INT8 desplegados en el hardware final. FUOTA posterior para parches delta.",
  },
];

/**
 * Prototipado Virtual — ciclo de CI/CD del hardware.
 * Blueprint.io (esquemático) → Velxio.dev (emulación) → validación → silicio.
 */
export default function BlueprintVelxio() {
  return (
    <section className="relative border-t border-surface-border bg-void/40">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:py-24">
        <p className="section-kicker">[ FASE 3 · PROTOTIPADO VIRTUAL ]</p>
        <h3 className="mt-3 font-sans text-2xl font-bold tracking-tight text-ink sm:text-4xl">
          Del esquemático al silicio,{" "}
          <span className="text-neon-cyan">sin quemar componentes</span>.
        </h3>
        <p className="mt-5 max-w-2xl font-mono text-sm leading-relaxed text-ink-dim">
          El ciclo de CI/CD del hardware valida cada etapa antes del flasheo:
          del <span className="text-ink">Blueprint.io</span> al emulador{" "}
          <span className="text-ink">Velxio.dev</span> para emular picos de consumo
          y validar las rutinas de <span className="text-neon-amber">Deep Sleep</span>.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <div key={step.n} className="relative">
              <div
                className={`panel clip-corner h-full p-5 ${step.border}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-xs font-bold ${step.color}`}>
                    {step.n}
                  </span>
                  <span className={`tag ${step.color} ${step.border}`}>
                    {step.tag}
                  </span>
                </div>
                <h3 className="mt-4 font-sans text-lg font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 font-mono text-xs leading-relaxed text-ink-dim">
                  {step.desc}
                </p>
              </div>
              {i < STEPS.length - 1 && (
                <span className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-neon-cyan lg:block">
                  ▸
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Mini terminal de CI */}
        <div className="panel clip-corner mt-8 p-4 font-mono text-xs leading-relaxed">
          <div className="mb-2 text-[10px] text-ink-faint">
            awki@ci:~/hardware · pipeline.log
          </div>
          <div className="space-y-1">
            <p className="text-ink-dim">$ blueprint export --target awki-node</p>
            <p className="text-neon-green">✓ netlist generada · 142 nodos · 0 errores DRC</p>
            <p className="text-ink-dim">$ velxio simulate --peak-load</p>
            <p className="text-neon-cyan">✓ pico TX: 512 mW · pico inferencia: 98 mW</p>
            <p className="text-ink-dim">$ velxio validate --deep-sleep 300s</p>
            <p className="text-neon-amber">✓ consumo medio: 0.84 W · &lt; 1 W OK</p>
            <p className="text-ink-dim">$ flash --target esp32s3 --firmware v1.4.2</p>
            <p className="text-neon-magenta">✓ silicio real flasheado · FUOTA habilitado</p>
            <p className="mt-1 animate-blink text-neon-cyan">▊</p>
          </div>
        </div>
      </div>
    </section>
  );
}
