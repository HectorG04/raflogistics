import { createAdminClient } from "@/lib/supabase/admin";
import type {
  CarrierApplication,
  LeadStatus,
  QuoteRequest,
} from "@/lib/types";

export type QuoteInsert = Omit<QuoteRequest, "id" | "status" | "created_at">;
export type CarrierInsert = Omit<
  CarrierApplication,
  "id" | "status" | "created_at"
>;

type LeadTable = "quote_requests" | "carrier_applications";

/** Insert a quote request (service role; bypasses RLS). Returns the new id. */
export async function insertQuote(input: QuoteInsert): Promise<{ id: string }> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("quote_requests")
    .insert(input)
    .select("id")
    .single();
  if (error) throw error;
  return { id: (data as { id: string }).id };
}

/** Insert a carrier application. Returns the new id. */
export async function insertCarrier(
  input: CarrierInsert
): Promise<{ id: string }> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("carrier_applications")
    .insert(input)
    .select("id")
    .single();
  if (error) throw error;
  return { id: (data as { id: string }).id };
}

/** Subscribe an email to the newsletter; duplicates are treated as success. */
export async function subscribe(email: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email });
  if (error && error.code !== "23505") throw error;
}

/** Upload a carrier document to the private bucket; returns its storage path. */
export async function uploadCarrierDoc(
  file: File,
  prefix: "coi" | "w9"
): Promise<string> {
  const supabase = createAdminClient();
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const path = `${prefix}/${crypto.randomUUID()}.${ext}`;
  const { data, error } = await supabase.storage
    .from("carrier-docs")
    .upload(path, file, { contentType: file.type || undefined, upsert: false });
  if (error) throw error;
  return (data as { path: string }).path;
}

/** Admin: list quote requests, newest first. */
export async function listQuotes(): Promise<QuoteRequest[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("quote_requests")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as QuoteRequest[] | null) ?? [];
}

/** Admin: list carrier applications, newest first. */
export async function listCarriers(): Promise<CarrierApplication[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("carrier_applications")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as CarrierApplication[] | null) ?? [];
}

/** Admin: update a lead's triage status. */
export async function updateLeadStatus(
  table: LeadTable,
  id: string,
  status: LeadStatus
): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from(table).update({ status }).eq("id", id);
  if (error) throw error;
}

/** Admin: short-lived signed URL for a private carrier document. */
export async function getSignedCarrierDocUrl(
  path: string,
  expiresIn = 60
): Promise<string | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.storage
    .from("carrier-docs")
    .createSignedUrl(path, expiresIn);
  if (error || !data) return null;
  return (data as { signedUrl: string }).signedUrl;
}
