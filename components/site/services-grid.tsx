import { ServiceIcon } from "@/components/site/service-icon";
import type { Service } from "@/lib/types";

export function ServicesGrid({ services }: { services: Service[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {services.map((s) => (
        <div
          key={s.id}
          className="group rounded-xl border border-black/5 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-brand-orange/10 transition group-hover:bg-brand-orange">
            <ServiceIcon
              name={s.icon}
              className="size-7 text-brand-orange transition group-hover:text-white"
            />
          </div>
          <h3 className="font-heading text-lg font-bold text-brand-navy">
            {s.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-brand-navy/60">
            {s.description}
          </p>
        </div>
      ))}
    </div>
  );
}
