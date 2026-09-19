export interface GlossaryTerm {
  term: string;
  definition: string;
  category: "Red" | "Edge AI" | "Energía" | "Normativa" | "Datos";
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    term: "ALPR",
    definition:
      "Automatic License Plate Recognition. Reconocimiento automático de patentes mediante visión computacional, que detecta y lee la placa de un vehículo en tiempo real.",
    category: "Edge AI",
  },
  {
    term: "LoRaWAN",
    definition:
      "Protocolo de red LPWAN de largo alcance y bajo consumo, diseñado para IoT. Opera en bandas sub-GHz (en Chile, AU915 de 915–928 MHz) sin depender de la red celular.",
    category: "Red",
  },
  {
    term: "CSS (Chirp Spread Spectrum)",
    definition:
      "Modulación de espectro ensanchado por chirps: la señal barre la frecuencia de forma lineal, lo que la hace resistente a interferencias, ruido e inhibidores (jammers).",
    category: "Red",
  },
  {
    term: "Edge AI",
    definition:
      "Inteligencia artificial que se ejecuta localmente en el dispositivo de borde (edge), sin enviar datos a la nube. Reduce latencia, tráfico y exposición de datos personales.",
    category: "Edge AI",
  },
  {
    term: "YOLOv8-Nano",
    definition:
      "Modelo de detección de objetos de la familia YOLO, en su variante más ligera (Nano) y cuantizado a INT8, capaz de correr a más de 20 FPS en una NPU de bajo consumo.",
    category: "Edge AI",
  },
  {
    term: "NPU",
    definition:
      "Neural Processing Unit. Procesador especializado en inferencia de redes neuronales, con alto rendimiento por vatio. Awki usa la Grove Vision AI V2 (Cortex-M55 + Ethos-U55).",
    category: "Edge AI",
  },
  {
    term: "ADR",
    definition:
      "Adaptive Data Rate. Mecanismo de LoRaWAN que ajusta el factor de dispersión (SF) y la tasa de datos según la calidad del enlace, maximizando alcance y vida útil.",
    category: "Red",
  },
  {
    term: "SF (Spreading Factor)",
    definition:
      "Factor de dispersión en LoRa. Valores altos (SF10–SF12) dan mayor alcance y robustez, pero menor velocidad; valores bajos (SF7) priorizan velocidad.",
    category: "Red",
  },
  {
    term: "FUOTA",
    definition:
      "Firmware Update Over The Air. Actualización de firmware y de modelos de IA por radio, sin despliegue físico en terreno. Awki usa multicast con parches delta.",
    category: "Red",
  },
  {
    term: "MPPT",
    definition:
      "Maximum Power Point Tracking. Algoritmo de carga que extrae la máxima potencia del panel solar. En Awki incluye compensación térmica para evitar cargar bajo 0 °C.",
    category: "Energía",
  },
  {
    term: "LiFePO4",
    definition:
      "Fosfato de hierro y litio. Química de batería segura (no se incendia), de larga vida (2 000–5 000 ciclos) y estable térmicamente, ideal para operación en el altiplano.",
    category: "Energía",
  },
  {
    term: "Lithium plating",
    definition:
      "Depósito de litio metálico que ocurre al cargar una celda de litio bajo 0 °C, destruyendo la batería de forma irreversible. Se previene con cut-off térmico y pre-acondicionamiento.",
    category: "Energía",
  },
  {
    term: "Termistor NTC",
    definition:
      "Sensor de temperatura de coeficiente negativo. Awki usa un NTC de 10 kΩ ±1% para medir la temperatura de la batería y suspender la carga bajo cero.",
    category: "Energía",
  },
  {
    term: "AES-128",
    definition:
      "Estándar de cifrado simétrico usado por LoRaWAN (AppSKey/NwkSKey) para proteger la confidencialidad e integridad de los payloads transmitidos por radio.",
    category: "Datos",
  },
  {
    term: "PostGIS / TimescaleDB",
    definition:
      "Extensiones de PostgreSQL: PostGIS para datos geoespaciales (georreferencia de nodos y rutas) y TimescaleDB para series temporales de telemetría.",
    category: "Datos",
  },
  {
    term: "Ley 21.719",
    definition:
      "Ley chilena de protección de datos personales, que exige privacidad por diseño y por defecto, minimización de datos y medidas de seguridad desde el diseño.",
    category: "Normativa",
  },
  {
    term: "D.S. 1/2022",
    definition:
      "Decreto Supremo del Ministerio del Medio Ambiente que regula la contaminación lumínica en Chile. Awki opera en IR de 940 nm, sin luz visible, para no generar skyglow.",
    category: "Normativa",
  },
  {
    term: "SUBTEL",
    definition:
      "Subsecretaría de Telecomunicaciones de Chile. Regula el uso del espectro radioeléctrico, incluyendo las bandas LPWAN/IoT (Res. 737 y 2219) que utiliza Awki.",
    category: "Normativa",
  },
];
