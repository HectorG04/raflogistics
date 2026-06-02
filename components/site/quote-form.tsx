"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  Truck,
  Settings2,
  MapPin,
  Calendar,
  MessageSquare,
  Lock,
  ChevronDown,
  ArrowRight,
  Check,
} from "lucide-react";
import { submitQuote } from "@/app/actions/quote";
import { initialFormState } from "@/lib/forms";
import { trackLead } from "@/lib/analytics";
import { TurnstileWidget } from "@/components/site/turnstile-widget";
import { cn } from "@/lib/utils";

const STEPS = ["Contact", "Vehicle / Load", "Route & Date"];

const fieldBase =
  "w-full rounded-lg border border-black/10 bg-neutral-50 px-3 py-2.5 text-sm text-brand-navy placeholder:text-brand-navy/40 transition focus:border-brand-orange focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/20";

type Icon = React.ComponentType<{ className?: string }>;

function Err({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-red-600">{msg}</p>;
}

function IconInput({
  icon: Icon,
  error,
  ...props
}: { icon: Icon; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <div className="group relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-brand-navy/35 transition-colors group-focus-within:text-brand-orange" />
        <input {...props} className={cn(fieldBase, "pl-9")} />
      </div>
      <Err msg={error} />
    </div>
  );
}

function IconSelect({
  icon: Icon,
  children,
  ...props
}: { icon: Icon } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="group relative">
      <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-brand-navy/35 transition-colors group-focus-within:text-brand-orange" />
      <select {...props} className={cn(fieldBase, "appearance-none pl-9 pr-9")}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-brand-navy/35" />
    </div>
  );
}

function Stepper({ step, compact }: { step: number; compact: boolean }) {
  return (
    <div className="flex items-center">
      {STEPS.map((label, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
                  done || active
                    ? "bg-brand-orange text-white"
                    : "bg-black/10 text-brand-navy/50"
                )}
              >
                {done ? <Check className="size-4" /> : i + 1}
              </span>
              {!compact && (
                <span
                  className={cn(
                    "text-xs font-medium transition-colors",
                    active ? "text-brand-navy" : "text-brand-navy/45"
                  )}
                >
                  {label}
                </span>
              )}
            </div>
            {i < STEPS.length - 1 && (
              <span className="mx-2 h-0.5 flex-1 overflow-hidden rounded bg-black/10">
                <span
                  className={cn(
                    "block h-full bg-brand-orange transition-all duration-300",
                    done ? "w-full" : "w-0"
                  )}
                />
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-brand-orange px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-orange/25 transition hover:brightness-95 disabled:opacity-60"
    >
      {pending ? "Submitting…" : "Get My Quote"}
      {!pending && <ArrowRight className="size-4" />}
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
      trackLead("quote");
      formRef.current?.reset();
      setStep(0);
    } else if (state.status === "error" && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      {/* honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <Stepper step={step} compact={compact} />

      {/* Step 1 */}
      <div className={cn("space-y-3", step !== 0 && "hidden")}>
        <IconInput icon={User} name="name" placeholder="Full Name" error={errs.name} />
        <IconInput icon={Mail} type="email" name="email" placeholder="Email Address" error={errs.email} />
        <IconInput icon={Phone} name="phone" placeholder="Phone Number" error={errs.phone} />
      </div>

      {/* Step 2 */}
      <div className={cn("space-y-3", step !== 1 && "hidden")}>
        <p className="text-xs font-medium uppercase tracking-wide text-brand-navy/45">
          Vehicle details (optional for general freight)
        </p>
        <div className="grid grid-cols-3 gap-2">
          <input name="vehicle_year" placeholder="Year" className={fieldBase} />
          <input name="vehicle_make" placeholder="Make" className={fieldBase} />
          <input name="vehicle_model" placeholder="Model" className={fieldBase} />
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <IconSelect icon={Truck} name="transport_type" defaultValue="">
            <option value="">Transport type…</option>
            <option value="open">Open carrier</option>
            <option value="enclosed">Enclosed carrier</option>
          </IconSelect>
          <IconSelect icon={Settings2} name="operable" defaultValue="">
            <option value="">Is it operable?</option>
            <option value="yes">Running / operable</option>
            <option value="no">Not running</option>
          </IconSelect>
        </div>
      </div>

      {/* Step 3 */}
      <div className={cn("space-y-3", step !== 2 && "hidden")}>
        <div className="grid grid-cols-2 gap-2">
          <IconInput icon={MapPin} name="pickup_zip" placeholder="Pickup ZIP" />
          <IconInput icon={MapPin} name="delivery_zip" placeholder="Delivery ZIP" />
        </div>
        <IconInput icon={Calendar} type="date" name="ship_date" />
        <div className="group relative">
          <MessageSquare className="pointer-events-none absolute left-3 top-3 size-4 text-brand-navy/35 transition-colors group-focus-within:text-brand-orange" />
          <textarea
            name="message"
            rows={3}
            placeholder="Anything else we should know? (load details, timing…)"
            className={cn(fieldBase, "pl-9")}
          />
        </div>
        <TurnstileWidget />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className={cn(
            "cursor-pointer rounded-lg border border-black/10 px-5 py-2.5 text-sm font-semibold text-brand-navy transition hover:bg-neutral-50",
            step === 0 && "invisible"
          )}
        >
          Back
        </button>
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-brand-navy px-6 py-2.5 text-sm font-semibold text-white transition hover:brightness-125"
          >
            Next <ArrowRight className="size-4" />
          </button>
        ) : (
          <SubmitButton />
        )}
      </div>

      <div className="flex items-center justify-center gap-1.5 border-t border-black/5 pt-3 text-xs text-brand-navy/45">
        <Lock className="size-3.5 text-emerald-600" />
        Your information is secure &amp; confidential
      </div>
    </form>
  );
}
