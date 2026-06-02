# Raf Freight Logistics — Site Rebuild Design

**Date:** 2026-06-03
**Domain:** raffreightlogistics.com
**Status:** Approved design, pending spec review

## Summary

Rebuild the Raf Auto Freight Logistics marketing site from scratch as a single
Next.js application backed by Supabase, deployed on Vercel. The current site is a
static Bootstrap HTML site (6 pages) hosted on InterServer with no working
backend. The rebuild adds: persisted form submissions (quote requests + carrier
applications), a login-protected admin for content management, a blog, and email
notifications on new leads. Visual style is a modern refresh that keeps the
existing orange (`#ff4d1c`) / navy branding, logo, and photography.

## Goals

- Replace static site + dead PHP handler with a maintainable Next.js app.
- Capture quote requests and carrier applications into a database.
- Email the owner whenever a new lead arrives.
- Let the owner manage structured content (services, testimonials, blog, contact
  settings) through a login-protected admin without touching code.
- Improve SEO (SSR, metadata, schema) to help the company rank.
- Maximize lead conversion (smart quote form, click-to-call, confirmation
  emails, trust signals) and lead quality (spam protection).
- Deploy to Vercel on the existing domain.

## Non-Goals (v1 — YAGNI)

- Customer accounts / shipment tracking / load board.
- Payments or billing.
- Multi-user admin with roles/permissions (single admin user in v1).
- Fully editable page copy — hero/section static copy stays in code in v1.

## Planned for v2 (not built now)

- **Programmatic SEO route pages** — auto-generated "Car Shipping from
  [City] to [City]" pages driven by a data source. The biggest organic-lead
  lever for auto transport, but a meaningful build; deferred until the core
  site is live. The v1 schema and routing won't block it.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database / Auth / Storage | Supabase (Postgres, Auth, Storage) |
| Forms | Next.js Server Actions (server-side) |
| Email | Resend |
| Hosting | Vercel |
| Supabase client | `@supabase/ssr` (App Router server + browser clients) |
| Spam protection | Cloudflare Turnstile (invisible) on all public forms |
| Analytics | Vercel Analytics (+ optional GA4) |

Accounts: owner already has Vercel and Supabase accounts.

## Architecture

Single Next.js app serving both the public site and `/admin`. One Supabase
project provides Postgres, Auth, and Storage.

```
Visitor ──► Next.js public pages (SSR, SEO-friendly)
              │  reads published content (services, testimonials, blog, settings)
              │  submits forms ──► Server Action ──► Supabase (insert)
              │                                   └─► Resend (email owner)
Admin ──────► /admin (Supabase Auth login, protected by middleware)
              └─► manage content + view/triage leads ──► Supabase (read/write)
```

Key boundaries (each unit independently understandable/testable):

- **Data access layer** (`lib/db/*`): typed functions for reading content and
  writing leads. Consumers never touch the Supabase client directly.
- **Server Actions** (`app/**/actions.ts`): validate input, call data layer,
  trigger email. No UI logic.
- **UI components** (`components/*`): presentational; receive data as props.
- **Admin** (`app/admin/*`): gated by middleware session check; reuses the data
  layer with the authenticated client.

## Project Layout

The Next.js app is scaffolded at the repository root. Existing static
HTML/CSS is moved into `legacy/` for reference. Existing assets in `images/`
are reused (logo, photography).

```
/ (Next.js app root)
  app/
    (public)/            # marketing pages
    blog/
    admin/               # protected admin
    api/ or actions      # server actions
  components/
  lib/
    db/                  # data access
    supabase/            # server + browser clients
    email/               # Resend wrapper
  public/                # migrated images
  legacy/                # old static HTML/CSS, for reference
  supabase/              # SQL migrations / schema
  docs/superpowers/specs/
```

## Public Pages

- `/` — Home: hero, services overview, why-us, testimonials, quote form, CTA.
- `/about` — About.
- `/auto-transport` — Auto Transport service detail.
- `/freight` — Freight Services detail.
- `/carriers` — Carrier info + carrier signup form.
- `/contact` — Contact info + quote request form.
- `/blog` — Blog/news index (published posts).
- `/blog/[slug]` — Blog post detail.

