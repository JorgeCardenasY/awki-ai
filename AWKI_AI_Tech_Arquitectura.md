# AWKI AI TECH — Arquitectura de Hardware y Software
### Plataforma de Trazabilidad Logística en Rutas Altoandinas y Desérticas sin Cobertura Celular — Macrozona Norte

> **Documento de Diseño Consolidado** · Metodología Skilyfi (Enjambre de Agentes de IA)
> **Versión:** 1.1 · **Clasificación:** Interno — Ingeniería y Negocio
> **Revisión 1.1:** incorpora el contexto "Macrozona Norte" y la conexión a Power BI vía Power Query M y DAX.

---

## 0. Resumen Ejecutivo (para tomadores de decisiones)

**Awki AI Tech** es una plataforma de trazabilidad logística diseñada para operar en la
**Macrozona Norte de Chile** (regiones de Arica y Parinacota, Tarapacá y Antofagasta), abarcando
tanto la precordillera y el Altiplano como el Desierto de Atacama —rutas donde las redes celulares
no existen y donde el crimen organizado intenta anular las señales. El sistema resuelve tres
problemas en cadena:

1. **Ver con inteligencia** — Un dispositivo de borde (Edge AI) reconoce automáticamente
   placas patentes (ALPR) en milisegundos, incluso de noche, sin luz visible y a temperaturas
   extremas.
2. **Transmitir sin depender del celular** — La información viaja por radio LoRaWAN (Chirp
   Spread Spectrum), resistente a interferencias y a inhibidores, con alcance de 10–15 km.
3. **Consumir con privacidad y escala** — Un backend en Django recibe solo metadatos cifrados
   (nunca la imagen), los publica en una PWA offline-first y los expone mediante APIs seguras
   a organismos del Estado (Carabineros, SITIA-Patentes).

**Valor comercial clave:** la imagen de la patente **nunca abandona el dispositivo**. Se procesa
localmente, se extrae la cadena de texto y el archivo multimedia se destruye. Esto cumple la
**Ley 21.719 (Chile)** de privacidad *by design*, reduce el tráfico de datos en un 99% y protege
a la plataforma frente a responsabilidad legal y ataques de interceptación.

**Factibilidad de integración:** ✅ validada. La combinación de un microcontrolador ESP32-S3
(orquestación), una NPU de bajo consumo (Grove Vision AI V2, ARM Cortex-M55 + Ethos-U55) y un
módulo LoRa Wio-E5/LoRa-E5 es técnicamente compatible (interfaces UART/I2C/SPI), opera con un
TDP agregado inferior a 1 W y se alimenta de forma sostenible con un panel solar + batería
LiFePO4 gestionada por MPPT con compensación térmica.

---

## 1. Metodología Skilyfi — Orquestación del Enjambre

Este documento es el resultado de la colaboración iterativa de **tres agentes especializados**:

| Agente | Responsabilidad | Salida |
|---|---|---|
| **Agente 1 — Visión Computacional y Captura** | Edge AI, energía solar, cámara IR | *Spec Unidad de Captura* (Sección 3) |
| **Agente 2 — Telecomunicaciones** | LoRaWAN, antena, regulación, FUOTA | *Spec Unidad de Transmisión* (Sección 4) |
| **Agente 3 — Arquitectura de Software** | Privacidad, Django, API, PWA | *Spec Sistema de Almacenado/API* (Sección 5) |

Cada agente genera su Spec con profundidad de ingeniería; la Sección 6 consolida el trabajo y
valida la integración sistémica.

---

## 2. Arquitectura General del Sistema

```
                        ┌─────────────────────────────────────────────┐
                        │   UNIDAD DE BORDE (AWKI NODE)  — por ruta   │
                        │  ┌─────────────┐   ┌──────────────────────┐  │
                        │  │ Cámara CMOS │──▶│ Grove Vision AI V2   │  │
                        │  │ Starlight IR │   │ (NPU Ethos-U55, YOLO)│  │
                        │  └─────────────┘   └──────────┬───────────┘  │
                        │                               │ (texto placa) │
                        │                        ┌──────▼───────────┐  │
                        │   XIAO ESP32-S3 ◀─────▶│ Metadatos cifrados│  │
                        │   (orquestación)       └──────┬───────────┘  │
                        │            │                  │ UART         │
                        │            │           ┌──────▼───────────┐  │
                        │   RTC + WD │           │ Wio-E5 (LoRaWAN) │  │
                        │            │           └──────┬───────────┘  │
                        │   MPPT + LiFePO4 + panel ──────┘  │ 915 MHz  │
                        └──────────────────────────────────┼──────────┘
                                                           │ CSS
                                         ┌─────────────────▼──────────┐
                                         │  GATEWAY LoRaWAN           │
                                         │  (Raspberry Pi 4 + Hat)    │
                                         └─────────────────┬──────────┘
                                                           │ IP (TLS)
                                         ┌─────────────────▼──────────┐
                                         │  RED LOraWAN (ChirpStack)  │
                                         │  ─▶ MQTT / Webhook         │
                                         └─────────────────┬──────────┘
                                                           │
                                         ┌─────────────────▼──────────┐
                                         │  BACKEND Django + Postgres │
                                         │  ─▶ REST/GraphQL API       │
                                         └──────┬──────────┬──────────┘
                                                │          │
                                      ┌─────────▼──┐   ┌───▼─────────┐
                                      │  PWA       │   │ Power BI /  │
                                      │ offline-1st│   │ Carabineros │
                                      └────────────┘   └─────────────┘
```

