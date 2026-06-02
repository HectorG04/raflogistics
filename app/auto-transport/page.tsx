import type { Metadata } from "next";
import { Car, ShieldCheck, MapPin, Clock } from "lucide-react";
import { siteSettings } from "@/lib/site-content";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { CtaBanner } from "@/components/site/cta-banner";

export const metadata: Metadata = {
  title: "Auto Transport",
  description:
    "Nationwide open and enclosed auto transport. Door-to-door car shipping that's safe, insured, and fully tracked. Get a free quote today.",
};

const FEATURES = [
  { icon: Car, title: "Open & Enclosed", text: "Standard open carriers or premium enclosed transport for high-value vehicles." },
  { icon: ShieldCheck, title: "Fully Insured", text: "Every vehicle is covered in transit for total peace of mind." },
  { icon: MapPin, title: "Door-to-Door", text: "We pick up and deliver as close to your door as legally possible." },
  { icon: Clock, title: "On-Time", text: "Reliable pickup and delivery windows with real-time updates." },
];

export default async function AutoTransportPage() {
  const settings = await siteSettings();
  return (
    <>
      <PageHero
        title="Auto Transport"
        subtitle="Safe, insured, nationwide vehicle shipping — open and enclosed."
      />
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Vehicle Shipping"
            title="Car Shipping Done Right"
          />
          <p className="mx-auto -mt-6 mb-12 max-w-3xl text-center text-brand-navy/70">
            Whether you&apos;re moving a single car across the country or a fleet
            of vehicles, Raf Auto Freight handles your shipment with care. Choose
            open transport for great value or enclosed transport for premium
            protection.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-xl border border-black/5 bg-white p-6 shadow-sm">
                <f.icon className="size-9 text-brand-orange" />
                <h3 className="mt-4 font-heading text-lg font-bold text-brand-navy">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-brand-navy/60">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CtaBanner
        title="Need to Ship a Vehicle?"
        subtitle="Get a free, no-obligation auto transport quote in minutes."
        phone={settings.phone}
      />
    </>
  );
}
