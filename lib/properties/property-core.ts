import { z } from "zod";

const nullableText = (max: number) =>
  z.preprocess((value) => {
    if (value === null || value === undefined) return null;
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed.length === 0 ? null : trimmed;
  }, z.string().max(max).nullable());

const requiredText = (label: string, max: number) =>
  z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : value),
    z.string().min(1, `${label} is required`).max(max),
  );

export const createPropertyInputSchema = z
  .object({
    titleEn: nullableText(200).default(null),
    titleAr: requiredText("Arabic title", 200),
    descriptionEn: nullableText(20_000).default(null),
    descriptionAr: nullableText(20_000).default(null),
    city: nullableText(120).default(null),
    district: nullableText(120).default(null),
    price: z.coerce.number().finite().min(0).default(0),
    images: z.array(z.string().trim().min(1)).max(100).default([]),
  })
  .strict();

const updatePropertyInputSchema = z
  .object({
    titleEn: nullableText(200).optional(),
    titleAr: requiredText("Arabic title", 200).optional(),
    descriptionEn: nullableText(20_000).optional(),
    descriptionAr: nullableText(20_000).optional(),
    city: nullableText(120).optional(),
    district: nullableText(120).optional(),
    price: z.coerce.number().finite().min(0).optional(),
    images: z.array(z.string().trim().min(1)).max(100).optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, "At least one property field is required");

export interface CreatePropertyInput {
  titleEn?: string | null;
  titleAr: string;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  city?: string | null;
  district?: string | null;
  price?: number;
  images?: string[];
}

export type UpdatePropertyInput = Partial<CreatePropertyInput>;

interface NormalizedCreatePropertyInput {
  titleEn: string | null;
  titleAr: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  city: string | null;
  district: string | null;
  price: number;
  images: string[];
}

type NormalizedUpdatePropertyInput = Partial<NormalizedCreatePropertyInput>;

export interface PropertyRecord {
  id: string;
  titleEn: string | null;
  titleAr: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  city: string | null;
  district: string | null;
  price: number;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type SerializedPropertyRecord = Omit<PropertyRecord, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export function serializeProperty(property: PropertyRecord): SerializedPropertyRecord {
  return {
    ...property,
    createdAt: property.createdAt.toISOString(),
    updatedAt: property.updatedAt.toISOString(),
  };
}

export interface PropertyQuery {
  query?: string;
  city?: string;
  limit?: number;
}

export interface PropertyRepository {
  list(query: PropertyQuery): Promise<PropertyRecord[]>;
  listIds(limit: number): Promise<string[]>;
  getById(id: string): Promise<PropertyRecord | null>;
  create(input: NormalizedCreatePropertyInput): Promise<PropertyRecord>;
  update(id: string, input: NormalizedUpdatePropertyInput): Promise<PropertyRecord | null>;
  delete(id: string): Promise<PropertyRecord | null>;
}

interface PropertyEvent {
  type: "property_created" | "property_updated" | "property_deleted";
  title: string;
  description: string;
  metadata: Record<string, unknown>;
}

export interface PropertyModuleDependencies {
  repository: PropertyRepository;
  recordEvent(event: PropertyEvent): Promise<void>;
  notifyCreated(property: PropertyRecord): Promise<void>;
  invalidate(propertyId?: string): Promise<void>;
  reportEffectError?(effect: string, error: unknown): void;
}

export class PropertyModuleError extends Error {
  constructor(
    message: string,
    readonly code: "INVALID_INPUT" | "NOT_FOUND",
    readonly details?: unknown,
  ) {
    super(message);
    this.name = "PropertyModuleError";
  }
}

function displayTitle(property: PropertyRecord): string {
  return property.titleEn || property.titleAr;
}

async function settleEffects(
  dependencies: PropertyModuleDependencies,
  effects: Array<[name: string, run: () => Promise<void>]>,
): Promise<void> {
  const results = await Promise.allSettled(effects.map(([, run]) => run()));
  results.forEach((result, index) => {
    if (result.status === "rejected") {
      dependencies.reportEffectError?.(effects[index][0], result.reason);
    }
  });
}

function parseCreate(input: CreatePropertyInput): NormalizedCreatePropertyInput {
  const result = createPropertyInputSchema.safeParse(input);
  if (!result.success) {
    throw new PropertyModuleError("Invalid property data", "INVALID_INPUT", result.error.flatten());
  }
  return result.data as NormalizedCreatePropertyInput;
}

function parseUpdate(input: UpdatePropertyInput): NormalizedUpdatePropertyInput {
  const result = updatePropertyInputSchema.safeParse(input);
  if (!result.success) {
    throw new PropertyModuleError("Invalid property data", "INVALID_INPUT", result.error.flatten());
  }
  return result.data as NormalizedUpdatePropertyInput;
}

export function createPropertyModule(dependencies: PropertyModuleDependencies) {
  return {
    async list(query: PropertyQuery = {}): Promise<PropertyRecord[]> {
      return dependencies.repository.list({
        query: query.query?.trim() || undefined,
        city: query.city?.trim() || undefined,
        limit: query.limit === undefined ? undefined : Math.max(1, Math.min(query.limit, 100)),
      });
    },

    async listIds(limit = 100): Promise<string[]> {
      return dependencies.repository.listIds(Math.max(1, Math.min(limit, 1_000)));
    },

    async getById(id: string): Promise<PropertyRecord | null> {
      return dependencies.repository.getById(id);
    },

    async create(input: CreatePropertyInput): Promise<PropertyRecord> {
      const property = await dependencies.repository.create(parseCreate(input));
      const title = displayTitle(property);
      await settleEffects(dependencies, [
        ["property event", () =>
          dependencies.recordEvent({
            type: "property_created",
            title: `New Property Created: ${title}`,
            description: `Property "${title}" was created in ${property.city || "unknown city"}`,
            metadata: {
              propertyId: property.id,
              titleEn: property.titleEn,
              titleAr: property.titleAr,
              city: property.city,
              district: property.district,
              imageCount: property.images.length,
            },
          })],
        ["property notification", () => dependencies.notifyCreated(property)],
        ["property cache invalidation", () => dependencies.invalidate(property.id)],
      ]);
      return property;
    },

    async update(id: string, input: UpdatePropertyInput): Promise<PropertyRecord> {
      const property = await dependencies.repository.update(id, parseUpdate(input));
      if (!property) throw new PropertyModuleError("Property not found", "NOT_FOUND");
      const title = displayTitle(property);
      await settleEffects(dependencies, [
        ["property event", () =>
          dependencies.recordEvent({
            type: "property_updated",
            title: `Property Updated: ${title}`,
            description: `Property "${title}" was updated`,
            metadata: {
              propertyId: property.id,
              titleEn: property.titleEn,
              titleAr: property.titleAr,
              city: property.city,
            },
          })],
        ["property cache invalidation", () => dependencies.invalidate(property.id)],
      ]);
      return property;
    },

    async delete(id: string): Promise<void> {
      const property = await dependencies.repository.delete(id);
      if (!property) throw new PropertyModuleError("Property not found", "NOT_FOUND");
      const title = displayTitle(property);
      await settleEffects(dependencies, [
        ["property event", () =>
          dependencies.recordEvent({
            type: "property_deleted",
            title: `Property Deleted: ${title}`,
            description: `Property "${title}" was deleted`,
            metadata: { propertyId: property.id, titleEn: property.titleEn },
          })],
        ["property cache invalidation", () => dependencies.invalidate(property.id)],
      ]);
    },
  };
}

export function getLocalizedPropertyTitle(property: PropertyRecord, locale: string): string {
  return (locale === "ar" ? property.titleAr : property.titleEn) || property.titleAr;
}

export function getLocalizedPropertyDescription(
  property: PropertyRecord,
  locale: string,
): string | null {
  return (locale === "ar" ? property.descriptionAr : property.descriptionEn) || null;
}
