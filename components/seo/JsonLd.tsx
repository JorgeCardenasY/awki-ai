import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, SOCIAL_LINKS } from "@/lib/site";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/icon.svg`,
      description: SITE_DESCRIPTION,
      sameAs: SOCIAL_LINKS,
      areaServed: {
        "@type": "AdministrativeArea",
        name: "Macrozona Norte, Chile",
      },
    },
    {
      "@type": "SoftwareApplication",
      name: "Awki — Plataforma de Trazabilidad Logística",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web (PWA offline-first)",
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "CLP",
        description: "Demo bajo solicitud",
      },
      provider: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      inLanguage: "es-CL",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

/** Datos estructurados JSON-LD: Organization + SoftwareApplication + WebSite. */
export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
