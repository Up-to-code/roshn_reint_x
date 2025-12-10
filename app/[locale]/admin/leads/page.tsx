import { db } from "@/lib/db";
import { LeadsTable } from "@/components/admin/leads-table";
import { getTranslations } from "next-intl/server";

export default async function LeadsPage() {
  const t = await getTranslations("admin.leads");
  
  // Fetch leads where source is one of our landing pages
  // Or just show all 'Interest' entries that have a propertyTitle set? 
  // For now, let's fetch strictly the ones we know are from landing pages based on propertyTitle, 
  // or simple all interests to be safe.
  const leads = await db.interest.findMany({
    orderBy: {
      createdAt: "desc",
    },
     // Optional: Filter by specific sources if needed
     // where: {
     //   propertyTitle: { in: ["Roshn Residence", "Roshn Hills"] }
     // }
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Leads</h1>
      </div>
      
      <LeadsTable leads={leads} />
    </div>
  );
}
