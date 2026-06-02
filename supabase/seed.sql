-- Raf Freight Logistics — seed data (idempotent). Run after 0001_init.sql.

-- Site settings (single row, id = 1)
insert into public.site_settings (id, phone, email, address, mc_number, usdot_number, whatsapp, hero_headline, hero_sub)
values (
  1,
  '+1 (845) 573-1488',
  'info@raflogisticsgroup.com',
  'United States',
  '01762619',
  '4467308',
  '18455731488',
  'Nationwide Auto & Freight Solutions. Safe. Fast. Reliable.',
  'We provide professional trucking and logistics solutions across the country with 100% reliability and safety.'
)
on conflict (id) do update set
  phone = excluded.phone,
  email = excluded.email,
  mc_number = excluded.mc_number,
  usdot_number = excluded.usdot_number,
  whatsapp = excluded.whatsapp,
  hero_headline = excluded.hero_headline,
  hero_sub = excluded.hero_sub,
  updated_at = now();

-- Services
insert into public.services (slug, title, description, icon, sort_order, published) values
  ('auto-transport', 'Auto Transport', 'Safe, insured nationwide vehicle shipping — open and enclosed carriers with real-time updates.', 'truck', 1, true),
  ('road-freight',   'Road Freight',   'High-quality road transportation solutions for all types of goods with real-time tracking.', 'truck-moving', 2, true),
  ('warehousing',    'Warehousing',    'Secure and climate-controlled storage facilities for your inventory management needs.', 'boxes-packing', 3, true),
  ('supply-chain',   'Supply Chain',   'End-to-end supply chain optimization to improve efficiency and reduce operational costs.', 'globe', 4, true)
on conflict (slug) do nothing;

-- Testimonials
insert into public.testimonials (name, company, quote, rating, sort_order, published) values
  ('John Smith',   'CEO, Global Trade Inc.',           'Raf Auto Freight has been our primary logistics partner for 3 years. Their drivers are professional, and their tracking system is the most accurate we''ve ever used.', 5, 1, true),
  ('Sarah Jenkins','Operations Manager, AutoDirect',   'Best vehicle transport service in the US. My car arrived 2 days earlier than expected in perfect condition. Highly recommend Raf Auto for long-distance hauls.', 5, 2, true),
  ('Michael Chen', 'Logistics Director, TechLogix',    'Reliability is hard to find in trucking, but Raf Auto Freight delivers every time. Their customer support team is available 24/7 and always helpful.', 5, 3, true)
on conflict do nothing;
