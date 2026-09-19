# 📋 INFORME DE AUDITORÍA SEO — AWKI AI TECH

**Tipo:** Auditoría técnica + on-page + contenido + autoridad + rendimiento
**Fecha:** 13/09/2026
**Alcance:** `awki` — sitio Next.js 16 (App Router) · B2B SaaS de trazabilidad logística (Macrozona Norte de Chile)
**Clasificación:** Interno — Marketing / Ingeniería

---

## 1. RESUMEN EJECUTIVO

El sitio tiene una **identidad técnica sobresaliente** y una base tecnológica correcta (Next.js App Router, SSG estático, `lang="es"`, title/description presentes), pero **no estaba preparado para posicionar**: carecía de los fundamentos de SEO técnico (`robots.txt`, `sitemap.xml`, canónica, Open Graph, datos estructurados), es un **one-pager** que concentra todo el contenido en una sola URL, y su contenido indexable es **fino** (la narrativa vive en 3D/WebGL y SVG, invisible para el crawler).

**Calificación global:** 🔴 38/100 — *Necesita trabajo inmediato en fundamentos técnicos y arquitectura de información.*

| Pilar | Nota | Estado |
|---|---:|---|
| SEO Técnico | 25/100 | 🔴 Crítico |
| On-Page | 45/100 | 🟠 Mejorable |
| Contenido | 30/100 | 🔴 Insuficiente |
| Autoridad (E-E-A-T) | 20/100 | 🔴 Crítico |
| Rendimiento (CWV) | 55/100 | 🟡 Aceptable con riesgo |
| Arquitectura de info | 30/100 | 🔴 Crítico |

---

## 2. METODOLOGÍA

Análisis estático del código fuente del proyecto (`app/`, `components/`, `services/`, `public/`, `next.config.ts`, `layout.tsx`), revisión de metadatos, jerarquía de encabezados, enlazado interno/externo, assets y estructura de rutas. No se incluyó rastreo en vivo (sin despliegue de producción).

---

## 3. AUDITORÍA TÉCNICA

### 3.1 Hallazgos confirmados (estado real del código)

| # | Hallazgo | Impacto | Prioridad |
|---|---|---|---|
| T1 | `metadataBase` / URL canónica ausentes | Duplicados/ambigüedad de dominio | 🔴 Alta |
| T2 | Sin Open Graph ni Twitter Cards | Compartidos en RRSS sin imagen/título | 🔴 Alta |
| T3 | Sin `og:image` (imagen social) | Previews rotos en LinkedIn/WhatsApp | 🔴 Alta |
| T4 | Sin `robots.txt` | Google no sabe qué rastrear | 🔴 Alta |
| T5 | Sin `sitemap.xml` | Descubrimiento de URLs deficiente | 🔴 Alta |
| T6 | Sin datos estructurados (JSON-LD) | Sin rich results ni entidad reconocida | 🔴 Alta |
| T7 | Sin `manifest` PWA | Desperdicia la narrativa offline-first | 🟠 Media |
| T8 | Favicon por defecto de Next (`favicon.ico`) | Marca débil | 🟠 Media |
| T9 | `public/` con SVGs huérfanos | Basura, confunde auditoría | 🟡 Baja |
| T10 | `next.config.ts` vacío | Sin headers/compression | 🟡 Media |
| T11 | `keywords` meta presente | Obsoleto (Google lo ignora desde 2009) | ⚪ Neutro |

### 3.2 Estado de implementación (post quick-wins)

> ✅ Marcados como resueltos en esta iteración: T1, T2, T3, T4, T5, T6, T7, T8, T9, T10.
> Archivos: `lib/site.ts`, `app/robots.ts`, `app/sitemap.ts`, `app/manifest.ts`,
> `app/opengraph-image.tsx`, `app/icon.svg`, `components/seo/JsonLd.tsx`,
> `next.config.ts`, `app/layout.tsx`.

---

## 4. AUDITORÍA ON-PAGE

| # | Hallazgo | Impacto |
|---|---|---|
| O1 | **1 solo `H1`** correcto en el Hero ✅ | Positivo |
| O2 | ~10 `H2` en la home; varias son **subsecciones** que deberían ser `H3` | Jerarquía plana, diluye semántica |
| O3 | **Cero imágenes `<img>` con `alt`** (todo es SVG inline / 3D / CSS) | Sin image SEO, sin accesibilidad |
| O4 | **Cero enlaces externos** (SUBTEL, D.S. 1/2022, Ley 21.719, FCC no enlazan) | E-E-A-T débil, sin citas |
| O5 | Enlazado interno solo por anclas (`#nodo`, `#saas`…) | Sin URLs, sin autoridad de página |
| O6 | Title = 62 chars, description sin CTA ni keyword long-tail | Optimización media |

