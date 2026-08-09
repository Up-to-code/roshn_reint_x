import { z } from "zod";

const optionalImage = z.string().trim().max(2048).optional().transform(value => value || "");

export const serviceInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(160),
  description: z.string().trim().min(1, "Description is required").max(4000),
  image: optionalImage,
  features: z.array(z.string().trim().min(1).max(300)).max(30).default([]),
  order: z.coerce.number().int().min(0).max(10_000).default(0),
  enabled: z.boolean().default(true),
}).strict();

export const servicesPageInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(160),
  subtitle: z.string().trim().min(1, "Subtitle is required").max(500),
  heroImage: optionalImage,
  enabled: z.boolean().default(true),
}).strict();

export const defaultServicesPage = {
  id: "default",
  title: "خدماتنا",
  subtitle: "حلول عقارية متكاملة تلبي احتياجاتك",
  heroImage: "",
  enabled: true,
} as const;

export type ServiceInput = z.input<typeof serviceInputSchema>;
export type ServicesPageInput = z.input<typeof servicesPageInputSchema>;
