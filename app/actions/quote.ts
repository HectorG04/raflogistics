"use server";

import { quoteSchema } from "@/lib/validation/schemas";
import { fieldErrorsFromZod } from "@/lib/zod-errors";
import { verifyTurnstile } from "@/lib/turnstile";
import { insertQuote, type QuoteInsert } from "@/lib/db/leads";
import { notifyOwnerNewLead, sendCustomerConfirmation } from "@/lib/email/resend";
import type { FormState } from "@/lib/forms";

function str(formData: FormData, key: string): string {
  return (formData.get(key) as string | null)?.trim() ?? "";
}
const nn = (v: string) => (v ? v : null);

export async function submitQuote(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  // Turnstile (skipped when not configured, e.g. local dev).
  if (process.env.TURNSTILE_SECRET_KEY) {
    const ok = await verifyTurnstile(str(formData, "cf-turnstile-response"));
    if (!ok) {
      return { status: "error", message: "Verification failed. Please try again." };
    }
  }

  const operableStr = str(formData, "operable");
  const raw = {
    name: str(formData, "name"),
    email: str(formData, "email"),
    phone: str(formData, "phone"),
    pickup_zip: str(formData, "pickup_zip"),
    delivery_zip: str(formData, "delivery_zip"),
    pickup_city: str(formData, "pickup_city"),
    delivery_city: str(formData, "delivery_city"),
    vehicle_year: str(formData, "vehicle_year"),
    vehicle_make: str(formData, "vehicle_make"),
    vehicle_model: str(formData, "vehicle_model"),
    operable:
      operableStr === "yes" ? true : operableStr === "no" ? false : undefined,
    transport_type: str(formData, "transport_type") || undefined,
    ship_date: str(formData, "ship_date"),
    message: str(formData, "message"),
    website: str(formData, "website"),
  };

  const parsed = quoteSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors: fieldErrorsFromZod(parsed.error),
    };
  }

  const d = parsed.data;
  const payload: QuoteInsert = {
    name: d.name,
    email: d.email,
    phone: nn(d.phone ?? ""),
    pickup_zip: nn(d.pickup_zip ?? ""),
    delivery_zip: nn(d.delivery_zip ?? ""),
    pickup_city: nn(d.pickup_city ?? ""),
    delivery_city: nn(d.delivery_city ?? ""),
    vehicle_year: nn(d.vehicle_year ?? ""),
    vehicle_make: nn(d.vehicle_make ?? ""),
    vehicle_model: nn(d.vehicle_model ?? ""),
    operable: d.operable ?? null,
    transport_type: d.transport_type ?? null,
    ship_date: nn(d.ship_date ?? ""),
    message: nn(d.message ?? ""),
  };

  try {
    await insertQuote(payload);
  } catch {
    return {
      status: "error",
      message: "We couldn't submit your request. Please try again or call us.",
    };
  }

  // Emails are best-effort; never block a successful submission.
  try {
    await Promise.allSettled([
      notifyOwnerNewLead("quote", payload),
      sendCustomerConfirmation("quote", d.email, d.name),
    ]);
  } catch {
    /* ignore */
  }

  return {
    status: "success",
    message: "Thanks! Your quote request is in — we'll be in touch shortly.",
  };
}
