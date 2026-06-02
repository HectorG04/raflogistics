import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { services, testimonials, siteSettings } from "@/lib/site-content";
import { SectionHeading } from "@/components/site/section-heading";
import { ServicesGrid } from "@/components/site/services-grid";
import { Testimonials } from "@/components/site/testimonials";
import { TrustStrip } from "@/components/site/trust-strip";
import { CtaBanner } from "@/components/site/cta-banner";
import { QuoteForm } from "@/components/site/quote-form";

const WHY_US = [
  "On-time delivery you can count on",
  "Fully licensed, bonded & insured",
  "Open & enclosed auto transport",
  "Real-time shipment tracking",
  "24/7 logistics support",
  "Nationwide carrier network",
];

export default async function HomePage() {
  const [settings, svc, tms] = await Promise.all([
    siteSettings(),
    services(),
    testimonials(),
  ]);

  return (
    <>
      {/* Hero */}
      <section
        className="relative bg-brand-navy bg-cover bg-center"
        style={{ backgroundImage: "url(/images/hero-header.jpg)" }}
      >
        <div className="absolute inset-0 bg-brand-navy/85" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:py-24">
          <div className="text-white">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-orange">
              Welcome to Raf Auto Freight
            </p>
            <h1 className="font-heading text-4xl font-bold leading-tight sm:text-5xl">
              {settings.hero_headline}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/80">
              {settings.hero_sub}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#quote"
                className="rounded-md bg-brand-orange px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"
              >
                Get A Free Quote
              </a>
              {settings.phone && (
                <a
                  href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`}
                  className="rounded-md border border-white/40 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  {settings.phone}
                </a>
              )}
            </div>
            {settings.phone_secondary && (
              <p className="mt-4 text-white/80">
                Or call us directly at{" "}
                <a
                  href={`tel:${settings.phone_secondary.replace(/[^\d+]/g, "")}`}
                  className="font-semibold text-brand-orange hover:underline"
                >
                  {settings.phone_secondary}
                </a>
              </p>
            )}
          </div>

          {/* Quote card */}
          <div id="quote" className="rounded-2xl bg-white p-6 shadow-xl sm:p-8">
            <h2 className="font-heading text-2xl font-bold text-brand-navy">
              Request A Quote
            </h2>
            <p className="mb-5 mt-1 text-sm text-brand-navy/60">
              Tell us about your shipment — we&apos;ll get right back to you.
            </p>
            <QuoteForm compact />
          </div>
        </div>
      </section>

      <TrustStrip settings={settings} />

      {/* Services */}
      <section className="bg-neutral-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading eyebrow="What We Do" title="Our Best Services" />
          <ServicesGrid services={svc} />
        </div>
      </section>

      {/* Why us */}
      <section className="py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
          <div className="relative">
            <Image
              src="/images/close-har.jpg"
              alt="Raf Auto Freight driver"
              width={640}
              height={520}
              className="rounded-2xl object-cover shadow-lg"
            />
          </div>
          <div>
            <SectionHeading
              eyebrow="About Company"
              title="Advanced Transport Logistics You Can Trust"
              center={false}
            />
            <p className="-mt-6 mb-6 text-brand-navy/70">
              Our logistics expertise, modern fleet, and customized solutions
              help you move vehicles and freight safely and on schedule — from
              first mile to last.
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {WHY_US.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-brand-navy">
                  <CheckCircle2 className="size-5 shrink-0 text-brand-orange" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-neutral-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading eyebrow="Testimonials" title="What Our Clients Say" />
          <Testimonials items={tms} />
        </div>
      </section>

      <CtaBanner phone={settings.phone} />
    </>
  );
}
