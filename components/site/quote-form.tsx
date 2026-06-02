"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { submitQuote } from "@/app/actions/quote";
import { initialFormState } from "@/lib/forms";
import { TurnstileWidget } from "@/components/site/turnstile-widget";
import { cn } from "@/lib/utils";

const STEPS = ["Contact", "Vehicle / Load", "Route & Date"];

function Err({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-red-600">{msg}</p>;
}

const inputClass =
  "w-full rounded-md border border-black/10 bg-white px-3 py-2.5 text-sm text-brand-navy focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-brand-orange px-6 py-2.5 text-sm font-semibold text-white transition hover:brightness-95 disabled:opacity-60"
    >
      {pending ? "Submitting…" : "Get My Quote"}
    </button>
  );
}

export function QuoteForm({ compact = false }: { compact?: boolean }) {
  const [state, formAction] = useActionState(submitQuote, initialFormState);
  const [step, setStep] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const errs = state.fieldErrors ?? {};

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message ?? "Request received!");
      formRef.current?.reset();
      setStep(0);
    } else if (state.status === "error" && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      {/* honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      {/* Stepper */}
      <div className="flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                i <= step ? "bg-brand-orange text-white" : "bg-black/10 text-brand-navy/60"
              )}
            >
              {i + 1}
            </span>
            {!compact && (
              <span className="hidden text-xs font-medium text-brand-navy/70 sm:block">
                {label}
              </span>
            )}
            {i < STEPS.length - 1 && <span className="h-px flex-1 bg-black/10" />}
          </div>
        ))}
      </div>

      {/* Step 1 */}
      <div className={cn("space-y-3", step !== 0 && "hidden")}>
        <div>
          <input name="name" placeholder="Full Name" className={inputClass} />
          <Err msg={errs.name} />
        </div>
        <div>
          <input name="email" type="email" placeholder="Email Address" className={inputClass} />
          <Err msg={errs.email} />
        </div>
        <div>
          <input name="phone" placeholder="Phone Number" className={inputClass} />
          <Err msg={errs.phone} />
        </div>
      </div>

      {/* Step 2 */}
      <div className={cn("space-y-3", step !== 1 && "hidden")}>
        <div className="grid grid-cols-3 gap-2">
          <input name="vehicle_year" placeholder="Year" className={inputClass} />
          <input name="vehicle_make" placeholder="Make" className={inputClass} />
          <input name="vehicle_model" placeholder="Model" className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <select name="transport_type" defaultValue="" className={inputClass}>
            <option value="">Transport type…</option>
            <option value="open">Open carrier</option>
            <option value="enclosed">Enclosed carrier</option>
          </select>
          <select name="operable" defaultValue="" className={inputClass}>
            <option value="">Is it operable?</option>
            <option value="yes">Running / operable</option>
            <option value="no">Not running</option>
          </select>
        </div>
        <p className="text-xs text-brand-navy/50">
          Shipping general freight instead of a vehicle? Leave these blank and add
          details on the next step.
        </p>
      </div>

      {/* Step 3 */}
      <div className={cn("space-y-3", step !== 2 && "hidden")}>
        <div className="grid grid-cols-2 gap-2">
          <input name="pickup_zip" placeholder="Pickup ZIP" className={inputClass} />
          <input name="delivery_zip" placeholder="Delivery ZIP" className={inputClass} />
        </div>
        <input name="ship_date" type="date" className={inputClass} />
        <textarea
          name="message"
          rows={3}
          placeholder="Anything else we should know? (load details, timing…)"
          className={inputClass}
        />
        <TurnstileWidget />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className={cn(
            "rounded-md border border-black/10 px-5 py-2.5 text-sm font-semibold text-brand-navy",
            step === 0 && "invisible"
          )}
        >
          Back
        </button>
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
            className="rounded-md bg-brand-navy px-6 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Next
          </button>
        ) : (
          <SubmitButton />
        )}
      </div>
    </form>
  );
}
