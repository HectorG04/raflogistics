-- Raf Freight Logistics — initial schema, RLS, and storage buckets
-- Apply via Supabase SQL Editor or `supabase db push`.

-- =====================================================================
-- Extensions
-- =====================================================================
create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- =====================================================================
-- Lead capture tables (public INSERT only; never publicly readable)
-- =====================================================================
create table if not exists public.quote_requests (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  email          text not null,
  phone          text,
  pickup_zip     text,
  delivery_zip   text,
  pickup_city    text,
  delivery_city  text,
  vehicle_year   text,
  vehicle_make   text,
  vehicle_model  text,
  operable       boolean,
  transport_type text check (transport_type in ('open', 'enclosed')),
  ship_date      date,
  message        text,
  status         text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at     timestamptz not null default now()
);

create table if not exists public.carrier_applications (
  id            uuid primary key default gen_random_uuid(),
  business_name text not null,
  mc_number     text,
  contact_name  text,
  email         text,
  phone         text,
  equipment     text[] not null default '{}',
  lanes_notes   text,
  coi_doc_url   text,
  w9_doc_url    text,
  status        text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at    timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  created_at timestamptz not null default now()
);

-- =====================================================================
-- Editable content tables (public reads published rows; admin writes)
-- =====================================================================
create table if not exists public.services (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null,
  description text,
  icon        text,
  image_url   text,
  sort_order  int not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.testimonials (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  company    text,
  quote      text not null,
  rating     int not null default 5 check (rating between 1 and 5),
  sort_order int not null default 0,
  published  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title           text not null,
  excerpt         text,
  body            text,
  cover_image_url text,
  status          text not null default 'draft' check (status in ('draft', 'published')),
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table if not exists public.site_settings (
  id           int primary key default 1 check (id = 1),
  phone        text,
  email        text,
  address      text,
  mc_number    text,
  usdot_number text,
  whatsapp     text,
  facebook     text,
  instagram    text,
  linkedin     text,
  hero_headline text,
  hero_sub     text,
  updated_at   timestamptz not null default now()
);

-- =====================================================================
-- Row-Level Security
-- =====================================================================
alter table public.quote_requests       enable row level security;
alter table public.carrier_applications enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.services      enable row level security;
alter table public.testimonials  enable row level security;
alter table public.blog_posts    enable row level security;
alter table public.site_settings enable row level security;

-- Lead tables: anon may INSERT only (no SELECT policy => not readable by anon).
create policy "anon insert quote_requests"
  on public.quote_requests for insert to anon with check (true);
create policy "anon insert carrier_applications"
  on public.carrier_applications for insert to anon with check (true);
create policy "anon insert newsletter_subscribers"
  on public.newsletter_subscribers for insert to anon with check (true);

-- Content tables: anon may read only published rows / settings.
create policy "anon read published services"
  on public.services for select to anon using (published = true);
create policy "anon read published testimonials"
  on public.testimonials for select to anon using (published = true);
create policy "anon read published posts"
  on public.blog_posts for select to anon using (status = 'published');
create policy "anon read site_settings"
  on public.site_settings for select to anon using (true);

-- Authenticated admin: full access on every table.
do $$
declare t text;
begin
  foreach t in array array[
    'quote_requests','carrier_applications','newsletter_subscribers',
    'services','testimonials','blog_posts','site_settings'
  ] loop
    execute format(
      'create policy "admin all %1$s" on public.%1$I for all to authenticated using (true) with check (true);',
      t
    );
  end loop;
end $$;

-- =====================================================================
-- Storage buckets
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true), ('carrier-docs', 'carrier-docs', false)
on conflict (id) do nothing;

-- Public read for the media bucket; writes happen server-side (service role).
create policy "public read media"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'media');

-- carrier-docs has no anon/authenticated policy: only the service role
-- (which bypasses RLS) can write/read; the admin reads via signed URLs.
