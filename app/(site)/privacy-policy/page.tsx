import type { Metadata } from "next";
import { siteSettings } from "@/lib/site-content";
import { PageHero } from "@/components/site/page-hero";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "RAF Freight Logistics privacy policy: what information we collect, how we use and share it, our SMS and phone number privacy commitments, and your choices.",
};

const h2 = "mt-10 font-heading text-2xl font-bold text-brand-navy";
const p = "mt-3 leading-relaxed";

export default async function PrivacyPolicyPage() {
  const settings = await siteSettings();

  return (
    <>
      <PageHero title="Privacy Policy" subtitle="Last Updated: May 2026" />

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-6 text-brand-navy/80">
          <p className="text-lg">
            RAF Freight Logistics (&ldquo;RAF,&rdquo; &ldquo;we,&rdquo;
            &ldquo;us,&rdquo; or &ldquo;our&rdquo;) respects your privacy. This
            Privacy Policy explains what information we collect, how we use and
            share it, and the choices you have when you use our website, request
            a quote, ship a vehicle or freight, or work with us as a carrier.
          </p>

          <h2 className={h2}>Information We Collect</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <strong>Information you provide:</strong> name, email, phone
              number, pickup and delivery addresses or ZIP codes, vehicle
              details (year, make, model, and condition), shipment or load
              details, and any message you send us.
            </li>
            <li>
              <strong>Carrier information:</strong> business name, MC and USDOT
              numbers, contact details, equipment, lanes, and documents you
              upload such as your Certificate of Insurance (COI) and W-9.
            </li>
            <li>
              <strong>Information collected automatically:</strong> IP address,
              browser and device type, pages viewed, and similar usage data
              collected through cookies and analytics tools.
            </li>
          </ul>

          <h2 className={h2}>How We Use Your Information</h2>
          <p className={p}>
            We use your information to provide quotes; arrange, coordinate,
            dispatch, and track shipments; onboard and verify carriers;
            communicate with you about your requests (including by phone, email,
            and SMS); process payments; provide customer support; comply with
            legal and regulatory requirements (such as FMCSA and DOT rules);
            prevent fraud; and improve our services.
          </p>

          <h2 className={h2}>SMS &amp; Phone Number Privacy</h2>
          <div className="mt-3 space-y-3 rounded-xl border-l-4 border-brand-orange bg-brand-navy/[0.03] p-5 leading-relaxed">
            <p>
              We do not sell, rent, or share consumers&rsquo; personal
              information, including phone numbers, with third parties or
              affiliates for marketing or lead generation purposes. All the
              above categories exclude text messaging originator opt-in data and
              consent; this information will not be shared with any third
              parties.
            </p>
            <p>
              SMS consent and phone numbers collected for SMS communications
              will not be shared with third parties or affiliates for marketing
              purposes.
            </p>
          </div>

          <h2 className={h2}>Cookies &amp; Tracking</h2>
          <p className={p}>
            We use cookies and similar technologies to operate the site,
            remember your preferences, and measure traffic. You can control
            cookies through your browser settings; disabling them may affect
            site functionality.
          </p>

          <h2 className={h2}>How We Share Information</h2>
          <p className={p}>
            We share information only as needed to run our business: with motor
            carriers and drivers to fulfill your shipment; with service
            providers (such as payment processors, hosting, email, and analytics
            providers) under confidentiality obligations; and with authorities
            when required by law or to comply with FMCSA and DOT regulations or
            legal process. We may transfer information as part of a business sale
            or reorganization. <strong>We do not sell your personal information.</strong>
          </p>

          <h2 className={h2}>Data Retention</h2>
          <p className={p}>
            We keep information for as long as needed to provide our services,
            meet legal and recordkeeping obligations, resolve disputes, and
            enforce our agreements.
          </p>

          <h2 className={h2}>Data Security</h2>
          <p className={p}>
            We use reasonable administrative, technical, and physical safeguards
            to protect your information. No method of transmission or storage is
            completely secure, so we cannot guarantee absolute security.
          </p>

          <h2 className={h2}>Your Rights &amp; Choices</h2>
          <p className={p}>
            You may request access to, correction of, or deletion of your
            personal information, and you may opt out of marketing
            communications at any time. Depending on your state, you may have
            additional rights (for example, under the California Consumer
            Privacy Act). To exercise any right, contact us using the details
            below.
          </p>

          <h2 className={h2}>Children&rsquo;s Privacy</h2>
          <p className={p}>
            Our services are not directed to children under 18, and we do not
            knowingly collect their personal information.
          </p>

          <h2 className={h2}>Changes to This Policy</h2>
          <p className={p}>
            We may update this Privacy Policy from time to time. The &ldquo;Last
            Updated&rdquo; date above reflects the most recent version.
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
