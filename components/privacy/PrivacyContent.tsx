const NORMS = [
  {
    code: "LEY 21.719",
    name: "Protección de Datos Personales (Chile)",
    desc: "Privacidad por diseño: minimización, imagen destruida en el borde y cifrado.",
    href: "https://www.bcn.cl/leychile",
    color: "text-neon-magenta",
  },
  {
    code: "D.S. 1/2022",
    name: "Contaminación lumínica (MMA)",
    desc: "Operación en IR 940 nm, cero luz visible, sin skyglow.",
    href: "https://www.bcn.cl/leychile",
    color: "text-neon-cyan",
  },
  {
    code: "SUBTEL",
    name: "Res. 737 / 2219 · LPWAN/IoT",
    desc: "Banda AU915/US915 915–928 MHz, potencia ≤ 1 W y duty cycle.",
    href: "https://www.subtel.gob.cl",
    color: "text-neon-amber",
  },
  {
    code: "FCC / IC / RED",
    name: "Certificación radioeléctrica",
    desc: "Módulo LoRa pre-certificado + homologación del producto final.",
    href: "https://www.fcc.gov",
    color: "text-neon-green",
  },
];

const PRINCIPLES = [
  { t: "Minimización", d: "Solo se transmiten metadatos (~48 bytes). La imagen nunca sale del dispositivo." },
  { t: "Procesamiento local", d: "La inferencia ALPR ocurre en el borde; el frame se sobrescribe en RAM." },
  { t: "Cifrado", d: "AES-128 en la radio (AppSKey/NwkSKey), TLS 1.3 en backhaul y cifrado en reposo." },
  { t: "Control de acceso", d: "mTLS, rate limiting y auditoría inmutable en integraciones estatales." },
  { t: "Transparencia", d: "Alertas con validación humana y umbrales de confianza para evitar falsos positivos." },
];

/** Privacidad y cumplimiento normativo — contenido E-E-A-T con citas oficiales. */
export default function PrivacyContent() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="panel clip-corner p-6">
          <h2 className="font-sans text-2xl font-bold tracking-tight text-ink sm:text-4xl">
            Privacidad <span className="text-neon-magenta">por diseño</span>, no por
            añadidura.
          </h2>
          <p className="mt-4 max-w-3xl font-mono text-sm leading-relaxed text-ink-dim">
            La <span className="text-ink">Ley 21.719</span> de protección de datos
            personales exige minimización y seguridad desde el diseño. En Awki, el
            dato personal (la patente) se procesa localmente, se extrae solo el texto y
            la imagen cruda se <span className="text-neon-magenta">destruye en RAM</span>{" "}
            antes de cualquier transmisión.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map((p) => (
              <div key={p.t} className="rounded-sm border border-surface-border bg-surface/50 p-4">
                <h3 className="font-sans text-sm font-semibold text-neon-cyan">{p.t}</h3>
                <p className="mt-2 font-mono text-xs leading-relaxed text-ink-dim">{p.d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Normativa con enlaces salientes */}
        <div className="mt-6">
          <h2 className="font-sans text-xl font-bold text-ink sm:text-2xl">
            Cumplimiento normativo
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {NORMS.map((n) => (
              <a
                key={n.code}
                href={n.href}
                target="_blank"
                rel="noopener noreferrer"
                className="panel clip-corner group p-5 transition-colors hover:bg-surface-raised"
              >
                <span className={`font-mono text-xs font-bold ${n.color}`}>{n.code}</span>
                <div className="mt-2 font-sans text-sm font-semibold text-ink">{n.name}</div>
                <p className="mt-1 font-mono text-xs leading-relaxed text-ink-dim">{n.desc}</p>
                <span className={`mt-3 inline-block font-mono text-xs ${n.color}`}>
                  Ver fuente ↗
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
