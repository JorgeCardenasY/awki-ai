export interface BlogSection {
  heading?: string;
  paragraphs: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  readTime: string;
  sections: BlogSection[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "que-es-lorawan",
    title: "¿Qué es LoRaWAN y por qué funciona sin cobertura celular?",
    description:
      "Guía técnica sobre LoRaWAN: modulación Chirp Spread Spectrum, bandas AU915, factores de dispersión y por qué es ideal para logística en zonas sin señal móvil.",
    date: "2026-09-10",
    category: "Red",
    readTime: "6 min",
    sections: [
      {
        paragraphs: [
          "LoRaWAN (Long Range Wide Area Network) es un protocolo de red de área amplia y bajo consumo pensado para el Internet de las Cosas. A diferencia de 4G/5G, opera en bandas de radio sub-GHz sin licencia — en Chile, la banda AU915 entre 915 y 928 MHz — y no depende de la infraestructura de los operadores móviles.",
          "Esta independencia es clave en la Macrozona Norte de Chile: en la precordillera, el altiplano y el desierto de Atacama, las redes celulares simplemente no existen. LoRaWAN permite desplegar nodos autónomos que transmiten datos a decenas de kilómetros con un consumo inferior a 1 W.",
        ],
      },
      {
        heading: "Chirp Spread Spectrum: robustez por diseño",
        paragraphs: [
          "LoRaWAN usa una modulación llamada Chirp Spread Spectrum (CSS). La señal 'barre' la frecuencia de forma lineal a lo largo del tiempo, en lugar de fijarse en una frecuencia única. Esto la hace extremadamente resistente al ruido, a la atenuación por distancia y a los inhibidores (jammers) que usan bandas de ruido para bloquear comunicaciones.",
        ],
      },
      {
        heading: "Factores de dispersión y ADR",
        paragraphs: [
          "El factor de dispersión (Spreading Factor, SF) define el equilibrio entre alcance y velocidad. Un SF alto (SF10–SF12) da más alcance y robustez pero menos velocidad; un SF bajo (SF7) prioriza el ancho de banda. El Adaptive Data Rate (ADR) ajusta automáticamente este parámetro según la calidad del enlace, optimizando la entrega incluso en terrenos accidentados.",
        ],
      },
      {
        heading: "De la radio a la nube",
        paragraphs: [
          "Cada nodo cifra su payload con AES-128 antes de transmitir. Un gateway (como un Raspberry Pi 4 con HAT LoRa) recibe la señal y la reenvía por internet a un servidor de red como ChirpStack, que publica los datos por MQTT hacia la plataforma. Así se completa un enlace de extremo a extremo sin pasar jamás por la red celular.",
        ],
      },
    ],
  },
  {
    slug: "que-es-alpr",
    title: "¿Qué es el reconocimiento automático de patentes (ALPR)?",
    description:
      "Qué es el ALPR, cómo funciona la detección con YOLO y OCR en el borde, y por qué procesar localmente protege la privacidad y reduce el tráfico de datos.",
    date: "2026-09-08",
    category: "Edge AI",
    readTime: "5 min",
    sections: [
      {
        paragraphs: [
          "El ALPR (Automatic License Plate Recognition) es la tecnología que detecta y lee automáticamente las placas patente de los vehículos mediante visión computacional. Combina dos etapas: la detección del objeto (encontrar la placa en la imagen) y el reconocimiento óptico de caracteres (OCR) para extraer el texto.",
        ],
      },
      {
        heading: "Detección en el borde con YOLOv8-Nano",
        paragraphs: [
          "Awki ejecuta un modelo YOLOv8-Nano cuantizado a INT8 dentro de una NPU de bajo consumo (Ethos-U55). Esto permite inferir a más de 20 FPS directamente en el dispositivo, sin depender de un servidor. Procesar en el borde reduce la latencia a milisegundos y elimina la necesidad de subir video a la nube.",
        ],
      },
      {
        heading: "Captura nocturna sin luz visible",
        paragraphs: [
          "La óptica usa un sensor CMOS Starlight (Sony STARVIS) sin filtro IR-cut, acoplado a iluminadores LED infrarrojos de 940 nm. Esta longitud de onda es invisible al ojo humano, lo que permite leer patentes de noche sin generar contaminación lumínica, cumpliendo el D.S. 1/2022.",
        ],
      },
      {
        heading: "Privacidad por diseño",
        paragraphs: [
          "El dato sensible es la imagen, no el texto. Por eso Awki extrae la cadena de la patente y sobrescribe la imagen cruda en la RAM antes de transmitir. Solo viajan metadatos cifrados: una reducción del 99% del tráfico y una protección integral frente a la interceptación y la responsabilidad legal.",
        ],
      },
    ],
  },
  {
    slug: "ley-21719-privacidad-by-design",
    title: "Ley 21.719: privacidad by design en la logística",
    description:
      "Qué exige la Ley 21.719 de protección de datos personales y cómo la arquitectura de Awki cumple la privacidad por diseño procesando la imagen en el borde.",
    date: "2026-09-05",
    category: "Normativa",
    readTime: "7 min",
    sections: [
      {
        paragraphs: [
          "La Ley 21.719 moderniza la protección de datos personales en Chile, alineándola con estándares internacionales como el RGPD europeo. Entre sus principios destaca la privacidad por diseño y por defecto: la protección debe integrarse desde la arquitectura del sistema, no añadirse después.",
          "Para una plataforma de trazabilidad logística que lee patentes, este principio tiene una consecuencia directa: la placa patente es un dato personal, y su tratamiento debe minimizarse y protegerse desde el diseño.",
        ],
      },
      {
        heading: "Minimización: procesar en el borde",
        paragraphs: [
          "Awki aplica minimización radical: la imagen de la patente se procesa localmente en el nodo, se extrae solo la cadena de texto y la imagen cruda se sobrescribe en la RAM. Lo que se transmite son metadatos cifrados, nunca la fotografía. De este modo, el dato de mayor riesgo nunca abandona el dispositivo.",
        ],
      },
      {
        heading: "Seguridad de extremo a extremo",
        paragraphs: [
          "El cifrado es transversal: AES-128 en la radio (LoRaWAN), TLS 1.3 en el backhaul hacia la nube y cifrado en reposo en la base de datos. El acceso a datos sensibles se controla con mTLS, rate limiting y auditoría inmutable, especialmente en integraciones con organismos como Carabineros o SITIA-Patentes.",
        ],
      },
      {
        heading: "Por qué importa para tu negocio",
        paragraphs: [
          "Cumplir la normativa no es solo una obligación: reduce el riesgo legal, protege la reputación y disminuye la superficie de ataque. Al no almacenar imágenes, Awki minimiza el impacto de una eventual filtración y simplifica el ejercicio de derechos de los titulares (acceso, rectificación y supresión).",
        ],
      },
    ],
  },
  {
    slug: "ruta-ch-11-sin-cobertura",
    title: "Logística sin cobertura celular en la Ruta CH-11",
    description:
      "Caso de uso: cómo Awki despliega nodos autónomos de trazabilidad en la Ruta CH-11, sin obras civiles ni permisos viales, entre Arica y el altiplano.",
    date: "2026-09-01",
    category: "Caso de uso",
    readTime: "6 min",
    sections: [
      {
        paragraphs: [
          "La Ruta CH-11 conecta Arica con el altiplano, ascendiendo desde el nivel del mar hasta más de 4 600 m.s.n.m. En este corredor no hay cobertura celular, las temperaturas oscilan entre -15 °C y +40 °C, y la topografía es extrema. Trazar la logística aquí exige una solución diseñada para la adversidad.",
        ],
      },
      {
        heading: "Tres problemas encadenados",
        paragraphs: [
          "Primero, ver: reconocer patentes de noche y sin luz visible. Segundo, transmitir: llevar la información sin depender del celular y resistiendo inhibidores. Tercero, consumir: publicar datos con privacidad para organismos y clientes. Awki resuelve la cadena completa con Edge AI, LoRaWAN y una plataforma en la nube.",
        ],
      },
      {
        heading: "Despliegue sin obras civiles",
        paragraphs: [
          "El nodo se fija a infraestructura existente o roca mediante una carcasa mimetizada IP65/67 impresa en PETG/ASA, sin hormigón ni zanjas. Al no haber obras civiles, se evita el ingreso al SEIA y los permisos viales mayores, acelerando el despliegue de pilotos en semanas, no meses.",
        ],
      },
      {
        heading: "Resultados esperados",
        paragraphs: [
          "En los pilotos de los meses 4 a 6 se valida la operación autónoma continua, el alcance de la red con gateways en altura y la integridad de los datos cifrados. El objetivo es cerrar contratos SaaS facturados con organismos y operadores logísticos de la Macrozona Norte.",
        ],
      },
    ],
  },
];

