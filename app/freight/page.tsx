import type { Metadata } from "next";
import { Truck, Boxes, Globe, PackageCheck } from "lucide-react";
import { siteSettings } from "@/lib/site-content";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { CtaBanner } from "@/components/site/cta-banner";

export const metadata: Metadata = {
  title: "Freight Services",
  description:
    "Full-service freight and logistics: road freight, warehousing, and end-to-end supply chain solutions across the United States.",
};

const SERVICES = [
  { icon: Truck, title: "Road Freight", text: "FTL and LTL road transportation for all types of goods with real-time tracking." },
  { icon: Boxes, title: "Warehousing", text: "Secure, climate-controlled storage and inventory management." },
  { icon: Globe, title: "Supply Chain", text: "End-to-end supply chain optimization to cut costs and boost efficiency." },
  { icon: PackageCheck, title: "Specialized Loads", text: "Flatbed, reefer, step deck and more — we handle the tough freight." },
];

export default async function FreightPage() {
  const settings = await siteSettings();
  return (
    <>
      <PageHero
        title="Freight Services"
        subtitle="Reliable freight, warehousing, and supply chain solutions nationwide."
      />
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading eyebrow="What We Move" title="Complete Freight Solutions" />
          <div className="grid gap-6 sm:grid-cols-2">
            {SERVICES.map((s) => (
              <div key={s.title} className="flex gap-4 rounded-xl border border-black/5 bg-white p-6 shadow-sm">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-brand-orange/10">
                  <s.icon className="size-6 text-brand-orange" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-brand-navy">
                    {s.title}
                  </h3>
                  <p className="mt-1 text-sm text-brand-navy/60">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CtaBanner
        title="Need a Custom Freight Quote?"
        subtitle="Tell us about your load and we'll build the right solution."
        phone={settings.phone}
      />
    </>
  );
}
