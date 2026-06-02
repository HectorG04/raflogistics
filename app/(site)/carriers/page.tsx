import type { Metadata } from "next";
import { DollarSign, Clock, Headset, FileText } from "lucide-react";
import { siteSettings } from "@/lib/site-content";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { CarrierForm } from "@/components/site/carrier-form";

export const metadata: Metadata = {
  title: "Carriers",
  description:
    "Join the Raf Auto Freight carrier network. Steady freight, quick pay, and 24/7 dispatch support. Apply online — upload your COI and W-9.",
};

const BENEFITS = [
  { icon: DollarSign, title: "Competitive Pay", text: "Fair rates and quick-pay options." },
  { icon: Clock, title: "Steady Freight", text: "Consistent loads on the lanes you run." },
  { icon: Headset, title: "24/7 Dispatch", text: "Real people, around the clock." },
  { icon: FileText, title: "Easy Onboarding", text: "Apply and upload docs in minutes." },
];

export default async function CarriersPage() {
  const settings = await siteSettings();
  return (
    <>
      <PageHero
        title="Drive With Raf Auto Freight"
        subtitle="Join our carrier network — steady freight, quick pay, and dispatch that has your back."
      />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="For Carriers"
                title="Why Run With Us"
                center={false}
              />
              <div className="-mt-4 grid gap-4 sm:grid-cols-2">
                {BENEFITS.map((b) => (
                  <div key={b.title} className="rounded-xl border border-black/5 bg-white p-5 shadow-sm">
                    <b.icon className="size-7 text-brand-orange" />
                    <h3 className="mt-3 font-semibold text-brand-navy">{b.title}</h3>
                    <p className="mt-1 text-sm text-brand-navy/60">{b.text}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm text-brand-navy/60">
                Questions? Call dispatch at{" "}
                <a
                  href={`tel:${settings.phone?.replace(/[^\d+]/g, "")}`}
                  className="font-semibold text-brand-orange"
                >
                  {settings.phone}
                </a>
                .
              </p>
            </div>

            <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-md sm:p-8">
              <h2 className="font-heading text-2xl font-bold text-brand-navy">
                Carrier Application
              </h2>
              <p className="mb-6 mt-1 text-sm text-brand-navy/60">
                Fill out the form and attach your COI and W-9 to get set up fast.
              </p>
              <CarrierForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
