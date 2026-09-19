# Despliegue de AWKI AI TECH en DirectAdmin (Node.js + Apache)

Guía paso a paso para publicar este proyecto en un servidor DirectAdmin usando la
funcionalidad **Setup Node.js App** y el reverse proxy definido en `.htaccess`.

> El proyecto se sirve en modo **`output: "standalone"`** (ver `next.config.ts`), lo que
> genera un `server.js` autocontenido con un `node_modules` mínimo: menos uso de disco/RAM
> y arranque más rápido.

---

## 🚀 Paso a paso rápido (FTP + panel web, sin SSH)

### 1) Qué subir por FileZilla → a `domains/awki-ai.cl/public_html/`

```
app/
components/
lib/
services/
package.json
package-lock.json
next.config.ts
tsconfig.json
tailwind.config.ts
postcss.config.mjs
eslint.config.mjs     (opcional: solo para `npm run lint`)
.htaccess             ⚠️ crítico: reverse proxy Apache
.env.example          (opcional: plantilla de variables)
next-env.d.ts         (opcional: Next lo regenera solo)
```

> `public/` está vacía: no hace falta subirla.
> Los `*.md` de documentación (README, DEPLOYMENT, ROADMAP, SEO_*) son opcionales.

### ⛔ Qué NO subir (nunca)

```
node_modules/   → 557 MB de dependencias (el servidor las descarga con `npm ci`)
.next/          → 388 MB de build (el servidor lo genera con `npm run build`)
.git/           → historial local (no se necesita en el servidor)
.env.local      → secretos (se crea directamente en el servidor)
```

### 2) DNS y SSL (panel)

1. **Administración DNS**: registro `A` para `awki-ai.cl` y otro para `www.awki-ai.cl` → IP del servidor.
2. **SSL/TLS Certificates**: Let's Encrypt cubriendo `awki-ai.cl` y `www.awki-ai.cl`.

### 3) Crear la Node.js App (panel)

**"Setup Node.js App"** → *Create Application*:

| Campo | Valor |
|---|---|
| Node.js version | 20 o 22 (≥ 20.9) |
| Application root | `/home/USUARIO/domains/awki-ai.cl/public_html` |
| Startup command | `node .next/standalone/server.js` |
| Port | `3000` |
| Environment variables | `PORT=3000` (+ `NEXT_PUBLIC_GA_MEASUREMENT_ID` opcional) |

> ⚠️ Desactiva el "auto-proxy" de DirectAdmin: el `.htaccess` ya hace el proxy.

### 4) Compilar en el servidor (una sola vez)

Ejecuta **en el servidor** (Terminal del panel o un Trabajo Cron manual):

```bash
cd /home/USUARIO/domains/awki-ai.cl/public_html && npm ci && npm run build
```

> ⚠️ No hagas el build en Windows y subas `.next`: los binarios nativos (`@swc`, `sharp`)
> son incompatibles con Linux. El build debe ocurrir en el servidor.

### 5) Copiar assets y arrancar

```bash
cp -r .next/static .next/standalone/.next/
```

Pulsa **Start/Restart** en la Node.js App.

### 6) Verificar

Abre `https://www.awki-ai.cl`: HTTPS, fuentes, 3D, `sitemap.xml` y `robots.txt`.

---

## 1. Prerequisitos

| Requisito | Detalle | Dónde verificarlo |
|---|---|---|
| Dominio | `awki-ai.cl` y `www.awki-ai.cl` apuntando a la IP del servidor (registros A) | "Administración DNS" / tu registrador |
| Node.js | **≥ 20.9.0** (recomendado 20 LTS o 22 LTS) | "Setup Node.js App" → selector de versión |
| Módulos Apache | `mod_rewrite`, `mod_proxy`, `mod_proxy_http`, `mod_headers` | "Manipuladores Apache" / soporte |
| Acceso | SSH o File Manager/FTP para subir el código | — |
| Salida a internet durante el build | `next/font/google` descarga las fuentes en `npm run build` | prueba de red en el servidor |

---

## 2. Subir el código al servidor

Elige **una** de estas opciones:

### Opción A — Git (recomendada)

1. Confirma/crea un remoto y sube todo el código (hoy el repo solo tiene el commit inicial):

   ```bash
   git add -A
   git commit -m "Preparar despliegue standalone en DirectAdmin"
   git remote add origin git@github.com:TU_USUARIO/awki.git
   git push -u origin main
   ```

2. En DirectAdmin → **Git** → *Create Repository* → pega la URL y clona dentro de
   `domains/awki-ai.cl/` (o el directorio que uses).

### Opción B — File Manager / FTP

1. Sube todo el proyecto **excepto** `node_modules`, `.next`, `.git` y `.env*` a un
   directorio como `domains/awki-ai.cl/awki/`.

