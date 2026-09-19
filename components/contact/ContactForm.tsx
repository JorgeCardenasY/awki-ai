"use client";

import { useState, type FormEvent } from "react";

/**
 * Formulario de contacto / solicitud de demo (mockup — sin backend aún).
 */
export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="panel clip-corner mx-auto max-w-xl p-8 text-center">
        <div className="font-mono text-4xl text-neon-green">✓</div>
        <h2 className="mt-4 font-sans text-2xl font-bold text-ink">
          Solicitud recibida
        </h2>
        <p className="mt-3 font-mono text-sm leading-relaxed text-ink-dim">
          Gracias por tu interés. Un ingeniero de Awki se pondrá en contacto para
          coordinar una <span className="text-neon-cyan">demo técnica</span> y evaluar
          un piloto en tu ruta.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="clip-corner mt-6 border border-surface-border px-5 py-2 font-mono text-xs uppercase tracking-widest text-ink-dim transition-colors hover:border-neon-cyan/50 hover:text-neon-cyan"
        >
          Enviar otra solicitud
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="panel clip-corner mx-auto max-w-xl p-6">
      <div className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
              Nombre
            </span>
            <input
              type="text"
              required
              placeholder="Nombre y apellido"
              className="mt-1 w-full rounded-sm border border-surface-border bg-void px-3 py-2 font-mono text-sm text-ink placeholder:text-ink-faint focus:border-neon-cyan/50 focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
              Email corporativo
            </span>
            <input
              type="email"
              required
              placeholder="tu@empresa.cl"
              className="mt-1 w-full rounded-sm border border-surface-border bg-void px-3 py-2 font-mono text-sm text-ink placeholder:text-ink-faint focus:border-neon-cyan/50 focus:outline-none"
            />
          </label>
        </div>

        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
            Empresa / institución
          </span>
          <input
            type="text"
            placeholder="Nombre de la organización"
            className="mt-1 w-full rounded-sm border border-surface-border bg-void px-3 py-2 font-mono text-sm text-ink placeholder:text-ink-faint focus:border-neon-cyan/50 focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
            Mensaje
          </span>
          <textarea
            rows={4}
            placeholder="Cuéntanos sobre tu ruta, flota o necesidad de trazabilidad…"
            className="mt-1 w-full rounded-sm border border-surface-border bg-void px-3 py-2 font-mono text-sm text-ink placeholder:text-ink-faint focus:border-neon-cyan/50 focus:outline-none"
          />
        </label>

        <button
          type="submit"
          className="clip-corner bg-neon-cyan px-5 py-3 font-mono text-xs font-bold uppercase tracking-widest text-black transition-colors hover:bg-neon-cyan/80"
        >
          Solicitar demo ▸
        </button>
      </div>
    </form>
  );
}
