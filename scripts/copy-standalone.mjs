// Copia los assets estáticos al bundle standalone de Next.js.
// Se ejecuta automáticamente tras `npm run build` (hook `postbuild` de npm),
// por lo que NO requiere pasos manuales de shell en el servidor.
//
// `output: "standalone"` genera `.next/standalone/server.js` pero NO copia
// `public/` ni `.next/static/`; este script lo hace para que el bundle quede
// listo para arrancar con `node .next/standalone/server.js`.

import { cpSync, existsSync, mkdirSync } from "node:fs";

const standalone = ".next/standalone";

// 1) public/ -> .next/standalone/public/ (si existe)
if (existsSync("public")) {
  mkdirSync(`${standalone}/public`, { recursive: true });
  cpSync("public", `${standalone}/public`, { recursive: true });
}

// 2) .next/static/ -> .next/standalone/.next/static/
if (existsSync(".next/static")) {
  mkdirSync(`${standalone}/.next`, { recursive: true });
  cpSync(".next/static", `${standalone}/.next/static`, { recursive: true });
}

console.log("✔ Assets copiados a .next/standalone/ (public/ + .next/static/)");
