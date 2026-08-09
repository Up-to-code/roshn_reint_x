"use server";

import { headers } from "next/headers";
import { userAgent } from "next/server";
import { revalidatePath } from "next/cache";
import { inquiryModule } from "@/lib/inquiries/inquiry-module";

interface SubmitLeadParams { firstName: string; lastName: string; phone: string; source: string }

export async function submitLead(data: SubmitLeadParams) {
  try {
    const { os } = userAgent({ headers: headers() });
    await inquiryModule.createLandingLead(data, os?.name);
    revalidatePath("/[locale]/dashboard/leads", "page");
    return { success: true };
  } catch (error) {
    console.error("Error submitting lead:", error);
    return { success: false, error: "Failed to submit lead" };
  }
}
