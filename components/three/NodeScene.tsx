"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import NodeModel, { type ProgressRef } from "./NodeModel";

/**
 * Escena 3D del Nodo Awki — vista explotada interactiva.
 * El scroll (ScrollTrigger) conduce el desplazamiento de capas vía `progress`.
 */
export default function NodeScene({ progress }: { progress: ProgressRef }) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [3.2, 0.6, 5.6], fov: 42 }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 6, 3]} intensity={1.2} color="#cfe8ff" />
      <pointLight position={[-4, -2, -3]} intensity={0.7} color="#7c5cff" />
      <pointLight position={[0, 3, 2]} intensity={0.45} color="#00ffcc" />

      <NodeModel progress={progress} />

      <Grid
        position={[0, -2.8, 0]}
        args={[24, 24]}
        cellSize={0.4}
        cellThickness={0.5}
        cellColor="#1a2330"
        sectionSize={2}
        sectionThickness={0.8}
        sectionColor="#00ffcc"
        fadeDistance={20}
        fadeStrength={1.5}
        infiniteGrid
      />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        maxPolarAngle={Math.PI / 1.75}
        minPolarAngle={Math.PI / 3.2}
      />
    </Canvas>
  );
}
