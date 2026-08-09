import "server-only";
import { revalidateTag, unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { defaultServicesPage, serviceInputSchema, servicesPageInputSchema, type ServiceInput, type ServicesPageInput } from "./service-core";

const SERVICES_TAG = "services";

const cachedPublicServices = unstable_cache(
  () => prisma.service.findMany({ where: { enabled: true }, orderBy: [{ order: "asc" }, { createdAt: "asc" }] }),
  ["public-services"],
  { revalidate: 300, tags: [SERVICES_TAG] },
);

const cachedPage = unstable_cache(
  () => prisma.servicesPage.findFirst({ orderBy: { createdAt: "asc" } }),
  ["services-page"],
  { revalidate: 300, tags: [SERVICES_TAG] },
);

const invalidate = () => revalidateTag(SERVICES_TAG);

export const serviceModule = {
  listPublic: () => cachedPublicServices(),
  listEditor: () => prisma.service.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] }),

  async getPage() {
    return (await cachedPage()) || defaultServicesPage;
  },

  async create(input: ServiceInput) {
    const data = serviceInputSchema.parse(input);
    const service = await prisma.service.create({ data: { title: data.title!, description: data.description!, image: data.image!, features: data.features!, order: data.order!, enabled: data.enabled! } });
    invalidate();
    return service;
  },

  async update(id: string, input: ServiceInput) {
    const data = serviceInputSchema.parse(input);
    const updated = await prisma.service.updateMany({ where: { id }, data });
    if (!updated.count) return null;
    invalidate();
    return prisma.service.findUnique({ where: { id } });
  },

  async delete(id: string) {
    const deleted = await prisma.service.deleteMany({ where: { id } });
    if (!deleted.count) return false;
    invalidate();
    return true;
  },

  async savePage(input: ServicesPageInput) {
    const data = servicesPageInputSchema.parse(input);
    const existing = await prisma.servicesPage.findFirst({ orderBy: { createdAt: "asc" }, select: { id: true } });
    const page = existing
      ? await prisma.servicesPage.update({ where: { id: existing.id }, data })
      : await prisma.servicesPage.create({ data: { id: "default", title: data.title!, subtitle: data.subtitle!, heroImage: data.heroImage!, enabled: data.enabled! } });
    invalidate();
    return page;
  },
};
