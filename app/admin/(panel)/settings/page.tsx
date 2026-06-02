import { getSettingsRow } from "@/lib/db/admin-content";
import { DEFAULT_SETTINGS } from "@/lib/site-content";
import { saveSettings } from "@/app/admin/actions";

const input =
  "w-full rounded-md border border-black/10 px-3 py-2 text-sm focus:border-brand-orange focus:outline-none";

function Field({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-brand-navy/70">{label}</label>
      <input name={name} defaultValue={defaultValue ?? ""} className={input} />
    </div>
  );
}

export default async function AdminSettingsPage() {
  const s = (await getSettingsRow().catch(() => null)) ?? DEFAULT_SETTINGS;

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 font-heading text-2xl font-bold text-brand-navy">
        Site Settings
      </h1>

      <form action={saveSettings} className="space-y-6">
        <section className="rounded-xl border border-black/5 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-navy/50">
            Contact
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Phone (business)" name="phone" defaultValue={s.phone} />
            <Field label="Phone (secondary)" name="phone_secondary" defaultValue={s.phone_secondary} />
            <Field label="Email" name="email" defaultValue={s.email} />
            <Field label="WhatsApp (digits only)" name="whatsapp" defaultValue={s.whatsapp} />
            <Field label="Address" name="address" defaultValue={s.address} />
            <Field label="MC Number" name="mc_number" defaultValue={s.mc_number} />
            <Field label="USDOT Number" name="usdot_number" defaultValue={s.usdot_number} />
          </div>
        </section>

        <section className="rounded-xl border border-black/5 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-navy/50">
            Social
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Facebook URL" name="facebook" defaultValue={s.facebook} />
            <Field label="Instagram URL" name="instagram" defaultValue={s.instagram} />
            <Field label="LinkedIn URL" name="linkedin" defaultValue={s.linkedin} />
          </div>
        </section>

        <section className="rounded-xl border border-black/5 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-navy/50">
            Homepage Hero
          </h2>
          <div className="space-y-4">
            <Field label="Headline" name="hero_headline" defaultValue={s.hero_headline} />
            <div>
              <label className="mb-1 block text-xs font-medium text-brand-navy/70">
                Subheading
              </label>
              <textarea
                name="hero_sub"
                defaultValue={s.hero_sub ?? ""}
                rows={2}
                className={input}
              />
            </div>
          </div>
        </section>

        <button className="rounded-md bg-brand-orange px-6 py-2.5 text-sm font-semibold text-white hover:brightness-95">
          Save Settings
        </button>
      </form>
    </div>
  );
}
