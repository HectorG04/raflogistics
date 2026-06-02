import { Quote, Star } from "lucide-react";
import type { Testimonial } from "@/lib/types";

export function Testimonials({ items }: { items: Testimonial[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {items.map((t) => (
        <figure
          key={t.id}
          className="flex flex-col rounded-xl bg-white p-7 shadow-sm ring-1 ring-black/5"
        >
          <Quote className="size-8 text-brand-orange/40" />
          <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-brand-navy/80">
            “{t.quote}”
          </blockquote>
          <div className="mt-5 flex">
            {Array.from({ length: t.rating }).map((_, i) => (
              <Star key={i} className="size-4 fill-brand-orange text-brand-orange" />
            ))}
          </div>
          <figcaption className="mt-3">
            <span className="block font-semibold text-brand-navy">{t.name}</span>
            {t.company && (
              <span className="text-xs text-brand-navy/50">{t.company}</span>
            )}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
