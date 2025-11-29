import { prisma } from "@/lib/db";
import type { User } from "@prisma/client";

export type UserWithPassword = User & { password: string | null };

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    return user;
  } catch {
    return null;
  }
};

export const getUserByEmailWithPassword = async (email: string): Promise<UserWithPassword | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        accounts: {
          select: {
            password: true,
            providerId: true,
          },
        },
      },
    });

    if (!user) return null;

    // Extract password from any account that has one (typically the credential account)
    const accountWithPassword = user.accounts.find(account => account.password !== null);
    const password = accountWithPassword?.password || null;

    // Remove accounts from the returned object and add password
    const { accounts, ...userWithoutAccounts } = user;
    
    return {
      ...userWithoutAccounts,
      password,
    };
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });

    return user;
  } catch {
    return null;
  }
};