import "server-only";
import { prisma } from "@/lib/db";
import { assertRoleChange, userNameInputSchema, userRoleInputSchema, UserAdministrationError } from "./user-core";

const publicUserSelection = { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true } as const;

export const userModule = {
  list: () => prisma.user.findMany({ select: publicUserSelection, orderBy: { createdAt: "desc" } }),

  async setName(id: string, input: unknown) {
    const { name } = userNameInputSchema.parse(input);
    const updated = await prisma.user.updateMany({ where: { id }, data: { name } });
    if (!updated.count) throw new UserAdministrationError("NOT_FOUND");
  },

  async setRole(actorId: string, targetId: string, input: unknown) {
    const { role } = userRoleInputSchema.parse(input);
    return prisma.$transaction(async tx => {
      const [target, adminCount] = await Promise.all([
        tx.user.findUnique({ where: { id: targetId }, select: { id: true, role: true } }),
        tx.user.count({ where: { role: "ADMIN" } }),
      ]);
      if (!target) throw new UserAdministrationError("NOT_FOUND");
      assertRoleChange({ actorId, targetId, nextRole: role, currentRole: target.role, adminCount });
      return tx.user.update({ where: { id: targetId }, data: { role }, select: publicUserSelection });
    });
  },

  async delete(id: string) {
    const deleted = await prisma.user.deleteMany({ where: { id } });
    return deleted.count > 0;
  },
};
