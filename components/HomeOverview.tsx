import Link from "next/link";

const PILLARS = [
  {
    href: "/tecnologia",
    tag: "TECNOLOGÍA",
    title: "Edge AI + LoRaWAN",
    desc: "Inferencia ALPR en el borde (YOLOv8-Nano) y transmisión por radio en banda AU915, sin depender de la red celular.",
    color: "text-neon-violet",
    border: "border-neon-violet/40",
  },
  {
    href: "/hardware/nodo-awki",
    tag: "HARDWARE",
    title: "El Nodo Awki",
    desc: "Carcasa IP65/67 mimetizada en PETG/ASA, óptica STARVIS sin IR-cut y tren energético solar adaptativo a bajo cero.",
    color: "text-neon-cyan",
    border: "border-neon-cyan/40",
  },
  {
    href: "/soluciones",
    tag: "SOLUCIONES",
    title: "Rutas altoandinas",
    desc: "Despliegue en la Ruta CH-11 y la Macrozona Norte: trazabilidad sin obras civiles, PWA offline y analítica B2B.",
    color: "text-neon-amber",
    border: "border-neon-amber/40",
  },
  {
    href: "/privacidad",
    tag: "PRIVACIDAD",
    title: "Ley 21.719",
    desc: "Privacidad por diseño: la imagen se destruye en el borde y solo viajan metadatos cifrados. Cumplimiento normativo.",
    color: "text-neon-magenta",
    border: "border-neon-magenta/40",
  },
  {
    href: "/contacto",
    tag: "DEMO",
    title: "Solicita una demo",
    desc: "Conversa con el equipo, agenda un piloto en tu ruta y conecta tus datos a Power BI.",
    color: "text-neon-green",
    border: "border-neon-green/40",
  },
];

/** Hub de la home: tarjetas que enlazan a cada pilar (hub-and-spoke). */
export default function HomeOverview() {
  return (
    <section className="relative border-t border-surface-border">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:py-28">
        <p className="section-kicker">[ EXPLORA LA PLATAFORMA ]</p>
        <h2 className="mt-3 font-sans text-3xl font-bold tracking-tight text-ink sm:text-5xl">
          Un sistema, <span className="text-neon-cyan">cinco pilares</span>.
        </h2>
        <p className="mt-5 max-w-2xl font-mono text-sm leading-relaxed text-ink-dim">
          Desde la electrónica de borde hasta la analítica en la nube. Explora
          cada capa del sistema de trazabilidad logística de Awki.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className={`panel clip-corner group p-6 transition-colors hover:bg-surface-raised ${p.border}`}
            >
              <span className={`tag ${p.color} ${p.border}`}>{p.tag}</span>
              <h3 className="mt-4 font-sans text-lg font-semibold text-ink">
                {p.title}
              </h3>
              <p className="mt-2 font-mono text-xs leading-relaxed text-ink-dim">
                {p.desc}
              </p>
              <span className={`mt-4 inline-block font-mono text-xs ${p.color}`}>
                Explorar ▸
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
