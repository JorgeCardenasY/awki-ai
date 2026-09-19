# AWKI AI TECH — skilyfi_state.md
### Estado Global de Desarrollo · Metodología Skilyfi (Enjambre de Agentes de IA)

> **Este archivo es la fuente de verdad del proyecto.** Cada agente DEBE leer este archivo
> antes de modificar código y actualizarlo al terminar su fase.
> **Última actualización:** ✅ Todas las fases (1–5) completadas · Enjambre Skilyfi

---

## 1. Misión y Contexto

Plataforma web B2B de **Awki AI Tech** — SaaS de trazabilidad logística para la
**Macrozona Norte de Chile** y rutas altoandinas (ej. Ruta CH-11) sin cobertura 3G/4G.

No es un brochure tradicional: es una **inmersión técnica "de geeks para geeks"** con estética
**cyber-industrial** (OLED black, acentos neón, tipografías monospace).

> Documento fuente de ingeniería: `AWKI_AI_Tech_Arquitectura.md` (raíz).

---

## 2. Stack Tecnológico

| Capa | Tecnología | Versión instalada |
|---|---|---|
| Framework | Next.js (App Router) | 16.3.5 (Turbopack) |
| Lenguaje | TypeScript | 5.x |
| Estilos | Tailwind CSS | 3.4.19 (`tailwind.config.ts`) |
| 3D | Three.js + R3F + Drei | three 0.186 · r3f 9.7 · drei 10.7 |
| Animación | GSAP + Anime.js | gsap 3.15 · animejs 3.2.2 |
| Runtime | Node.js | 25.3.0 |
| React | react / react-dom | 19.2.8 |

> **Decisión: Tailwind v3** (no v4) porque el requisito exige configurar `tailwind.config.ts`.
> **Backend futuro (NO implementado aún):** Django + PostgreSQL (TimescaleDB + PostGIS).
> En esta etapa el Frontend es 100% interactivo con **simulaciones visuales y mockups de API**.

---

## 3. Sistema de Diseño Cyber-Industrial

### 3.1 Paleta (OLED black + acentos neón)
- `bg` fondo absoluto: `#000000` / `#050505` (ausencia de contaminación lumínica — D.S. 1/2022)
- `surface` plomo oscuro: `#0a0e12`, `#11161d`
- `neon-cyan`: `#00ffcc` (telemetría / datos)
- `neon-amber`: `#ffb000` (alerta / energía)
- `neon-magenta`: `#ff2d78` (inferencia / ALPR)
- `neon-violet`: `#7c5cff` (red / LoRaWAN)
- `grid` líneas: `#1a2330` / `#223046`

### 3.2 Tipografía
- **Monospace** (datos crudos / terminal): JetBrains Mono, fallback IBM Plex Mono, `ui-monospace`
- **Sans geométrica** (narrativa / títulos): Space Grotesk, fallback Inter, `system-ui`

### 3.3 Motivos visuales
- Grid de fondo sutil, scanlines, esquinas recortadas (clip-path), barras de estado, etiquetas `[ TAG ]`.

---

## 4. Estructura de Directorios

```
AWKI/
├─ skilyfi_state.md            # ESTE archivo
├─ AWKI_AI_Tech_Arquitectura.md
├─ app/
│  ├─ layout.tsx               # fuentes, metadata, providers
│  ├─ globals.css              # variables, base, scrollbar
│  └─ page.tsx                 # composición de secciones
├─ components/
│  ├─ layout/                  # Header, Footer
│  ├─ three/                   # R3F (Fase 2)
│  ├─ simulation/              # Anime.js / SVG (Fase 3)
│  ├─ saas/                    # diagramas / PWA / PowerBI (Fase 4)
│  └─ roadmap/                 # Gantt (Fase 5)
├─ services/                   # mockups API (Fase 5)
├─ lib/                        # hooks compartidos (GSAP, R3F)
└─ tailwind.config.ts
```

---

## 5. Hooks y Convenciones Compartidas

- **GSAP:** registrar `ScrollTrigger` una sola vez en un provider o `useEffect` de layout.
- **R3F:** envolver cada escena en `<Canvas>` con `dpr={[1, 2]}` y `gl={{ antialias: true, alpha: true }}`.
- **Dark-only:** el sitio no soporta modo claro; fijar `color-scheme: dark`.
- **Tipado:** todos los mockups de API retornan interfaces TypeScript definidas en `services/`.
- **Accesibilidad:** `prefers-reduced-motion` debe degradar animaciones a estático.