Shared: reusable Quote form component (home + contact); header/footer pull
contact info (phone, email, MC# 01762619, USDOT# 4467308, social) from the
`site_settings` record.

## Data Model

Lead capture (public can INSERT only, never SELECT):

- **quote_requests** (smart multi-step quote): `id`, `name`, `email`, `phone`,
  `pickup_zip`, `delivery_zip`, `pickup_city`, `delivery_city`,
  `vehicle_year`, `vehicle_make`, `vehicle_model`, `operable` (bool),
  `transport_type` (open/enclosed), `ship_date`, `message`,
  `status` (new/contacted/closed), `created_at`.
  (A freight-style quote without vehicle details is still valid — vehicle
  fields are optional so the form serves both auto and general freight.)
- **carrier_applications**: `id`, `business_name`, `mc_number`, `contact_name`,
  `email`, `phone`, `equipment` (text[]: flatbed/reefer/autocarrier/stepdeck…),
  `lanes_notes`, `coi_doc_url`, `w9_doc_url` (private Storage paths),
  `status`, `created_at`.
- **newsletter_subscribers**: `id`, `email` (unique), `created_at`.

Editable content (admin-managed):

- **services**: `id`, `slug`, `title`, `description`, `icon`, `image_url`,
  `sort_order`, `published`, timestamps.
- **testimonials**: `id`, `name`, `company`, `quote`, `rating`, `sort_order`,
  `published`, timestamps.
- **blog_posts**: `id`, `slug` (unique), `title`, `excerpt`, `body`,
  `cover_image_url`, `status` (draft/published), `published_at`, timestamps.
- **site_settings**: single row — `phone`, `email`, `address`, `mc_number`,
  `usdot_number`, social links, optional hero copy fields.

Storage:
- `media` (public) — blog cover images and service images.
- `carrier-docs` (private) — carrier COI / W-9 uploads. Read only via
  server-generated signed URLs in the admin; never publicly listable.

## Forms & Lead Flow

Each form submits via a Server Action that:

1. Verifies a **Cloudflare Turnstile** token (server-side) plus a hidden
   honeypot field; rejects bots before any DB write.
2. Validates input server-side (zod).
3. For the carrier form, uploads attached COI/W-9 files to the private
   `carrier-docs` Storage bucket and records their paths.
4. Inserts into the appropriate Supabase table via the data layer.
5. Sends a **notification email to the owner** (Resend) with the lead details.
6. Sends an **auto-reply confirmation email to the submitter** (Resend)
   acknowledging their request.
7. Returns a success/error state to the client for inline feedback.

The quote form is a **multi-step** flow (contact → vehicle/load → route &
date) for higher completion; the carrier form is single-page with file
uploads. Replaces the old `submit_carrier.php`.

## Conversion & Trust Features

- **Sticky mobile contact bar** — a persistent bottom bar on phones with
  click-to-call and a WhatsApp button; numbers sourced from `site_settings`.
- **Trust strip** — reusable component showing MC# 01762619, USDOT# 4467308
  (with a live FMCSA SAFER lookup link), "licensed • bonded • insured," and
  Google review stars. Placed on home, contact, and carriers pages.
- **Confirmation emails** — submitters receive an instant Resend auto-reply
  (see Forms). Templates stored in `lib/email/`.
- **Analytics** — Vercel Analytics enabled by default; optional GA4 via
  `NEXT_PUBLIC_GA_ID`. Form-submission success fires a conversion event.

## Admin Panel (`/admin`)

Protected by Next.js middleware checking the Supabase session; unauthenticated
users are redirected to `/admin/login`.

- **Dashboard** — counts + most recent leads.
- **Leads** — quote requests and carrier applications; status triage
  (new/contacted/closed); search/filter; download carrier COI/W-9 via
  server-generated signed URLs; CSV export.
- **Blog** — list/create/edit/publish posts; cover image upload to Storage.
- **Services / Testimonials** — edit fields, toggle published, reorder.
- **Settings** — contact info, MC/DOT numbers, social links.

UI built with shadcn/ui (tables, forms, dialogs).

## Security (Row-Level Security)

RLS enabled on all tables.

- **Anon (public):**
  - `INSERT` allowed on `quote_requests`, `carrier_applications`,
    `newsletter_subscribers`.
  - `SELECT` allowed only on published rows of `services`, `testimonials`,
    `blog_posts` (status = published), and on `site_settings`.
  - No `SELECT` on lead tables.
- **Authenticated (admin):** full read on leads; read/write on all content.
- **Storage:** `media` bucket is public-read; `carrier-docs` is private —
  uploads happen server-side with the service role, and the admin reads them
  only through short-lived signed URLs.
- Service-role key used only in server-side code (Server Actions / route
  handlers); never exposed to the browser.

## SEO & Branding

- Per-page `metadata` (title/description) + OpenGraph/Twitter cards.
- `sitemap.xml` and `robots.txt`.
- JSON-LD `Organization` / `LocalBusiness` schema including MC#/USDOT#.
- Orange (`#ff4d1c`) / navy palette and existing logo/photography carried over,
  modernized.

## Deployment

- Git repo initialized at root; linked to a Vercel project.
- Environment variables on Vercel:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (server-only)
  - `RESEND_API_KEY`
  - `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`
  - `NEXT_PUBLIC_GA_ID` (optional)
- Domain `raffreightlogistics.com` pointed at Vercel (DNS records / nameservers).
- Owner provides keys and performs the Supabase project setup steps when needed.

## Build Order

1. Scaffold Next.js + Tailwind + shadcn; base layout, branding, header/footer,
   sticky mobile call/WhatsApp bar, trust strip.
2. Supabase schema + RLS policies + Storage buckets + seed data; data layer.
3. Public pages reading content from Supabase.
4. Forms → Server Actions → Supabase: multi-step quote form, carrier form with
   doc uploads, Turnstile + honeypot, Resend owner notification + customer
   auto-reply.
5. Blog (public pages + admin editor + image upload).
6. Admin auth + content management screens (incl. lead triage, signed-URL doc
   download, CSV export).
7. SEO + analytics + polish (metadata, schema, sitemap, Vercel Analytics/GA4,
   accessibility).
8. Deploy to Vercel + connect domain.

## Testing Strategy

- **Data layer & Server Actions:** unit tests (validation, insert mapping,
  Turnstile verification, file-upload path handling, owner + auto-reply
  email-trigger logic with Resend mocked).
- **RLS policies:** verify anon cannot read leads and can only read published
  content (integration check against a local/staging Supabase).
- **Pages/forms:** manual + lightweight Playwright happy-path (submit quote,
  submit carrier app, admin login, publish post).
- Marketing-site focus: heaviest coverage on the data/submission path, not
  pixel-level UI.

## Open Items / Owner Actions

- Provide Supabase project URL + anon key + service-role key.
- Provide Resend API key and a verified sender domain/address (used for both
  owner notifications and customer auto-replies).
- Create a Cloudflare Turnstile widget and provide site + secret keys.
- Provide WhatsApp number and confirm the click-to-call number.
- (Optional) Provide a GA4 measurement ID.
- Confirm DNS access for `raffreightlogistics.com` to point at Vercel.
- Confirm the admin email to seed as the single admin user.
