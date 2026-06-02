import { createClient } from "@/lib/supabase/server";
import type { BlogPost, Service, SiteSettings, Testimonial } from "@/lib/types";

/** Published services for the public site, ordered for display. */
export async function getPublishedServices(): Promise<Service[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  return (data as Service[] | null) ?? [];
}

/** Published testimonials, ordered for display. */
export async function getPublishedTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  return (data as Testimonial[] | null) ?? [];
}

/** The single site-settings row (id = 1). */
export async function getSiteSettings(): Promise<SiteSettings | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();
  return (data as SiteSettings | null) ?? null;
}

/** Published blog posts, newest first. */
export async function getPublishedPosts(): Promise<BlogPost[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  return (data as BlogPost[] | null) ?? [];
}

/** A single published post by slug, or null. */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  return (data as BlogPost | null) ?? null;
}
