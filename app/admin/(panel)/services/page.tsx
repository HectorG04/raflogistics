import { Trash2 } from "lucide-react";
import { listServices } from "@/lib/db/admin-content";
import { saveService, deleteServiceAction } from "@/app/admin/actions";
import type { Service } from "@/lib/types";

const input =
  "w-full rounded-md border border-black/10 px-3 py-2 text-sm focus:border-brand-orange focus:outline-none";

function ServiceForm({ service }: { service?: Service }) {
  return (
    <form
      action={saveService}
      className="rounded-xl border border-black/5 bg-white p-5 shadow-sm"
    >
      {service && <input type="hidden" name="id" value={service.id} />}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-brand-navy/70">Title</label>
          <input name="title" defaultValue={service?.title} required className={input} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-brand-navy/70">
            Icon (truck, warehouse, globe, boxes)
          </label>
          <input name="icon" defaultValue={service?.icon ?? "truck"} className={input} />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-brand-navy/70">Description</label>
          <textarea name="description" defaultValue={service?.description ?? ""} rows={2} className={input} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-brand-navy/70">Sort order</label>
          <input name="sort_order" type="number" defaultValue={service?.sort_order ?? 0} className={input} />
        </div>
        <label className="flex items-center gap-2 self-end text-sm text-brand-navy">
          <input type="checkbox" name="published" defaultChecked={service?.published ?? true} className="accent-brand-orange" />
          Published
        </label>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button className="rounded-md bg-brand-orange px-4 py-2 text-sm font-semibold text-white hover:brightness-95">
          {service ? "Save" : "Add Service"}
        </button>
      </div>
    </form>
  );
}

export default async function AdminServicesPage() {
  const services = await listServices().catch(() => []);
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-brand-navy">Services</h1>

      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand-navy/50">
          Add new
        </h2>
        <ServiceForm />
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-navy/50">
          Existing ({services.length})
        </h2>
        {services.map((s) => (
          <div key={s.id} className="relative">
            <ServiceForm service={s} />
            <form action={deleteServiceAction.bind(null, s.id)} className="absolute right-5 top-5">
              <button
                className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                title="Delete"
              >
                <Trash2 className="size-3.5" /> Delete
              </button>
            </form>
          </div>
        ))}
      </section>
    </div>
  );
}
