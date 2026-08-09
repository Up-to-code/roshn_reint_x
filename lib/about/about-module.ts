import "server-only";
import { revalidateTag, unstable_cache } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { aboutDataSchema, defaultAboutData, normalizeAboutData, type AboutData } from "./about-core";

const ABOUT_TAG = "about";

const cachedAbout = unstable_cache(
  () => prisma.aboutPage.findUnique({ where: { id: "default" }, select: { data: true } }),
  ["about-page"],
  { revalidate: 300, tags: [ABOUT_TAG] },
);

async function saveAbout(input: unknown): Promise<AboutData> {
  const data = aboutDataSchema.parse(input);
  await prisma.aboutPage.upsert({
    where: { id: "default" },
    create: { id: "default", data: data as unknown as Prisma.InputJsonValue },
    update: { data: data as unknown as Prisma.InputJsonValue },
  });
  revalidateTag(ABOUT_TAG);
  return data;
}

export const aboutModule = {
  async get(): Promise<AboutData> {
    return normalizeAboutData((await cachedAbout())?.data);
  },

  save: saveAbout,

  reset() {
    return saveAbout(defaultAboutData);
  },
};
