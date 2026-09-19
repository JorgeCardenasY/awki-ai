# ROADMAP — Operativización de AWKI AI TECH en DirectAdmin

Documento de planificación que define **cómo dejar el servidor operativo** usando solo
las tecnologías que el servidor ya provee, y dejando en el repositorio **únicamente**
aquello que el servidor no tiene. Objetivo transversal: **evitar la duplicación de archivos**.

> Complementa a `DEPLOYMENT.md` (pasos técnicos detallados). Aquí está el *por qué* y el *orden*.

---

## 1. Principio rector

> **La infraestructura vive en el servidor; el código vive en el repositorio.**

El servidor DirectAdmin **ya provee** runtimes e infraestructura (Node.js, Python, Git,
Apache, SSL, DNS, cron, bases de datos). Por lo tanto, el repo solo debe contener lo que
el servidor **no** tiene: código fuente, manifiesto de dependencias, configuración y
assets propios del sitio.

---

## 2. Mapeo de tecnologías (proyecto ↔ servidor)

| Necesidad del proyecto | Tecnología del servidor | ¿Dónde vive? |
|---|---|---|
| Runtime Node.js (≥ 20.9) | Setup Node.js App (selector Node) | Servidor (no se versiona) |
| Instalar deps + build | Trabajo Cron (`npm ci && npm run build`) — sin terminal | Servidor |
| Reverse proxy Apache → Node | Manipuladores Apache + `.htaccess` (mod_proxy) | Servidor |
| HTTPS / dominio canónico | SSL/TLS Certificates + Dominios + DNS | Servidor |
| Despliegue | FTP/File Manager (subida) — Git solo para versionar | Servidor |
| Backend futuro (Django) | Setup Python App | Servidor (futuro) |
| BBDD futura (PostgreSQL) | Base de Datos | Servidor (futuro) |
| Seguridad en borde | Web Application Firewall + ImunifyAV | Servidor |
| Tareas programadas | Trabajo Cron | Servidor (futuro) |
| Monitoreo / logs | Resource Usage + Site summary & logs | Servidor |
| Respaldo | Backup and Restore | Servidor |
| ~~WordPress / Joomla / Softaculous / SitePad / PHP~~ | — | ❌ **No usar** (stack ajeno = duplicación) |

---

## 3. Principio anti-duplicación (local vs servidor)

| Artefacto | ¿Dónde vive? | Regla |
|---|---|---|
| Código fuente (`app/`, `components/`, `lib/`, `services/`) | Local (repo) | Única fuente |
| `package.json` + `package-lock.json` | Local (repo) | Única fuente de dependencias |
| Config (`next.config.ts`, `tailwind`, `tsconfig`, `.htaccess`) | Local (repo) | Única fuente |
| Assets propios (`public/`, `icon.svg`, `opengraph-image`) | Local (repo) | Única fuente |
| `.env.example` (plantilla, sin secretos) | Local (repo) | Documenta variables |
| Runtime Node.js / npm | Servidor (Setup Node.js App) | **No** se versiona |
| `node_modules/` | Servidor (vía `npm ci`) | Gitignored — **nunca** se sube |
| `.next/` (build + standalone) | Servidor (vía `npm run build`) | Gitignored — **nunca** se sube |
| Secretos (`.env.local`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`) | Servidor (solo) | Gitignored — **nunca** se sube |

---

## 4. Estimación de tamaño (antes / después)

Medición real del proyecto:

| Artefacto | Tamaño |
|---|---|
| Código fuente (sin `node_modules`, `.next`, `.git`) | **463 KB** · 64 archivos |
| `package-lock.json` | ~250 KB |
| `node_modules` (completo, dev + prod) | **557 MB** |
| `.next` (build completo) | **388 MB** |
| `.next/standalone` (bundle runtime) | **33 MB** |
| `.git` (historial) | ~312 KB |

Tras implementar los cambios:

| Métrica | Antes | Después | Ahorro |
|---|---|---|---|
| Repositorio Git (lo que se versiona/clona) | riesgo de 557 MB si se commitea | **~470 KB** | ~**−99.9 %** |
| Dependencias que el servidor mantiene **para correr** | 557 MB | **28 MB** (runtime standalone) | **−95 %** |
| Transferencia de build | subir 388 MB | 0 (se builda in-situ) | **−388 MB** |

Huella del servidor: **pico de build ≈ 945 MB** · **runtime persistente ≈ 34 MB**.
(En Linux el `node_modules` será algo menor: no instala binarios nativos de otras plataformas.)

---

## 5. Roadmap por fases

### Fase 0 — Consolidar el repositorio (una vez, local)
1. `git add -A && git commit -m "Preparar despliegue standalone en DirectAdmin"`.
2. `git push -u origin main` (remoto ya configurado → `awki-ai`).

### Fase 1 — Infraestructura del servidor (una vez)
3. DNS: `A awki-ai.cl` y `A www.awki-ai.cl` → IP del servidor.
4. SSL: emitir Let's Encrypt para `awki-ai.cl` y `www.awki-ai.cl`.
5. Habilitar módulos Apache: `mod_rewrite`, `mod_proxy`, `mod_proxy_http`, `mod_headers`.

### Fase 2 — Despliegue (por cada release)
6. Subir los ficheros por FTP/File Manager (sin SSH) a `domains/awki-ai.cl/public_html/`.
7. Setup Node.js App: Node 20/22, start `node .next/standalone/server.js`, puerto `3000`.
8. Definir `NEXT_PUBLIC_GA_MEASUREMENT_ID` **antes** del build.
9. Build sin terminal: **Trabajo Cron** con `cd .../public_html && npm ci && npm run build`
   (el `postbuild` copia `public/` y `.next/static/` automáticamente); luego borrar el cron.
10. Desactivar auto-proxy de DirectAdmin (el `.htaccess` ya proxea) y pulsar **Start**.

### Fase 3 — Verificación
11. HTTPS, headers de seguridad, sitemap/robots, fuentes, página 404 propia.

### Fase 4 — Operación continua
12. Backup programado (Backup and Restore) + monitoreo (Resource Usage / logs).

### Fase 5 — Expansión futura (backend real, sin duplicar)
13. PostgreSQL (Base de Datos) + Django (Setup Python App) → conectar `services/api.ts`
    a endpoints reales reutilizando los contratos ya definidos.

---

## 6. Decisiones críticas (para no duplicar)

1. **Un único reverse proxy.** Elegir `.htaccess` (mod_proxy) **o** el auto-proxy de
   DirectAdmin — nunca ambos (doble proxy → redirección infinita). Recomendado: `.htaccess`.
2. **Build en el servidor, no en local.** Evita subir `.next` y el desajuste de binarios
   nativos Windows/Linux (`sharp`, `@swc`).
3. **Instalar deps en el servidor con `npm ci`.** `package-lock.json` versionado garantiza
   dependencias idénticas (sin deriva de versiones).
4. **Secretos solo en el servidor.** `.env.local` gitignored; `.env.example` versionado
   (plantilla sin valores reales).

