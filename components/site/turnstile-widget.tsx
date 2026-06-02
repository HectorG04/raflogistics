"use client";

import { Turnstile } from "@marsidev/react-turnstile";

/** Renders the Turnstile widget only when a site key is configured. */
export function TurnstileWidget() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (!siteKey) return null;
  return <Turnstile siteKey={siteKey} options={{ size: "flexible" }} className="my-3" />;
}
