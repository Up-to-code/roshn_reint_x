import { describe, expect, test } from "bun:test";
import {
  contactDto,
  contactInputSchema,
  contactUpdateSchema,
  landingLeadInputSchema,
  propertyInterestInputSchema,
} from "../../lib/inquiries/inquiry-core";

describe("Inquiry core", () => {
  test("normalizes public contact input and preserves association metadata", () => {
    expect(contactInputSchema.parse({
      name: "  Ahmed  ", phone: "  +966500000000 ", email: "", message: "  Help me  ",
      propertyId: " property-1 ", propertyTitle: " Villa ", reason: " Viewing ",
    })).toEqual({
      name: "Ahmed", phone: "+966500000000", email: null, message: "Help me",
      propertyId: "property-1", propertyTitle: "Villa", reason: "Viewing",
    });
  });

  test("uses one validation policy for contact create and update", () => {
    const input = { name: "Ahmed", phone: "123", email: "", message: "ok" };
    expect(contactInputSchema.safeParse(input).success).toBe(true);
    expect(contactUpdateSchema.safeParse(input).success).toBe(true);
  });

  test("normalizes optional property interest fields", () => {
    expect(propertyInterestInputSchema.parse({ name: "Sara", phone: "123", message: "", propertyId: "" }))
      .toMatchObject({ email: null, message: null, propertyId: null, propertyTitle: null });
  });

  test("rejects incomplete landing leads", () => {
    expect(landingLeadInputSchema.safeParse({ firstName: "", lastName: "M", phone: "12", source: "" }).success).toBe(false);
  });

  test("keeps the legacy contact API shape at the adapter edge", () => {
    const dto = contactDto({ id: "1", kind: "CONTACT", phone: "123", propertyTitle: "General Inquiry", propertyId: null, source: null, reason: null });
    expect(dto).toEqual({ id: "1", phoneNumber: "123" });
  });
});
