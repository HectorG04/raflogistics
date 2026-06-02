"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as content from "@/lib/db/admin-content";
import { updateLeadStatus, getSignedCarrierDocUrl } from "@/lib/db/leads";
import { slugify } from "@/lib/slug";
import type { LeadStatus } from "@/lib/types";

const text = (fd: FormData, k: string) =>
  ((fd.get(k) as string | null) ?? "").trim();
const bool = (fd: FormData, k: string) => fd.get(k) === "on" || fd.get(k) === "true";
const num = (fd: FormData, k: string) => Number(fd.get(k) ?? 0) || 0;

// ---- Leads ----
export async function updateLeadStatusAction(
  table: "quote_requests" | "carrier_applications",
  id: string,
  status: LeadStatus
) {
  await updateLeadStatus(table, id, status);
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

export async function getCarrierDocUrlAction(path: string) {
  return getSignedCarrierDocUrl(path, 120);
}

// ---- Services ----
export async function saveService(fd: FormData) {
  const title = text(fd, "title");
  await content.upsertService({
    id: text(fd, "id") || undefined,
    title,
    slug: slugify(text(fd, "slug") || title),
    description: text(fd, "description"),
    icon: text(fd, "icon") || "truck",
    sort_order: num(fd, "sort_order"),
    published: bool(fd, "published"),
  });
  revalidatePath("/");
  revalidatePath("/admin/services");
}

export async function deleteServiceAction(id: string) {
  await content.deleteService(id);
  revalidatePath("/");
  revalidatePath("/admin/services");
}

// ---- Testimonials ----
export async function saveTestimonial(fd: FormData) {
  await content.upsertTestimonial({
    id: text(fd, "id") || undefined,
    name: text(fd, "name"),
    company: text(fd, "company"),
    quote: text(fd, "quote"),
    rating: num(fd, "rating") || 5,
    sort_order: num(fd, "sort_order"),
    published: bool(fd, "published"),
  });
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}

export async function deleteTestimonialAction(id: string) {
  await content.deleteTestimonial(id);
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}

// ---- Blog ----
export async function savePost(fd: FormData) {
  const id = text(fd, "id") || undefined;
  const title = text(fd, "title");
  const status = (text(fd, "status") || "draft") as "draft" | "published";

  let coverUrl = text(fd, "cover_image_url") || null;
  const cover = fd.get("cover");
  if (cover instanceof File && cover.size > 0) {
    coverUrl = await content.uploadMedia(cover);
  }

  await content.upsertPost({
    id,
    title,
    slug: slugify(text(fd, "slug") || title),
    excerpt: text(fd, "excerpt"),
    body: text(fd, "body"),
    cover_image_url: coverUrl,
    status,
    published_at:
      status === "published" ? text(fd, "published_at") || new Date().toISOString() : null,
  });

  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function deletePostAction(id: string) {
  await content.deletePost(id);
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
}

// ---- Settings ----
export async function saveSettings(fd: FormData) {
  await content.updateSettings({
    phone: text(fd, "phone"),
    email: text(fd, "email"),
    address: text(fd, "address"),
    mc_number: text(fd, "mc_number"),
    usdot_number: text(fd, "usdot_number"),
    whatsapp: text(fd, "whatsapp"),
    facebook: text(fd, "facebook"),
    instagram: text(fd, "instagram"),
    linkedin: text(fd, "linkedin"),
    hero_headline: text(fd, "hero_headline"),
    hero_sub: text(fd, "hero_sub"),
  });
  revalidatePath("/");
  revalidatePath("/admin/settings");
}
