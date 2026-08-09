import "server-only";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { eventInputSchema, eventQuerySchema } from "./event-core";

export const eventModule = {
  async record(input: unknown): Promise<void> {
    try {
      const event = eventInputSchema.parse(input);
      await prisma.event.create({ data: { type: event.type!, title: event.title!, description: event.description!, metadata: event.metadata as Prisma.InputJsonValue } });
    } catch (error) {
      console.error("Failed to record event:", error);
    }
  },

  async list(input: unknown) {
    const query = eventQuerySchema.parse(input);
    return prisma.event.findMany({ where: { type: query.type }, orderBy: { createdAt: "desc" }, take: query.limit });
  },
};
