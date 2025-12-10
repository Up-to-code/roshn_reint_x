"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

interface SubmitLeadParams {
  firstName: string;
  lastName: string;
  phone: string;
  source: string;
}

export async function submitLead(data: SubmitLeadParams) {
  try {
    const { firstName, lastName, phone, source } = data;

    // We use the 'Interest' table as planned, mapping fields appropriately.
    // 'name' combines first and last name.
    // 'propertyTitle' stores the source (e.g., "Roshn Residence").
    await db.interest.create({
      data: {
        name: `${firstName} ${lastName}`,
        phone: phone,
        propertyTitle: source,
        message: "Lead from landing page",
      },
    });

    revalidatePath("/admin/leads");
    return { success: true };
  } catch (error) {
    console.error("Error submitting lead:", error);
    return { success: false, error: "Failed to submit lead" };
  }
}
