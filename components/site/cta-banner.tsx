import Link from "next/link";

export function CtaBanner({
  title = "Ready to Ship? Get a Free Quote Today.",
  subtitle = "Fast, reliable nationwide auto transport and freight. No obligation.",
  phone,
}: {
  title?: string;
  subtitle?: string;
  phone?: string | null;
}) {
  return (
    <section className="bg-brand-orange">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 py-12 text-center text-white md:flex-row md:justify-between md:text-left">
        <div>
          <h2 className="font-heading text-2xl font-bold sm:text-3xl">{title}</h2>
          <p className="mt-2 text-white/90">{subtitle}</p>
        </div>
        <div className="flex shrink-0 gap-3">
          <Link
            href="/contact#quote"
            className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-brand-orange shadow-sm transition hover:bg-white/90"
          >
            Get A Quote
          </Link>
          {phone && (
            <a
              href={`tel:${phone.replace(/[^\d+]/g, "")}`}
              className="rounded-md border border-white/70 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Call {phone}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
