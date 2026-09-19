"use client";

import { useEffect, useState } from "react";

const BOOT_LINES = [
  { text: "$ awki --boot node://ch-11/alta-cumbre", color: "text-neon-cyan" },
  { text: "> montando carcasa PETG/ASA [IP65/67] ......... OK", color: "text-ink-dim" },
  { text: "> sensor CMOS STARVIS (sin IR-cut) ............ OK", color: "text-ink-dim" },
  { text: "> NPU Ethos-U55 · YOLOv8-Nano INT8 ............ OK", color: "text-ink-dim" },
  { text: "> radio Wio-E5 · AU915 · SF7 .................. OK", color: "text-ink-dim" },
  { text: "> MPPT + LiFePO4 · termistor NTC .............. OK", color: "text-ink-dim" },
  { text: "> red LoRaWAN: ENLAZADA · gateway RPi4 ........ OK", color: "text-neon-green" },
  { text: "> privacidad: Ley 21.719 · imagen→RAM→destruir", color: "text-neon-magenta" },
  { text: "> awki online. listo para operar.", color: "text-neon-cyan" },
];

const STATS = [
  { value: "< 1 W", label: "TDP medio por nodo" },
  { value: "10–15 km", label: "alcance LoRaWAN" },
  { value: "> 20 FPS", label: "inferencia ALPR" },
  { value: "940 nm", label: "IR invisible · D.S. 1/2022" },
];

export default function Hero() {
  const [lines, setLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setLines(BOOT_LINES.slice(0, i).map((l) => l.text));
      if (i >= BOOT_LINES.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 140);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* Grid de fondo */}
      <div className="pointer-events-none absolute inset-0 bg-grid-faint [background-size:48px_48px] opacity-60" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-void to-transparent" />

      <div className="relative mx-auto flex max-w-7xl flex-col items-start px-4 pb-24 pt-20 sm:pt-28">
        {/* Terminal de arranque */}
        <div className="panel clip-corner w-full max-w-2xl p-4 font-mono text-xs sm:text-sm">
          <div className="mb-3 flex items-center justify-between border-b border-surface-border pb-2 text-[10px] text-ink-faint">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-neon-red" />
              <span className="h-2 w-2 rounded-full bg-neon-amber" />
              <span className="h-2 w-2 rounded-full bg-neon-green" />
            </span>
            <span>awki@node: ~/boot.log</span>
          </div>
          <div className="min-h-[9rem] space-y-1 leading-relaxed">
            {lines.map((_, idx) => {
              const line = BOOT_LINES[idx];
              return (
                <p key={idx} className={line.color}>
                  {line.text}
                </p>
              );
            })}
            {!done && <span className="animate-blink text-neon-cyan">▊</span>}
          </div>
        </div>

        {/* Título principal */}
        <h1 className="mt-12 max-w-4xl font-sans text-5xl font-bold leading-[1.05] tracking-tight text-ink sm:text-7xl">
          Trazabilidad logística{" "}
          <span className="text-neon-cyan">sin cobertura celular</span> en el
          Altiplano.
        </h1>

        <p className="mt-6 max-w-2xl font-mono text-sm leading-relaxed text-ink-dim sm:text-base">
          Awki AI Tech despliega nodos de borde con{" "}
          <span className="text-neon-magenta">Edge AI</span> que leen patentes en
          la oscuridad, transmiten por{" "}
          <span className="text-neon-violet">LoRaWAN</span> a través de zonas
          interferidas y destruyen la imagen en el dispositivo —{" "}
          <span className="text-neon-cyan">privacidad by design</span>.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="/hardware/nodo-awki"
            className="clip-corner bg-neon-cyan px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-black transition-colors hover:bg-neon-cyan/80"
          >
            Explorar el nodo ▸
          </a>
          <a
            href="/tecnologia"
            className="clip-corner border border-surface-border bg-surface px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-ink-dim transition-colors hover:border-neon-cyan/50 hover:text-neon-cyan"
          >
            Ver arquitectura SaaS
          </a>
        </div>

        {/* Métricas */}
        <div className="mt-16 grid w-full grid-cols-2 gap-px overflow-hidden rounded-sm border border-surface-border bg-surface-border sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-surface/80 p-5">
              <div className="font-mono text-2xl font-bold text-neon-cyan sm:text-3xl">
                {s.value}
              </div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-ink-faint">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
