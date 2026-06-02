import type { Metadata } from "next";
import Link from "next/link";
import { siteSettings } from "@/lib/site-content";
import { PageHero } from "@/components/site/page-hero";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms & Conditions for RAF Freight Logistics, including our broker and motor carrier role, liability and claims, and SMS messaging terms (STOP/HELP).",
};

const h2 = "mt-10 font-heading text-2xl font-bold text-brand-navy";
const p = "mt-3 leading-relaxed";

export default async function TermsPage() {
  const settings = await siteSettings();
  const tel = settings.phone?.replace(/[^\d+]/g, "");

  return (
    <>
      <PageHero title="Terms & Conditions" subtitle="Last Updated: May 2026" />

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-6 text-brand-navy/80">
          <p className="text-lg">
            These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern your use of
            the RAF Freight Logistics (&ldquo;RAF,&rdquo; &ldquo;we,&rdquo;
            &ldquo;us&rdquo;) website and services. By using our website,
            requesting a quote, or booking a shipment, you agree to these Terms.
          </p>

          <h2 className={h2}>Our Role (Broker and Motor Carrier)</h2>
          <p className={p}>
            RAF Freight Logistics is a licensed transportation broker (MC{" "}
            {settings.mc_number}) and a registered motor carrier (USDOT{" "}
            {settings.usdot_number}). Depending on the shipment, RAF may act
            either as a <strong>broker</strong> &mdash; arranging transport by an
            independent, authorized, and insured motor carrier &mdash; or as the{" "}
            <strong>motor carrier</strong> transporting your vehicle or freight
            directly. The capacity in which RAF is acting for a given shipment
            will be reflected in your quote, booking confirmation, and/or Bill of
            Lading.
          </p>

          <h2 className={h2}>Quotes &amp; Pricing</h2>
          <p className={p}>
            Quotes are estimates based on the information you provide and may
            change if actual details differ (for example, vehicle condition,
            dates, location, or accessibility). Unless stated otherwise, quotes
            are valid for 7 days.
          </p>

          <h2 className={h2}>Booking, Deposits &amp; Cancellation</h2>
          <p className={p}>
            You may cancel a booking before the shipment is dispatched or
            assigned to a carrier for a full refund of any deposit paid. Once a
            vehicle or shipment has been dispatched or picked up, cancellation
            fees may apply.
          </p>

          <h2 className={h2}>Customer Responsibilities</h2>
          <p className={p}>
            You agree to provide accurate and complete information; ensure the
            vehicle or freight is available for pickup at the agreed time; ensure
            any vehicle is in the condition described (including disclosing if it
            is inoperable); and remove personal belongings unless otherwise
            agreed. RAF and its carriers are not responsible for personal items
            left in a vehicle.
          </p>

          <h2 className={h2}>Pickup, Delivery &amp; Transit Times</h2>
          <p className={p}>
            Pickup and delivery dates are estimates and are not guaranteed.
            Transit times may be affected by weather, traffic, road conditions,
            mechanical issues, or other factors beyond our control. The condition
            of the vehicle or freight is documented on the inspection report and
            Bill of Lading at pickup and delivery.
          </p>

          <h2 className={h2}>Insurance, Liability &amp; Claims</h2>
          <p className={p}>
            <strong>When RAF acts as a broker:</strong> RAF is not liable for
            loss, damage, theft, or delay occurring while a vehicle or shipment
            is in the care, custody, and control of the motor carrier. Under the
            Carmack Amendment (49 U.S.C. &sect; 14706), the assigned carrier is
            responsible for loss or damage to property in transit. Every carrier
            in our network is required to hold active operating authority and the
            insurance mandated by the FMCSA. If loss or damage occurs, RAF will
            provide the carrier&rsquo;s insurance and contact information and
            assist you in filing a claim directly with the carrier; RAF does not
            insure shipments and is not a party to the claim.
          </p>
          <p className={p}>
            <strong>When RAF acts as the motor carrier:</strong> RAF transports
            the shipment under its own operating authority and maintains the
            cargo and liability insurance required by the FMCSA. Damage must be
            noted on the delivery inspection report or Bill of Lading at the time
            of delivery and reported to RAF within 5 days. Liability is subject
            to these Terms and applicable law.
          </p>

          <h2 className={h2}>Limitation of Liability</h2>
          <p className={p}>
            To the maximum extent permitted by law: where RAF acts as a broker,
            RAF&rsquo;s total liability arising from any shipment is limited to
            the brokerage fee paid to RAF for that shipment; where RAF acts as
            the motor carrier, RAF&rsquo;s liability is limited to that required
            under applicable law and RAF&rsquo;s cargo insurance coverage.
          </p>

          <h2 className={h2}>Payment</h2>
          <p className={p}>
            Payment is due as stated in your quote or booking confirmation.
            Accepted payment methods will be provided at the time of booking.
          </p>

          <h2 className={h2}>Prohibited Items</h2>
          <p className={p}>
            Unless expressly agreed in writing, you may not ship hazardous
            materials, illegal items, firearms, or other prohibited goods.
            Personal items should not be left in vehicles beyond any allowance
            stated at booking.
          </p>

          <h2 className={h2}>SMS / Messaging Terms</h2>
          <p className={p}>
            By providing your phone number and opting in, you agree to receive
            SMS text messages from RAF Freight Logistics regarding quote
            requests, shipment coordination, dispatch updates, and customer
            service for your active requests.
          </p>
          <ul className="mt-4 space-y-3">
            <li className="flex gap-3">
              <span className="font-semibold text-brand-orange">&bull;</span>
              <span><strong>Message frequency may vary.</strong></span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-brand-orange">&bull;</span>
              <span><strong>Message &amp; data rates may apply.</strong></span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-brand-orange">&bull;</span>
              <span>
                <strong>Reply STOP to opt out.</strong> You can cancel SMS
                messages at any time by replying <strong>STOP</strong>. After you
                send STOP, we will send a confirmation message and then stop
                sending you SMS messages.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-brand-orange">&bull;</span>
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
          <p className={p}>
            SMS consent and phone numbers collected for SMS communications will
            not be shared with third parties or affiliates for marketing
            purposes. See our{" "}
            <Link href="/privacy-policy" className="font-semibold text-brand-orange">
              Privacy Policy
            </Link>{" "}
            for details.
          </p>

          <h2 className={h2}>Website Use &amp; Intellectual Property</h2>
          <p className={p}>
            All content on this website is owned by or licensed to RAF Freight
            Logistics and may not be copied or used without permission. You agree
            not to misuse the website or interfere with its operation.
          </p>

          <h2 className={h2}>Indemnification</h2>
          <p className={p}>
            To the extent permitted by law, you agree to indemnify and hold RAF
            harmless from any claims, losses, or expenses arising from your
            breach of these Terms or from your shipment.
          </p>

          <h2 className={h2}>Disclaimers</h2>
          <p className={p}>
            The website and services are provided &ldquo;as is&rdquo; without
            warranties of any kind, to the maximum extent permitted by law.
          </p>

          <h2 className={h2}>Governing Law &amp; Disputes</h2>
          <p className={p}>
            These Terms are governed by the laws of the State of New York,
            without regard to its conflict-of-laws rules. Any dispute will be
            subject to the exclusive jurisdiction of the state and federal courts
            located in New York.
          </p>

          <h2 className={h2}>Changes to These Terms</h2>
          <p className={p}>
            We may update these Terms from time to time. Continued use of our
            website or services after changes take effect constitutes acceptance
            of the updated Terms.
          </p>

          <h2 className={h2}>Contact Us</h2>
          <p className={p}>
            RAF Freight Logistics
            {settings.email && (
              <>
                {" "}&middot; Email:{" "}
                <a href={`mailto:${settings.email}`} className="font-semibold text-brand-orange">
                  {settings.email}
                </a>
              </>
            )}
            {settings.phone && <> &middot; Phone: {settings.phone}</>}
            {" "}&middot; MC {settings.mc_number} &middot; USDOT{" "}
            {settings.usdot_number}.
          </p>
        </div>
      </section>
    </>
  );
}
