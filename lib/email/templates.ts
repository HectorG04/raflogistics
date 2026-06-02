export type LeadKind = "quote" | "carrier";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Owner notification email for a new lead. */
export function ownerLeadEmail(
  kind: LeadKind,
  data: Record<string, unknown>
): { subject: string; html: string } {
  const title =
    kind === "carrier" ? "New Carrier Application" : "New Quote Request";

  const rows = Object.entries(data)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => {
      const value = Array.isArray(v) ? v.join(", ") : String(v);
      return `<tr><td style="padding:4px 12px 4px 0;font-weight:600;text-transform:capitalize">${k.replace(
        /_/g,
        " "
      )}</td><td style="padding:4px 0">${escapeHtml(value)}</td></tr>`;
    })
    .join("");

  const html = `
    <div style="font-family:Arial,sans-serif;color:#0c1f3f">
      <h2 style="color:#ff4d1c">${title}</h2>
      <table style="border-collapse:collapse">${rows}</table>
    </div>`;

  return { subject: `${title} — Raf Auto Freight`, html };
}

/** Confirmation email sent to the person who submitted the form. */
export function customerConfirmationEmail(
  kind: LeadKind,
  name: string
): { subject: string; html: string } {
  const what = kind === "carrier" ? "carrier application" : "quote request";
  const safeName = escapeHtml(name || "there");

  const html = `
    <div style="font-family:Arial,sans-serif;color:#0c1f3f">
      <h2 style="color:#ff4d1c">Thanks, ${safeName}!</h2>
      <p>We received your ${what} and a member of our team will reach out shortly.</p>
      <p>For anything urgent, call us at <strong>+1 (845) 573-1488</strong>.</p>
      <p style="margin-top:24px">— Raf Auto Freight Logistics</p>
    </div>`;

  return { subject: `We received your ${what} — Raf Auto Freight`, html };
}
