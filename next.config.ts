import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sitio 100% estático (SSG). Se compila a HTML/CSS/JS puro en `out/` y se
  // sirve directamente desde cualquier hosting (LiteSpeed/Apache/Nginx) sin
  // servidor Node. Las cabeceras de seguridad y redirecciones se aplican en
  // `.htaccess` (output:"export" no admite headers()/rewrites/redirects).
  output: "export",
};

export default nextConfig;

