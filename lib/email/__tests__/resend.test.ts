import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const sendMock = vi.fn();
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

import { notifyOwnerNewLead, sendCustomerConfirmation } from "@/lib/email/resend";

beforeEach(() => {
  sendMock.mockReset();
  sendMock.mockResolvedValue({ data: { id: "email-1" }, error: null });
  vi.stubEnv("RESEND_API_KEY", "re_test");
  vi.stubEnv("RESEND_FROM", "Raf <noreply@raffreightlogistics.com>");
  vi.stubEnv("OWNER_NOTIFY_EMAIL", "owner@raf.com");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("notifyOwnerNewLead", () => {
  it("emails the owner with the lead kind and details", async () => {
    await notifyOwnerNewLead("quote", { name: "Jane Doe", email: "jane@x.com" });
    expect(sendMock).toHaveBeenCalledTimes(1);
    const arg = sendMock.mock.calls[0][0];
    expect(arg.to).toBe("owner@raf.com");
    expect(arg.from).toContain("raffreightlogistics.com");
    expect(arg.subject.toLowerCase()).toContain("quote");
    expect(arg.html).toContain("Jane Doe");
  });

  it("renders carrier applications", async () => {
    await notifyOwnerNewLead("carrier", { business_name: "Acme Trucking" });
    const arg = sendMock.mock.calls[0][0];
    expect(arg.subject.toLowerCase()).toContain("carrier");
    expect(arg.html).toContain("Acme Trucking");
  });
});

describe("sendCustomerConfirmation", () => {
  it("emails the submitter an acknowledgement", async () => {
    await sendCustomerConfirmation("quote", "jane@x.com", "Jane");
    const arg = sendMock.mock.calls[0][0];
    expect(arg.to).toBe("jane@x.com");
    expect(arg.html).toContain("Jane");
  });
});
