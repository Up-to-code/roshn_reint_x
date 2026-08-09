import "server-only";

import { Prisma } from "@prisma/client";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";

import { prisma } from "@/lib/db";
import {
  createDefaultSiteContent,
  createSiteContentModule,
  type SiteContentDocument,
  type SiteContentRepository,
} from "@/lib/site-content/site-content-core";

const readCached = unstable_cache(
  async () => (await prisma.siteSettings.findUnique({ where: { id: "default" } }))?.data ?? null,
  ["site-content"],
  { revalidate: 300, tags: ["site-content"] },
);

async function patchWithRetry(sections: Partial<SiteContentDocument>): Promise<void> {
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    create: { id: "default", data: createDefaultSiteContent() as unknown as Prisma.InputJsonValue },
    update: {},
  });

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      await prisma.$transaction(async (transaction) => {
        await transaction.$queryRaw`SELECT "id" FROM "site_settings" WHERE "id" = 'default' FOR UPDATE`;
        const current = await transaction.siteSettings.findUniqueOrThrow({ where: { id: "default" } });
        const source = current.data && typeof current.data === "object" && !Array.isArray(current.data)
          ? current.data as Record<string, unknown>
          : createDefaultSiteContent();
        await transaction.siteSettings.update({
          where: { id: "default" },
          data: { data: { ...source, ...sections } as unknown as Prisma.InputJsonValue },
        });
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      revalidateTag("site-content");
      revalidatePath("/[locale]", "page");
      return;
    } catch (error) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2034" || attempt === 3) {
        throw error;
      }
    }
  }
}

const repository: SiteContentRepository = { read: readCached, patch: patchWithRetry };
export const siteContentModule = createSiteContentModule(repository);
