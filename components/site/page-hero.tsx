export function PageHero({
  title,
  subtitle,
  image = "/images/inner-hero-bg.jpg",
}: {
  title: string;
  subtitle?: string;
  image?: string;
}) {
  return (
    <section
      className="relative bg-brand-navy bg-cover bg-center py-20"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="absolute inset-0 bg-brand-navy/80" />
      <div className="relative mx-auto max-w-7xl px-6 text-center text-white">
        <h1 className="font-heading text-4xl font-bold sm:text-5xl">{title}</h1>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-2xl text-white/80">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
