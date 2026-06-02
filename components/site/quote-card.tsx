import { BadgeCheck } from "lucide-react";
import { QuoteForm } from "@/components/site/quote-form";

export function QuoteCard({
  title = "Request A Quote",
  subtitle = "Tell us about your shipment — we'll get right back to you.",
  compact = false,
}: {
  title?: string;
  subtitle?: string;
  compact?: boolean;
}) {
  return (
    <div
      id="quote"
      className="overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/40 ring-1 ring-white/15"
    >
      {/* Orange top accent — crisp brand edge that separates the card from the hero */}
      <div className="h-1.5 w-full bg-brand-orange" />

      {/* Branded header (lighter navy gradient so it doesn't blend with the hero) */}
      <div className="bg-gradient-to-br from-brand-navy-light to-brand-navy px-6 py-6 sm:px-8">
        <h2 className="font-heading text-2xl font-bold text-white">{title}</h2>
        <p className="mt-1 text-sm text-white/75">{subtitle}</p>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand-orange/15 px-3 py-1 text-xs font-semibold text-brand-orange ring-1 ring-brand-orange/40">
          <BadgeCheck className="size-3.5" /> 100% Free · No Obligation
        </span>
      </div>

      {/* Form body */}
      <div className="p-6 sm:p-8">
        <QuoteForm compact={compact} />
      </div>
    </div>
  );
}
