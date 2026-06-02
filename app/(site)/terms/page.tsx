import type { Metadata } from "next";
import Link from "next/link";
import { siteSettings } from "@/lib/site-content";
import { PageHero } from "@/components/site/page-hero";

export const metadata: Metadata = {
  title: "SMS Terms & Conditions",
  description:
    "SMS Terms & Conditions for RAF Freight Logistics text messaging: message frequency, rates, STOP to opt out, and HELP for assistance.",
};

export default async function TermsPage() {
  const settings = await siteSettings();
  const tel = settings.phone?.replace(/[^\d+]/g, "");

  return (
    <>
      <PageHero title="SMS Terms & Conditions" subtitle="Last Updated: May 2026" />

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-6 text-brand-navy/80">
          <p className="text-lg">
            By providing your phone number and opting in, you agree to receive
            SMS text messages from RAF Freight Logistics regarding quote
            requests, shipment coordination, dispatch updates, and customer
            service for your active requests.
          </p>

          <h2 className="mt-10 font-heading text-2xl font-bold text-brand-navy">
            Messaging Terms
          </h2>
          <ul className="mt-4 space-y-3">
            <li className="flex gap-3">
              <span className="font-semibold text-brand-orange">•</span>
              <span><strong>Message frequency may vary.</strong></span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-brand-orange">•</span>
              <span><strong>Message &amp; data rates may apply.</strong></span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-brand-orange">•</span>
              <span>
                <strong>Reply STOP to opt out.</strong> You can cancel SMS
                messages at any time by replying <strong>STOP</strong>. After you
                send STOP, we will send a confirmation message and then stop
                sending you SMS messages.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-brand-orange">•</span>
              <span>
                <strong>Reply HELP for assistance.</strong> For help, reply{" "}
                <strong>HELP</strong>
                {settings.phone && (
                  <>
                    {" "}or contact us at{" "}
                    <a href={`tel:${tel}`} className="font-semibold text-brand-orange">
                      {settings.phone}
                    </a>
                  </>
                )}
                {settings.email && (
                  <>
                    {" "}or{" "}
                    <a
                      href={`mailto:${settings.email}`}
                      className="font-semibold text-brand-orange"
                    >
                      {settings.email}
                    </a>
                  </>
                )}
                .
              </span>
            </li>
          </ul>

          <h2 className="mt-10 font-heading text-2xl font-bold text-brand-navy">
            Carrier Liability
          </h2>
          <p className="mt-3 leading-relaxed">
            Carriers are not liable for delayed or undelivered messages.
          </p>

          <h2 className="mt-10 font-heading text-2xl font-bold text-brand-navy">
            Privacy
          </h2>
          <p className="mt-3 leading-relaxed">
            SMS consent and phone numbers collected for SMS communications will
            not be shared with third parties or affiliates for marketing
            purposes. For full details on how we handle your information, see our{" "}
            <Link href="/privacy-policy" className="font-semibold text-brand-orange">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
