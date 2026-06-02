import { listQuotes, listCarriers } from "@/lib/db/leads";
import { LeadsTable } from "@/components/admin/leads-table";

export default async function AdminLeadsPage() {
  const [quotes, carriers] = await Promise.all([
    listQuotes().catch(() => []),
    listCarriers().catch(() => []),
  ]);

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold text-brand-navy">Leads</h1>
      <LeadsTable quotes={quotes} carriers={carriers} />
    </div>
  );
}
