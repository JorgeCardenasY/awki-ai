"use client";

import { useState } from "react";
import {
  fetchNodeTelemetry,
  checkStolenVehicle,
  type NodeTelemetry,
  type StolenVehicleCheck,
} from "@/services/api";

const PLACA_TEST = "a3f9·c2b7·8d1e";

export default function ApiConsole() {
  const [telemetry, setTelemetry] = useState<NodeTelemetry | null>(null);
  const [check, setCheck] = useState<StolenVehicleCheck | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const runTelemetry = async () => {
    setLoading("telemetria");
    setTelemetry(await fetchNodeTelemetry("CH-11·N7"));
    setLoading(null);
  };

  const runCheck = async () => {
    setLoading("consulta");
    setCheck(await checkStolenVehicle(PLACA_TEST));
    setLoading(null);
  };

  return (
    <section className="relative border-t border-surface-border bg-void/40">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:py-24">
        <p className="section-kicker">[ FASE 5 · MOCKUPS DE API ]</p>
        <h3 className="mt-3 font-sans text-2xl font-bold tracking-tight text-ink sm:text-4xl">
          Conectores listos para <span className="text-neon-cyan">producción</span>.
        </h3>
        <p className="mt-5 max-w-2xl font-mono text-sm leading-relaxed text-ink-dim">
          El directorio <span className="text-ink">/services</span> expone promesas
          simuladas que devuelven JSON realista. Al conectar Django, solo se cambia
          la implementación interna — el contrato se mantiene.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* fetchNodeTelemetry */}
          <div className="panel clip-corner p-4">
            <div className="mb-3 flex items-center justify-between font-mono text-[10px] text-ink-faint">
              <span className="text-neon-cyan">fetchNodeTelemetry()</span>
              <button
                onClick={runTelemetry}
                className="clip-corner border border-neon-cyan/40 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-neon-cyan transition-colors hover:bg-neon-cyan hover:text-black"
              >
                {loading === "telemetria" ? "..." : "Ejecutar"}
              </button>
            </div>
            <pre className="min-h-40 overflow-x-auto rounded-sm bg-void p-4 font-mono text-xs leading-relaxed text-ink-dim">
              {telemetry ? JSON.stringify(telemetry, null, 2) : "// esperando invocación…"}
            </pre>
          </div>

          {/* checkStolenVehicle */}
          <div className="panel clip-corner p-4">
            <div className="mb-3 flex items-center justify-between font-mono text-[10px] text-ink-faint">
              <span className="text-neon-amber">checkStolenVehicle(&quot;{PLACA_TEST}&quot;)</span>
              <button
                onClick={runCheck}
                className="clip-corner border border-neon-amber/40 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-neon-amber transition-colors hover:bg-neon-amber hover:text-black"
              >
                {loading === "consulta" ? "..." : "Ejecutar"}
              </button>
            </div>
            <pre className="min-h-40 overflow-x-auto rounded-sm bg-void p-4 font-mono text-xs leading-relaxed text-ink-dim">
              {check ? JSON.stringify(check, null, 2) : "// esperando invocación…"}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
