import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHeader from "@/components/PageHeader";
import PrivacyContent from "@/components/privacy/PrivacyContent";

export const metadata: Metadata = {
  title: "Privacidad — Ley 21.719 y Cumplimiento",
  description:
    "Privacidad por diseño según la Ley 21.719: la imagen se destruye en el borde y solo viajan metadatos cifrados. Cumplimiento SUBTEL, D.S. 1/2022 y FCC.",
  alternates: { canonical: "/privacidad" },
};

export default function PrivacidadPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Privacidad", href: "/privacidad" }]} />
      <PageHeader
        kicker="[ PRIVACIDAD · NORMATIVA ]"
        title={
          <>
            Privacidad <span className="text-neon-magenta">by design</span> en el
            borde.
          </>
        }
        description="Cómo Awki cumple la Ley 21.719, el D.S. 1/2022 y las resoluciones SUBTEL: minimización de datos, procesamiento local y cifrado de extremo a extremo."
      />
      <PrivacyContent />
    </>
  );
}
