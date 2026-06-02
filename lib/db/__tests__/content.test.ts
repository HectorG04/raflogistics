import { describe, it, expect, vi, beforeEach } from "vitest";

// Chainable, thenable query-builder mock that records method calls.
function makeBuilder(result: unknown) {
  const calls: Array<[string, unknown[]]> = [];
  const builder: Record<string, unknown> & { calls: typeof calls } = {
    calls,
    select: (...a: unknown[]) => (calls.push(["select", a]), builder),
    eq: (...a: unknown[]) => (calls.push(["eq", a]), builder),
    order: (...a: unknown[]) => (calls.push(["order", a]), builder),
    single: (...a: unknown[]) => (calls.push(["single", a]), builder),
    then: (resolve: (v: unknown) => void) => resolve(result),
  };
  return builder;
}

const builders: Record<string, ReturnType<typeof makeBuilder>> = {};
const fromMock = vi.fn((table: string) => builders[table]);

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({ from: fromMock })),
}));

import {
  getPublishedServices,
  getPublishedTestimonials,
  getSiteSettings,
  getPublishedPosts,
  getPostBySlug,
} from "@/lib/db/content";

beforeEach(() => {
  fromMock.mockClear();
  for (const k of Object.keys(builders)) delete builders[k];
});

describe("getPublishedServices", () => {
  it("queries published services ordered by sort_order", async () => {
    const rows = [{ id: "1", title: "Auto Transport" }];
    builders["services"] = makeBuilder({ data: rows });

    const result = await getPublishedServices();

    expect(fromMock).toHaveBeenCalledWith("services");
    const calls = builders["services"].calls;
    expect(calls).toContainEqual(["eq", ["published", true]]);
    expect(calls.some(([m, a]) => m === "order" && a[0] === "sort_order")).toBe(true);
    expect(result).toEqual(rows);
  });

  it("returns [] when data is null", async () => {
    builders["services"] = makeBuilder({ data: null });
    expect(await getPublishedServices()).toEqual([]);
  });
});

describe("getPublishedTestimonials", () => {
  it("queries published testimonials ordered by sort_order", async () => {
    const rows = [{ id: "t1", name: "John Smith" }];
    builders["testimonials"] = makeBuilder({ data: rows });

    const result = await getPublishedTestimonials();

    expect(fromMock).toHaveBeenCalledWith("testimonials");
    expect(builders["testimonials"].calls).toContainEqual(["eq", ["published", true]]);
    expect(result).toEqual(rows);
  });
});

describe("getSiteSettings", () => {
  it("returns the single settings row", async () => {
    const row = { id: 1, phone: "+1 (845) 573-1488" };
    builders["site_settings"] = makeBuilder({ data: row });

    const result = await getSiteSettings();

    expect(fromMock).toHaveBeenCalledWith("site_settings");
    expect(builders["site_settings"].calls).toContainEqual(["single", []]);
    expect(result).toEqual(row);
  });
});

describe("getPublishedPosts", () => {
  it("queries published posts ordered by published_at desc", async () => {
    const rows = [{ id: "p1", slug: "hello", status: "published" }];
    builders["blog_posts"] = makeBuilder({ data: rows });

    const result = await getPublishedPosts();

    expect(builders["blog_posts"].calls).toContainEqual(["eq", ["status", "published"]]);
    expect(
      builders["blog_posts"].calls.some(
        ([m, a]) => m === "order" && a[0] === "published_at"
      )
    ).toBe(true);
    expect(result).toEqual(rows);
  });
});

describe("getPostBySlug", () => {
  it("returns a published post matching the slug", async () => {
    const row = { id: "p1", slug: "hello", status: "published" };
    builders["blog_posts"] = makeBuilder({ data: row });

    const result = await getPostBySlug("hello");

    expect(builders["blog_posts"].calls).toContainEqual(["eq", ["slug", "hello"]]);
    expect(builders["blog_posts"].calls).toContainEqual(["eq", ["status", "published"]]);
    expect(result).toEqual(row);
  });

  it("returns null when not found", async () => {
    builders["blog_posts"] = makeBuilder({ data: null });
    expect(await getPostBySlug("missing")).toBeNull();
  });
});
