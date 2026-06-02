// Database row types — mirror supabase/migrations/0001_init.sql

export type LeadStatus = "new" | "contacted" | "closed";
export type TransportType = "open" | "enclosed";
export type PostStatus = "draft" | "published";

export interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  pickup_zip: string | null;
  delivery_zip: string | null;
  pickup_city: string | null;
  delivery_city: string | null;
  vehicle_year: string | null;
  vehicle_make: string | null;
  vehicle_model: string | null;
  operable: boolean | null;
  transport_type: TransportType | null;
  ship_date: string | null;
  message: string | null;
  status: LeadStatus;
  created_at: string;
}

export interface CarrierApplication {
  id: string;
  business_name: string;
  mc_number: string | null;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  equipment: string[];
  lanes_notes: string | null;
  coi_doc_url: string | null;
  w9_doc_url: string | null;
  status: LeadStatus;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  created_at: string;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icon: string | null;
  image_url: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  company: string | null;
  quote: string;
  rating: number;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  cover_image_url: string | null;
  status: PostStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: number;
  phone: string | null;
  email: string | null;
  address: string | null;
  mc_number: string | null;
  usdot_number: string | null;
  whatsapp: string | null;
  facebook: string | null;
  instagram: string | null;
  linkedin: string | null;
  hero_headline: string | null;
  hero_sub: string | null;
  updated_at: string;
}
