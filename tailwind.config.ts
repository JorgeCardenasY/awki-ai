import type { Config } from "tailwindcss";

/**
 * AWKI AI TECH — Sistema de Diseño Cyber-Industrial
 * OLED black + acentos neón · D.S. N° 1/2022 (cero contaminación lumínica)
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./services/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Fondo absoluto (ausencia de contaminación lumínica)
        oled: "#000000",
        void: "#050505",
        // Superficies plomo oscuro
        surface: {
          DEFAULT: "#0a0e12",
          deep: "#06090c",
          raised: "#11161d",
          border: "#1a2330",
        },
        // Acentos neón
        neon: {
          cyan: "#00ffcc", // telemetría / datos
          amber: "#ffb000", // alerta / energía
          magenta: "#ff2d78", // inferencia / ALPR
          violet: "#7c5cff", // red / LoRaWAN
          green: "#39ff88", // estado OK / éxito
          red: "#ff3b4d", // jammer / fallo
        },
        // Grises de texto
        ink: {
          DEFAULT: "#e6edf3",
          dim: "#8b98a5",
          faint: "#4b5663",
        },
      },
      fontFamily: {
        // Monospace para datos crudos / terminal
        mono: [
          "var(--font-mono)",
          "JetBrains Mono",
          "IBM Plex Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
        // Sans geométrica para narrativa / títulos
        sans: [
          "var(--font-sans)",
          "Space Grotesk",
          "Inter",
          "system-ui",
          "sans-serif",
        ],
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(26,35,48,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(26,35,48,0.35) 1px, transparent 1px)",
        "scanlines":
          "repeating-linear-gradient(to bottom, rgba(0,0,0,0.22) 0px, rgba(0,0,0,0.22) 1px, transparent 1px, transparent 3px)",
      },
      boxShadow: {
        "neon-cyan": "0 0 8px rgba(0,255,204,0.5), 0 0 24px rgba(0,255,204,0.2)",
        "neon-magenta":
          "0 0 8px rgba(255,45,120,0.5), 0 0 24px rgba(255,45,120,0.2)",
        "neon-amber": "0 0 8px rgba(255,176,0,0.5), 0 0 24px rgba(255,176,0,0.2)",
        "neon-violet":
          "0 0 8px rgba(124,92,255,0.5), 0 0 24px rgba(124,92,255,0.2)",
        glow: "0 0 40px rgba(0,255,204,0.08)",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        flicker: {
          "0%, 19%, 21%, 23%, 80%, 100%": { opacity: "1" },
          "20%, 22%": { opacity: "0.4" },
        },
        "scan-y": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        blink: "blink 1s step-end infinite",
        flicker: "flicker 6s linear infinite",
        "pulse-glow": "pulse-glow 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
