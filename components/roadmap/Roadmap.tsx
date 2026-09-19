"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

const PHASES = [
  {
    title: "PMV + Algoritmos",
    months: "M1 – M3",
    start: 1,
    end: 3,
    desc: "Desarrollo del Producto Mínimo Viable y algoritmos de borde.",
    items: ["YOLOv8-Nano INT8 · ALPR", "MPPT con compensación térmica", "LoRaWAN CSS · AU915"],
    bar: "bg-neon-cyan",
    text: "text-neon-cyan",
    border: "border-neon-cyan/50",
  },
  {
    title: "Pilotos CH-11",
    months: "M4 – M6",
    start: 4,
    end: 6,
    desc: "Despliegue de 3 a 5 pilotos en la Ruta CH-11.",
    items: ["Operación 100% autónoma", "Cero obras civiles (sin SEIA)", "Validación en altiplano"],
    bar: "bg-neon-violet",
    text: "text-neon-violet",
    border: "border-neon-violet/50",
  },
  {
    title: "FUOTA + SaaS",
    months: "M7 – M10",
    start: 7,
    end: 10,
    desc: "Actualizaciones por radio y cierre de contratos facturados.",
    items: ["FUOTA · multicast + parches delta", "Modelo YOLO vía radio", "Contratos SaaS recurrentes"],
    bar: "bg-neon-magenta",
    text: "text-neon-magenta",
    border: "border-neon-magenta/50",
  },
];

export default function Roadmap() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const barRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        barRefs.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.1,
          stagger: 0.15,
          ease: "power2.out",
          transformOrigin: "left center",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const pct = (start: number, end: number) => ({
    left: `${((start - 1) / 10) * 100}%`,
    width: `${((end - start + 1) / 10) * 100}%`,
  });

  return (
    <section id="roadmap" ref={sectionRef} className="relative border-t border-surface-border">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:py-28">
        <p className="section-kicker">[ FASE 5 · ROADMAP COMERCIAL ]</p>
        <h2 className="mt-3 font-sans text-3xl font-bold tracking-tight text-ink sm:text-5xl">
          10 meses, <span className="text-neon-cyan">de cero a SaaS</span>.
        </h2>
        <p className="mt-5 max-w-2xl font-mono text-sm leading-relaxed text-ink-dim">
          Cronograma del proyecto: del PMV a los pilotos en la Ruta CH-11 y el
          cierre de contratos facturados. Pasa el cursor sobre cada fase.
        </p>

        {/* Gantt */}
        <div className="panel clip-corner mt-10 overflow-x-auto p-5">
          <div className="min-w-[640px]">
            {/* Regla de meses */}
            <div className="mb-3 grid grid-cols-10 gap-px">
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} className="text-center font-mono text-[10px] text-ink-faint">
                  M{i + 1}
                </div>
              ))}
            </div>

            {/* Tracks */}
            <div className="space-y-3">
              {PHASES.map((phase, i) => (
                <div
                  key={phase.title}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group relative h-10 cursor-pointer rounded-sm border border-surface-border bg-surface-deep transition-colors hover:border-surface-border/0"
                >
                  <div
                    ref={(el) => {
                      if (el) barRefs.current[i] = el;
                    }}
                    className={`absolute top-0 h-full ${phase.bar} opacity-70 transition-opacity group-hover:opacity-100`}
                    style={pct(phase.start, phase.end)}
                  />
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 font-mono text-[10px] font-bold text-black">
                    {phase.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Línea de tiempo base */}
            <div className="relative mt-2 h-4">
              <div className="absolute inset-x-0 top-0 h-px bg-surface-border" />
              {Array.from({ length: 11 }, (_, i) => (
                <span
                  key={i}
                  className="absolute top-0 h-2 w-px bg-surface-border"
                  style={{ left: `${(i / 10) * 100}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Detalle de la fase activa */}
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {PHASES.map((phase, i) => (
            <div
              key={phase.title}
              className={`panel clip-corner p-5 transition-all ${
                i === active ? phase.border : "border-surface-border opacity-60"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-mono text-xs font-bold ${phase.text}`}>
                  {phase.months}
                </span>
                <span className={`h-2.5 w-2.5 rounded-full ${phase.bar}`} />
              </div>
              <h3 className="mt-3 font-sans text-base font-semibold text-ink">
                {phase.title}
              </h3>
              <p className="mt-1 font-mono text-xs leading-relaxed text-ink-dim">
                {phase.desc}
              </p>
              <ul className="mt-3 space-y-1">
                {phase.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 font-mono text-[11px] text-ink-faint">
                    <span className={phase.text}>▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
