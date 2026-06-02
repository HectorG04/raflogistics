"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { submitCarrierApplication } from "@/app/actions/carrier";
import { initialFormState } from "@/lib/forms";
import { TurnstileWidget } from "@/components/site/turnstile-widget";

const EQUIPMENT = [
  { value: "flatbed", label: "Flatbed" },
  { value: "reefer", label: "Reefer" },
  { value: "autocarrier", label: "Auto Carrier" },
  { value: "stepdeck", label: "Step Deck" },
  { value: "dryvan", label: "Dry Van" },
  { value: "power-only", label: "Power Only" },
];

const inputClass =
  "w-full rounded-md border border-black/10 bg-white px-3 py-2.5 text-sm text-brand-navy focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange";

function Err({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-red-600">{msg}</p>;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-brand-orange px-6 py-3 text-sm font-semibold text-white transition hover:brightness-95 disabled:opacity-60"
    >
      {pending ? "Submitting…" : "Submit Application"}
    </button>
  );
}

export function CarrierForm() {
  const [state, formAction] = useActionState(
    submitCarrierApplication,
    initialFormState
  );
  const formRef = useRef<HTMLFormElement>(null);
  const errs = state.fieldErrors ?? {};

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message ?? "Application received!");
      formRef.current?.reset();
    } else if (state.status === "error" && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-brand-navy">
            Legal Business Name *
          </label>
          <input name="business_name" className={inputClass} placeholder="Acme Trucking LLC" />
          <Err msg={errs.business_name} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-brand-navy">MC Number</label>
          <input name="mc_number" className={inputClass} placeholder="MC# 123456" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-brand-navy">Contact Name</label>
          <input name="contact_name" className={inputClass} placeholder="Full name" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-brand-navy">Email *</label>
          <input name="email" type="email" className={inputClass} placeholder="email@company.com" />
          <Err msg={errs.email} />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-brand-navy">Phone</label>
          <input name="phone" className={inputClass} placeholder="+1 (___) ___-____" />
        </div>
      </div>

      <div>
        <span className="mb-2 block text-sm font-medium text-brand-navy">Equipment</span>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {EQUIPMENT.map((e) => (
            <label key={e.value} className="flex items-center gap-2 text-sm text-brand-navy">
              <input type="checkbox" name="equipment" value={e.value} className="accent-brand-orange" />
              {e.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-brand-navy">Lanes you usually run</label>
        <textarea name="lanes_notes" rows={3} className={inputClass} placeholder="Tell us where you usually run…" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-brand-navy">
            Certificate of Insurance (COI)
          </label>
          <input type="file" name="coi" accept=".pdf,.jpg,.jpeg,.png" className="block w-full text-sm text-brand-navy/70 file:mr-3 file:rounded-md file:border-0 file:bg-brand-navy file:px-3 file:py-2 file:text-white" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-brand-navy">W-9</label>
          <input type="file" name="w9" accept=".pdf,.jpg,.jpeg,.png" className="block w-full text-sm text-brand-navy/70 file:mr-3 file:rounded-md file:border-0 file:bg-brand-navy file:px-3 file:py-2 file:text-white" />
        </div>
      </div>

      <TurnstileWidget />
      <SubmitButton />
    </form>
  );
}
