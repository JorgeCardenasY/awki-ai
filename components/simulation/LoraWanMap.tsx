"use client";

import { useEffect, useRef } from "react";
import anime from "animejs";

/** Genera una trayectoria senoidal (chirp) entre dos puntos. */
function sinePath(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  amplitude: number,
  cycles: number
) {
  const steps = 90;
  let d = `M ${x0} ${y0}`;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const x = x0 + (x1 - x0) * t;
    const y =
      y0 + (y1 - y0) * t + Math.sin(t * cycles * Math.PI * 2) * amplitude;
    d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

const CHIRP = sinePath(70, 210, 730, 210, 46, 6);

const SFS = ["SF7", "SF8", "SF9", "SF10"];

export default function LoraWanMap() {
  const chirpRef = useRef<SVGPathElement>(null);
  const chirpGhostRef = useRef<SVGPathElement>(null);
  const sfRef = useRef<SVGTextElement>(null);
  const rippleRefs = useRef<SVGCircleElement[]>([]);

  useEffect(() => {
    const chirp = chirpRef.current;
    const ghost = chirpGhostRef.current;
    const sf = sfRef.current;
    if (!chirp || !ghost || !sf) return;

    const ripples = rippleRefs.current.filter(Boolean);

    const tl = anime.timeline({ loop: true, easing: "linear" });

    ripples.forEach((r, i) => {
      tl.add(
        {
          targets: r,
          r: [8, 60],
          opacity: [0.7, 0],
          duration: 1800,
        },
        i * 450
      );
    });

    tl.add(
      {
        targets: chirp,
        strokeDashoffset: [0, -420],
        duration: 2200,
        easing: "linear",
      },
      0
    );

    tl.add(
      {
        targets: ghost,
        strokeDashoffset: [-420, 0],
        duration: 2200,
        easing: "linear",
      },
      0
    );

    tl.add(
      {
        targets: sf,
        opacity: [1, 0.2],
        duration: 400,
        begin: () => {
          const i = Math.floor(Math.random() * SFS.length);
          sf.textContent = SFS[i];
        },
      },
      0
    );

    return () => tl.pause();
  }, []);

  return (
    <section id="lorawan" className="relative border-t border-surface-border">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:py-28">
        <p className="section-kicker">[ FASE 3 · RADIO · LoRaWAN CSS ]</p>
        <h2 className="mt-3 font-sans text-3xl font-bold tracking-tight text-ink sm:text-5xl">
          Chirps que <span className="text-neon-violet">atraviesan</span> el ruido.
        </h2>
        <p className="mt-5 max-w-2xl font-mono text-sm leading-relaxed text-ink-dim">
          El módulo <span className="text-ink">Wio-E5 (STM32WLE5)</span> transmite en
          la banda <span className="text-neon-violet">AU915/US915 (915–928 MHz)</span> a
          menos de 1 W. La modulación <span className="text-ink">Chirp Spread Spectrum</span>{" "}
          y el <span className="text-neon-violet">ADR</span> adaptan el factor de
          dispersión para esquivar inhibidores criminales.
        </p>

        <div className="panel clip-corner mt-8 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-border px-4 py-2 font-mono text-[10px] text-ink-faint">
            <span>MACROZONA NORTE · topografía accidentada</span>
            <span className="text-neon-violet">freq: 915.2 → 927.6 MHz</span>
          </div>

          <svg
            viewBox="0 0 800 400"
            className="h-auto w-full"
            role="img"
            aria-label="Mapa LoRaWAN de la Macrozona Norte con chirps atravesando zonas de interferencia"
          >
            <defs>
              <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#050505" />
                <stop offset="100%" stopColor="#0a0e12" />
              </linearGradient>
              <filter id="glowViolet" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <rect width="800" height="400" fill="url(#sky)" />

            {/* Topografía (cordillera) */}
            <polygon points="0,340 120,270 240,320 360,250 480,300 600,240 720,300 800,270 800,400 0,400" fill="#0c1118" />
            <polygon points="0,380 180,320 320,370 500,310 640,360 800,330 800,400 0,400" fill="#080c11" />

            {/* Jammer zones (interferencia criminal) */}
            <g stroke="#ff3b4d" strokeWidth="1" strokeDasharray="4 4" fill="rgba(255,59,77,0.05)">
              <circle cx="300" cy="200" r="60" />
              <circle cx="520" cy="230" r="50" />
            </g>
            <text x="300" y="130" fill="#ff3b4d" fontSize="9" fontFamily="monospace" textAnchor="middle">
              JAMMER
            </text>
            <text x="520" y="165" fill="#ff3b4d" fontSize="9" fontFamily="monospace" textAnchor="middle">
              JAMMER
            </text>

            {/* Chirp fantasma (eco) */}
            <path
              ref={chirpGhostRef}
              d={CHIRP}
              fill="none"
              stroke="#7c5cff"
              strokeWidth="1"
              strokeOpacity="0.25"
              strokeDasharray="8 16"
            />

            {/* Chirp principal */}
            <path
              ref={chirpRef}
              d={CHIRP}
              fill="none"
              stroke="#7c5cff"
              strokeWidth="2.5"
              strokeDasharray="10 18"
              filter="url(#glowViolet)"
            />

            {/* Ripples del nodo */}
            {[0, 1, 2].map((i) => (
              <circle
                key={i}
                ref={(el) => {
                  if (el) rippleRefs.current[i] = el;
                }}
                cx="70"
                cy="210"
                r="8"
                fill="none"
                stroke="#00ffcc"
                strokeWidth="1"
                opacity="0"
              />
            ))}

            {/* Nodo transmisor */}
            <g transform="translate(70,210)">
              <rect x="-14" y="-14" width="28" height="28" fill="#0a3d1f" stroke="#00ffcc" strokeWidth="1" />
              <circle cx="0" cy="0" r="4" fill="#00ffcc" />
              <text x="0" y="34" fill="#00ffcc" fontSize="9" fontFamily="monospace" textAnchor="middle">
                NODO AWKI
              </text>
            </g>

            {/* Gateway */}
            <g transform="translate(730,210)">
              <rect x="-16" y="-16" width="32" height="32" fill="#0a0e12" stroke="#39ff88" strokeWidth="1" />
              <circle cx="0" cy="0" r="4" fill="#39ff88" />
              <text x="0" y="34" fill="#39ff88" fontSize="9" fontFamily="monospace" textAnchor="middle">
                GW RPi4
              </text>
            </g>

            {/* Indicador SF adaptativo */}
            <g transform="translate(400,60)">
              <rect x="-58" y="-16" width="116" height="26" fill="#050505" stroke="#7c5cff" strokeWidth="1" />
              <text ref={sfRef} x="0" y="2" fill="#7c5cff" fontSize="13" fontFamily="monospace" textAnchor="middle">
                SF7
              </text>
            </g>

            {/* Leyenda banda */}
            <text x="400" y="380" fill="#4b5663" fontSize="9" fontFamily="monospace" textAnchor="middle">
              CSS · AU915 · &lt;1 W · AES-128 · ADR adaptativo
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}
