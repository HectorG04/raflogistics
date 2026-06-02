"use client";

import { useMemo, useState, useTransition } from "react";
import { Download, FileDown } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  updateLeadStatusAction,
  getCarrierDocUrlAction,
} from "@/app/admin/actions";
import type {
  CarrierApplication,
  LeadStatus,
  QuoteRequest,
} from "@/lib/types";

const STATUSES: LeadStatus[] = ["new", "contacted", "closed"];
type LeadTable = "quote_requests" | "carrier_applications";

function StatusSelect({
  table,
  id,
  value,
}: {
  table: LeadTable;
  id: string;
  value: LeadStatus;
}) {
  const [val, setVal] = useState<LeadStatus>(value);
  const [pending, start] = useTransition();
  return (
    <select
      value={val}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value as LeadStatus;
        setVal(next);
        start(() => updateLeadStatusAction(table, id, next));
      }}
      className="rounded-md border border-black/10 px-2 py-1 text-xs capitalize focus:border-brand-orange focus:outline-none"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}

function downloadCsv(filename: string, rows: Record<string, unknown>[]) {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

async function openDoc(path: string) {
  const url = await getCarrierDocUrlAction(path);
  if (url) window.open(url, "_blank");
}

export function LeadsTable({
  quotes,
  carriers,
}: {
  quotes: QuoteRequest[];
  carriers: CarrierApplication[];
}) {
  const [q, setQ] = useState("");
  const term = q.toLowerCase();

  const filteredQuotes = useMemo(
    () =>
      quotes.filter(
        (x) =>
          x.name.toLowerCase().includes(term) ||
          x.email.toLowerCase().includes(term)
      ),
    [quotes, term]
  );
  const filteredCarriers = useMemo(
    () =>
      carriers.filter(
        (x) =>
          x.business_name.toLowerCase().includes(term) ||
          (x.email ?? "").toLowerCase().includes(term)
      ),
    [carriers, term]
  );

  return (
    <Tabs defaultValue="quotes">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <TabsList>
          <TabsTrigger value="quotes">Quotes ({quotes.length})</TabsTrigger>
          <TabsTrigger value="carriers">Carriers ({carriers.length})</TabsTrigger>
        </TabsList>
        <input
          placeholder="Search name or email…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="rounded-md border border-black/10 px-3 py-1.5 text-sm focus:border-brand-orange focus:outline-none"
        />
      </div>

      <TabsContent value="quotes">
        <div className="mb-3 flex justify-end">
          <button
            onClick={() => downloadCsv("quotes.csv", filteredQuotes as unknown as Record<string, unknown>[])}
            className="inline-flex items-center gap-1.5 rounded-md border border-black/10 px-3 py-1.5 text-xs font-medium text-brand-navy hover:bg-neutral-50"
          >
            <FileDown className="size-3.5" /> Export CSV
          </button>
        </div>
        <div className="overflow-x-auto rounded-xl border border-black/5 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-xs uppercase text-brand-navy/50">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Route</th>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filteredQuotes.map((x) => (
                <tr key={x.id}>
                  <td className="px-4 py-3 font-medium text-brand-navy">{x.name}</td>
                  <td className="px-4 py-3 text-brand-navy/70">
                    <div>{x.email}</div>
                    <div className="text-xs text-brand-navy/50">{x.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-brand-navy/70">
                    {[x.pickup_zip, x.delivery_zip].filter(Boolean).join(" → ") || "—"}
                  </td>
                  <td className="px-4 py-3 text-brand-navy/70">
                    {[x.vehicle_year, x.vehicle_make, x.vehicle_model]
                      .filter(Boolean)
                      .join(" ") || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusSelect table="quote_requests" id={x.id} value={x.status} />
                  </td>
                </tr>
              ))}
              {filteredQuotes.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-brand-navy/50">
                    No quotes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </TabsContent>

      <TabsContent value="carriers">
        <div className="mb-3 flex justify-end">
          <button
            onClick={() => downloadCsv("carriers.csv", filteredCarriers as unknown as Record<string, unknown>[])}
            className="inline-flex items-center gap-1.5 rounded-md border border-black/10 px-3 py-1.5 text-xs font-medium text-brand-navy hover:bg-neutral-50"
          >
            <FileDown className="size-3.5" /> Export CSV
          </button>
        </div>
        <div className="overflow-x-auto rounded-xl border border-black/5 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-xs uppercase text-brand-navy/50">
              <tr>
                <th className="px-4 py-3">Business</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Equipment</th>
                <th className="px-4 py-3">Docs</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filteredCarriers.map((x) => (
                <tr key={x.id}>
                  <td className="px-4 py-3 font-medium text-brand-navy">
                    {x.business_name}
                    {x.mc_number && (
                      <div className="text-xs text-brand-navy/50">MC {x.mc_number}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-brand-navy/70">
                    <div>{x.email}</div>
                    <div className="text-xs text-brand-navy/50">{x.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-brand-navy/70">
                    {x.equipment?.length ? x.equipment.join(", ") : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {x.coi_doc_url && (
                        <button
                          onClick={() => openDoc(x.coi_doc_url!)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-brand-orange hover:underline"
                        >
                          <Download className="size-3" /> COI
                        </button>
                      )}
                      {x.w9_doc_url && (
                        <button
                          onClick={() => openDoc(x.w9_doc_url!)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-brand-orange hover:underline"
                        >
                          <Download className="size-3" /> W-9
                        </button>
                      )}
                      {!x.coi_doc_url && !x.w9_doc_url && (
                        <span className="text-xs text-brand-navy/40">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusSelect
                      table="carrier_applications"
                      id={x.id}
                      value={x.status}
                    />
                  </td>
                </tr>
              ))}
              {filteredCarriers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-brand-navy/50">
                    No carrier applications.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </TabsContent>
    </Tabs>
  );
}
