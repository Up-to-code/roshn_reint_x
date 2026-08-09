import { describe, expect, test } from "bun:test";

import {
  createPropertyModule,
  PropertyModuleError,
  serializeProperty,
  type PropertyRecord,
  type PropertyRepository,
} from "../../lib/properties/property-core";

function property(overrides: Partial<PropertyRecord> = {}): PropertyRecord {
  return {
    id: "property-1",
    titleEn: "Home",
    titleAr: "منزل",
    descriptionEn: null,
    descriptionAr: null,
    city: null,
    district: null,
    price: 0,
    images: [],
    createdAt: new Date("2026-01-01T00:00:00Z"),
    updatedAt: new Date("2026-01-01T00:00:00Z"),
    ...overrides,
  };
}

function harness(initial: PropertyRecord[] = []) {
  const records = new Map(initial.map((record) => [record.id, record]));
  const events: string[] = [];
  const invalidations: Array<string | undefined> = [];
  let createdInput: Record<string, unknown> | undefined;

  const repository: PropertyRepository = {
    async list(query) {
      let result = [...records.values()];
      if (query.query) {
        const needle = query.query.toLowerCase();
        result = result.filter((record) =>
          [record.titleEn, record.titleAr, record.city, record.district].some((value) =>
            value?.toLowerCase().includes(needle),
          ),
        );
      }
      return query.limit ? result.slice(0, query.limit) : result;
    },
    async listIds(limit) {
      return [...records.keys()].slice(0, limit);
    },
    async getById(id) {
      return records.get(id) || null;
    },
    async create(input) {
      createdInput = input;
      const record = property({ id: "created", ...input });
      records.set(record.id, record);
      return record;
    },
    async update(id, input) {
      const current = records.get(id);
      if (!current) return null;
      const updated = { ...current, ...input, updatedAt: new Date("2026-02-01T00:00:00Z") };
      records.set(id, updated);
      return updated;
    },
    async delete(id) {
      const current = records.get(id) || null;
      records.delete(id);
      return current;
    },
  };

  const propertyModule = createPropertyModule({
    repository,
    async recordEvent(event) {
      events.push(event.type);
    },
    async notifyCreated() {},
    async invalidate(id) {
      invalidations.push(id);
    },
  });

  return { propertyModule, events, invalidations, get createdInput() { return createdInput; } };
}

describe("Property module", () => {
  test("serializes dates at the client transport boundary", () => {
    expect(serializeProperty(property())).toMatchObject({
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    });
  });

  test("normalizes a create once and applies canonical defaults", async () => {
    const context = harness();
    const result = await context.propertyModule.create({ titleAr: "  منزل  ", titleEn: "   ", price: 25 });

    expect(result.titleAr).toBe("منزل");
    expect(context.createdInput).toEqual({
      titleAr: "منزل",
      titleEn: null,
      descriptionEn: null,
      descriptionAr: null,
      city: null,
      district: null,
      price: 25,
      images: [],
    });
    expect(context.events).toEqual(["property_created"]);
    expect(context.invalidations).toEqual(["created"]);
  });

  test("rejects negative prices and unknown database fields", async () => {
    const context = harness();
    expect(context.propertyModule.create({ titleAr: "منزل", price: -1 })).rejects.toBeInstanceOf(
      PropertyModuleError,
    );
    expect(context.propertyModule.update("missing", { status: "published" } as never)).rejects.toMatchObject({
      code: "INVALID_INPUT",
    });
  });

  test("returns not found consistently for missing updates and deletes", async () => {
    const context = harness();
    expect(context.propertyModule.update("missing", { city: "Cairo" })).rejects.toMatchObject({
      code: "NOT_FOUND",
    });
    expect(context.propertyModule.delete("missing")).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  test("clamps public query limits", async () => {
    const context = harness(Array.from({ length: 120 }, (_, index) => property({ id: `${index}` })));
    expect(await context.propertyModule.list({ limit: 10_000 })).toHaveLength(100);
    expect(await context.propertyModule.listIds(10_000)).toHaveLength(120);
  });

  test("persists a create even when secondary effects fail", async () => {
    let persisted = false;
    const propertyModule = createPropertyModule({
      repository: {
        list: async () => [],
        listIds: async () => [],
        getById: async () => null,
        create: async (input) => {
          persisted = true;
          return property(input);
        },
        update: async () => null,
        delete: async () => null,
      },
      recordEvent: async () => { throw new Error("event unavailable"); },
      notifyCreated: async () => { throw new Error("email unavailable"); },
      invalidate: async () => { throw new Error("cache unavailable"); },
    });

    await expect(propertyModule.create({ titleAr: "منزل" })).resolves.toMatchObject({ titleAr: "منزل" });
    expect(persisted).toBe(true);
  });
});
