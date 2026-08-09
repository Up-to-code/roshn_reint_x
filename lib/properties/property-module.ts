import "server-only";

import { unstable_cache, revalidatePath, revalidateTag } from "next/cache";
import { Prisma } from "@prisma/client";

import { eventModule } from "@/lib/events/event-module";
import { prisma } from "@/lib/db";
import { resend } from "@/lib/email";
import {
  createPropertyModule,
  type PropertyQuery,
  type PropertyRecord,
  type PropertyRepository,
} from "@/lib/properties/property-core";

const propertySelect = {
  id: true,
  titleEn: true,
  titleAr: true,
  descriptionEn: true,
  descriptionAr: true,
  city: true,
  district: true,
  price: true,
  images: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.PropertySelect;

function propertyWhere(query: PropertyQuery): Prisma.PropertyWhereInput | undefined {
  if (query.query) {
    return {
      OR: ["titleEn", "titleAr", "city", "district"].map((field) => ({
        [field]: { contains: query.query, mode: "insensitive" },
      })),
    };
  }
  if (query.city) return { city: { contains: query.city, mode: "insensitive" } };
  return undefined;
}

const readAllProperties = unstable_cache(
  () => prisma.property.findMany({ select: propertySelect, orderBy: { createdAt: "desc" } }),
  ["properties-list"],
  { revalidate: 60, tags: ["properties"] },
);

function readProperty(id: string): Promise<PropertyRecord | null> {
  return unstable_cache(
    () => prisma.property.findUnique({ where: { id }, select: propertySelect }),
    ["property", id],
    { revalidate: 300, tags: ["properties", `property-${id}`] },
  )();
}

const repository: PropertyRepository = {
  async list(query) {
    if (!query.query && !query.city && !query.limit) return readAllProperties();
    return prisma.property.findMany({
      where: propertyWhere(query),
      select: propertySelect,
      orderBy: { createdAt: "desc" },
      take: query.limit,
    });
  },
  async listIds(limit) {
    const rows = await prisma.property.findMany({
      select: { id: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return rows.map(({ id }) => id);
  },
  getById: readProperty,
  create(input) {
    return prisma.property.create({ data: input, select: propertySelect });
  },
  async update(id, input) {
    try {
      return await prisma.property.update({ where: { id }, data: input, select: propertySelect });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") return null;
      throw error;
    }
  },
  async delete(id) {
    try {
      return await prisma.property.delete({ where: { id }, select: propertySelect });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") return null;
      throw error;
    }
  },
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] || character);
}

export const propertyModule = createPropertyModule({
  repository,
  recordEvent: (event) => eventModule.record(event),
  async notifyCreated(property) {
    const title = escapeHtml(property.titleEn || property.titleAr);
    const city = escapeHtml(property.city || "N/A");
    const result = await resend.emails.send({
      from: process.env.ADMIN_EMAIL || "noreply@roshnreit.com",
      to: process.env.PROPERTY_NOTIFICATION_EMAIL || "roshnreitsaudi@gmail.com",
      subject: `New Property Added: ${property.titleEn || property.titleAr}`,
      html: `<div style="font-family:Arial,sans-serif"><h2>New Property Added</h2><p><strong>Title:</strong> ${title}</p><p><strong>City:</strong> ${city}</p><p><strong>Price:</strong> ${property.price}</p></div>`,
    });
    if (result.error) throw new Error(result.error.message);
  },
  async invalidate(propertyId) {
    revalidateTag("properties");
    if (propertyId) revalidateTag(`property-${propertyId}`);
    revalidatePath("/[locale]/dashboard/p", "page");
    revalidatePath("/[locale]/p", "page");
    revalidatePath("/[locale]/p/[id]", "page");
  },
  reportEffectError(effect, error) {
    console.error(`Failed ${effect}:`, error);
  },
});
