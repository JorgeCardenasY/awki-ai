/**
 * AWKI AI TECH — Mockups de API (Future-Proofing)
 * ------------------------------------------------------------------
 * Promesas simuladas que retornan estructuras JSON realistas para el
 * frontend 100% interactivo. Preparadas para conectarse al backend real
 * (Django + PostgreSQL/TimescaleDB/PostGIS) sin cambiar los contratos.
 *
 * En producción estas funciones se sustituyen por llamadas `fetch()` a:
 *   GET  /api/v1/nodos/telemetria
 *   POST /api/v1/placas/consultar
 */

export interface NodeTelemetry {
  nodoId: string;
  ts: string; // ISO 8601
  placaCifrada: string; // AES-128 (nunca la placa cruda)
  bateriaMv: number; // mV
  spreadingFactor: number; // SF7..SF12
  rssi: number; // dBm
  temperaturaC: number;
  lat: number;
  lon: number;
}

export interface StolenVehicleCheck {
  placaCifrada: string;
  encontrada: boolean;
  estado: "BUSCADA" | "SIN_NOVEDAD";
  timestamp: string;
  fuente: "SITIA-PATENTES" | "CARABINEROS";
  confianza: number;
}

export interface FleetStatus {
  nodosActivos: number;
  nodosTotales: number;
  lecturasHoy: number;
  bateriaMinimaMv: number;
  syncPendiente: number;
}

/* ------------------------------------------------------------------ */
/* Utilidades internas                                                 */
/* ------------------------------------------------------------------ */

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Latencia de red simulada (300–900 ms). */
const networkLatency = () => delay(300 + Math.random() * 600);

/** Genera una placa "cifrada" realista (hex de 8 grupos). */
function encryptPlaca(): string {
  const hex = "0123456789abcdef";
  const group = () =>
    Array.from({ length: 4 }, () => hex[Math.floor(Math.random() * 16)]).join("");
  return `${group()}·${group()}·${group()}·${group()}`;
}

const randomIn = (min: number, max: number, decimals = 0) => {
  const v = min + Math.random() * (max - min);
  const f = 10 ** decimals;
  return Math.round(v * f) / f;
};

const RUTA_CH11: [number, number][] = [
  [-18.478, -69.913],
  [-18.437, -69.722],
  [-18.305, -69.56],
  [-18.202, -69.49],
  [-18.121, -69.41],
];

/* ------------------------------------------------------------------ */
/* Endpoints simulados                                                 */
/* ------------------------------------------------------------------ */

/**
 * Telemetría de un nodo de borde (placa cifrada, batería en mV,
 * spreading factor, RSSI, temperatura, georreferencia).
 */
export async function fetchNodeTelemetry(nodoId?: string): Promise<NodeTelemetry> {
  await networkLatency();
  const [lat, lon] = RUTA_CH11[Math.floor(Math.random() * RUTA_CH11.length)];
  return {
    nodoId: nodoId ?? `CH-11·N${randomIn(1, 28)}`,
    ts: new Date().toISOString(),
    placaCifrada: encryptPlaca(),
    bateriaMv: randomIn(3100, 3350),
    spreadingFactor: randomIn(7, 12),
    rssi: randomIn(-120, -82),
    temperaturaC: randomIn(-15, 38, 1),
    lat,
    lon,
  };
}

/**
 * Consulta si una placa cifrada figura en las listas de vehículos
 * buscados (SITIA-Patentes / Carabineros).
 */
export async function checkStolenVehicle(
  placaCifrada: string
): Promise<StolenVehicleCheck> {
  await networkLatency();
  const encontrada = Math.random() < 0.18; // ~18% de probabilidad simulada
  return {
    placaCifrada,
    encontrada,
    estado: encontrada ? "BUSCADA" : "SIN_NOVEDAD",
    timestamp: new Date().toISOString(),
    fuente: Math.random() < 0.5 ? "SITIA-PATENTES" : "CARABINEROS",
    confianza: randomIn(0.9, 0.999, 3),
  };
}

/** Estado agregado de la flota (para la PWA / dashboard). */
export async function fetchFleetStatus(): Promise<FleetStatus> {
  await networkLatency();
  return {
    nodosActivos: randomIn(25, 28),
    nodosTotales: 28,
    lecturasHoy: randomIn(1200, 2100),
    bateriaMinimaMv: randomIn(3120, 3220),
    syncPendiente: randomIn(0, 4),
  };
}

/**
 * Suscripción simulada a telemetría (event emitter-like vía AsyncGenerator).
 * Emite una lectura cada `intervalMs`; útil para alimentar dashboards en vivo.
 */
export async function* subscribeTelemetry(intervalMs = 1500): AsyncGenerator<NodeTelemetry> {
  while (true) {
    yield await fetchNodeTelemetry();
    await delay(intervalMs);
  }
}
