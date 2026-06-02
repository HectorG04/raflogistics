import { Trash2 } from "lucide-react";
import { listTestimonials } from "@/lib/db/admin-content";
import { saveTestimonial, deleteTestimonialAction } from "@/app/admin/actions";
import type { Testimonial } from "@/lib/types";

const input =
  "w-full rounded-md border border-black/10 px-3 py-2 text-sm focus:border-brand-orange focus:outline-none";

function TestimonialForm({ item }: { item?: Testimonial }) {
  return (
    <form
      action={saveTestimonial}
      className="rounded-xl border border-black/5 bg-white p-5 shadow-sm"
    >
      {item && <input type="hidden" name="id" value={item.id} />}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-brand-navy/70">Name</label>
          <input name="name" defaultValue={item?.name} required className={input} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-brand-navy/70">Company / Title</label>
          <input name="company" defaultValue={item?.company ?? ""} className={input} />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-brand-navy/70">Quote</label>
          <textarea name="quote" defaultValue={item?.quote} rows={3} required className={input} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-brand-navy/70">Rating (1–5)</label>
          <input name="rating" type="number" min={1} max={5} defaultValue={item?.rating ?? 5} className={input} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-brand-navy/70">Sort order</label>
          <input name="sort_order" type="number" defaultValue={item?.sort_order ?? 0} className={input} />
        </div>
        <label className="flex items-center gap-2 self-end text-sm text-brand-navy">
          <input type="checkbox" name="published" defaultChecked={item?.published ?? true} className="accent-brand-orange" />
          Published
        </label>
      </div>
      <div className="mt-4">
        <button className="rounded-md bg-brand-orange px-4 py-2 text-sm font-semibold text-white hover:brightness-95">
          {item ? "Save" : "Add Testimonial"}
        </button>
      </div>
    </form>
  );
}

export default async function AdminTestimonialsPage() {
  const items = await listTestimonials().catch(() => []);
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-brand-navy">Testimonials</h1>

      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand-navy/50">
          Add new
        </h2>
        <TestimonialForm />
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-navy/50">
          Existing ({items.length})
        </h2>
        {items.map((t) => (
          <div key={t.id} className="relative">
            <TestimonialForm item={t} />
            <form action={deleteTestimonialAction.bind(null, t.id)} className="absolute right-5 top-5">
              <button className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50">
                <Trash2 className="size-3.5" /> Delete
              </button>
            </form>
          </div>
        ))}
      </section>
    </div>
  );
}
