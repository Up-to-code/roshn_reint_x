"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { mailtrap } from "@/lib/email";
import { headers } from "next/headers";
import { userAgent } from "next/server";

interface SubmitLeadParams {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  source: string;
}

export async function submitLead(data: SubmitLeadParams) {
  try {
    const { firstName, lastName, phone, email, source } = data;

    // We use the 'Interest' table as planned, mapping fields appropriately.
    // 'name' combines first and last name.
    // 'propertyTitle' stores the source (e.g., "Roshn Residence").
    const interest = await db.interest.create({
      data: {
        name: `${firstName} ${lastName}`,
        phone: phone,
        email: email || null,
        propertyTitle: source,
        message: "Lead from landing page",
      },
    });

    // Send email notification
    try {
      const headersList = headers();
      const ua = userAgent({ headers: headersList });
      const osString = ua.os?.name ? `${ua.os.name} ${ua.os.version || ''}` : 'Unknown OS';

      const sender = {
        email: "mailtrap@demomailtrap.com",
        name: "Roshn Lead Notification",
      };

      const recipients = [
        {
          email: "roshnreitsaudi@gmail.com",
        },
      ];

      await mailtrap.send({
        from: sender,
        to: recipients,
        subject: `New Lead from Source: ${source}`,
        text: `New lead submitted!

Name: ${firstName} ${lastName}
Phone: ${phone}
Email: ${email || 'N/A'}
Source: ${source}
User OS: ${osString}
Message: Lead from landing page
`,
        category: "New Lead",
      });
      console.log(`Notification sent for lead ${interest.id}`);
    } catch (emailError) {
      console.error("Failed to send lead email notification:", emailError);
      // Don't fail the action if email fails
    }

    revalidatePath("/dashboard/leads");
    return { success: true };
  } catch (error) {
    console.error("Error submitting lead:", error);
    return { success: false, error: "Failed to submit lead" };
  }
}
