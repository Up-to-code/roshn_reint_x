"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/db";
import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/lib/user";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use!" };
  }

  // Create user and account in a transaction
  await prisma.$transaction(async (tx) => {
    // Create the user first
    const user = await tx.user.create({
      data: {
        name,
        email,
      },
    });

    // Create the account with the password
    await tx.account.create({
      data: {
        accountId: user.id,
        providerId: "credential",
        userId: user.id,
        password: hashedPassword,
      },
    });
  });

  return { success: "User created!" };
};
