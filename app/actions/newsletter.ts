"use server";

import { newsletterSchema } from "@/lib/validation/schemas";
import { subscribe } from "@/lib/db/leads";
import type { FormState } from "@/lib/forms";

export async function subscribeNewsletter(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = newsletterSchema.safeParse({
    email: formData.get("email"),
    website: formData.get("website") ?? "",
  });

  if (!parsed.success) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  // Honeypot tripped — pretend success, do nothing.
  if (parsed.data.website) return { status: "success" };

  try {
    await subscribe(parsed.data.email);
    return { status: "success", message: "You're subscribed — thank you!" };
  } catch {
    return { status: "error", message: "Something went wrong. Please try again." };
  }
}
