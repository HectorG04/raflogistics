"use server";

import { carrierSchema } from "@/lib/validation/schemas";
import { fieldErrorsFromZod } from "@/lib/zod-errors";
import { verifyTurnstile } from "@/lib/turnstile";
import {
  insertCarrier,
  uploadCarrierDoc,
  type CarrierInsert,
} from "@/lib/db/leads";
import { notifyOwnerNewLead, sendCustomerConfirmation } from "@/lib/email/resend";
import type { FormState } from "@/lib/forms";

function str(formData: FormData, key: string): string {
  return (formData.get(key) as string | null)?.trim() ?? "";
}
const nn = (v: string) => (v ? v : null);

function fileOrNull(formData: FormData, key: string): File | null {
  const v = formData.get(key);
  return v instanceof File && v.size > 0 ? v : null;
}

export async function submitCarrierApplication(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  if (process.env.TURNSTILE_SECRET_KEY) {
    const ok = await verifyTurnstile(str(formData, "cf-turnstile-response"));
    if (!ok) {
      return { status: "error", message: "Verification failed. Please try again." };
    }
  }

  const raw = {
    business_name: str(formData, "business_name"),
    mc_number: str(formData, "mc_number"),
    contact_name: str(formData, "contact_name"),
    email: str(formData, "email"),
    phone: str(formData, "phone"),
    equipment: formData.getAll("equipment").map(String),
    lanes_notes: str(formData, "lanes_notes"),
    website: str(formData, "website"),
  };

  const parsed = carrierSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors: fieldErrorsFromZod(parsed.error),
    };
  }

  // Upload optional documents to the private bucket.
  let coiUrl: string | null = null;
  let w9Url: string | null = null;
  try {
    const coi = fileOrNull(formData, "coi");
    const w9 = fileOrNull(formData, "w9");
    if (coi) coiUrl = await uploadCarrierDoc(coi, "coi");
    if (w9) w9Url = await uploadCarrierDoc(w9, "w9");
  } catch {
    return {
      status: "error",
      message: "We couldn't upload your documents. Please try again.",
    };
  }

  const d = parsed.data;
  const payload: CarrierInsert = {
    business_name: d.business_name,
    mc_number: nn(d.mc_number ?? ""),
    contact_name: nn(d.contact_name ?? ""),
    email: nn(d.email),
    phone: nn(d.phone ?? ""),
    equipment: d.equipment,
    lanes_notes: nn(d.lanes_notes ?? ""),
    coi_doc_url: coiUrl,
    w9_doc_url: w9Url,
  };

  try {
    await insertCarrier(payload);
  } catch {
    return {
      status: "error",
      message: "We couldn't submit your application. Please try again or call us.",
    };
  }

  try {
    await Promise.allSettled([
      notifyOwnerNewLead("carrier", payload),
      d.email
        ? sendCustomerConfirmation("carrier", d.email, d.contact_name ?? "")
        : Promise.resolve(),
    ]);
  } catch {
    /* ignore */
  }

  return {
    status: "success",
    message: "Thanks! Your carrier application has been received.",
  };
}