---

## 3. FASE 1 — Agente de Visión Computacional y Captura en el Borde (Edge AI)

### 3.1 Desafío Ambiental

El nodo opera en la precordillera y el Altiplano de la **Macrozona Norte** (Arica y Parinacota,
Tarapacá y Antofagasta), con un rango térmico de **-15 °C a más de +40 °C**. Esto impone tres
exigencias críticas al diseño:

- **Electrónica de grado industrial/extendido:** los componentes deben tener rango de operación
  -40 °C a +85 °C (grado industrial). Los componentes de consumo (0–70 °C) quedan descartados.
- **Energía estable a baja temperatura:** las baterías de litio pierden capacidad y su química
  cambia con el frío; el sistema de carga debe adaptarse activamente.
- **Protección física:** la carcasa (impresión 3D en PETG/ASA con sellado IP65/IP67) debe resistir
  radiación UV, ciclos de expansión térmica y polvo desértico.

### 3.2 Sistema de Alimentación (Solar + LiFePO4 + MPPT con compensación térmica)

El corazón energético combina **panel solar + batería LiFePO4 + controlador MPPT**. La elección
de **LiFePO4 (Fosfato de Hierro y Litio)** se justifica por su seguridad (no se incendia), su vida
útil (2 000–5 000 ciclos) y su estabilidad térmica, frente a las Li-ion convencionales.

**Punto crítico — el colapso del electrolito en frío:** por debajo de **0 °C**, cargar una celda de
litio provoca *lithium plating* (depósito de litio metálico) que destruye la batería de forma
permanente e irreversible. El diseño lo resuelve con un **algoritmo de compensación térmica en el
MPPT**:

1. Un **termistor NTC** (10 kΩ, ±1%) adherido a la celda mide la temperatura de la batería en
   tiempo real.
2. Si `T_batería < 0 °C`, el MPPT **corta la corriente de carga** (cut-off) y, si hay excedente
   solar, la redirige a un **elemento calefactor de bajo consumo** (resistencia PTC) que pre-acondiciona
   la celda antes de permitir la carga.
3. El voltaje de carga se **compensa por temperatura** (coeficiente típico −3 mV/°C/celda para
   LiFePO4), evitando sobretensión en calor y subcarga en frío.
4. Un **BMS (Battery Management System)** integrado supervisa balanceo de celdas, sobrecorriente,
   sobredescarga y temperatura, actuando como última barrera de seguridad.

**Referencia de controlador:** la lógica puede implementarse con un MPPT comercial de referencia
(Victron SmartSolar MPPT 75/15 como referencia de comportamiento: low-temperature cut-off
configurable y compensación térmica) o con un MPPT embebido propio (IC tipo BQ24650 + periferia),
que es el camino recomendado para un producto masivo de bajo costo.

**Dimensionamiento de referencia (por nodo):**

| Parámetro | Valor de diseño |
|---|---|
| Panel solar | 10–20 W monocristalino, 12 V nominal |
| Batería LiFePO4 | 4 celdas (12.8 V) · 10–20 Ah |
| MPPT | con compensación térmica + cut-off < 0 °C |
| Autonomía sin sol | 7–10 días (consumo medio < 100 mW en reposo) |

### 3.3 Procesamiento y Modelos (MCU de muy bajo consumo + NPU)

**Requisito:** TDP **inferior a 5 W** (objetivo de diseño: < 1 W en operación continua), capaz de
ejecutar **YOLO** para ALPR en **milisegundos**.

La solución óptima es una **arquitectura de dos silicios** que separa la inferencia (NPU dedicada)
de la orquestación (MCU generalista):

