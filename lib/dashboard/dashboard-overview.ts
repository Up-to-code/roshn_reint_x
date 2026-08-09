import "server-only";

import { prisma } from "@/lib/db";

export async function getDashboardOverview() {
  const [users, properties, posts, contacts] = await Promise.all([
    prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.property.findMany({
      select: { id: true, titleEn: true, titleAr: true, price: true, city: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.post.findMany({
      select: { id: true, title: true, status: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.inquiry.findMany({
      where: { kind: "CONTACT" },
      select: { id: true, name: true, phone: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  return { users, properties, posts, contacts };
}
