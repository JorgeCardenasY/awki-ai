# ROADMAP — Operativización de AWKI AI TECH (sitio estático)

Documento de planificación que define **cómo dejar el servidor operativo** usando el
mínimo de infraestructura. El sitio es **estático** (`output: "export"`): se compila
en local y se sube por FTP. No hay runtime Node, ni proxy, ni cron en el servidor.

> Complementa a `DEPLOYMENT.md` (pasos técnicos detallados). Aquí está el *por qué* y
> el *orden*.

---

## 1. Principio rector

> **El build vive en tu máquina; el servidor solo sirve archivos estáticos.**

El servidor (LiteSpeed, hosting compartido, sin SSH) solo necesita **servir archivos
estáticos** (`mod_rewrite` + `mod_headers`). Por lo tanto, el repositorio contiene el
código fuente y el `.htaccess`; el servidor recibe únicamente el resultado del build
(`out/`).

---

## 2. Mapeo de tecnologías (proyecto ↔ servidor)

| Necesidad del proyecto | Tecnología | ¿Dónde vive? |
|---|---|---|
| Compilación estática | `next build` (`output: "export"`) | Local (tu máquina) |
| Servir HTML/CSS/JS | LiteSpeed (static) | Servidor |
| Redirecciones / HTTPS / HSTS / caché | `.htaccess` (`mod_rewrite` + `mod_headers`) | Servidor (vía repo) |
| HTTPS / dominio canónico | SSL/TLS + DNS (ya activos) | Servidor |
| Despliegue | FTP / File Manager (subir `out/`) | Servidor |
| Analytics (GA4) | `NEXT_PUBLIC_GA_MEASUREMENT_ID` en build-time | Local (build) |
| Backend futuro (Django) | Entorno con Python + persistencia | Servidor (futuro) |
| BBDD futura (PostgreSQL) | Base de Datos | Servidor (futuro) |
| ~~Node.js / mod_proxy / cron build~~ | — | ❌ **Ya no se usa** (sitio estático) |

---

## 3. Principio anti-duplicación (local vs servidor)

| Artefacto | ¿Dónde vive? | Regla |
|---|---|---|
| Código fuente (`app/`, `components/`, `lib/`, `services/`) | Local (repo) | Única fuente |
| `package.json` + `package-lock.json` | Local (repo) | Única fuente de dependencias |
| Config (`next.config.ts`, `tailwind`, `tsconfig`, `.htaccess`) | Local (repo) | Única fuente |
| `out/` (build estático) | Local (generado) → subido | Gitignored — **nunca** se commitea |
| Secretos (`.env.local`) | Local (solo) | Gitignored — **nunca** se sube |
| `node_modules/`, `.next/` | Local (solo) | Gitignored — **nunca** se sube |

---

## 4. Estimación de tamaño

| Artefacto | Tamaño |
|---|---|
| Código fuente (sin `node_modules`, `.next`, `.git`, `out`) | ~463 KB |
| `out/` (build estático listo para subir) | **~3.4 MB** (113 archivos) |
| `node_modules` (dev + prod, solo local) | 557 MB (no se sube) |

> Ahorro vs. el enfoque Node standalone anterior: **0 MB de runtime en el servidor**,
> sin `node_modules`, sin `.next`, sin proceso persistente.

---

## 5. Roadmap por fases

### Fase 0 — Consolidar el repositorio (una vez, local)
1. `git add -A && git commit -m "Migrar a sitio estático (output: export)"`.
2. `git push -u origin main`.

### Fase 1 — Infraestructura del servidor (una vez)
3. DNS: `A awki-ai.cl` y `A www.awki-ai.cl` → IP del servidor (✅ ya hecho).
4. SSL: Let's Encrypt para `awki-ai.cl` y `www.awki-ai.cl` (✅ ya hecho).
5. Confirmar `mod_rewrite` y `mod_headers` activos (LiteSpeed los trae por defecto).

### Fase 2 — Despliegue (por cada release)
6. Build local: `npm run build` (con `NEXT_PUBLIC_GA_MEASUREMENT_ID`).
7. Subir el contenido de `out/` + `.htaccess` por FTP a `public_html/`.

### Fase 3 — Verificación
8. HTTPS, redirecciones, headers, sitemap/robots, 404 propia.

### Fase 4 — Operación continua
9. Backup del servidor + monitoreo (Resource Usage / logs del panel).

### Fase 5 — Expansión futura (backend real)
10. Django + PostgreSQL en un entorno con Python/persistencia → conectar
    `services/api.ts` a endpoints reales reutilizando los contratos ya definidos.

---

## 6. Decisiones críticas

1. **Sitio estático, no Node.** El sitio no usa SSR/ISR ni rutas API →
   `output: "export"` elimina runtime, proxy y cron. (Si en el futuro se añade un
   backend con SSR, se reevalúa un hosting con Node/SSH.)
2. **Build en local, no en el servidor.** Evita depender de un entorno de build en el
   hosting compartido.
3. **Un solo `.htaccess`.** Redirecciones, HTTPS, HSTS, caché y cabeceras de seguridad
   en un único archivo versionado.
4. **Secretos solo en local.** `NEXT_PUBLIC_GA_MEASUREMENT_ID` se inyecta en build-time;
   `.env.local` gitignored.
