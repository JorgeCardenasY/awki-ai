"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "@/lib/gsap";

const NodeScene = dynamic(() => import("./NodeScene"), { ssr: false });

const LEGEND = [
  { color: "#ffb000", name: "Panel Solar 10-20W", spec: "MPPT + compensación térmica" },
  { color: "#4b5563", name: "Carcasa PETG/ASA", spec: "IP65/67 · mimetizada altiplano" },
  { color: "#ff2d78", name: "CMOS STARVIS + LED IR 940nm", spec: "sin IR-cut · espectro invisible" },
  { color: "#7c5cff", name: "NPU Grove Vision AI V2", spec: "Cortex-M55 + Ethos-U55" },
  { color: "#00ffcc", name: "XIAO ESP32-S3", spec: "orquestación I2C/UART" },
  { color: "#39ff88", name: "Wio-E5 (STM32WLE5)", spec: "LoRaWAN AU915 · <1 W" },
  { color: "#ffb000", name: "LiFePO4 + Termistor NTC", spec: "cut-off < 0°C · anti lithium plating" },
];

function Legend() {
  return (
    <div className="panel clip-corner p-4">
      <div className="section-kicker mb-3">Leyenda</div>
      <ul className="space-y-2">
        {LEGEND.map((item) => (
          <li key={item.name} className="flex items-start gap-2.5">
            <span
              className="mt-1 h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}` }}
            />
            <div>
              <div className="font-mono text-xs text-ink">{item.name}</div>
              <div className="font-mono text-[10px] text-ink-faint">{item.spec}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SubtelTooltip() {
  return (
    <div className="relative max-w-xs border border-neon-amber/30 bg-surface/90 p-4 backdrop-blur-sm">
      {/* punta del tooltip */}
      <span className="absolute -top-1.5 left-4 h-3 w-3 rotate-45 border-l border-t border-neon-amber/30 bg-surface" />
      <div className="flex items-center gap-2">
        <span className="tag-amber">SUBTEL</span>
        <span className="font-mono text-[10px] text-ink-faint">Res. 737 / 2219</span>
      </div>
      <p className="mt-2 font-mono text-xs leading-relaxed text-ink-dim">
        El <span className="text-neon-amber">código QR de certificación</span> se
        incluye en los manuales técnicos,{" "}
        <span className="text-ink">no en la carcasa</span>, para preservar la
        invisibilidad del nodo en el altiplano.
      </p>
    </div>
  );
}

export default function NodeExplodedView() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const progress = useRef({ value: 0 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(progress.current, {
        value: 1,
        ease: "none",
        scrollTrigger: {
          trigger: viewportRef.current,
          start: "top top",
          end: "+=220%",
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
        },
      });
    }, viewportRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="nodo" className="relative">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:py-28">
        <p className="section-kicker">[ FASE 2 · HARDWARE DE BORDE ]</p>
        <h2 className="mt-3 font-sans text-3xl font-bold tracking-tight text-ink sm:text-5xl">
          Nodo Awki, <span className="text-neon-cyan">desmontado</span>.
        </h2>
        <p className="mt-5 max-w-2xl font-mono text-sm leading-relaxed text-ink-dim">
          Ingeniería de grado industrial en una carcasa{" "}
          <span className="text-ink">mimetizada</span> para operar sin obras
          civiles en la Ruta CH-11. Haz scroll para separar cada subsistema: la
          óptica indetectable, los silicios de borde y el tren energético
          adaptativo a temperaturas bajo cero.
        </p>
      </div>

      <div
        ref={viewportRef}
        className="relative h-screen w-full overflow-hidden border-y border-surface-border"
      >
        <NodeScene progress={progress} />
        {/* Leyenda */}
        <div className="pointer-events-none absolute left-4 top-1/2 hidden -translate-y-1/2 lg:block">
          <Legend />
        </div>

        {/* Tooltip normativo */}
        <div className="pointer-events-none absolute bottom-6 right-4 sm:right-8">
          <SubtelTooltip />
        </div>

        {/* Indicación de scroll */}
        <div className="pointer-events-none absolute left-1/2 top-6 -translate-x-1/2">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-neon-cyan">
            <span className="animate-blink">▊</span> scroll para desmontar
          </div>
        </div>
      </div>
    </section>
  );
}
