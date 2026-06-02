import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { siteSettings } from "@/lib/site-content";
import { PageHero } from "@/components/site/page-hero";
import { QuoteCard } from "@/components/site/quote-card";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Raf Auto Freight Logistics for a free quote or to track a load. Available 24/7. Call +1 (845) 573-1488.",
};

export default async function ContactPage() {
  const settings = await siteSettings();
  const tel = settings.phone?.replace(/[^\d+]/g, "");

  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="Our coordinators are available 24/7 for quotes and load tracking."
      />

      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2">
          {/* Contact details */}
          <div>
            <h2 className="font-heading text-2xl font-bold text-brand-navy">
              Get In Touch
            </h2>
            <p className="mt-2 text-brand-navy/70">
              Whether it&apos;s a quote or tracking an active load, we&apos;re one
              call away.
            </p>
            <ul className="mt-8 space-y-5">
              {settings.phone && (
                <li className="flex items-start gap-4">
                  <span className="flex size-11 items-center justify-center rounded-lg bg-brand-orange/10">
                    <Phone className="size-5 text-brand-orange" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-brand-navy">Phone</p>
                    <a href={`tel:${tel}`} className="text-brand-navy/70 hover:text-brand-orange">
                      {settings.phone}
                    </a>
                  </div>
                </li>
              )}
              {settings.email && (
                <li className="flex items-start gap-4">
                  <span className="flex size-11 items-center justify-center rounded-lg bg-brand-orange/10">
                    <Mail className="size-5 text-brand-orange" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-brand-navy">Email</p>
                    <a href={`mailto:${settings.email}`} className="text-brand-navy/70 hover:text-brand-orange">
                      {settings.email}
                    </a>
                  </div>
                </li>
              )}
              <li className="flex items-start gap-4">
                <span className="flex size-11 items-center justify-center rounded-lg bg-brand-orange/10">
                  <Clock className="size-5 text-brand-orange" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-brand-navy">Hours</p>
                  <p className="text-brand-navy/70">24/7 Dispatch &amp; Support</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex size-11 items-center justify-center rounded-lg bg-brand-orange/10">
                  <MapPin className="size-5 text-brand-orange" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-brand-navy">Authority</p>
                  <p className="text-brand-navy/70">
                    MC {settings.mc_number} · USDOT {settings.usdot_number}
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Quote form */}
          <QuoteCard
            title="Request a Free Quote"
            subtitle="Describe your load, origin, and destination — we'll respond fast."
          />
        </div>
      </section>
    </>
  );
}
