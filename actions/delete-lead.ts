"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/authorization";
import { inquiryModule } from "@/lib/inquiries/inquiry-module";

export async function deleteLead(leadId: string) {
  try {
    await requireAdmin();
    const deleted = await inquiryModule.delete(leadId, "LANDING_LEAD");
    if (!deleted) return { success: false, error: "Lead not found" };

    // Revalidate all pages that display interests/leads
    revalidatePath("/[locale]/dashboard/leads", "page");
    revalidatePath("/[locale]/dashboard/interests", "page");
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting lead:", error);
    return { success: false, error: "Failed to delete lead" };
  }
}
