"use server";

import { requireSelfOrAdmin } from "@/lib/authorization";
import { userModule } from "@/lib/users/user-module";
import { revalidatePath } from "next/cache";

export type FormData = {
  name: string;
};

export async function updateUserName(userId: string, data: FormData) {
  try {
    await requireSelfOrAdmin(userId);

    await userModule.setName(userId, data);

    revalidatePath('/dashboard/settings');
    return { status: "success" };
  } catch {
    return { status: "error" }
  }
}
