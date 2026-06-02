import { track } from "@vercel/analytics";

type Gtag = (command: string, event: string, params?: Record<string, unknown>) => void;

/** Fire a lead-conversion event to GA4 (if present) and Vercel Analytics. */
export function trackLead(kind: string) {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof gtag === "function") {
    gtag("event", "generate_lead", { lead_type: kind });
  }
  try {
    track("lead", { kind });
  } catch {
    /* analytics not enabled */
  }
}
