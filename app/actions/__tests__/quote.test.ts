import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { initialFormState } from "@/lib/forms";

vi.mock("@/lib/turnstile", () => ({ verifyTurnstile: vi.fn() }));
vi.mock("@/lib/db/leads", () => ({ insertQuote: vi.fn() }));
vi.mock("@/lib/email/resend", () => ({
  notifyOwnerNewLead: vi.fn(),
  sendCustomerConfirmation: vi.fn(),
}));

import { submitQuote } from "@/app/actions/quote";
import { verifyTurnstile } from "@/lib/turnstile";
import { insertQuote } from "@/lib/db/leads";
import { notifyOwnerNewLead, sendCustomerConfirmation } from "@/lib/email/resend";

function fd(obj: Record<string, string>): FormData {
  const f = new FormData();
  for (const [k, v] of Object.entries(obj)) f.append(k, v);
  return f;
}

const base = {
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "555-123-4567",
  transport_type: "open",
  "cf-turnstile-response": "tok",
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(insertQuote).mockResolvedValue({ id: "q-1" });
  vi.mocked(verifyTurnstile).mockResolvedValue(true);
});

afterEach(() => vi.unstubAllEnvs());

describe("submitQuote", () => {
  it("rejects when the honeypot is filled", async () => {
    const res = await submitQuote(initialFormState, fd({ ...base, website: "spam" }));
    expect(res.status).toBe("error");
    expect(insertQuote).not.toHaveBeenCalled();
  });

  it("rejects an invalid Turnstile token when Turnstile is configured", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    vi.mocked(verifyTurnstile).mockResolvedValue(false);
    const res = await submitQuote(initialFormState, fd(base));
    expect(res.status).toBe("error");
    expect(insertQuote).not.toHaveBeenCalled();
  });

  it("returns field errors for invalid input", async () => {
    const res = await submitQuote(initialFormState, fd({ ...base, email: "bad" }));
    expect(res.status).toBe("error");
    expect(res.fieldErrors?.email).toBeTruthy();
    expect(insertQuote).not.toHaveBeenCalled();
  });

  it("inserts, emails owner + customer, and returns success on valid input", async () => {
    const res = await submitQuote(
      initialFormState,
      fd({ ...base, vehicle_make: "Toyota", operable: "yes" })
    );
    expect(insertQuote).toHaveBeenCalledTimes(1);
    const payload = vi.mocked(insertQuote).mock.calls[0][0];
    expect(payload.name).toBe("Jane Doe");
    expect(payload.operable).toBe(true);
    expect(payload.transport_type).toBe("open");
    expect(notifyOwnerNewLead).toHaveBeenCalledWith("quote", expect.any(Object));
    expect(sendCustomerConfirmation).toHaveBeenCalledWith(
      "quote",
      "jane@example.com",
      "Jane Doe"
    );
    expect(res.status).toBe("success");
  });

  it("still succeeds if email sending fails", async () => {
    vi.mocked(notifyOwnerNewLead).mockRejectedValue(new Error("smtp"));
    const res = await submitQuote(initialFormState, fd(base));
    expect(res.status).toBe("success");
  });
});
