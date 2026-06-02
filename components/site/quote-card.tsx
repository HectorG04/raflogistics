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
      className="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5"
    >
      {/* Branded header */}
      <div className="relative bg-brand-navy px-6 py-6 sm:px-8">
        <span className="absolute inset-y-0 left-0 w-1.5 bg-brand-orange" />
        <h2 className="font-heading text-2xl font-bold text-white">{title}</h2>
        <p className="mt-1 text-sm text-white/70">{subtitle}</p>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand-orange/15 px-3 py-1 text-xs font-semibold text-brand-orange ring-1 ring-brand-orange/30">
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
