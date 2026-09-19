import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHeader from "@/components/PageHeader";
import AlprPipeline from "@/components/simulation/AlprPipeline";
import LoraWanMap from "@/components/simulation/LoraWanMap";
import BlueprintVelxio from "@/components/simulation/BlueprintVelxio";
import TopologyDiagram from "@/components/saas/TopologyDiagram";
import ApiConsole from "@/components/roadmap/ApiConsole";

export const metadata: Metadata = {
  title: "Tecnología — Edge AI, LoRaWAN y Arquitectura",
  description:
    "Edge AI (reconocimiento de patentes con YOLOv8-Nano), transmisión LoRaWAN en banda AU915 sin cobertura celular y arquitectura de datos cifrada de extremo a extremo.",
  alternates: { canonical: "/tecnologia" },
};

export default function TecnologiaPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Tecnología", href: "/tecnologia" }]} />
      <PageHeader
        kicker="[ TECNOLOGÍA ]"
        title={
          <>
            Tecnología de borde y{" "}
            <span className="text-neon-cyan">red</span> para logística sin cobertura.
          </>
        }
        description="Cómo Awki procesa en el borde, transmite por radio y persiste en la nube: Edge AI, LoRaWAN CSS y una arquitectura cifrada de extremo a extremo."
      />
      <AlprPipeline />
      <LoraWanMap />
      <BlueprintVelxio />
      <TopologyDiagram />
      <ApiConsole />
    </>
  );
}
