"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteLead(leadId: string) {
  try {
    await db.interest.delete({
      where: {
        id: leadId,
      },
    });

    revalidatePath("/dashboard/leads");
    return { success: true };
  } catch (error) {
    console.error("Error deleting lead:", error);
    return { success: false, error: "Failed to delete lead" };
  }
}
