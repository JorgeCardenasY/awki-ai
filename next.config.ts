import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-hosting en DirectAdmin: genera `.next/standalone/server.js` autocontenido.
  // Requiere copiar `public/` y `.next/static/` a la carpeta standalone (ver DEPLOYMENT.md).
  output: "standalone",
  compress: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;

