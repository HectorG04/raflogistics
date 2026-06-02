import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  center = true,
  className,
}: {
  eyebrow?: string;
  title: string;
  center?: boolean;
  className?: string;
}) {
  return (
    <div className={cn(center && "text-center", "mb-10", className)}>
      {eyebrow && (
        <p className="mb-2 text-sm font-bold uppercase tracking-widest text-brand-orange">
          {eyebrow}
        </p>
      )}
      <h2 className="font-heading text-3xl font-bold text-brand-navy sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}