> ⚠️ No subas `node_modules` ni `.next`: se generan en el servidor durante el build.
> `.env.local` con secretos tampoco debe versionarse (ya está en `.gitignore`).

---

## 3. Configurar variables de entorno (antes del build)

Crea `.env.local` en la raíz del proyecto (o define las variables en "Setup Node.js App"):

```bash
# Google Analytics 4 — solo si tienes el ID (opcional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

> `NEXT_PUBLIC_*` se incrusta en el bundle **en tiempo de build**. Si lo cambias,
> debes re-buildar.

---

## 4. Build en el servidor

Desde la raíz del proyecto (vía SSH o la terminal de "Setup Node.js App"):

```bash
npm install        # instala dependencias (usa package-lock.json: `npm ci` si prefieres)
npm run build      # genera .next/ con la carpeta standalone
```

Si el build falla por falta de red (fuentes de Google), revisa que el servidor tenga
salida a internet o contacta a soporte para permitir `fonts.googleapis.com`.

---

## 5. Copiar assets al standalone

`output: "standalone"` NO copia automáticamente los assets estáticos. Tras el build:

```bash
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/
```

Resultado esperado:

```
.next/standalone/
├── server.js
├── package.json
├── node_modules/        # solo dependencias de runtime
├── public/
└── .next/static/
```

---

## 6. Crear la Node.js App en DirectAdmin

Ir a **"Setup Node.js App"** → *Create Application*:

| Campo | Valor |
|---|---|
| Node.js version | 20 LTS o 22 LTS (≥ 20.9) |
| Application root / directory | la raíz del proyecto (`/home/USUARIO/domains/awki-ai.cl/awki`) |
| Startup file / command | `node .next/standalone/server.js` |
| Port | `3000` (debe coincidir con el puerto del `.htaccess`) |
| Environment variables | `PORT=3000`, `NEXT_PUBLIC_GA_MEASUREMENT_ID=...` (opcional) |

### Importante sobre el proxy

- **Desactiva el "auto-proxy" / "Proxy to domain"** de la Node.js App. El `.htaccess` de
  este proyecto ya hace el reverse proxy (Apache → `127.0.0.1:3000`).
- Si prefieres usar el auto-proxy de DirectAdmin, **elimina** las reglas `[P]` de
  `mod_proxy` del `.htaccess` para evitar un doble proxy (mantén solo HTTPS/HSTS/cache).

---

## 7. Verificación post-deploy

Desde un navegador y por línea de comandos (`curl -I https://www.awki-ai.cl`):

- [ ] `https://www.awki-ai.cl` carga (HTTPS válido, sin warning).
- [ ] `http://awki-ai.cl` y `http://www.awki-ai.cl` redirigen 301 a `https://www.awki-ai.cl`.
- [ ] Headers de seguridad presentes: `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`.
- [ ] `https://www.awki-ai.cl/_next/static/...` sirve assets con `Cache-Control: public, max-age=31536000, immutable`.
- [ ] Fuentes (`Space Grotesk`, `JetBrains Mono`) cargan correctamente (no fallback).
- [ ] `https://www.awki-ai.cl/sitemap.xml` y `https://www.awki-ai.cl/robots.txt` responden.
- [ ] Ruta inexistente devuelve la página 404 propia (no error de proxy).

Prueba rápida de headers:

```bash
curl -I https://www.awki-ai.cl
```

---

## 8. Actualizar en el futuro

Cada vez que publiques cambios:

```bash
git pull                          # o sube los archivos nuevos
npm install                       # si cambió package.json
npm run build                     # re-build
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/
# Reinicia la Node.js App desde el panel de DirectAdmin (o systemctl/pm2 según aplique)
```

> Para reiniciar, usa el botón *Restart* de "Setup Node.js App".

---

## 9. Troubleshooting

| Síntoma | Causa probable | Solución |
|---|---|---|
| 502 / 503 Bad Gateway | La Node.js App no está corriendo o el puerto no coincide | Verifica que `node .next/standalone/server.js` escuche en `3000` y que el `.htaccess` use el mismo puerto |
| El sitio carga pero sin estilos | No se copió `.next/static/` al standalone | Repite el paso 5 |
| Fuentes en fallback (serif por defecto) | Falló la descarga de `next/font/google` en el build | Confirma salida a internet durante `npm run build` |
| Redirección infinita | Doble proxy (auto-proxy de DirectAdmin + `.htaccess`) | Desactiva uno de los dos (ver sección 6) |
| Error "requires Node >=20.9.0" | Versión de Node antigua | Selecciona Node 20/22 en "Setup Node.js App" |
| gtag/GA4 no aparece | `NEXT_PUBLIC_GA_MEASUREMENT_ID` vacío o definido después del build | Define la variable antes de `npm run build` y re-builda |
