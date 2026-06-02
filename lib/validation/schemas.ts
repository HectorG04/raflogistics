import { z } from "zod";

// Hidden honeypot field: real users leave it empty; bots tend to fill it.
const honeypot = z.literal("").optional();

export const quoteSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Enter a valid email"),
  phone: z.string().trim().min(1, "Phone is required"),
  pickup_zip: z.string().trim().optional(),
  delivery_zip: z.string().trim().optional(),
  pickup_city: z.string().trim().optional(),
  delivery_city: z.string().trim().optional(),
  vehicle_year: z.string().trim().optional(),
  vehicle_make: z.string().trim().optional(),
  vehicle_model: z.string().trim().optional(),
  operable: z.boolean().optional(),
  transport_type: z.enum(["open", "enclosed"]).optional(),
  ship_date: z.string().trim().optional(),
  message: z.string().trim().optional(),
  website: honeypot,
});

export const carrierSchema = z.object({
  business_name: z.string().trim().min(1, "Business name is required"),
  mc_number: z.string().trim().optional(),
  contact_name: z.string().trim().optional(),
  email: z.string().trim().email("Enter a valid email"),
  phone: z.string().trim().optional(),
  equipment: z.array(z.string()).default([]),
  lanes_notes: z.string().trim().optional(),
  website: honeypot,
});

export const newsletterSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  website: honeypot,
});

export type QuoteInput = z.infer<typeof quoteSchema>;
export type CarrierInput = z.infer<typeof carrierSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
