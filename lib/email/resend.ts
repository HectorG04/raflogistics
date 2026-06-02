import { Resend } from "resend";
import {
  customerConfirmationEmail,
  ownerLeadEmail,
  type LeadKind,
} from "./templates";

let client: Resend | null = null;
function getClient(): Resend {
  if (!client) client = new Resend(process.env.RESEND_API_KEY);
  return client;
}

function fromAddress(): string {
  return (
    process.env.RESEND_FROM ??
    "Raf Auto Freight <noreply@raffreightlogistics.com>"
  );
}

/** Email the owner that a new lead has arrived. */
export async function notifyOwnerNewLead(
  kind: LeadKind,
  data: Record<string, unknown>
): Promise<void> {
  const { subject, html } = ownerLeadEmail(kind, data);
  await getClient().emails.send({
    from: fromAddress(),
    to: process.env.OWNER_NOTIFY_EMAIL ?? "",
    subject,
    html,
  });
}

/** Send the submitter a confirmation/auto-reply. */
export async function sendCustomerConfirmation(
  kind: LeadKind,
  to: string,
  name: string
): Promise<void> {
  const { subject, html } = customerConfirmationEmail(kind, name);
  await getClient().emails.send({ from: fromAddress(), to, subject, html });
}
