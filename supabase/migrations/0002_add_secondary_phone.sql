-- Add a secondary phone number to site settings.
alter table public.site_settings
  add column if not exists phone_secondary text;
