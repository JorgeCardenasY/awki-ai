"use client";

import { useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Edges } from "@react-three/drei";
import * as THREE from "three";

export interface ProgressObject {
  value: number;
}
export type ProgressRef = { current: ProgressObject };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Posiciones [ensamblado, explotado] en Y para cada capa (de arriba hacia abajo)
const Y = {
  solar: [1.45, 3.05],
  chassisTop: [0.98, 2.25],
  optics: [0.5, 1.45],
  npu: [0.12, 0.65],
  mcu: [-0.22, -0.15],
  radio: [-0.55, -0.95],
  battery: [-0.95, -1.8],
  chassisBottom: [-1.32, -2.65],
};

/** Capa explotable: desplaza su posición Y según el progreso del scroll. */
function Explodable({
  progress,
  from,
  to,
  children,
}: {
  progress: ProgressRef;
  from: number;
  to: number;
  children: ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (ref.current) {
      ref.current.position.y = lerp(from, to, progress.current.value);
    }
  });
  return (
    <group ref={ref} position={[0, from, 0]}>
      {children}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Partes del Nodo Awki                                                */
/* ------------------------------------------------------------------ */

function SolarPanel() {
  return (
    <group>
      <RoundedBox args={[1.7, 0.07, 1.0]} radius={0.02} smoothness={2}>
        <meshStandardMaterial
          color="#0d1a2e"
          metalness={0.4}
          roughness={0.35}
          emissive="#0a1a2a"
          emissiveIntensity={0.3}
        />
      </RoundedBox>
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          position={[0, 0.045, -0.35 + i * 0.35]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[1.55, 0.02]} />
          <meshStandardMaterial
            color="#1a3a5c"
            metalness={0.5}
            roughness={0.3}
            emissive="#0a2a4a"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
      <Edges color="#ffb000" />
    </group>
  );
}

function Chassis({ top }: { top?: boolean }) {
  return (
    <group>
      <RoundedBox args={[1.9, 0.32, 1.2]} radius={0.05} smoothness={3}>
        <meshStandardMaterial color="#34393b" metalness={0.15} roughness={0.9} />
      </RoundedBox>
      {/* Mimetización: protuberancias rocosas */}
      <mesh position={[0.55, 0.18, 0.3]}>
        <sphereGeometry args={[0.09, 8, 8]} />
        <meshStandardMaterial color="#2b3032" roughness={1} />
      </mesh>
      <mesh position={[-0.6, 0.17, -0.25]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial color="#40454a" roughness={1} />
      </mesh>
      <Edges color={top ? "#4b5563" : "#374151"} />
    </group>
  );
}

function Optics() {
  return (
    <group>
      <RoundedBox args={[0.85, 0.08, 0.6]} radius={0.02}>
        <meshStandardMaterial
          color="#0a3d1f"
          metalness={0.2}
          roughness={0.6}
          emissive="#062d15"
          emissiveIntensity={0.4}
        />
      </RoundedBox>
      {/* Barril de lente */}
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.32, 24]} />
        <meshStandardMaterial color="#14181d" metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Vidrio CMOS Starlight (sin IR-cut) */}
      <mesh position={[0, 0.22, 0.17]}>
        <cylinderGeometry args={[0.12, 0.12, 0.03, 24]} />
        <meshStandardMaterial
          color="#00ffcc"
          emissive="#00ffcc"
          emissiveIntensity={0.9}
          metalness={0.9}
          roughness={0.05}
        />
      </mesh>
      {/* LED IR 940 nm (espectro invisible) */}
      {[-0.32, 0, 0.32].map((x) => (
        <mesh key={x} position={[x, 0.08, -0.3]}>
          <cylinderGeometry args={[0.04, 0.04, 0.07, 12]} />
          <meshStandardMaterial
            color="#330011"
            emissive="#ff2d78"
            emissiveIntensity={1.3}
          />
        </mesh>
      ))}
      <Edges color="#ff2d78" />
    </group>
  );
}

function NPU() {
  return (
    <group>
      <RoundedBox args={[1.0, 0.07, 0.7]} radius={0.02}>
        <meshStandardMaterial
          color="#0a3d1f"
          metalness={0.2}
          roughness={0.6}
          emissive="#062d15"
          emissiveIntensity={0.4}
        />
      </RoundedBox>
      {/* Chip Cortex-M55 + Ethos-U55 */}
      <RoundedBox args={[0.42, 0.09, 0.42]} radius={0.02} position={[0, 0.08, 0]}>
        <meshStandardMaterial color="#161b22" metalness={0.6} roughness={0.3} />
      </RoundedBox>
      <mesh position={[0, 0.13, 0]}>
        <boxGeometry args={[0.24, 0.02, 0.24]} />
        <meshStandardMaterial
          color="#7c5cff"
          emissive="#7c5cff"
          emissiveIntensity={0.8}
        />
      </mesh>
      <Edges color="#7c5cff" />
    </group>
  );
}

