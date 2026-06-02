import { ShieldCheck, BadgeCheck, Star, ExternalLink } from "lucide-react";
import type { SiteSettings } from "@/lib/types";

/** Trust signals: authority numbers, FMCSA link, licensing, reviews. */
export function TrustStrip({ settings }: { settings: SiteSettings }) {
  return (
    <section className="border-y border-black/5 bg-brand-navy/[0.03]">
      <div className="mx-auto grid max-w-7xl gap-4 px-6 py-6 text-center sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center justify-center gap-2 text-sm font-medium text-brand-navy">
          <BadgeCheck className="size-5 text-brand-orange" />
          MC {settings.mc_number} · USDOT {settings.usdot_number}
        </div>
        <div className="flex items-center justify-center gap-2 text-sm font-medium text-brand-navy">
          <ShieldCheck className="size-5 text-brand-orange" />
          Licensed · Bonded · Insured
        </div>
        <a
          href={`https://safer.fmcsa.dot.gov/CompanySnapshot.aspx`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-sm font-medium text-brand-navy hover:text-brand-orange"
        >
          <ExternalLink className="size-5 text-brand-orange" />
          Verify on FMCSA SAFER
        </a>
        <div className="flex items-center justify-center gap-1.5 text-sm font-medium text-brand-navy">
          <span className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-4 fill-brand-orange text-brand-orange" />
            ))}
          </span>
          5-Star Rated Service
        </div>
      </div>
    </section>
  );
}
