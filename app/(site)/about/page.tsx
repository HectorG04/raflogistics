import type { Metadata } from "next";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { siteSettings } from "@/lib/site-content";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { CtaBanner } from "@/components/site/cta-banner";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Raf Auto Freight Logistics — a trusted nationwide auto transport and freight carrier. Licensed, bonded, and insured with 24/7 support.",
};

const POINTS = [
  "Years of nationwide auto transport experience",
  "Modern, well-maintained fleet",
  "Vetted, professional drivers",
  "Transparent pricing — no hidden fees",
];

export default async function AboutPage() {
  const settings = await siteSettings();
  return (
    <>
      <PageHero
        title="About Raf Auto Freight"
        subtitle="Moving vehicles and freight across the country with safety, speed, and reliability."
      />
      <section className="py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
          <Image
            src="/images/about-01.png"
            alt="Raf Auto Freight operations"
            width={640}
            height={520}
            className="rounded-2xl object-cover shadow-lg"
          />
          <div>
            <SectionHeading
              eyebrow="Who We Are"
              title="Your Reliable Logistics Partner"
              center={false}
            />
            <p className="-mt-6 text-brand-navy/70">
              Raf Auto Freight Logistics provides professional trucking and
              logistics solutions nationwide. From single-vehicle auto transport
              to full freight loads, we deliver with 100% reliability and a
              relentless focus on safety. We&apos;re fully licensed under MC{" "}
              {settings.mc_number} and USDOT {settings.usdot_number}.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {POINTS.map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm text-brand-navy">
                  <CheckCircle2 className="size-5 shrink-0 text-brand-orange" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <CtaBanner phone={settings.phone} />
    </>
  );
}