---

## 6. Estado de Agentes (Cascada Skilyfi)

| Fase | Agente | Estado | Notas |
|---|---|---|---|
| Fase 1 | Arquitecto Base | ✅ COMPLETADA | Setup, design system, header/footer, hero |
| Fase 2 | Renderizado 3D | ✅ COMPLETADA | Exploded view nodo Awki (R3F + GSAP) |
| Fase 3 | Simulación de Flujos | ✅ COMPLETADA | ALPR (Anime.js) + LoRaWAN SVG + Blueprint/Velxio |
| Fase 4 | Arquitectura SaaS | ✅ COMPLETADA | Topología + PWA + Power BI (M/DAX) |
| Fase 5 | Roadmap + API | ✅ COMPLETADA | Gantt 10 meses + `/services` mocks |

---

## 7. Decisiones de Arquitectura (registro acumulativo)

- [Fase 1] Se usa `app/` (App Router) sin `src/`.
- [Fase 1] Import alias `@/*` → raíz del proyecto.
- [Fase 1] Tailwind v3 con `tailwind.config.ts` y tokens semánticos custom.
- [Fase 1] Header tipo terminal + Footer con cumplimiento SUBTEL/FCC.
- [Fase 1] Fuentes: Space Grotesk (`--font-sans`) + JetBrains Mono (`--font-mono`) vía next/font.
- [Fase 1] El proyecto se generó en `awki-tmp` y se movió a la raíz (npm rechaza mayúsculas en el nombre).
- [Fase 1] `package.json` name = `awki`.
- [Fase 2] R3F v9 + drei v10 + three 0.186 (React 19 compatible). Escena cargada con `next/dynamic(ssr:false)`.
- [Fase 2] GSAP ScrollTrigger conduce el valor `progress` (objeto mutable compartido) hacia el `useFrame` de R3F.
- [Fase 3] animejs se fijó en **v3.2.2** (API clásica `anime({...})`); v4 reescribió la API (`animate/createTimeline`) y se descartó por riesgo.
- [Fase 4] Topología, PWA y Power BI son componentes de servidor (estáticos); solo los elementos interactivos son clientes.
- [Fase 5] `/services/api.ts` define los contratos (`NodeTelemetry`, `StolenVehicleCheck`, `FleetStatus`) listos para Django.
- [Fase 5] `subscribeTelemetry()` usa `AsyncGenerator` para simular streaming en tiempo real.
- [SEO] Quick wins del Pilar 1 implementados: `lib/site.ts` (constantes), `app/robots.ts`, `app/sitemap.ts`, `app/manifest.ts`, `app/opengraph-image.tsx`, `app/icon.svg`, `components/seo/JsonLd.tsx` (Organization + SoftwareApplication + WebSite), `next.config.ts` (headers/compression). Dominio de referencia: `https://awki.cl` (confirmar en producción). Informe completo en `SEO_Audit.md`.
- [SEO] Fase 2 (arquitectura) implementada: migración one-pager → multi-página (`/`, `/tecnologia`, `/hardware/nodo-awki`, `/soluciones`, `/privacidad`, `/contacto`), jerarquía H1→H2→H3, `Breadcrumbs` con JSON-LD BreadcrumbList, enlazado interno hub-and-spoke (`HomeOverview`) y enlaces salientes normativos (SUBTEL/FCC/BCN).
- [SEO] Fase 3 (contenido) implementada: `/glosario` (18 términos + JSON-LD `DefinedTermSet`), `/blog` con 4 artículos reales (`lib/blog.ts`, SSG con `generateStaticParams`), y FAQ en la home con JSON-LD `FAQPage` (`lib/faq.ts`).
- [SEO] Fase 4 (off-page) — código listo: `components/seo/Analytics.tsx` (GA4 gtag vía `NEXT_PUBLIC_GA_MEASUREMENT_ID`), `sameAs` en JSON-LD (`SOCIAL_LINKS`). Acciones externas (Search Console, GA4, Google Business Profile, linkbuilding) documentadas en `SEO_OffPage_Checklist.md`.
