import { z } from "zod";

const eventTypes = ["property_created", "property_updated", "property_deleted", "contact_submission", "property_interest", "landing_lead", "user_registered", "other"] as const;

export const eventInputSchema = z.object({
  type: z.enum(eventTypes),
  title: z.string().trim().min(1).max(240),
  description: z.string().trim().max(2000),
  metadata: z.record(z.unknown()).default({}),
}).strict();

export const eventQuerySchema = z.object({
  type: z.enum(eventTypes).optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50),
});
