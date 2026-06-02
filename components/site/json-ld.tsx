import type { SiteSettings } from "@/lib/types";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://raffreightlogistics.com";

/** Organization / MovingCompany structured data for rich results & AI search. */
export function OrganizationJsonLd({ settings }: { settings: SiteSettings }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "MovingCompany",
    name: "Raf Auto Freight Logistics",
    description:
      "Nationwide auto transport and freight logistics — safe, fast, and reliable.",
    url: BASE,
    logo: `${BASE}/images/raf-logo.jpg`,
    image: `${BASE}/images/hero-header.jpg`,
    telephone: settings.phone ?? undefined,
    email: settings.email ?? undefined,
    areaServed: "US",
    address: {
      "@type": "PostalAddress",
      addressCountry: "US",
    },
    identifier: [
      { "@type": "PropertyValue", name: "MC", value: settings.mc_number },
      { "@type": "PropertyValue", name: "USDOT", value: settings.usdot_number },
    ],
    sameAs: [settings.facebook, settings.instagram, settings.linkedin].filter(
      Boolean
    ),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
