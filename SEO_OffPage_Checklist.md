# 🚀 CHECKLIST OFF-PAGE SEO — AWKI AI TECH

**Fase 4 del plan de posicionamiento global.** La parte de código ya está lista
(analytics, `sameAs`, verificación). Este documento detalla las acciones externas
que requieren cuentas y herramientas, y que no pueden ejecutarse solo con código.

---

## 1. Google Search Console (prioridad máxima)

- [ ] Crear propiedad en [search.google.com/search-console](https://search.google.com/search-console).
- [ ] Verificar el dominio (`awki.cl`) por DNS (recomendado) o etiqueta HTML.
  - Si usas etiqueta HTML, añade a `app/layout.tsx` → `metadata.verification.google`.
- [ ] Enviar el sitemap: `https://awki.cl/sitemap.xml`.
- [ ] Inspeccionar la URL `/` y solicitar indexación.
- [ ] Revisar el informe de cobertura tras 1–2 semanas (corregir errores 404/soft-404).

## 2. Google Analytics 4

- [ ] Crear una propiedad GA4 y copiar el Measurement ID (`G-XXXXXXXXXX`).
- [ ] Crear `.env.local` con:
  ```bash
  NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
  ```
  (El componente `components/seo/Analytics.tsx` ya inyecta gtag.js al detectar esta variable.)
- [ ] Definir eventos de conversión: `generate_lead` (formulario de contacto),
  `demo_requested`, `click_contact`, `scroll_depth`.
- [ ] Vincular GA4 con Search Console para cruzar datos de búsqueda.

## 3. Google Business Profile (Local SEO)

- [ ] Crear o reclamar la ficha de Google Business Profile (si hay oficina/domicilio fiscal).
- [ ] Categoría: "Empresa de software" / "Servicio de logística".
- [ ] Área de servicio: Macrozona Norte (Arica y Parinacota, Tarapacá, Antofagasta).
- [ ] Añadir sitio web, teléfono y horario.
- [ ] Pedir reseñas a clientes piloto.

## 4. Linkbuilding y autoridad

- [ ] Perfiles de empresa en directorios B2B y de tecnología de Chile.
- [ ] Crear los perfiles reales referenciados en `lib/site.ts` → `SOCIAL_LINKS`
  (LinkedIn, GitHub) y mantenerlos actualizados.
- [ ] Guest posts técnicos en comunidades IoT / Edge AI / LoRaWAN (con enlace a `/blog`).
- [ ] Notas de prensa en medios de la Macrozona Norte (Arica, Iquique, Antofagasta).
- [ ] Alianzas con organismos normativos/estatales para menciones y enlaces.

## 5. Digital PR — ángulo único

- [ ] Pitch: "logística sin cobertura celular en el altiplano" (diferenciador).
- [ ] Material de prensa: whitepaper técnico + capturas del Nodo Awki.
- [ ] Caso de éxito de la Ruta CH-11 para enlazar desde medios especializados.

## 6. Redes y distribución de contenido

- [ ] Compartir los artículos de `/blog` en LinkedIn (audiencia B2B técnica).
- [ ] Reutilizar el glosario como hilos/carruseles en redes.
- [ ] YouTube/tech talks: demo del exploded view y del pipeline ALPR.

## 7. KPIs de seguimiento

| Métrica | Herramienta | Objetivo (3–6 meses) |
|---|---|---|
| URLs indexadas | Search Console | 100% del sitemap |
| Impresiones / CTR | Search Console | Crecimiento mes a mes |
| Posiciones por cluster | Search Console | Top 10 en long-tail |
| Conversiones (demo) | GA4 | Primeras leads orgánicas |
| CWV | PageSpeed Insights | Todo en verde |

---

## Nota de verificación (pendiente de credenciales)

Las siguientes líneas de código ya están preparadas y solo requieren los valores reales:
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` → `.env.local` (GA4).
- `lib/site.ts` → `SOCIAL_LINKS` (perfiles reales) y `SITE_URL` (dominio definitivo).
- `app/layout.tsx` → `metadata.verification.google` (código de Search Console).
