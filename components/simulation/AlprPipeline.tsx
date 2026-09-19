"use client";

import { useEffect, useRef } from "react";
import anime from "animejs";

const STAGES = ["CAPTURA", "DETECCIÓN", "OCR", "DESTRUIR", "TX"];

const PAYLOAD_LINES = [
  { label: "placa", value: "\"a3f9·c2b7·8d1e\"", color: "text-neon-cyan" },
  { label: "confianza", value: "0.982", color: "text-ink" },
  { label: "ts", value: "\"04:12:33.842Z\"", color: "text-ink" },
  { label: "sf", value: "7 · ADR", color: "text-neon-violet" },
  { label: "bateria_mv", value: "3280", color: "text-neon-amber" },
  { label: "imagen", value: "\"SOBRESCRITA\"", color: "text-neon-magenta" },
];

/**
 * Pipeline ALPR (YOLOv8-Nano INT8, >20 FPS) — privacidad por diseño (Ley 21.719).
 * La imagen se procesa localmente, se extrae el texto y se destruye en RAM:
 * solo viajan metadatos cifrados.
 */
export default function AlprPipeline() {
  const boxRef = useRef<HTMLDivElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const ocrRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const noiseRef = useRef<HTMLDivElement>(null);
  const destroyedRef = useRef<HTMLDivElement>(null);
  const stageRefs = useRef<HTMLSpanElement[]>([]);
  const payloadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    const plate = plateRef.current;
    const ocr = ocrRef.current;
    const frame = frameRef.current;
    const noise = noiseRef.current;
    const destroyed = destroyedRef.current;
    const payload = payloadRef.current;
    const stages = stageRefs.current;
    if (!box || !plate || !ocr || !frame || !noise || !destroyed || !payload) return;

    const stageOn = (i: number) => {
      stages.forEach((s, idx) => {
        if (s) {
          s.style.color = idx === i ? "#00ffcc" : "#4b5663";
          s.style.borderColor = idx === i ? "rgba(0,255,204,0.5)" : "#1a2330";
        }
      });
    };

    const tl = anime.timeline({
      loop: true,
      easing: "easeInOutQuad",
    });

    tl.add({
      targets: [frame, plate, payload],
      opacity: [0, 1],
      duration: 400,
      begin: () => stageOn(0),
    })
      .add(
        {
          targets: box,
          scaleX: [0, 1],
          scaleY: [0, 1],
          opacity: [0, 1],
          duration: 500,
          begin: () => stageOn(1),
        },
        "+=200"
      )
      .add(
        {
          targets: ocr,
          opacity: [0, 1],
          translateY: [10, 0],
          duration: 500,
          begin: () => stageOn(2),
        },
        "+=300"
      )
      // Destrucción de la imagen en RAM
      .add(
        {
          targets: frame,
          translateX: [0, 4, -4, 2, 0],
          duration: 400,
          begin: () => stageOn(3),
        },
        "+=500"
      )
      .add(
        { targets: noise, opacity: [0, 1], duration: 300 },
        "-=200"
      )
      .add(
        { targets: destroyed, opacity: [0, 1], scale: [1.4, 1], duration: 400 },
        "-=150"
      )
      .add(
        { targets: [noise, box, ocr, plate], opacity: 0, duration: 300 },
        "+=400"
      )
      .add({ targets: destroyed, opacity: 0, duration: 200 }, "-=200")
      .add({ targets: frame, opacity: 0, duration: 300 }, "+=100")
      .add({ duration: 600, complete: () => stageOn(4) });

    return () => tl.pause();
  }, []);

  return (
    <section id="edge-ai" className="relative border-t border-surface-border">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:py-28">
        <p className="section-kicker">[ FASE 3 · EDGE AI · PRIVACIDAD ]</p>
        <h2 className="mt-3 font-sans text-3xl font-bold tracking-tight text-ink sm:text-5xl">
          La imagen <span className="text-neon-magenta">nunca abandona</span> el
          nodo.
        </h2>
        <p className="mt-5 max-w-2xl font-mono text-sm leading-relaxed text-ink-dim">
          YOLOv8-Nano INT8 a &gt;20 FPS recorta la patente, extrae el texto y{" "}
          <span className="text-neon-magenta">sobrescribe la imagen cruda en RAM</span>.
          Solo viajan metadatos cifrados —{" "}
          <span className="text-ink">Ley 21.719, privacidad by design</span>.
        </p>

        {/* Indicadores de etapa */}
        <div className="mt-8 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-widest">
          {STAGES.map((s, i) => (
            <span key={s} className="flex items-center gap-2">
              <span
                ref={(el) => {
                  if (el) stageRefs.current[i] = el;
                }}
                className="rounded-sm border border-surface-border px-2 py-1 text-ink-faint transition-colors"
              >
                {s}
              </span>
              {i < STAGES.length - 1 && <span className="text-neon-cyan">▸</span>}
            </span>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Visor de cámara */}
          <div className="panel clip-corner relative overflow-hidden p-4">
            <div className="mb-3 flex items-center justify-between font-mono text-[10px] text-ink-faint">
              <span>CAM_01 · CMOS STARVIS · sin IR-cut</span>
              <span className="text-neon-cyan">20.4 FPS</span>
            </div>

            <div
              ref={frameRef}
              className="relative flex h-64 items-center justify-center overflow-hidden rounded-sm border border-surface-border bg-surface-deep opacity-0 sm:h-72"
            >
              <div className="absolute inset-0 bg-grid-faint [background-size:24px_24px] opacity-40" />

              {/* Placa patente */}
              <div ref={plateRef} className="relative">
                <div className="flex items-center justify-between rounded border-2 border-ink bg-white px-4 py-2">
                  <span className="font-mono text-2xl font-bold tracking-[0.15em] text-black sm:text-3xl">
                    LXZT47
                  </span>
                  <span className="ml-3 flex h-6 w-4 flex-col justify-between">
                    <span className="h-1.5 w-4 bg-neon-magenta" />
                    <span className="h-1.5 w-4 bg-black" />
                  </span>
                </div>
                <span className="mt-1 block text-center font-mono text-[8px] uppercase tracking-widest text-ink-faint">
                  CHILE · MACROZONA NORTE
                </span>
              </div>

              {/* Bounding box YOLOv8 */}
              <div
                ref={boxRef}
                className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-44 -translate-x-1/2 -translate-y-1/2 border-2 border-neon-magenta opacity-0"
              >
                <span className="absolute -left-7 -top-6 bg-neon-magenta px-1 font-mono text-[9px] font-bold text-black">
                  placa · 0.982
                </span>
                <span className="absolute -left-1 -top-1 h-3 w-3 border-l-2 border-t-2 border-neon-cyan" />
                <span className="absolute -right-1 -top-1 h-3 w-3 border-r-2 border-t-2 border-neon-cyan" />
                <span className="absolute -bottom-1 -left-1 h-3 w-3 border-b-2 border-l-2 border-neon-cyan" />
                <span className="absolute -bottom-1 -right-1 h-3 w-3 border-b-2 border-r-2 border-neon-cyan" />
              </div>

              {/* OCR extraído */}
              <div
                ref={ocrRef}
                className="absolute bottom-3 left-3 rounded-sm bg-black/70 px-2 py-1 font-mono text-sm text-neon-cyan opacity-0"
              >
                &gt; OCR:&nbsp;LXZT47
              </div>

              {/* Ruido de sobrescritura */}
              <div
                ref={noiseRef}
                className="pointer-events-none absolute inset-0 bg-scanlines opacity-0 mix-blend-screen"
              />

              {/* Overlay de destrucción */}
              <div
                ref={destroyedRef}
                className="pointer-events-none absolute inset-0 flex items-center justify-center bg-neon-magenta/90 opacity-0"
              >
                <span className="font-mono text-2xl font-bold tracking-widest text-black">
                  ⨯ SOBRESCRITA
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between font-mono text-[10px] text-ink-faint">
              <span>RAM frame buffer → memset(0x00)</span>
              <span className="text-neon-magenta">Ley 21.719</span>
            </div>
          </div>

          {/* Payload saliente */}
          <div className="panel clip-corner p-4">
            <div className="mb-3 flex items-center justify-between font-mono text-[10px] text-ink-faint">
              <span>payload LoRaWAN · AES-128</span>
              <span className="text-neon-violet">~48 bytes</span>
            </div>
            <div
              ref={payloadRef}
              className="overflow-x-auto rounded-sm bg-void p-4 font-mono text-sm leading-relaxed opacity-0"
            >
              <div className="text-ink-faint">{"{"}</div>
              {PAYLOAD_LINES.map((line) => (
                <div key={line.label} className="pl-4">
                  <span className="text-ink-dim">&quot;{line.label}&quot;</span>
                  <span className="text-ink-faint">: </span>
                  <span className={line.color}>{line.value}</span>
                  <span className="text-ink-faint">,</span>
                </div>
              ))}
              <div className="text-ink-faint">{"}"}</div>
              <div className="mt-3 border-t border-surface-border pt-2 text-[10px] text-ink-faint">
                <span className="text-neon-magenta">{"// imagen cruda: nunca transmitida"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