| Función | Componente | Detalle técnico |
|---|---|---|
| **Inferencia ALPR (NPU)** | **Grove Vision AI V2 (Seeed Studio)** | SoC Himax **HX6537-A "WiseEye2"**: **ARM Cortex-M55 @ 400 MHz** + **NPU Ethos-U55** (128 MAC/ciclo). Ejecuta **YOLOv8-Nano cuantizado INT8** y modelos optimizados tipo **YOLO11n**. Consumo de decenas de mW. Compatible con TensorFlow Lite Micro, Edge Impulse y SenseCraft AI. |
| **Orquestación / comunicaciones** | **Seeed Studio XIAO ESP32-S3** | Dual-core **Xtensa LX7 @ 240 MHz**, 8 MB PSRAM, instrucciones vectoriales para AI. Gestiona el flujo: captura → preprocesado → disparo de inferencia → cifrado → envío. Consumo < 0.5 W. |
| **Alternativa todo-en-uno** | **XIAO ESP32-S3 Sense** | Incluye cámara OV2640 (2 MP) y permite ejecutar modelos ligeros sin NPU externa, útil para prototipado rápido o lotes de bajo costo. |

**Rendimiento esperado (ALPR):** con YOLOv8-Nano INT8 sobre la NPU Ethos-U55, la detección de la
placa se logra en **< 50 ms por fotograma** (≥ 20 FPS), cumpliendo holgadamente el requisito de
"milisegundos". El modelo se entrena con dataset de patentes chilenas (formato AA·BB·00 y
AA·BB·CD de 2019+) y se cuantiza a INT8 para ajustarse a la memoria de la NPU.

### 3.4 Captura de Imagen (IR, Starlight, mimetización)

- **Sensor CMOS "Starlight" de alta sensibilidad:** sensores de la familia **Sony STARVIS**
  (ej. IMX327/IMX385) o equivalentes con sensibilidad ~0.0001 lux, capaces de leer una placa con
  la iluminación IR propia, sin luz visible. Se retira el **filtro IR-cut** para operar en el
  espectro infrarrojo cercano (NIR).
- **Iluminación IR indetectable:** iluminadores LED a **940 nm** (espectro invisible al ojo humano,
  a diferencia de los 850 nm que emiten un tenue brillo rojo). Esto es clave para la operación
  *mimetizada*.
- **Cumplimiento Decreto Supremo N° 1/2022 (contaminación lumínica):** al operar en IR a 940 nm,
  el dispositivo **no emite luz visible**, no genera *skyglow* ni deslumbramiento, y cumple con las
  restricciones de la norma. Se añade blindaje de cualquier LED de estado visible (se apagan o se
  cubren) y lentes dirigidas (ángulo estrecho) para no dispersar luz.
- **Mimetización (impresión 3D):** la carcasa se fabrica en **PETG o ASA** con textura y color
  camuflados al entorno (roca precordillerana), forma de baja firma visual y montaje discreto. El
  diseño evita superficies reflectantes que delaten el equipo.

### 3.5 Spec Detallado — Unidad de Captura

| Especificación | Detalle |
|---|---|
| **Procesamiento** | Grove Vision AI V2 (Cortex-M55 + Ethos-U55 NPU) + XIAO ESP32-S3 (orquestación) |
| **Modelo** | YOLOv8-Nano INT8 / YOLO11n cuantizado, ALPR chileno |
| **Latencia de inferencia** | < 50 ms/fotograma (≥ 20 FPS) |
| **Cámara** | CMOS Starlight (STARVIS) sin filtro IR-cut, 2–5 MP |
| **Iluminación** | LED IR 940 nm (invisible), lente de haz estrecho |
| **Energía** | Panel 10–20 W + LiFePO4 12.8 V / 10–20 Ah + MPPT con compensación térmica |
| **BMS** | Balanceo, cut-off < 0 °C, protección sobrecorriente/sobredescarga |
| **Temperatura de operación** | −15 °C a +40 °C (componentes grado industrial −40/85 °C) |
| **TDP total** | < 1 W (objetivo) · máximo admisible 5 W |
| **Carcasa** | Impresión 3D PETG/ASA, IP65/IP67, mimetizada |
| **Fiabilidad** | RTC + Watchdog + arranque por reinicio seguro (brown-out detector) |
| **Almacenamiento local** | microSD (solo log de diagnóstico, sin persistir imágenes) |
| **Normativa óptica** | DS N° 1/2022 (cero emisión de luz visible) |

---

