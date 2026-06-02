import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { initialFormState } from "@/lib/forms";

vi.mock("@/lib/turnstile", () => ({ verifyTurnstile: vi.fn() }));
vi.mock("@/lib/db/leads", () => ({
  insertCarrier: vi.fn(),
  uploadCarrierDoc: vi.fn(),
}));
vi.mock("@/lib/email/resend", () => ({
  notifyOwnerNewLead: vi.fn(),
  sendCustomerConfirmation: vi.fn(),
}));

import { submitCarrierApplication } from "@/app/actions/carrier";
import { verifyTurnstile } from "@/lib/turnstile";
import { insertCarrier, uploadCarrierDoc } from "@/lib/db/leads";
import { notifyOwnerNewLead } from "@/lib/email/resend";

function fd(
  fields: Record<string, string>,
  files: Record<string, File> = {},
  equipment: string[] = []
): FormData {
  const f = new FormData();
  for (const [k, v] of Object.entries(fields)) f.append(k, v);
  for (const e of equipment) f.append("equipment", e);
  for (const [k, v] of Object.entries(files)) f.append(k, v);
  return f;
}

const base = {
  business_name: "Acme Trucking",
  email: "ops@acme.com",
  contact_name: "Bob",
  "cf-turnstile-response": "tok",
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(insertCarrier).mockResolvedValue({ id: "c-1" });
  vi.mocked(verifyTurnstile).mockResolvedValue(true);
  vi.mocked(uploadCarrierDoc).mockResolvedValue("coi/x.pdf");
});

afterEach(() => vi.unstubAllEnvs());

describe("submitCarrierApplication", () => {
  it("rejects when the honeypot is filled", async () => {
    const res = await submitCarrierApplication(
      initialFormState,
      fd({ ...base, website: "spam" })
    );
    expect(res.status).toBe("error");
    expect(insertCarrier).not.toHaveBeenCalled();
  });

  it("rejects an invalid Turnstile token when configured", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    vi.mocked(verifyTurnstile).mockResolvedValue(false);
    const res = await submitCarrierApplication(initialFormState, fd(base));
    expect(res.status).toBe("error");
    expect(insertCarrier).not.toHaveBeenCalled();
  });

  it("requires a business name", async () => {
    const res = await submitCarrierApplication(
      initialFormState,
      fd({ ...base, business_name: "" })
    );
    expect(res.status).toBe("error");
    expect(res.fieldErrors?.business_name).toBeTruthy();
  });

  it("uploads docs, stores their paths, inserts, and emails owner", async () => {
    vi.mocked(uploadCarrierDoc)
      .mockResolvedValueOnce("coi/a.pdf")
      .mockResolvedValueOnce("w9/b.pdf");

    const res = await submitCarrierApplication(
      initialFormState,
      fd(
        base,
        {
          coi: new File(["x"], "coi.pdf", { type: "application/pdf" }),
          w9: new File(["y"], "w9.pdf", { type: "application/pdf" }),
        },
        ["flatbed", "reefer"]
      )
    );

    expect(uploadCarrierDoc).toHaveBeenCalledTimes(2);
    const payload = vi.mocked(insertCarrier).mock.calls[0][0];
    expect(payload.business_name).toBe("Acme Trucking");
    expect(payload.equipment).toEqual(["flatbed", "reefer"]);
    expect(payload.coi_doc_url).toBe("coi/a.pdf");
    expect(payload.w9_doc_url).toBe("w9/b.pdf");
    expect(notifyOwnerNewLead).toHaveBeenCalledWith("carrier", expect.any(Object));
    expect(res.status).toBe("success");
  });

  it("succeeds with no documents attached", async () => {
    const res = await submitCarrierApplication(initialFormState, fd(base));
    expect(uploadCarrierDoc).not.toHaveBeenCalled();
    const payload = vi.mocked(insertCarrier).mock.calls[0][0];
    expect(payload.coi_doc_url).toBeNull();
    expect(payload.w9_doc_url).toBeNull();
    expect(res.status).toBe("success");
  });
});
