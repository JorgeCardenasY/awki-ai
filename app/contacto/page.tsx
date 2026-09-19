import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contacto — Solicita una Demo",
  description:
    "Solicita una demo de la plataforma de trazabilidad logística Awki. Agenda un piloto en tu ruta y conecta tus datos a Power BI.",
  alternates: { canonical: "/contacto" },
};

export default function ContactoPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Contacto", href: "/contacto" }]} />
      <PageHeader
        kicker="[ CONTACTO ]"
        title={
          <>
            Hablemos de tu <span className="text-neon-green">ruta</span>.
          </>
        }
        description="Cuéntanos tu caso de uso y coordinamos una demo técnica o un piloto en la Ruta CH-11 y la Macrozona Norte."
      />
      <div className="pb-20">
        <ContactForm />
      </div>
    </>
  );
}