## 4. FASE 2 — Agente de Telecomunicaciones y Transmisión Resiliente

### 4.1 Desafío de Conectividad

La topografía accidentada (quebradas, laderas, valles profundos) y el uso de **inhibidores de señal
(jammers)** por parte del crimen organizado anulan el GPS y las redes 3G/4G. El diseño debe
garantizar comunicación **sin infraestructura celular** y **resistente a interferencias** intencionales.

La respuesta es **LoRaWAN con modulación Chirp Spread Spectrum (CSS)**, que es intrínsecamente
robusta frente a interferencias de banda estrecha y *jammers* de bajo costo: la señal se dispersa
en el tiempo-frecuencia, lo que permite decodificarla incluso por debajo del nivel de ruido
(*processing gain*). Esto no inmuniza contra un jammer de banda ancha de alta potencia, pero eleva
drásticamente el costo y la sofisticación requeridos para bloquearla, y permite **saltos de
frecuencia** y redundancia de gateway como mitigación adicional.

### 4.2 Protocolo LoRaWAN con CSS

- **Modulación:** Chirp Spread Spectrum (CSS), con factores de dispersión **SF7–SF12**, ancho de
  banda de canal 125/250/500 kHz.
- **Trade-off alcance/velocidad:** SF7 → mayor tasa (hasta ~50 kbps con FSK) pero menor alcance;
  SF12 → menor tasa (≈ 0.3 kbps) pero máximo alcance y robustez. El dispositivo ajusta
  dinámicamente el SF según la calidad del enlace (**ADR — Adaptive Data Rate**).
- **Alcance objetivo:** **10–15 km** con línea de vista (LOS) y buena ubicación del gateway en
  altura. En topografía quebrada se despliegan múltiples gateways en puntos altos (torres, cerros)
  para cubrir los valles.
- **Clases de dispositivo:** **Clase A** (modo por defecto, máxima eficiencia energética: el nodo
  transmite y abre dos ventanas cortas de recepción) como base, con opción de **Clase C** para
  nodos con energía excedente que requieran *downlink* continuo (necesario para FUOTA).

### 4.3 Selección de Componentes y Antena

| Componente | Selección | Detalle |
|---|---|---|
| **Módulo LoRaWAN** | **Wio-E5 / LoRa-E5 (Seeed Studio)** | Basado en el SoC **STM32WLE5** (núcleo ARM Cortex-M4 + radio LoRa SX126x integrados). Soporta **LoRaWAN 1.0.x**, Clases A/B/C, bandas **AU915/US915/AS923/EU868**. Interfaz UART (comandos AT) o desarrollo directo en STM32CubeWL. |
| **Antena sub-GHz** | **Omnidireccional 915 MHz** | Antena *whip* o helicoidal de **2–3 dBi**, conector **U.FL/IPEX** (módulo) y **SMA** opcional en carcasa. Diseño *ground-plane* o PCB para compactar. La omnidireccionalidad garantiza cobertura del camino sin apuntamiento. |
| **Gateway** | **Raspberry Pi 4 + HAT LoRa** (o Seeed SenseCAP M2) | Concentrador SX1302/SX1303 multicanales (8 canales), compatible con ChirpStack/The Things Stack. Alimentación solar/batería y enlace *backhaul* vía satélite, Wi-Fi o fibra en punto de montaña. |

**Nota de diseño de antena:** para el rango 915–928 MHz, la antena se dimensiona a un cuarto de
onda (≈ 8 cm) o se usa una helicoidal corta. Se valida con analizador vectorial (VNA) para obtener
ROE (VSWR) < 2:1 en la banda de operación y se respeta una distancia de despeje respecto a la masa
del circuito para no degradar el patrón.

### 4.4 Marco Regulatorio (SUBTEL — Chile)

- **Resoluciones 1985 y 737 de SUBTEL:** autorizan el uso de bandas no licenciadas para IoT/LPWAN
  y definen las condiciones técnicas de operación.
- **Banda de operación:** plan de canalización **AU915 o US915**, en el rango **915–928 MHz**.
  - AU915: subbanda 915–928 MHz (uplink), canales 64+8.
  - US915: 902–928 MHz, canalización por sub-bandas de 8 canales.
- **Potencia máxima:** **1 W (30 dBm)** EIRP permitida. En la práctica, para preservar batería y
  cumplir el *duty cycle* (límite de ocupación del canal), los nodos operan típicamente a
  14–20 dBm, reservando la potencia máxima para casos excepcionales con autorización.
- **Certificación:** el módulo Wio-E5/LoRa-E5 cuenta con **certificación FCC/IC/RED**; el integrador
  debe tramitar la homologación local del producto final ante SUBTEL.

