const SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Verify a Cloudflare Turnstile token server-side. Returns true if valid. */
export async function verifyTurnstile(
  token: string | null | undefined
): Promise<boolean> {
  if (!token) return false;

  const res = await fetch(SITEVERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: process.env.TURNSTILE_SECRET_KEY ?? "",
      response: token,
    }),
  });

  const data = (await res.json()) as { success?: boolean };
  return data?.success === true;
}
