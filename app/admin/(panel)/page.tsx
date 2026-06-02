import Link from "next/link";
import { Inbox, Truck, Newspaper, FileText } from "lucide-react";
import { listQuotes, listCarriers } from "@/lib/db/leads";
import { listAllPosts } from "@/lib/db/admin-content";

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-xl border border-black/5 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-brand-navy/60">{label}</span>
        <Icon className="size-5 text-brand-orange" />
      </div>
      <p className="mt-2 font-heading text-3xl font-bold text-brand-navy">{value}</p>
    </div>
  );
}

export default async function AdminDashboard() {
  const [quotes, carriers, posts] = await Promise.all([
    listQuotes().catch(() => []),
    listCarriers().catch(() => []),
    listAllPosts().catch(() => []),
  ]);

  const newQuotes = quotes.filter((q) => q.status === "new").length;
  const recent = quotes.slice(0, 6);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-brand-navy">Dashboard</h1>
      <p className="mt-1 text-sm text-brand-navy/60">Overview of leads and content.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="New Quotes" value={newQuotes} icon={Inbox} />
        <StatCard label="Total Quotes" value={quotes.length} icon={FileText} />
        <StatCard label="Carrier Apps" value={carriers.length} icon={Truck} />
        <StatCard label="Blog Posts" value={posts.length} icon={Newspaper} />
      </div>

      <div className="mt-8 rounded-xl border border-black/5 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-brand-navy">
            Recent Quote Requests
          </h2>
          <Link href="/admin/leads" className="text-sm font-semibold text-brand-orange hover:underline">
            View all →
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-sm text-brand-navy/50">No quote requests yet.</p>
        ) : (
          <ul className="divide-y divide-black/5">
            {recent.map((q) => (
              <li key={q.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <span className="font-medium text-brand-navy">{q.name}</span>
                  <span className="ml-2 text-brand-navy/50">{q.email}</span>
                </div>
                <span className="rounded-full bg-brand-orange/10 px-2.5 py-0.5 text-xs font-medium capitalize text-brand-orange">
                  {q.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