function MCU() {
  return (
    <group>
      <RoundedBox args={[1.1, 0.07, 0.7]} radius={0.02}>
        <meshStandardMaterial
          color="#0a3d1f"
          metalness={0.2}
          roughness={0.6}
          emissive="#062d15"
          emissiveIntensity={0.4}
        />
      </RoundedBox>
      <RoundedBox args={[0.3, 0.07, 0.3]} radius={0.02} position={[0.28, 0.07, 0]}>
        <meshStandardMaterial color="#161b22" metalness={0.6} roughness={0.3} />
      </RoundedBox>
      {/* Pinout I2C/UART */}
      {[-0.15, 0, 0.15].map((x) => (
        <mesh key={x} position={[x - 0.4, 0.05, 0.3]}>
          <boxGeometry args={[0.04, 0.02, 0.08]} />
          <meshStandardMaterial
            color="#00ffcc"
            emissive="#00ffcc"
            emissiveIntensity={0.6}
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>
      ))}
      <Edges color="#00ffcc" />
    </group>
  );
}

function Radio() {
  return (
    <group>
      <RoundedBox args={[0.7, 0.06, 0.5]} radius={0.02}>
        <meshStandardMaterial
          color="#0a3d1f"
          metalness={0.2}
          roughness={0.6}
          emissive="#062d15"
          emissiveIntensity={0.4}
        />
      </RoundedBox>
      {/* Antena sub-GHz */}
      <mesh position={[0.32, 0.35, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.62, 8]} />
        <meshStandardMaterial color="#8892a0" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0.32, 0.66, 0]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial
          color="#39ff88"
          emissive="#39ff88"
          emissiveIntensity={0.8}
        />
      </mesh>
      <Edges color="#39ff88" />
    </group>
  );
}

function Battery() {
  return (
    <group>
      <RoundedBox args={[1.3, 0.5, 0.8]} radius={0.04}>
        <meshStandardMaterial color="#1f2937" metalness={0.3} roughness={0.5} />
      </RoundedBox>
      <mesh position={[-0.35, 0.27, 0]}>
        <boxGeometry args={[0.2, 0.08, 0.2]} />
        <meshStandardMaterial
          color="#ffb000"
          emissive="#ffb000"
          emissiveIntensity={0.6}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0.35, 0.27, 0]}>
        <boxGeometry args={[0.2, 0.08, 0.2]} />
        <meshStandardMaterial color="#8892a0" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Termistor NTC (cut-off < 0 °C) */}
      <mesh position={[0, -0.3, 0.25]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial
          color="#ffb000"
          emissive="#ffb000"
          emissiveIntensity={0.9}
        />
      </mesh>
      <Edges color="#ffb000" />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Modelo principal                                                   */
/* ------------------------------------------------------------------ */

export default function NodeModel({ progress }: { progress: ProgressRef }) {
  const spin = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (spin.current) {
      spin.current.rotation.y += delta * 0.14;
    }
  });

  return (
    <group ref={spin}>
      <Explodable progress={progress} from={Y.solar[0]} to={Y.solar[1]}>
        <SolarPanel />
      </Explodable>
      <Explodable progress={progress} from={Y.chassisTop[0]} to={Y.chassisTop[1]}>
        <Chassis top />
      </Explodable>
      <Explodable progress={progress} from={Y.optics[0]} to={Y.optics[1]}>
        <Optics />
      </Explodable>
      <Explodable progress={progress} from={Y.npu[0]} to={Y.npu[1]}>
        <NPU />
      </Explodable>
      <Explodable progress={progress} from={Y.mcu[0]} to={Y.mcu[1]}>
        <MCU />
      </Explodable>
      <Explodable progress={progress} from={Y.radio[0]} to={Y.radio[1]}>
        <Radio />
      </Explodable>
      <Explodable progress={progress} from={Y.battery[0]} to={Y.battery[1]}>
        <Battery />
      </Explodable>
      <Explodable progress={progress} from={Y.chassisBottom[0]} to={Y.chassisBottom[1]}>
        <Chassis />
      </Explodable>
    </group>
  );
}
