import { createAdminClient } from "@/lib/supabase/admin";
import type { BlogPost, Service, SiteSettings, Testimonial } from "@/lib/types";

const now = () => new Date().toISOString();

// ---- Services ----
export async function listServices(): Promise<Service[]> {
  const s = createAdminClient();
  const { data } = await s.from("services").select("*").order("sort_order");
  return (data as Service[] | null) ?? [];
}

export async function upsertService(input: Partial<Service>): Promise<void> {
  const s = createAdminClient();
  if (input.id) {
    const { error } = await s
      .from("services")
      .update({ ...input, updated_at: now() })
      .eq("id", input.id);
    if (error) throw error;
  } else {
    const { error } = await s.from("services").insert(input);
    if (error) throw error;
  }
}

export async function deleteService(id: string): Promise<void> {
  const s = createAdminClient();
  const { error } = await s.from("services").delete().eq("id", id);
  if (error) throw error;
}

// ---- Testimonials ----
export async function listTestimonials(): Promise<Testimonial[]> {
  const s = createAdminClient();
  const { data } = await s.from("testimonials").select("*").order("sort_order");
  return (data as Testimonial[] | null) ?? [];
}

export async function upsertTestimonial(
  input: Partial<Testimonial>
): Promise<void> {
  const s = createAdminClient();
  if (input.id) {
    const { error } = await s
      .from("testimonials")
      .update({ ...input, updated_at: now() })
      .eq("id", input.id);
    if (error) throw error;
  } else {
    const { error } = await s.from("testimonials").insert(input);
    if (error) throw error;
  }
}

export async function deleteTestimonial(id: string): Promise<void> {
  const s = createAdminClient();
  const { error } = await s.from("testimonials").delete().eq("id", id);
  if (error) throw error;
}

// ---- Blog posts ----
export async function listAllPosts(): Promise<BlogPost[]> {
  const s = createAdminClient();
  const { data } = await s
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as BlogPost[] | null) ?? [];
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  const s = createAdminClient();
  const { data } = await s.from("blog_posts").select("*").eq("id", id).single();
  return (data as BlogPost | null) ?? null;
}

export async function upsertPost(input: Partial<BlogPost>): Promise<void> {
  const s = createAdminClient();
  if (input.id) {
    const { error } = await s
      .from("blog_posts")
      .update({ ...input, updated_at: now() })
      .eq("id", input.id);
    if (error) throw error;
  } else {
    const { error } = await s.from("blog_posts").insert(input);
    if (error) throw error;
  }
}

export async function deletePost(id: string): Promise<void> {
  const s = createAdminClient();
  const { error } = await s.from("blog_posts").delete().eq("id", id);
  if (error) throw error;
}

// ---- Settings ----
export async function getSettingsRow(): Promise<SiteSettings | null> {
  const s = createAdminClient();
  const { data } = await s.from("site_settings").select("*").eq("id", 1).single();
  return (data as SiteSettings | null) ?? null;
}

export async function updateSettings(
  input: Partial<SiteSettings>
): Promise<void> {
  const s = createAdminClient();
  const { error } = await s
    .from("site_settings")
    .upsert({ ...input, id: 1, updated_at: now() });
  if (error) throw error;
}

// ---- Media upload (public bucket) ----
export async function uploadMedia(file: File): Promise<string> {
  const s = createAdminClient();
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await s.storage
    .from("media")
    .upload(path, file, { contentType: file.type || undefined });
  if (error) throw error;
  return s.storage.from("media").getPublicUrl(path).data.publicUrl;
}
