import {
  getPublishedServices,
  getPublishedTestimonials,
  getSiteSettings,
  getPublishedPosts,
  getPostBySlug,
} from "@/lib/db/content";
import type { BlogPost, Service, SiteSettings, Testimonial } from "@/lib/types";

// Defaults mirror supabase/seed.sql so the site renders fully even before the
// database is connected. Once Supabase is wired up, live data takes over.

export const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  phone: "+1 (845) 573-1488",
  email: "info@raflogisticsgroup.com",
  address: "United States",
  mc_number: "01762619",
  usdot_number: "4467308",
  whatsapp: "18455731488",
  facebook: null,
  instagram: null,
  linkedin: null,
  hero_headline: "Nationwide Auto & Freight Solutions. Safe. Fast. Reliable.",
  hero_sub:
    "We provide professional trucking and logistics solutions across the country with 100% reliability and safety.",
  updated_at: "",
};

const ts = (
  partial: Pick<Service, "slug" | "title" | "description" | "icon" | "sort_order">
): Service => ({
  id: partial.slug,
  image_url: null,
  published: true,
  created_at: "",
  updated_at: "",
  ...partial,
});

export const FALLBACK_SERVICES: Service[] = [
  ts({
    slug: "auto-transport",
    title: "Auto Transport",
    description:
      "Safe, insured nationwide vehicle shipping — open and enclosed carriers with real-time updates.",
    icon: "truck",
    sort_order: 1,
  }),
  ts({
    slug: "road-freight",
    title: "Road Freight",
    description:
      "High-quality road transportation solutions for all types of goods with real-time tracking.",
    icon: "truck",
    sort_order: 2,
  }),
  ts({
    slug: "warehousing",
    title: "Warehousing",
    description:
      "Secure and climate-controlled storage facilities for your inventory management needs.",
    icon: "warehouse",
    sort_order: 3,
  }),
  ts({
    slug: "supply-chain",
    title: "Supply Chain",
    description:
      "End-to-end supply chain optimization to improve efficiency and reduce operational costs.",
    icon: "globe",
    sort_order: 4,
  }),
];

const tm = (
  partial: Pick<Testimonial, "name" | "company" | "quote" | "sort_order">
): Testimonial => ({
  id: partial.name,
  rating: 5,
  published: true,
  created_at: "",
  updated_at: "",
  ...partial,
});

export const FALLBACK_TESTIMONIALS: Testimonial[] = [
  tm({
    name: "John Smith",
    company: "CEO, Global Trade Inc.",
    quote:
      "Raf Auto Freight has been our primary logistics partner for 3 years. Their drivers are professional, and their tracking system is the most accurate we've ever used.",
    sort_order: 1,
  }),
  tm({
    name: "Sarah Jenkins",
    company: "Operations Manager, AutoDirect",
    quote:
      "Best vehicle transport service in the US. My car arrived 2 days earlier than expected in perfect condition. Highly recommend Raf Auto for long-distance hauls.",
    sort_order: 2,
  }),
  tm({
    name: "Michael Chen",
    company: "Logistics Director, TechLogix",
    quote:
      "Reliability is hard to find in trucking, but Raf Auto Freight delivers every time. Their customer support team is available 24/7 and always helpful.",
    sort_order: 3,
  }),
];

// Safe accessors used by pages: never throw, fall back to defaults when the
// database is unavailable or empty.

export async function siteSettings(): Promise<SiteSettings> {
  try {
    return (await getSiteSettings()) ?? DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function services(): Promise<Service[]> {
  try {
    const rows = await getPublishedServices();
    return rows.length ? rows : FALLBACK_SERVICES;
  } catch {
    return FALLBACK_SERVICES;
  }
}

export async function testimonials(): Promise<Testimonial[]> {
  try {
    const rows = await getPublishedTestimonials();
    return rows.length ? rows : FALLBACK_TESTIMONIALS;
  } catch {
    return FALLBACK_TESTIMONIALS;
  }
}

export async function posts(): Promise<BlogPost[]> {
  try {
    return await getPublishedPosts();
  } catch {
    return [];
  }
}

export async function postBySlug(slug: string): Promise<BlogPost | null> {
  try {
    return await getPostBySlug(slug);
  } catch {
    return null;
  }
}
