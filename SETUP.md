# Setup Guide — Raf Freight Logistics

Steps the site owner performs. Claude Code does the rest. Work top-to-bottom.

## 1. Supabase

1. Open your Supabase project → **Project Settings → API**. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key (secret) → `SUPABASE_SERVICE_ROLE_KEY`
2. Open **SQL Editor**, paste the contents of `supabase/migrations/0001_init.sql`, run it.
3. Paste the contents of `supabase/seed.sql`, run it.
4. Confirm under **Storage** that two buckets exist: `media` (public) and
   `carrier-docs` (private). The migration creates them; if not, create them.
5. **Authentication → Users → Add user**: create the single admin login
   (your email + a strong password). This is how you'll sign into `/admin`.
6. **Authentication → URL Configuration**: add `http://localhost:3000` (dev)
   and later `https://raffreightlogistics.com` to allowed redirect URLs.

## 2. Resend (email notifications)

1. Create an API key at resend.com → `RESEND_API_KEY`.
2. Verify a sending domain (e.g. `raffreightlogistics.com`) so emails come
   from `noreply@raffreightlogistics.com` → set `RESEND_FROM`.
   (Until the domain is verified you can use Resend's `onboarding@resend.dev`.)
3. Set `OWNER_NOTIFY_EMAIL` to where new-lead alerts should go
   (default: `info@raflogisticsgroup.com`).

## 3. Cloudflare Turnstile (spam protection)

1. Cloudflare dashboard → **Turnstile** → add a site for
   `raffreightlogistics.com` (and `localhost` for testing).
2. Copy **Site Key** → `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and
   **Secret Key** → `TURNSTILE_SECRET_KEY`.

## 4. Local environment file

Copy `.env.example` to `.env.local` and fill in every value from above:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
RESEND_API_KEY=...
RESEND_FROM="Raf Auto Freight <noreply@raffreightlogistics.com>"
OWNER_NOTIFY_EMAIL=info@raflogisticsgroup.com
NEXT_PUBLIC_TURNSTILE_SITE_KEY=...
TURNSTILE_SECRET_KEY=...
NEXT_PUBLIC_GA_ID=          # optional
NEXT_PUBLIC_SITE_URL=https://raffreightlogistics.com
```

## 5. Contact details to confirm

- Click-to-call number (default `+1 (845) 573-1488`)
- WhatsApp number (digits only, e.g. `18455731488`)
- GA4 Measurement ID (optional, format `G-XXXXXXX`)

## 6. Vercel (done at deploy time, Phase 8)

- Import the GitHub repo into your Vercel project.
- Add all the env vars above under **Settings → Environment Variables**
  (Production + Preview).
- Point `raffreightlogistics.com` DNS at Vercel.
