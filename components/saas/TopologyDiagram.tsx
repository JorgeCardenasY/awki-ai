const NODES = [
  {
    id: "NODO",
    name: "Nodo Awki",
    tech: "Edge AI · ESP32-S3",
    detail: "Payload LoRaWAN cifrado AES-128 (~48 bytes)",
    color: "text-neon-cyan",
    border: "border-neon-cyan/40",
    dot: "bg-neon-cyan",
  },
  {
    id: "GW",
    name: "Gateway",
    tech: "Raspberry Pi 4 · SX1302",
    detail: "Concentrador LoRa → backhaul IP (TLS)",
    color: "text-neon-green",
    border: "border-neon-green/40",
    dot: "bg-neon-green",
  },
  {
    id: "LNS",
    name: "ChirpStack",
    tech: "LoRaWAN Network Server",
    detail: "Descifra, deduplica y enruta frames",
    color: "text-neon-violet",
    border: "border-neon-violet/40",
    dot: "bg-neon-violet",
  },
  {
    id: "MQTT",
    name: "MQTT Broker",
    tech: "Mosquitto / EMQX",
    detail: "Publica eventos de telemetría",
    color: "text-neon-violet",
    border: "border-neon-violet/40",
    dot: "bg-neon-violet",
  },
  {
    id: "WORKER",
    name: "Celery Workers",
    tech: "Django · Redis",
    detail: "Consumen cola, validan y normalizan",
    color: "text-neon-amber",
    border: "border-neon-amber/40",
    dot: "bg-neon-amber",
  },
  {
    id: "DB",
    name: "PostgreSQL",
    tech: "PostGIS + TimescaleDB",
    detail: "Georreferencia + series temporales",
    color: "text-neon-magenta",
    border: "border-neon-magenta/40",
    dot: "bg-neon-magenta",
  },
  {
    id: "UI",
    name: "Consumo B2B",
    tech: "PWA · Power BI · Carabineros",
    detail: "Dashboards offline-first + analítica",
    color: "text-ink",
    border: "border-surface-border",
    dot: "bg-ink",
  },
];

/**
 * Topología de datos — traza el paquete LoRaWAN desde el borde hasta el consumo.
 * Diagrama estático con flujo animado (pulso CSS escalonado).
 */
export default function TopologyDiagram() {
  return (
    <section id="saas" className="relative border-t border-surface-border">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:py-28">
        <p className="section-kicker">[ FASE 4 · ARQUITECTURA SaaS ]</p>
        <h2 className="mt-3 font-sans text-3xl font-bold tracking-tight text-ink sm:text-5xl">
          Del borde a la nube, <span className="text-neon-cyan">cifrado</span> de
          extremo a extremo.
        </h2>
        <p className="mt-5 max-w-2xl font-mono text-sm leading-relaxed text-ink-dim">
          El paquete LoRaWAN (cifrado <span className="text-ink">AES-128</span>)
          recorre el Gateway hacia el Network Server{" "}
          <span className="text-ink">ChirpStack</span>, baja por{" "}
          <span className="text-ink">MQTT</span> a Workers de{" "}
          <span className="text-ink">Celery</span> y persiste en{" "}
          <span className="text-ink">PostgreSQL</span> con PostGIS y TimescaleDB.
        </p>

        <div className="mt-10 flex flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-0">
          {NODES.map((node, i) => (
            <div key={node.id} className="flex flex-1 flex-col lg:flex-row lg:items-center">
              <div
                className={`panel clip-corner flex-1 p-4 ${node.border}`}
              >
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${node.dot} shadow-neon-cyan`} />
                  <span className={`font-mono text-[10px] uppercase tracking-widest ${node.color}`}>
                    {node.id}
                  </span>
                </div>
                <div className="mt-2 font-sans text-sm font-semibold text-ink">
                  {node.name}
                </div>
                <div className="font-mono text-[10px] text-ink-faint">{node.tech}</div>
                <div className="mt-2 font-mono text-[10px] leading-relaxed text-ink-dim">
                  {node.detail}
                </div>
              </div>

              {/* Conector */}
              {i < NODES.length - 1 && (
                <div className="flex items-center justify-center py-1 lg:px-2 lg:py-0">
                  <span className="flex items-center gap-1 lg:flex-col">
                    <span className="text-neon-cyan lg:rotate-90">▸</span>
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-neon-cyan animate-pulse-glow"
                      style={{ animationDelay: `${i * 180}ms` }}
                    />
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Nota de cifrado */}
        <div className="panel clip-corner mt-8 flex flex-wrap items-center justify-between gap-3 p-4 font-mono text-xs">
          <span className="text-ink-dim">
            <span className="text-neon-cyan">AES-128</span> AppSKey/NwkSKey ·{" "}
            <span className="text-neon-green">TLS 1.3</span> backhaul ·{" "}
            <span className="text-neon-magenta">cifrado en reposo</span> + HSM/KMS
          </span>
          <span className="text-ink-faint">mTLS en integraciones estatales</span>
        </div>
      </div>
    </section>
  );
}
