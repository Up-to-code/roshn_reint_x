import { z } from "zod";

const inquiryKinds = ["CONTACT", "PROPERTY_INTEREST", "LANDING_LEAD"] as const;
export type InquiryKind = (typeof inquiryKinds)[number];

const optionalText = z.string().trim().optional().transform(value => value || null);
const optionalEmail = z.union([z.string().trim().email(), z.literal(""), z.undefined()])
  .transform(value => value || null);

const personSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  phone: z.string().trim().min(3, "Phone number must be at least 3 characters"),
  email: optionalEmail,
});

export const contactInputSchema = personSchema.extend({
  message: z.string().trim().min(2, "Message must be at least 2 characters"),
  propertyId: optionalText,
  propertyTitle: optionalText,
  reason: optionalText,
});

export const propertyInterestInputSchema = personSchema.extend({
  message: optionalText,
  propertyId: optionalText,
  propertyTitle: optionalText,
});

export const landingLeadInputSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  phone: z.string().trim().min(3),
  source: z.string().trim().min(1),
});

export const contactUpdateSchema = personSchema.extend({
  message: z.string().trim().min(2, "Message must be at least 2 characters"),
});

export type ContactInput = z.input<typeof contactInputSchema>;
export type PropertyInterestInput = z.input<typeof propertyInterestInputSchema>;
export type LandingLeadInput = z.input<typeof landingLeadInputSchema>;
export type ContactUpdate = z.input<typeof contactUpdateSchema>;

export function contactDto<T extends {
  phone: string;
  kind: InquiryKind;
  propertyTitle: string;
  propertyId: string | null;
  source: string | null;
  reason: string | null;
}>(inquiry: T) {
  const { phone, kind: _kind, propertyTitle: _title, propertyId: _propertyId, source: _source, reason: _reason, ...contact } = inquiry;
  return { ...contact, phoneNumber: phone };
}
