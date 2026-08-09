import { describe, expect, test } from "bun:test";
import { defaultServicesPage, serviceInputSchema, servicesPageInputSchema } from "../../lib/services/service-core";

describe("Service core", () => {
  test("normalizes service input and defaults", () => {
    expect(serviceInputSchema.parse({ title: "  Valuation ", description: " Expert review " })).toEqual({
      title: "Valuation", description: "Expert review", image: "", features: [], order: 0, enabled: true,
    });
  });

  test("rejects arbitrary persistence fields and malformed features", () => {
    expect(serviceInputSchema.safeParse({ title: "X", description: "Y", id: "injected" }).success).toBe(false);
    expect(serviceInputSchema.safeParse({ title: "X", description: "Y", features: [""] }).success).toBe(false);
  });

  test("uses one canonical page default and validates updates", () => {
    expect(defaultServicesPage.id).toBe("default");
    expect(servicesPageInputSchema.parse({ title: " Services ", subtitle: " Help ", enabled: false })).toMatchObject({ title: "Services", subtitle: "Help", heroImage: "", enabled: false });
  });
});
