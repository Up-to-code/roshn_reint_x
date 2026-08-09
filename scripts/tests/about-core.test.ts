import { describe, expect, test } from "bun:test";
import { aboutDataSchema, defaultAboutData, normalizeAboutData } from "../../lib/about/about-core";

describe("About core", () => {
  test("merges partial legacy content with canonical defaults", () => {
    expect(normalizeAboutData({ hero: { title: "Custom" } }).hero).toEqual({ ...defaultAboutData.hero, title: "Custom" });
  });

  test("rejects unknown and malformed writes", () => {
    expect(aboutDataSchema.safeParse({ ...defaultAboutData, hidden: true }).success).toBe(false);
    expect(aboutDataSchema.safeParse({ ...defaultAboutData, goals: [] }).success).toBe(false);
  });
});
