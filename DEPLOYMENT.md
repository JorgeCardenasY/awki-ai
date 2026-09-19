# Despliegue de AWKI AI TECH en DirectAdmin (Node.js + Apache)

Guía paso a paso para publicar este proyecto en un servidor DirectAdmin usando la
funcionalidad **Setup Node.js App** y el reverse proxy definido en `.htaccess`.

> El proyecto se sirve en modo **`output: "standalone"`** (ver `next.config.ts`), lo que
> genera un `server.js` autocontenido con un `node_modules` mínimo: menos uso de disco/RAM
> y arranque más rápido.

---

## 1. Prerequisitos

| Requisito | Detalle | Dónde verificarlo |
|---|---|---|
| Dominio | `awki.cl` apuntando a la IP del servidor (registro A, y `www` si aplica) | "Administración DNS" / tu registrador |
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
   `domains/awki.cl/` (o el directorio que uses).

### Opción B — File Manager / FTP

1. Sube todo el proyecto **excepto** `node_modules`, `.next`, `.git` y `.env*` a un
   directorio como `domains/awki.cl/awki/`.

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
| Application root / directory | la raíz del proyecto (`/home/USUARIO/domains/awki.cl/awki`) |
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

Desde un navegador y por línea de comandos (`curl -I https://awki.cl`):

- [ ] `https://awki.cl` carga (HTTPS válido, sin warning).
- [ ] `http://awki.cl` y `http://www.awki.cl` redirigen 301 a `https://awki.cl`.
- [ ] Headers de seguridad presentes: `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`.
- [ ] `https://awki.cl/_next/static/...` sirve assets con `Cache-Control: public, max-age=31536000, immutable`.
- [ ] Fuentes (`Space Grotesk`, `JetBrains Mono`) cargan correctamente (no fallback).
- [ ] `https://awki.cl/sitemap.xml` y `https://awki.cl/robots.txt` responden.
- [ ] Ruta inexistente devuelve la página 404 propia (no error de proxy).

Prueba rápida de headers:

```bash
curl -I https://awki.cl
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
