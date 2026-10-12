# Despliegue de AWKI AI TECH — Sitio estático (Next.js `output: "export"`)

Guía para publicar este proyecto en hosting compartido **sin SSH ni servidor Node**.
El sitio es 100% estático (SSG): se compila en local a HTML/CSS/JS puro dentro de
`out/` y se sube por FTP. No requiere `Setup Node.js App`, ni `mod_proxy`, ni cron
de build, ni proceso persistente.

> Compatible con **LiteSpeed** y **Apache**. El servidor de producción de este
> proyecto es **LiteSpeed** (`Server: LiteSpeed`), por lo que las reglas se
> escribieron con `mod_rewrite`/`mod_headers`, soportados por ambos.

---

## 🚀 Paso a paso rápido (FTP + panel web, sin SSH)

### 1) Compilar en local (en tu máquina)

```powershell
cd c:\Users\user\Desktop\AWKI
$env:NEXT_PUBLIC_GA_MEASUREMENT_ID = "G-3Y9R6BPQ0E"   # GA4 (opcional)
npm ci
npm run build        # genera ./out/ (HTML/CSS/JS estático)
```

> `NEXT_PUBLIC_*` se incrusta en el bundle **en tiempo de build**. Si la cambias,
> debes re-buildar.
>
> `next/font/google` descarga y auto-hospeda las fuentes durante el build: se
> necesita salida a internet **en tu máquina**, no en el servidor.

### 2) Qué subir por FileZilla → a `public_html/`

Sube **el contenido** de `out/` (todo lo que está *dentro*, NO la carpeta `out`):

```
index.html, 404.html, sitemap.xml, robots.txt, manifest.webmanifest,
opengraph-image, icon.svg,
tecnologia.html, contacto.html, glosario.html, privacidad.html,
soluciones.html, blog.html, *.txt (payloads RSC),
blog/, hardware/, _next/
```

Y aparte sube el `.htaccess` de la raíz del proyecto a `public_html/.htaccess`.

> ⚠️ En FileZilla activa "Mostrar archivos ocultos" (`Servidor → Forzar mostrar
> archivos ocultos`) porque `.htaccess` empieza con punto.
>
> ⚠️ Incluye **todos** los archivos `.txt` (`index.txt`, `blog.txt`,
> `__next._*.txt`, …): son payloads RSC que Next usa para la navegación fluida
> entre páginas.

### ⛔ Qué NO subir (nunca)

```
node_modules/   # no se necesita (el build ya está en out/)
.next/          # no se necesita (el resultado es out/)
.git/           # historial local
.env.local      # secretos
out/            # sube su CONTENIDO, no la carpeta en sí
```

> **En resumen: todo el código fuente y la configuración quedan en local.** Al
> servidor solo van **dos** cosas — el contenido de `out/` (resultado del build) y
> el `.htaccess`. Por lo tanto, tampoco se sube ninguno de estos:
>
> ```
> app/  components/  lib/  services/  public/     # código fuente (queda local)
> package.json  package-lock.json                 # manifiesto de dependencias
> next.config.ts  tsconfig.json                   # configuración del build
> tailwind.config.ts  postcss.config.mjs  eslint.config.mjs
> next-env.d.ts  *.md                             # documentación
> ```

---

## 1. Por qué estático (y no Node)

- El sitio no tiene rutas API (`app/api`), ni `middleware`, ni `rewrites`/`redirects`,
  ni data fetching de servidor. Los mocks viven en `services/api.ts` (solo cliente).
- `output: "export"` elimina la necesidad de un proceso Node persistente, del reverse
  proxy (`mod_proxy`) y del cron de build → menos piezas móviles, sin 503, y
  compatible con LiteSpeed compartido sin SSH.

## 2. Qué hace el `.htaccess`

| Regla | Detalle |
|---|---|
| Dominio canónico | `awki-ai.cl` → `www.awki-ai.cl` (301) |
| HTTPS | `http` → `https` (directo o tras proxy TLS) |
| URLs limpias | `/tecnologia` → `tecnologia.html` (rewrite) |
| Caché | `/_next/static/` → `max-age=31536000, immutable` |
| 404 propia | `ErrorDocument 404 /404.html` |
| Open Graph | `ForceType image/png` para `opengraph-image` (sin extensión) |
| Seguridad | HSTS + `X-Frame-Options` + `nosniff` + `Referrer-Policy` + `Permissions-Policy` |

> Requisitos del servidor: módulos `mod_rewrite` y `mod_headers` habilitados.
> LiteSpeed los soporta; las redirecciones ya están activas en producción.

## 3. Configurar el build (variables)

```powershell
$env:NEXT_PUBLIC_GA_MEASUREMENT_ID = "G-3Y9R6BPQ0E"
```

> `NEXT_PUBLIC_*` se incrusta en build-time; no hay variables de entorno en el
> servidor.

## 4. Verificación post-deploy

```bash
curl -I https://www.awki-ai.cl
```

- [ ] `https://www.awki-ai.cl` → 200 (carga el sitio, sin 503).
- [ ] `/tecnologia`, `/blog`, `/glosario`, `/contacto`, `/blog/<slug>` → 200.
- [ ] `/sitemap.xml` y `/robots.txt` → 200.
- [ ] `http://awki-ai.cl` → 301 a `https://www.awki-ai.cl/`.
- [ ] Ruta inexistente → `404` propia.
- [ ] Headers de seguridad presentes (HSTS, nosniff, X-Frame-Options, Referrer-Policy).

## 5. Actualizar en el futuro

```powershell
npm run build    # re-build (con la variable GA si cambió)
# subir de nuevo el contenido de out/ + .htaccess
```

No hay que tocar el servidor: sin SSH, sin cron, sin reiniciar ningún proceso.

## 6. Troubleshooting

| Síntoma | Causa probable | Solución |
|---|---|---|
| 404 en `/tecnologia` pero `tecnologia.html` existe | Falta `mod_rewrite` o la regla de URLs limpias | Revisa `.htaccess` (regla #3) y que el servidor tenga `mod_rewrite` |
| El sitio carga sin estilos | No se subió `_next/` completo | Sube de nuevo todo el contenido de `out/` |
| Open Graph no se muestra en RRSS | `opengraph-image` se sirve sin `image/png` | Verifica `ForceType image/png` en `.htaccess` |
| 503 (estado anterior) | Se esperaba un servidor Node | Ya no aplica: el sitio ahora es estático |
| gtag/GA4 no aparece | `NEXT_PUBLIC_GA_MEASUREMENT_ID` vacío al build | Define la variable antes de `npm run build` |
