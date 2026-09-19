export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ: FaqItem[] = [
  {
    question: "¿Cómo funciona la trazabilidad sin cobertura celular?",
    answer:
      "Los nodos Awki procesan la información localmente y la transmiten por LoRaWAN, una red de radio de largo alcance (10–15 km) que no depende de la telefonía móvil. Un gateway conectado a internet (o satelital) recibe los datos y los publica en la plataforma.",
  },
  {
    question: "¿Qué ocurre con la privacidad de las patentes?",
    answer:
      "La imagen de la patente nunca abandona el dispositivo. Se procesa en el borde, se extrae solo el texto y la imagen cruda se sobrescribe en la RAM. Únicamente viajan metadatos cifrados, cumpliendo la Ley 21.719.",
  },
  {
    question: "¿Qué alcance tiene la red LoRaWAN?",
    answer:
      "En terreno abierto, el alcance puede superar los 15 km. En topografía accidentada como la Ruta CH-11, se compensa con gateways en altura y factores de dispersión adaptativos (ADR) que atraviesan interferencias e inhibidores.",
  },
  {
    question: "¿Requiere obras civiles o permisos viales?",
    answer:
      "No. El nodo se fija a infraestructura existente o a roca mediante una carcasa mimetizada IP65/67, sin obras civiles. Esto evita el ingreso al SEIA y los permisos viales mayores, acelerando el despliegue.",
  },
  {
    question: "¿Dónde opera Awki actualmente?",
    answer:
      "Awki está diseñado para la Macrozona Norte de Chile (Arica y Parinacota, Tarapacá y Antofagasta), con pilotos en la Ruta CH-11 y rutas del desierto de Atacama.",
  },
  {
    question: "¿Cómo se integra con mis sistemas actuales?",
    answer:
      "La plataforma expone una API REST y publica los datos para su consumo en Power BI (Power Query M y DAX), dashboards web y una PWA offline-first para operadores en terreno.",
  },
];
