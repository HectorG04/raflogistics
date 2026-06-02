import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { verifyTurnstile } from "@/lib/turnstile";

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubEnv("TURNSTILE_SECRET_KEY", "secret-key");
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockReset();
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("verifyTurnstile", () => {
  it("returns false for a missing token without calling fetch", async () => {
    expect(await verifyTurnstile(null)).toBe(false);
    expect(await verifyTurnstile("")).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns true when Cloudflare responds success:true", async () => {
    fetchMock.mockResolvedValue({ json: async () => ({ success: true }) });
    expect(await verifyTurnstile("good-token")).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("returns false when Cloudflare responds success:false", async () => {
    fetchMock.mockResolvedValue({ json: async () => ({ success: false }) });
    expect(await verifyTurnstile("bad-token")).toBe(false);
  });
});
