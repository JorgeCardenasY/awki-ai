import Link from "next/link";

type ComplianceItem = { code: string; label: string; href?: string };

const COMPLIANCE: ComplianceItem[] = [
  { code: "SUBTEL", label: "Res. 737 / 2219 · Homologación radioeléctrica", href: "https://www.subtel.gob.cl" },
  { code: "FCC", label: "Part 15 · Módulo LoRa pre-certificado", href: "https://www.fcc.gov" },
  { code: "D.S. 1/2022", label: "Cero contaminación lumínica · IR 940 nm", href: "https://www.bcn.cl/leychile" },
  { code: "LEY 21.719", label: "Privacidad by design · imagen destruida en borde", href: "https://www.bcn.cl/leychile" },
  { code: "IP65/67", label: "Carcasa sellada · cero obras civiles" },
];

/**
 * Footer — referencia el cumplimiento normativo tecnológico del sistema.
 */
export default function Footer() {
  return (
    <footer className="border-t border-surface-border bg-void">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Identidad */}
          <div>
            <div className="font-mono text-sm font-bold tracking-[0.2em] text-ink">
              AWKI_AI_TECH
            </div>
            <p className="mt-3 max-w-xs font-mono text-xs leading-relaxed text-ink-dim">
              Plataforma SaaS de trazabilidad logística para la Macrozona Norte
              de Chile y rutas altoandinas sin cobertura celular.
            </p>
            <div className="mt-4 flex items-center gap-2 font-mono text-[10px] text-neon-cyan">
              <span className="animate-blink">▊</span> awki@node:~$ ./uptime.sh
            </div>
          </div>

          {/* Cumplimiento normativo */}
          <div>
            <h3 className="section-kicker">Cumplimiento</h3>
            <ul className="mt-4 space-y-2.5">
              {COMPLIANCE.map((c) => (
                <li key={c.code} className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0 rounded-sm border border-neon-cyan/30 px-1.5 py-0.5 font-mono text-[10px] text-neon-cyan">
                    {c.code}
                  </span>
                  {c.href ? (
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs leading-relaxed text-ink-dim transition-colors hover:text-neon-cyan"
                    >
                      {c.label} ↗
                    </a>
                  ) : (
                    <span className="font-mono text-xs leading-relaxed text-ink-dim">
                      {c.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Stack */}
          <div>
            <h3 className="section-kicker">Stack</h3>
            <ul className="mt-4 space-y-2 font-mono text-xs text-ink-dim">
              <li>Edge AI · YOLOv8-Nano INT8 · &gt;20 FPS</li>
              <li>LoRaWAN CSS · Wio-E5 (STM32WLE5) · AU915</li>
              <li>Django + PostgreSQL · TimescaleDB + PostGIS</li>
              <li>PWA offline-first · IndexedDB</li>
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h3 className="section-kicker">Recursos</h3>
            <ul className="mt-4 space-y-2 font-mono text-xs text-ink-dim">
              <li>
                <Link href="/blog" className="transition-colors hover:text-neon-cyan">
                  Blog técnico
                </Link>
              </li>
              <li>
                <Link href="/glosario" className="transition-colors hover:text-neon-cyan">
                  Glosario
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="transition-colors hover:text-neon-cyan">
                  Privacidad (Ley 21.719)
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="transition-colors hover:text-neon-cyan">
                  Solicitar demo
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-surface-border/60 pt-6 font-mono text-[10px] text-ink-faint sm:flex-row">
          <span>© {new Date().getFullYear()} Awki AI Tech · Macrozona Norte, Chile</span>
          <span className="flex items-center gap-2">
            <span className="text-neon-cyan">[ SISTEMA OPERATIVO ]</span>
            <span>generado con metodología Skilyfi</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