### 4.5 Ciclo de Aprendizaje — FUOTA (actualizaciones OTA)

**Explicación simple:** el sistema puede *enseñar* nuevas habilidades al dispositivo sin tocarlo
físicamente, como actualizar el teléfono sin cable. Se hace por radio, en tres ingredientes:

1. **Fragmentación del firmware:** la nueva versión se divide en fragmentos pequeños (lo permite el
   estándar *FUOTA — Firmware Update Over The Air* del LoRa Alliance).
2. **Transmisión Multicast (Clase B/C):** en vez de enviar el firmware una y otra vez a cada nodo
   (desperdicio de batería y de aire), se envía **una sola vez a todos los nodos a la vez** (grupo
   *multicast* con su propia clave de sesión). Cada nodo solo "despierta" en su ventana de clase B/C
   para escuchar.
3. **Parches delta:** en lugar de enviar el firmware completo, se envía solo la **diferencia binaria**
   (delta) entre la versión instalada y la nueva (algoritmo tipo *bsdiff*). Un parche de unos pocos
   KB reemplaza descargas de cientos de KB.

**Resultado:** el ancho de banda se reduce hasta un **90%** y el consumo de batería del nodo se
mantiene mínimo, porque el nodo duerme la mayor parte del tiempo y solo recibe fragmentos cortos.
El proceso incluye verificación de integridad (CRC/hash) y *rollback* automático si el parche falla.

### 4.6 Spec Detallado — Unidad de Transmisión

| Especificación | Detalle |
|---|---|
| **Protocolo** | LoRaWAN 1.0.x, modulación CSS (SF7–SF12), Clases A/B/C |
| **Módulo radio** | Wio-E5 / LoRa-E5 (STM32WLE5, SX126x integrado) |
| **Banda** | AU915 / US915 (915–928 MHz) |
| **Potencia TX** | hasta 30 dBm (1 W) · operación típica 14–20 dBm |
| **Alcance** | 10–15 km LOS (redundancia por multi-gateway en valles) |
| **Antena** | Omnidireccional sub-GHz 2–3 dBi, U.FL/SMA, VSWR < 2:1 |
| **ADR** | Adaptive Data Rate activo para optimizar SF y potencia |
| **FUOTA** | Multicast Clase B/C + parches delta (bsdiff) + rollback |
| **Cifrado** | AES-128 (AppSKey/NwkSKey) + integridad de paquete (MIC) |
| **Anti-jamming** | CSS + salto de frecuencia + redundancia de gateway |
| **Cumplimiento** | Resoluciones SUBTEL 1985 y 737, FCC/IC/RED |

---

## 5. FASE 3 — Agente de Arquitectura de Software y Consumo de Datos (API)

### 5.1 Privacidad por Diseño (Ley 21.719, Chile)

La **Ley 21.719** moderniza la regulación de protección de datos personales en Chile, elevando el
estándar hacia principios como **privacidad por diseño y por defecto** (Privacy by Design). Awki
lo implementa en el nivel más profundo posible: **el borde físico**.

- **Procesamiento local y destrucción:** el modelo Edge AI (YOLO) recibe la imagen de la patente,
  detecta la placa, la recorta y ejecuta OCR para extraer **solo la cadena de texto**
  (ej. `BB·CD·12`). La imagen se **elimina de la RAM y del almacenamiento de forma irreversible**
  (sobrescritura) inmediatamente después de la extracción. **Ningún archivo multimedia abandona el
  dispositivo.**
- **Minimización de datos:** por la red viaja únicamente un paquete de metadatos cifrados:
  placa (texto), timestamp, ID de nodo/ubicación aproximada, confianza de detección y nivel de
  batería. No hay imagen, no hay datos biométricos de personas, no hay GPS continuo.
- **Cifrado en tránsito y en reposo:** AES-128 en la capa LoRaWAN (claves de aplicación/red),
  TLS 1.3 en el enlace gateway→nube, y cifrado de datos sensibles en la base de datos (ej.
  cifrado de columnas o *transparent data encryption*). Las claves se gestionan en un HSM/KMS.

### 5.2 Recepción y Almacenamiento (Gateway LoRaWAN → Backend)

```
Nodo AWKI →(LoRaWAN)→ Gateway RPi4 →(packet forwarder)→ ChirpStack LNS
   →(MQTT/Webhook, TLS)→ Django (consumidor) → PostgreSQL → API → PWA / Power BI
```

