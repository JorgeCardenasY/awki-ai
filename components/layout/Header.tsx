import Link from "next/link";

const NAV = [
  { href: "/tecnologia", label: "TECNOLOGÍA" },
  { href: "/hardware/nodo-awki", label: "NODO" },
  { href: "/soluciones", label: "SOLUCIONES" },
  { href: "/privacidad", label: "PRIVACIDAD" },
  { href: "/blog", label: "BLOG" },
  { href: "/contacto", label: "CONTACTO" },
];

/**
 * Header tipo terminal — evoca una sesión SSH remota al nodo de borde.
 * El cursor parpadeante y las etiquetas de estado refuerzan la estética cyber-industrial.
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-surface-border bg-void/90 backdrop-blur-md">
      {/* Barra de estado superior */}
      <div className="flex items-center justify-between border-b border-surface-border/60 px-4 py-1 font-mono text-[10px] tracking-wider text-ink-faint">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-neon-green">
            <span className="h-1.5 w-1.5 rounded-full bg-neon-green shadow-neon-cyan animate-pulse" />
            LINK_ESTABLE
          </span>
          <span className="hidden sm:inline">AU915 · 928 MHz</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:inline">D.S. 1/2022 · IR 940nm</span>
          <span className="text-neon-cyan">UPTIME 99.98%</span>
        </div>
      </div>

      {/* Barra principal */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="group flex items-center gap-2 font-mono">
          <span className="text-neon-cyan">awki@node</span>
          <span className="text-ink-dim">:</span>
          <span className="text-ink-faint">~</span>
          <span className="text-neon-magenta">$</span>
          <span className="ml-1 animate-blink text-neon-cyan">▊</span>
          <span className="ml-4 hidden text-sm font-bold tracking-[0.2em] text-ink sm:inline">
            AWKI_AI_TECH
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-sm px-3 py-1.5 font-mono text-xs tracking-wider text-ink-dim transition-colors hover:bg-surface-raised hover:text-neon-cyan"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 font-mono text-[10px]">
          <span className="tag-cyan">BETA</span>
        </div>
      </div>
    </header>
  );
}
