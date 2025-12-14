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

    // Revalidate all pages that display interests/leads
    revalidatePath("/dashboard/leads");
    revalidatePath("/[locale]/dashboard/leads");
    revalidatePath("/dashboard/interests");
    revalidatePath("/[locale]/dashboard/interests");
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting lead:", error);
    return { success: false, error: "Failed to delete lead" };
  }
}