1. **Gateway (Raspberry Pi 4):** ejecuta un *packet forwarder* (Semtech UDP o Concentratord) que
   reenvía los paquetes LoRa recibidos al **Network Server**.
2. **Network Server (ChirpStack / The Things Stack):** autentica los nodos (join OTAA), valida el
   MIC de integridad, descifra el payload y lo publica mediante **MQTT** o **webhook HTTPS**.
3. **Consumidor en Django:** un *worker* (Celery + Redis) se suscribe al topic MQTT, valida el
   esquema del payload (JSON), normaliza y persiste en **PostgreSQL**. Se usa **TimescaleDB**
   (extensión de PostgreSQL) para la serie temporal de lecturas y métricas de red, permitiendo
   consultas analíticas eficientes sobre millones de registros.

### 5.3 Modelo de Datos (Django ORM)

```python
# apps/core/models.py  (resumen de entidades)
class Nodo(models.Model):          # Unidad de borde
    dev_eui = models.CharField(unique=True)      # identificador LoRaWAN
    nombre = models.CharField()
    ubicacion = models.PointField(null=True)     # PostGIS (aproximada)
    version_fw = models.CharField()

class Lectura(models.Model):       # Lectura de patente
    nodo = models.ForeignKey(Nodo, on_delete=models.CASCADE)
    placa = models.CharField(db_index=True)      # texto extraído (cifrado en reposo)
    timestamp = models.DateTimeField(db_index=True)
    confianza = models.FloatField()              # 0..1
    bateria_mv = models.IntegerField()
    sf = models.PositiveSmallIntegerField()      # spreading factor usado

class Alerta(models.Model):        # Evento/incidencia
    lectura = models.OneToOneField(Lectura, on_delete=models.CASCADE)
    tipo = models.CharField()                     # robo, buscada, forastera, etc.
    estado = models.CharField(default="abierta")
    creada_en = models.DateTimeField(auto_now_add=True)
```

**Claves de diseño:** índices compuestos sobre `(placa, timestamp)` para consultas forenses rápidas;
particionado por tiempo en la tabla de lecturas; retención configurable (ej. 12–24 meses) alineada
a la normativa de datos personales.

### 5.4 Salida y Consumo (PWA + Power BI)

- **PWA (Progressive Web App) offline-first:** construida con un *service worker* y almacenamiento
  local (IndexedDB) para funcionar **sin conexión** en terreno. Cuando hay señal, sincroniza contra
  la API. Permite: consulta de placas, alta de alertas y mapa de nodos. Notificaciones *push* para
  alertas tempranas.
- **Tableros analíticos (Power BI):** se conectan a la API (o a una réplica de lectura/vista
  materializada) en dos capas:
  - **Power Query M** — capa de conectividad y ETL: extrae los datos desde el endpoint REST
    (fuente JSON/Web) o desde una vista materializada, transforma y limpia (tipos, zona horaria
    UTC→local) y fusiona con tablas de referencia (ej. listas de patentes buscadas de SITIA y
    catálogo de nodos). La actualización se programa vía *Power BI Gateway*.
  - **DAX** — capa de modelado y medidas: calcula los KPIs de trazabilidad (lecturas por ruta,
    horas pico, placas únicas, reincidencias, cobertura de red y estado de batería).

  **Ejemplo de consulta M (conexión a la API):**
  ```m
  let
      Origen = Json.Document(Web.Contents("https://api.awki-ai.cl/api/v1/lecturas")),
      Lecturas = Table.FromList(Origen[data], Record.FieldValues, {"id","placa","timestamp","nodo","confianza"}),
      ConTipo = Table.TransformColumnTypes(Lecturas, {{"timestamp", type datetime}}),
      ConHoraLocal = Table.TransformColumns(ConTipo, {{"timestamp", each DateTimeZone.SwitchZone(_, -4), type datetime}})
  in
      ConHoraLocal
  ```

  **Ejemplo de medidas DAX:**
  ```dax
  Total Lecturas      = COUNTROWS( Lecturas )
  Placas Únicas       = DISTINCTCOUNT( Lecturas[placa] )
  Lecturas Hoy        = CALCULATE( [Total Lecturas], Lecturas[timestamp] >= TODAY() )
  Reincidencias       = CALCULATE( [Placas Únicas], Lecturas[placa] IN Buscadas[placa] )
  Lecturas Año vs Año = [Total Lecturas] - CALCULATE( [Total Lecturas], SAMEPERIODLASTYEAR( 'Calendario'[Fecha] ) )
  ```

  Estos tableros son el punto de consumo final para los clientes, mostrando la trazabilidad
  logística de extremo a extremo (desde la detección en el borde hasta el KPI de negocio).