---

## 5. AUDITORÍA DE CONTENIDO

- **Contenido indexable insuficiente**: las secciones técnicas (nodo 3D, ALPR, LoRaWAN) transmiten su valor por visual, que el crawler no lee. El texto real por sección es de 1–2 frases.
- **Sin blog ni glosario**: no captura long-tail de alta intención informativa.
- **Oportunidad única**: la intersección "logística + IoT + normativa chilena (Ley 21.719, D.S. 1/2022)" es **poco competida** y altamente buscada por tomadores de decisión técnicos.

---

## 6. AUDITORÍA DE AUTORIDAD (E-E-A-T)

| Señal | Estado |
|---|---|
| Página "Nosotros" / equipo | ❌ Ausente |
| Autores / credenciales | ❌ Ausente |
| Citas a fuentes normativas | ❌ Ausente (no hay enlaces) |
| Schema `Organization` / `sameAs` | ✅ Implementado (post quick-wins) |
| Presencia en directorios/redes | ❌ Sin verificar |

---

## 7. AUDITORÍA DE RENDIMIENTO (Core Web Vitals)

- ✅ **Code-splitting del 3D** (`next/dynamic ssr:false`) — bien ejecutado, evita ~1 MB de three.js en el bundle inicial.
- ✅ Fuentes con `display: swap` — evita FOIT.
- ⚠️ **TBT/INP en riesgo**: GSAP ScrollTrigger + anime.js en componentes cliente con animaciones en bucle.
- ⚠️ **CLS en riesgo**: `pin` de ScrollTrigger en el exploded view (validar que reserve espacio).
- ⚠️ **Sin imagen LCP optimizada** ni precarga de recursos clave.

---

## 8. INVESTIGACIÓN DE KEYWORDS (preliminar, por cluster)

| Cluster | Ejemplos | Intención |
|---|---|---|
| Núcleo B2B | trazabilidad logística, monitoreo flota, reconocimiento de patentes chile | Transaccional |
| Tecnología | edge ai, alpr, yolov8, lorawan, chirpstack | Informativa |
| Normativa | ley 21.719, decreto supremo 1/2022, resolución subtel | Informativa/autoridad |
| Local | logística arica, ruta ch-11, altiplano chile, macrozona norte | Local |
| Long-tail | qué es lorawan, cómo funciona alpr, lifepo4 frío, lithium plating | Informativa |

*(Nota: requiere validación con herramientas de volumen real antes de priorizar.)*

---

## 9. PLAN DE ACCIÓN PRIORIZADO

### Quick wins (✅ completados en esta iteración)
1. `metadataBase` + canónica + Open Graph + Twitter + `og-image`.
2. `robots.ts` + `sitemap.ts`.
3. JSON-LD `Organization` + `SoftwareApplication` + `WebSite`.
4. `manifest.webmanifest` (PWA).
5. Favicon/icon set de marca (`app/icon.svg`).
6. Limpieza de `public/` + `next.config.ts` (headers/compression).

### Estructural (✅ completados en esta iteración)
7. Migración **one-pager → multi-página** (`/`, `/tecnologia`, `/hardware/nodo-awki`, `/soluciones`, `/privacidad`, `/contacto`).
8. Corrección de jerarquía de encabezados (H1→H2→H3, un H1 por página).
9. Estrategia de enlazado interno hub-and-spoke (HomeOverview + Breadcrumbs con JSON-LD).
10. E-E-A-T: enlaces salientes a normativa (SUBTEL, FCC, BCN LeyChile) en footer y página de privacidad.

### Crecimiento (✅ Fase 3 implementada · Fase 4 lista en código)
11. Glosario técnico (`/glosario`) + blog (`/blog`, 4 artículos) + FAQ schema — ✅ implementado.
12. Analytics GA4 + verificación Search Console + `sameAs` — ✅ código listo (pendiente de credenciales reales).
13. Linkbuilding, Google Business Profile, digital PR — 📋 documentado en `SEO_OffPage_Checklist.md` (acciones externas).

---

## 10. ROADMAP Y KPIs

| Fase | Duración | Entregable |
|---|---|---|
| 1 · Fundamentos | Sem 1–2 | SEO técnico completo (✅ hecho) |
| 2 · Arquitectura | Sem 2–4 | Multi-página + on-page |
| 3 · Contenido | Mes 2 | Glosario + blog + FAQ schema |
| 4 · Autoridad | Mes 3+ | Off-page + medición |

**KPIs objetivo (3–6 meses):**
- Indexación 100% (Search Console).
- CWV en verde (LCP < 2.5s, INP < 200ms, CLS < 0.1).
- Crecimiento de impresiones orgánicas + posiciones en clusters 1–2.
- Primeras conversiones orgánicas (demo/contacto).

