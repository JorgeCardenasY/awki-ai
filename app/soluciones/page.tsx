import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHeader from "@/components/PageHeader";
import RutaCh11 from "@/components/solutions/RutaCh11";
import PwaDashboard from "@/components/saas/PwaDashboard";
import PowerBi from "@/components/saas/PowerBi";
import Roadmap from "@/components/roadmap/Roadmap";

export const metadata: Metadata = {
  title: "Soluciones — Trazabilidad en Rutas Altoandinas",
  description:
    "Trazabilidad logística para la Ruta CH-11 y la Macrozona Norte de Chile: nodos autónomos sin obras civiles, PWA offline-first y analítica B2B en Power BI.",
  alternates: { canonical: "/soluciones" },
};

export default function SolucionesPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Soluciones", href: "/soluciones" }]} />
      <PageHeader
        kicker="[ SOLUCIONES B2B ]"
        title={
          <>
            Trazabilidad para la{" "}
            <span className="text-neon-amber">Macrozona Norte</span>.
          </>
        }
        description="Del desierto de Atacama al altiplano: Awki da trazabilidad de extremo a extremo donde las redes celulares no existen."
      />
      <RutaCh11 />
      <PwaDashboard />
      <PowerBi />
      <Roadmap />
    </>
  );
}