- **Exportación:** endpoints CSV/JSON para interoperar con sistemas externos y respaldo forense.

### 5.5 Interoperabilidad y Seguridad (API REST/GraphQL)

- **API RESTful (Django REST Framework)** como contrato principal, con **GraphQL (Graphene-Django)**
  opcional para consultas flexibles de análisis.
- **Autenticación/autorización:** OAuth 2.0 + OIDC, con *scopes* granulares por organismo
  (Carabineros: solo lectura/consulta; SITIA-Patentes: escritura de listas de búsqueda).
- **Endpoints de referencia:**
  - `POST /api/v1/lecturas` — ingesta (solo gateway/servicio interno, mTLS).
  - `GET /api/v1/placas/{placa}` — consulta de historial de una patente.
  - `POST /api/v1/alertas` — alta de alerta temprana.
  - `GET /api/v1/nodos/estado` — salud y batería de la flota.
  - `POST /api/v1/buscadas` — sincronización con listas estatales (SITIA).
- **Integraciones estatales:** adaptadores de cola para **Carabineros** y **SITIA-Patentes**
  (Sistema Integrado de Tránsito), con *rate limiting*, auditoría (log inmutable de accesos) y
  cifrado TLS mutuo (mTLS) para los enlaces sensibles.

### 5.6 Spec Detallado — Sistema de Almacenado y Salida en API

| Especificación | Detalle |
|---|---|
| **Backend** | Django + Django REST Framework + Celery + Redis |
| **Base de datos** | PostgreSQL + TimescaleDB (serie temporal) + PostGIS (georreferencia) |
| **Ingesta** | MQTT/Webhook desde ChirpStack → worker → persistencia |
| **Privacidad** | Ley 21.719: solo texto cifrado, imagen destruida en el borde |
| **Cifrado** | AES-128 (LoRa) + TLS 1.3 + cifrado en reposo + HSM/KMS |
| **API** | RESTful (DRF) + GraphQL (Graphene) · OAuth 2.0/OIDC + scopes |
| **Consumo** | PWA offline-first (IndexedDB + service worker) + Power BI Gateway |
| **Interoperabilidad** | Carabineros, SITIA-Patentes (mTLS, rate limiting, auditoría) |
| **Alertas** | Notificaciones push + webhooks + cola de eventos |
| **Escalabilidad** | Workers horizontales, particionado por tiempo, caché Redis |

---

## 6. Consolidación — Validación de Factibilidad de la Integración

La consolidación del trabajo de los tres agentes confirma que la integración **es factible** con
tecnología de catálogo actual. Los puntos de unión son:

**1. Interfaz electrónica entre silicios (Fase 1 ↔ Fase 2):**
- La **NPU (Grove Vision AI V2)** se comunica con el **XIAO ESP32-S3** por **I2C** (datos de
  inferencia) y **UART** (comandos). El ESP32-S3 envía el payload al **Wio-E5** por **UART** con
  comandos AT. Todos estos buses son nativos en ambos módulos; no hay incompatibilidad de niveles
  (3.3 V lógico en todo el sistema).

**2. Presupuesto energético (Fase 1):**
- La suma de consumos (NPU en inferencia < 100 mW + ESP32-S3 < 0.5 W + Wio-E5 TX picos ~ 0.5 W)
  se mantiene **por debajo de 1 W de media**, muy por debajo del límite de 5 W. El dimensionado
  solar (10–20 W) y LiFePO4 (10–20 Ah) cubre con margen la operación continua, incluidos los
  picos de transmisión y el pre-acondicionamiento térmico invernal.

**3. Cadena de datos de extremo a extremo (Fase 2 ↔ Fase 3):**
- El payload LoRaWAN (texto de placa + metadatos cifrados, ~10–50 bytes) encaja sin fricción en el
  *duty cycle* y el *payload size* de LoRaWAN (hasta 222 bytes con SF7). El ChirpStack publica por
  MQTT y el consumidor Django lo persiste; el camino es estándar y ampliamente probado en el
  ecosistema.

**4. Privacidad transversal:**
- La destrucción de la imagen en el borde (Fase 1), el cifrado AES-128 en la radio (Fase 2) y el
  cifrado en reposo + control de acceso (Fase 3) forman una cadena de privacidad continua que
  satisface la Ley 21.719 y minimiza la superficie de ataque.

**5. Actualizabilidad:**
- El **FUOTA** (Fase 2) permite evolucionar tanto el firmware del nodo como el **modelo YOLO**,
  cerrando el ciclo de aprendizaje continuo sin despliegues físicos en terreno.

