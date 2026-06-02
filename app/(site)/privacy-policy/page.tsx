import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "RAF Freight Logistics privacy policy, including our SMS and phone number privacy commitments. We do not sell, rent, or share consumers' personal information with third parties for marketing.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero title="Privacy Policy" subtitle="Last Updated: May 2026" />

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-6 text-brand-navy/80">
          <p className="text-lg">
            At RAF Freight Logistics, we respect your privacy. This policy
            outlines how we handle your information.
          </p>

          <h2 className="mt-10 font-heading text-2xl font-bold text-brand-navy">
            Information Collection
          </h2>
          <p className="mt-3 leading-relaxed">
            We collect information necessary to provide auto transport and
            logistics services, such as names, addresses, and phone numbers.
          </p>

          <h2 className="mt-10 font-heading text-2xl font-bold text-brand-navy">
            SMS &amp; Phone Number Privacy
          </h2>
          <div className="mt-3 rounded-xl border-l-4 border-brand-orange bg-brand-navy/[0.03] p-5 leading-relaxed">
            <p>
              We do not sell, rent, or share consumers&rsquo; personal
              information, including phone numbers, with third parties or
              affiliates for marketing or lead generation purposes. All the
              above categories exclude text messaging originator opt-in data and
              consent; this information will not be shared with any third
              parties.
            </p>
          </div>

          <h2 className="mt-10 font-heading text-2xl font-bold text-brand-navy">
            Use of Information
          </h2>
          <p className="mt-3 leading-relaxed">
            Your data is used solely for coordinating shipments, providing
            quotes, and communicating regarding your active service requests.
          </p>
        </div>
      </section>
    </>
  );
}
