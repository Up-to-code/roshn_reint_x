// import "server-only";
import { PrismaClient } from "@prisma/client";

export let prisma: PrismaClient;

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var cachedPrisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

if (process.env.NODE_ENV === "production") {
  prisma = prismaClientSingleton();
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = prismaClientSingleton();
  }
  prisma = global.cachedPrisma;
}
