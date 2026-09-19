import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHeader from "@/components/PageHeader";
import NodeExplodedView from "@/components/three/NodeExplodedView";
import NodeSpecs from "@/components/hardware/NodeSpecs";

export const metadata: Metadata = {
  title: "Nodo Awki — Hardware de borde IP65/67",
  description:
    "El Nodo Awki: carcasa PETG/ASA IP65/67 mimetizada, óptica CMOS Starlight sin IR-cut, NPU Ethos-U55, radio LoRa y tren energético solar con compensación térmica.",
  alternates: { canonical: "/hardware/nodo-awki" },
};

export default function NodoAwkiPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Nodo Awki", href: "/hardware/nodo-awki" }]} />
      <PageHeader
        kicker="[ HARDWARE DE BORDE ]"
        title={
          <>
            El Nodo Awki: hardware{" "}
            <span className="text-neon-cyan">mimetizado</span> para el altiplano.
          </>
        }
        description="Ingeniería de grado industrial en una carcasa IP65/67 impresa en PETG/ASA, diseñada para operar sin obras civiles en la Ruta CH-11."
      />
      <NodeExplodedView />
      <NodeSpecs />
    </>
  );
}
