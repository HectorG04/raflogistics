import { describe, it, expect } from "vitest";
import { quoteSchema, carrierSchema, newsletterSchema } from "@/lib/validation/schemas";

describe("quoteSchema", () => {
  const valid = {
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "555-123-4567",
    transport_type: "open",
    website: "",
  };

  it("accepts a valid minimal quote", () => {
    expect(quoteSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts optional vehicle/route fields", () => {
    const r = quoteSchema.safeParse({
      ...valid,
      vehicle_year: "2020",
      vehicle_make: "Toyota",
      vehicle_model: "Camry",
      operable: true,
      pickup_zip: "10001",
      delivery_zip: "90001",
      transport_type: "enclosed",
    });
    expect(r.success).toBe(true);
  });

  it("rejects empty name", () => {
    expect(quoteSchema.safeParse({ ...valid, name: "" }).success).toBe(false);
  });

  it("rejects invalid email", () => {
    expect(quoteSchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(false);
  });

  it("rejects invalid transport_type", () => {
    expect(quoteSchema.safeParse({ ...valid, transport_type: "spaceship" }).success).toBe(false);
  });

  it("rejects when the honeypot is filled", () => {
    expect(quoteSchema.safeParse({ ...valid, website: "spam" }).success).toBe(false);
  });
});

describe("carrierSchema", () => {
  const valid = {
    business_name: "Acme Trucking",
    mc_number: "MC123456",
    contact_name: "Bob",
    email: "bob@acme.com",
    phone: "555-000-1111",
    equipment: ["flatbed", "reefer"],
    website: "",
  };

  it("accepts a valid carrier application", () => {
    expect(carrierSchema.safeParse(valid).success).toBe(true);
  });

  it("requires business_name", () => {
    expect(carrierSchema.safeParse({ ...valid, business_name: "" }).success).toBe(false);
  });

  it("rejects invalid email", () => {
    expect(carrierSchema.safeParse({ ...valid, email: "nope" }).success).toBe(false);
  });

  it("defaults equipment to an empty array when omitted", () => {
    const { equipment, ...rest } = valid;
    void equipment;
    const r = carrierSchema.safeParse(rest);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.equipment).toEqual([]);
  });

  it("rejects when the honeypot is filled", () => {
    expect(carrierSchema.safeParse({ ...valid, website: "spam" }).success).toBe(false);
  });
});

describe("newsletterSchema", () => {
  it("accepts a valid email", () => {
    expect(newsletterSchema.safeParse({ email: "a@b.com", website: "" }).success).toBe(true);
  });

  it("rejects an invalid email", () => {
    expect(newsletterSchema.safeParse({ email: "bad", website: "" }).success).toBe(false);
  });

  it("rejects when the honeypot is filled", () => {
    expect(newsletterSchema.safeParse({ email: "a@b.com", website: "x" }).success).toBe(false);
  });
});