**Veredicto:** ✅ **viable en producción** con componentes Seeed Studio 2026, sin dependencias
críticas de proveedor único y con una ruta de homologación regulatoria clara (SUBTEL + FCC/IC/RED).

---

## 7. Lista de Materiales (BOM) — Resumen

| Ítem | Componente | Rol | Cant. |
|---|---|---|---|
| MCU principal | Seeed Studio XIAO ESP32-S3 | Orquestación, cifrado, control | 1 |
| NPU + cámara | Grove Vision AI V2 (Himax HX6537-A) + módulo cámara Starlight | Inferencia ALPR | 1 |
| Radio | Wio-E5 / LoRa-E5 (STM32WLE5) | LoRaWAN | 1 |
| Antena | Omnidireccional sub-GHz 915 MHz 2–3 dBi (U.FL/SMA) | RF | 1 |
| Energía | Panel 10–20 W + LiFePO4 12.8 V + MPPT c/ compensación térmica + BMS | Alimentación | 1 |
| Sensor térmico | Termistor NTC 10 kΩ ±1% | Cut-off carga < 0 °C | 1 |
| Almacenamiento | microSD (solo logs) | Diagnóstico | 1 |
| Fiabilidad | RTC + Watchdog + protección brown-out | Uptime | 1 |
| Carcasa | Impresión 3D PETG/ASA, IP65/67, mimetizada | Protección | 1 |
| Iluminación | LED IR 940 nm + lente haz estrecho | Captura nocturna | 2–4 |

**Gateway (por sitio):** Raspberry Pi 4 + HAT LoRa (SX1302/1303) + antena + backhaul satelital/Wi-Fi.

---

## 8. Cumplimiento Regulatorio y Normativo

| Norma / Ley | Ámbito | Cumplimiento en Awki |
|---|---|---|
| Ley 21.719 (Chile) | Protección de datos personales | Privacidad por diseño; imagen destruida en borde; minimización y cifrado |
| Decreto Supremo N° 1/2022 | Contaminación lumínica | Operación en IR 940 nm, cero luz visible, sin *skyglow* |
| Res. SUBTEL 1985 y 737 | Bandas LPWAN / IoT | AU915/US915 915–928 MHz, potencia ≤ 1 W, duty cycle |
| FCC / IC / RED | Certificación radioeléctrica | Módulo pre-certificado + homologación del producto final |

---

## 9. Riesgos y Mitigaciones

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Jammer de banda ancha de alta potencia | Pérdida temporal de enlace | Almacenamiento local temporal + retransmisión por ráfagas; salto de frecuencia; multi-gateway |
| Carga de batería bajo 0 °C (lithium plating) | Daño irreversible de batería | Cut-off térmico + pre-acondicionamiento PTC + compensación de voltaje |
| Falsa detección de patente (falsos positivos) | Alertas erróneas | Umbral de confianza + validación OCR de formato chileno + revisión humana en alertas |
| Intercepción del payload radio | Fuga de datos | AES-128 (AppSKey/NwkSKey) + MIC de integridad + rotación de claves |
| Topografía sin línea de vista | Cobertura insuficiente | Gateways en altura + SF adaptativo (ADR) + redundancia |
| Deriva del modelo en terreno | Pérdida de precisión ALPR | FUOTA de modelo + reentrenamiento con datos anonimizados |

---

## 10. Glosario

- **ALPR** — Automatic License Plate Recognition (reconocimiento automático de patentes).
- **CSS** — Chirp Spread Spectrum (modulación de espectro ensanchado por chirps).
- **FUOTA** — Firmware Update Over The Air (actualización de firmware por radio).
- **MPPT** — Maximum Power Point Tracking (seguimiento del punto de máxima potencia).
- **LiFePO4** — Batería de Fosfato de Hierro y Litio.
- **NPU** — Neural Processing Unit (unidad de procesamiento neuronal).
- **TDP** — Thermal Design Power (potencia de diseño térmico).
- **ADR** — Adaptive Data Rate (tasa de datos adaptativa).
- **PWA** — Progressive Web App (aplicación web progresiva).
- **LNS** — LoRaWAN Network Server (servidor de red LoRaWAN).
- **OTAA** — Over-The-Air Activation (activación por aire).

---

*Documento generado mediante la metodología Skilyfi (enjambre de agentes de IA), consolidando los
Specs de los Agentes 1 (Captura/Edge AI), 2 (Transmisión LoRaWAN) y 3 (Software/API).*









