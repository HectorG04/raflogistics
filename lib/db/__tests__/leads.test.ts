import { describe, it, expect, vi, beforeEach } from "vitest";

function makeBuilder(result: unknown) {
  const calls: Array<[string, unknown[]]> = [];
  const b: Record<string, unknown> & { calls: typeof calls } = {
    calls,
    insert: (...a: unknown[]) => (calls.push(["insert", a]), b),
    select: (...a: unknown[]) => (calls.push(["select", a]), b),
    single: (...a: unknown[]) => (calls.push(["single", a]), b),
    update: (...a: unknown[]) => (calls.push(["update", a]), b),
    eq: (...a: unknown[]) => (calls.push(["eq", a]), b),
    order: (...a: unknown[]) => (calls.push(["order", a]), b),
    then: (resolve: (v: unknown) => void) => resolve(result),
  };
  return b;
}

const builders: Record<string, ReturnType<typeof makeBuilder>> = {};
const fromMock = vi.fn((table: string) => builders[table]);
const uploadMock = vi.fn();
const signMock = vi.fn();
const storageFromMock = vi.fn(() => ({
  upload: uploadMock,
  createSignedUrl: signMock,
}));

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({ from: fromMock, storage: { from: storageFromMock } }),
}));

import {
  insertQuote,
  insertCarrier,
  subscribe,
  uploadCarrierDoc,
  listQuotes,
  updateLeadStatus,
  getSignedCarrierDocUrl,
} from "@/lib/db/leads";

beforeEach(() => {
  fromMock.mockClear();
  uploadMock.mockReset();
  signMock.mockReset();
  storageFromMock.mockClear();
  for (const k of Object.keys(builders)) delete builders[k];
});

describe("insertQuote", () => {
  it("inserts into quote_requests and returns the new id", async () => {
    builders["quote_requests"] = makeBuilder({ data: { id: "q-1" }, error: null });
    const result = await insertQuote({ name: "Jane", email: "j@x.com" } as never);
    expect(fromMock).toHaveBeenCalledWith("quote_requests");
    expect(builders["quote_requests"].calls[0][0]).toBe("insert");
    expect(result).toEqual({ id: "q-1" });
  });

  it("throws on db error", async () => {
    builders["quote_requests"] = makeBuilder({ data: null, error: { message: "boom" } });
    await expect(insertQuote({ name: "Jane", email: "j@x.com" } as never)).rejects.toBeTruthy();
  });
});

describe("insertCarrier", () => {
  it("inserts into carrier_applications and returns the new id", async () => {
    builders["carrier_applications"] = makeBuilder({ data: { id: "c-1" }, error: null });
    const result = await insertCarrier({ business_name: "Acme", equipment: [] } as never);
    expect(fromMock).toHaveBeenCalledWith("carrier_applications");
    expect(result).toEqual({ id: "c-1" });
  });
});

describe("subscribe", () => {
  it("succeeds on insert", async () => {
    builders["newsletter_subscribers"] = makeBuilder({ error: null });
    await expect(subscribe("a@b.com")).resolves.toBeUndefined();
    expect(fromMock).toHaveBeenCalledWith("newsletter_subscribers");
  });

  it("swallows duplicate-email unique violation (23505)", async () => {
    builders["newsletter_subscribers"] = makeBuilder({ error: { code: "23505" } });
    await expect(subscribe("dup@b.com")).resolves.toBeUndefined();
  });

  it("throws on other errors", async () => {
    builders["newsletter_subscribers"] = makeBuilder({ error: { code: "12345" } });
    await expect(subscribe("x@b.com")).rejects.toBeTruthy();
  });
});

describe("uploadCarrierDoc", () => {
  it("uploads to the private carrier-docs bucket and returns the path", async () => {
    uploadMock.mockResolvedValue({ data: { path: "coi/abc.pdf" }, error: null });
    const file = new File(["x"], "coi.pdf", { type: "application/pdf" });
    const path = await uploadCarrierDoc(file, "coi");
    expect(storageFromMock).toHaveBeenCalledWith("carrier-docs");
    expect(uploadMock).toHaveBeenCalled();
    expect(path).toBe("coi/abc.pdf");
  });

  it("throws on upload error", async () => {
    uploadMock.mockResolvedValue({ data: null, error: { message: "fail" } });
    const file = new File(["x"], "coi.pdf", { type: "application/pdf" });
    await expect(uploadCarrierDoc(file, "coi")).rejects.toBeTruthy();
  });
});

describe("listQuotes", () => {
  it("returns quotes ordered by created_at desc", async () => {
    const rows = [{ id: "q-1" }];
    builders["quote_requests"] = makeBuilder({ data: rows, error: null });
    const result = await listQuotes();
    expect(
      builders["quote_requests"].calls.some(
        ([m, a]) => m === "order" && a[0] === "created_at"
      )
    ).toBe(true);
    expect(result).toEqual(rows);
  });
});

describe("updateLeadStatus", () => {
  it("updates status on the given table for the given id", async () => {
    builders["quote_requests"] = makeBuilder({ error: null });
    await updateLeadStatus("quote_requests", "q-1", "contacted");
    const calls = builders["quote_requests"].calls;
    expect(calls).toContainEqual(["update", [{ status: "contacted" }]]);
    expect(calls).toContainEqual(["eq", ["id", "q-1"]]);
  });
});

describe("getSignedCarrierDocUrl", () => {
  it("returns a signed URL for a carrier-docs path", async () => {
    signMock.mockResolvedValue({ data: { signedUrl: "https://signed/x" }, error: null });
    const url = await getSignedCarrierDocUrl("coi/abc.pdf");
    expect(storageFromMock).toHaveBeenCalledWith("carrier-docs");
    expect(url).toBe("https://signed/x");
  });

  it("returns null on error", async () => {
    signMock.mockResolvedValue({ data: null, error: { message: "nope" } });
    expect(await getSignedCarrierDocUrl("missing")).toBeNull();
  });
});
