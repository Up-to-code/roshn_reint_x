"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { LoginSchema } from "@/schemas";
import { getUserByEmailWithPassword } from "@/lib/user";
import { DEFAULT_LOGIN_REDIRECT } from "../routes";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;

  try {
    // Verify credentials
    const user = await getUserByEmailWithPassword(email);
    if (!user || !user.password) {
      return { error: "Invalid credentials!" };
    }

    // At this point, TypeScript knows user.password is not null
    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      return { error: "Invalid credentials!" };
    }

    // Credentials are valid, return success
    // The actual sign-in will happen on the client side
    return { 
      success: true,
      email: user.email,
      callbackUrl: DEFAULT_LOGIN_REDIRECT 
    };
  } catch (error) {
    // Handle authentication errors
    return { error: "Something went wrong!" };
  }
};
