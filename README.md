# AWKI AI TECH — Plataforma B2B de Trazabilidad Logística

Sitio web "de geeks para geeks" para la plataforma SaaS de trazabilidad logística
en la **Macrozona Norte de Chile** y rutas altoandinas (Ruta CH-11) sin cobertura
celular.

> Documento de ingeniería: `AWKI_AI_Tech_Arquitectura.md` · Estado global: `skilyfi_state.md`

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v3** (design system cyber-industrial en `tailwind.config.ts`)
- **Three.js / React Three Fiber / Drei** — exploded view del Nodo Awki
- **GSAP (ScrollTrigger)** + **Anime.js** — animaciones de scroll y pipelines

## Scripts

```bash
npm run dev      # servidor de desarrollo
npm run build    # build de producción
npm run lint     # ESLint
```

## Estructura

```
app/
  layout.tsx            # metadata, viewport, JSON-LD, header/footer
  page.tsx              # home (hub): Hero + HomeOverview
  globals.css
  tecnologia/page.tsx   # Edge AI + LoRaWAN + arquitectura
  hardware/nodo-awki/   # exploded view 3D + especificaciones
  soluciones/page.tsx   # Ruta CH-11 + PWA + Power BI + roadmap
  privacidad/page.tsx   # Ley 21.719 + normativa
  contacto/page.tsx     # demo / contacto
  blog/page.tsx         # índice de artículos
  blog/[slug]/page.tsx  # artículos (SSG via generateStaticParams)
  glosario/page.tsx     # glosario técnico + DefinedTermSet
  # SEO: robots.ts, sitemap.ts, manifest.ts, opengraph-image.tsx, icon.svg
components/
  layout/       # Header, Footer
  three/        # exploded view R3F + GSAP
  simulation/   # ALPR, LoRaWAN SVG, Blueprint/Velxio
  saas/         # topología, PWA, Power BI
  roadmap/      # Gantt + consola API
  hardware/     # especificaciones del nodo
  solutions/    # caso Ruta CH-11
  privacy/      # privacidad + normativa
  contact/      # formulario de demo
  seo/          # JSON-LD estructurado
  PageHeader.tsx, Breadcrumbs.tsx, HomeOverview.tsx, Hero.tsx
services/       # mockups de API
lib/            # gsap.ts, site.ts (constantes SEO)
```

## Backend futuro

El frontend es 100% interactivo con simulaciones y mockups. Los contratos de API
(`services/api.ts`) están preparados para conectarse a **Django + PostgreSQL
(TimescaleDB + PostGIS)** sin cambiar la interfaz.

